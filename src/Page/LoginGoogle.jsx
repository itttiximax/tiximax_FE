import React, { useState, useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { googleLogin } from "../Services/Auth/authService";

const LoginGoogle = ({
  buttonText = "Đăng nhập bằng Google",
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleGoogleLogin = async () => {
    if (loading || disabled) return;

    setLoading(true);

    try {
      await googleLogin();
      // Redirect sẽ xảy ra, code dưới không chạy
    } catch (err) {
      if (!isMountedRef.current) return;

      setLoading(false);

      // Xử lý error messages từ BE
      let errorMessage = "Đăng nhập Google thất bại! Vui lòng thử lại.";

      if (err.response?.data?.message) {
        // Lỗi từ BE
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // Lỗi network hoặc timeout
        if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
          errorMessage = "Kết nối quá chậm! Vui lòng kiểm tra mạng và thử lại.";
        } else if (err.message.includes("Network Error")) {
          errorMessage = "Lỗi kết nối! Vui lòng kiểm tra internet.";
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FcGoogle className="text-xl" />
      <span className="text-gray-700 font-medium">
        {loading ? "Đang chuyển hướng..." : buttonText}
      </span>
    </button>
  );
};

export default LoginGoogle;
