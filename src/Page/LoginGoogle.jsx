import React, { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { googleLogin } from "../Services/Auth/authService";

const LoginGoogle = ({
  buttonText = "Đăng nhập bằng Google",
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleGoogleLogin = async () => {
    if (loading) return; // Prevent double-click

    setLoading(true);

    try {
      console.log("🚀 Starting Google OAuth flow...");

      // Simply trigger Google OAuth
      // User will be redirected to /auth/callback after success
      await googleLogin();

      // Note: Code below won't execute because googleLogin() redirects
      // The /auth/callback page will handle the rest
    } catch (err) {
      console.error("❌ Google login error:", err);

      // Only update state if component still mounted
      if (isMountedRef.current) {
        setLoading(false);

        // User-friendly error messages
        const errorMessage =
          err.message || "Đăng nhập Google thất bại! Vui lòng thử lại.";

        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      }
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
