import React, { useEffect, useRef, useState } from "react";
import { X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import registrationService from "../Services/Auth/Registration";
import LogoTixi from "../assets/TixiLogo.jpg";
import BgHeader from "../assets/bg.jpg";

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

  // Reset + khởi tạo timer khi mở dialog
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

    // Auto focus
    setTimeout(() => inputRefs.current[0]?.focus(), 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }

    if (error) setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((d, i) => {
      if (i < 6) newOtp[i] = d;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    if (error) setError("");
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
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center z-50 p-4"
      style={{ backgroundImage: `url(${LogoTixi})` }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100">
        {/* HEADER: dùng ảnh bg.jpg */}
        <div
          className="px-8 py-8 text-center bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${BgHeader})` }}
        >
          {/* Nếu muốn tăng độ tương phản chữ, có thể bật overlay nhẹ: */}
          {/* <div className="absolute inset-0 bg-blue-700/30"></div> */}
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
              <Mail className="text-white w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
              Xác Thực Email
            </h2>
            <p className="text-blue-100 text-sm">Chúng tôi đã gửi mã đến</p>
            <p className="text-white font-semibold text-sm break-all mt-1">
              {email}
            </p>
          </div>
        </div>

        {/* BODY: trắng, đồng bộ style với SignIn/Signup */}
        <div className="p-8 bg-white">
          {/* Info */}
          {info && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm flex items-start gap-3">
              <CheckCircle2 className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm"
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
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-3 text-center">
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
                      border transition-all duration-200
                      focus:outline-none focus:ring-2
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
                    `}
                    aria-label={`Số thứ ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!otpComplete || loading}
              className={`w-full py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200
                ${
                  otpComplete && !loading
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xác thực...
                </span>
              ) : (
                "Xác Thực"
              )}
            </button>
          </form>

          {/* Resend */}
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
                <span className="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg text-sm">
                  {resendTimer}s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Đường kẻ chân hộp thoại đồng bộ */}
        <div className="h-0.5 bg-gray-100" />
      </div>
    </div>
  );
};

export default OTPDialog;
