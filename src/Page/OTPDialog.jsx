import React, { useEffect, useRef, useState } from "react";
import { X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import registrationService from "../Services/Auth/Registration";

const OTPDialog = ({ isOpen, onClose, email, onVerifySuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const endAtRef = useRef(null);
  const timerRef = useRef(null);

  // Reset state khi mở dialog
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setInfo("");
    setCanResend(false);
    endAtRef.current = Date.now() + 60_000;

    const tick = () => {
      const now = Date.now();
      const remainMs = Math.max(0, (endAtRef.current ?? now) - now);
      const remainSec = Math.ceil(remainMs / 1000);
      setResendTimer(remainSec);

      if (remainSec <= 0) {
        setCanResend(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    tick();
    timerRef.current = setInterval(tick, 250);

    // Auto focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleChange = (index, value) => {
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      // Paste nhiều số
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus vào ô cuối cùng được điền
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Nhập 1 số
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus ô tiếp theo
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    if (error) setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Backspace ở ô trống → focus ô trước
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData) {
      const digits = pastedData.slice(0, 6).split("");
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        if (i < 6) {
          newOtp[i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus vào ô cuối hoặc ô trống đầu tiên
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();

      if (error) setError("");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");

    try {
      await registrationService.verifyAccount(email, otpString);
      onVerifySuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn";
      setError(msg);
      // Clear OTP và focus lại ô đầu
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const restartTimer60s = () => {
    setCanResend(false);
    setResendTimer(60);
    endAtRef.current = Date.now() + 60_000;

    if (timerRef.current) clearInterval(timerRef.current);

    const tick = () => {
      const now = Date.now();
      const remainMs = Math.max(0, (endAtRef.current ?? now) - now);
      const remainSec = Math.ceil(remainMs / 1000);
      setResendTimer(remainSec);
      if (remainSec <= 0) {
        setCanResend(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    tick();
    timerRef.current = setInterval(tick, 250);
  };

  const handleResend = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    setError("");
    setInfo("");
    setOtp(["", "", "", "", "", ""]);

    try {
      await registrationService.sendOTP(email);
      setInfo("Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.");
      restartTimer60s();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError("Không thể gửi lại mã. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const otpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slide-up overflow-hidden">
        {/* Decorative gradient bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            disabled={loading}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Mail className="text-white w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Xác Thực Email
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Chúng tôi đã gửi mã xác thực đến
            </p>
            <p className="text-blue-600 font-semibold text-base break-all px-4">
              {email}
            </p>
          </div>

          {/* Info message */}
          {info && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-blue-800 text-sm flex items-start gap-3 animate-slide-down">
              <CheckCircle2 className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl text-red-800 text-sm animate-shake"
              aria-live="assertive"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                <span className="flex-1">{error}</span>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <form onSubmit={handleVerify}>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                Nhập mã OTP gồm 6 số
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                    className={`
                      w-12 h-14 text-center text-2xl font-bold rounded-xl
                      border-2 transition-all duration-200
                      focus:outline-none focus:ring-4
                      ${
                        digit
                          ? "border-blue-500 bg-blue-50 text-blue-700 focus:ring-blue-200"
                          : "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-200"
                      }
                      ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-blue-400"
                      }
                      disabled:bg-gray-50
                    `}
                    aria-label={`Số thứ ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!otpComplete || loading}
              className={`
                w-full py-4 rounded-xl font-semibold text-white text-base
                transition-all duration-300 transform
                focus:outline-none focus:ring-4 focus:ring-blue-200
                ${
                  otpComplete && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xác thực...
                </span>
              ) : (
                "Xác Thực"
              )}
            </button>
          </form>

          {/* Resend section */}
          <div className="mt-8 text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Không nhận được mã?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" />
                Gửi lại mã OTP
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">Gửi lại sau</span>
                <span className="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg text-sm">
                  {resendTimer}s
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default OTPDialog;
