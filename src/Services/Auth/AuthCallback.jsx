import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../config/supabaseClient";
import { verifySupabaseToken, ROLES } from "./authService";
import { useAuth } from "../../contexts/AuthContext";

const roleRoutes = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.MANAGER]: "/manager",
  [ROLES.LEAD_SALE]: "/lead-sale",
  [ROLES.STAFF_SALE]: "/staff-sale",
  [ROLES.STAFF_PURCHASER]: "/staff-purchaser",
  [ROLES.STAFF_WAREHOUSE_FOREIGN]: "/staff-warehouse-foreign",
  [ROLES.STAFF_WAREHOUSE_DOMESTIC]: "/staff-warehouse-domestic",
  [ROLES.CUSTOMER]: "/",
};

const DEFAULT_ROUTE = "/";
const REDIRECT_DELAY = 2000;
const MAX_RETRIES = 2;

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const isMountedRef = useRef(true);
  const hasProcessedRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleError = useCallback(
    (err, statusCode) => {
      if (!isMountedRef.current) return;

      console.error("❌ Auth Callback Error:", err);

      const errorMessage = err.message || "Đăng nhập thất bại";
      setError(errorMessage);
      setIsProcessing(false);

      if (statusCode === 404) {
        toast.error("Tài khoản không tồn tại trong hệ thống!");
      } else if (statusCode === 401) {
        toast.error("Xác thực thất bại!");
      } else if (statusCode === 403) {
        toast.error("Bạn không có quyền truy cập!");
      } else {
        toast.error(errorMessage);
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          navigate("/signin", { replace: true });
        }
      }, REDIRECT_DELAY);
    },
    [navigate]
  );

  const verifyWithRetry = useCallback(async (accessToken, retries = 0) => {
    try {
      return await verifySupabaseToken(accessToken);
    } catch (err) {
      if (retries < MAX_RETRIES && err.message?.includes("network")) {
        console.log(
          `🔄 Retrying verification... (${retries + 1}/${MAX_RETRIES})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return verifyWithRetry(accessToken, retries + 1);
      }
      throw err;
    }
  }, []);

  const handleCallback = useCallback(async () => {
    if (hasProcessedRef.current) {
      console.log("⚠️ Callback already processed, skipping...");
      return;
    }
    hasProcessedRef.current = true;

    try {
      console.log("🔵 Auth Callback started...");

      // 🧩 Lấy token từ URL hash nếu có
      const hashParams = window.location.hash.substring(1);
      const params = new URLSearchParams(hashParams);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        console.log("🔐 Setting session from URL token...");
        const { error: setError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (setError) throw setError;

        // Xóa hash khỏi URL cho sạch
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

      if (!isMountedRef.current) return;

      // 🕒 Lấy session hiện tại từ Supabase
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Session timeout")), 10000)
      );

      const {
        data: { session },
        error: sessionError,
      } = await Promise.race([sessionPromise, timeoutPromise]);

      if (sessionError) throw sessionError;
      if (!session?.access_token)
        throw new Error("Không tìm thấy phiên đăng nhập hợp lệ");

      console.log("✅ Session found:", {
        user: session.user.email,
        provider: session.user.app_metadata?.provider,
        expiresAt: new Date(session.expires_at * 1000).toISOString(),
      });

      if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }

      // ✅ Xác thực token với backend
      const data = await verifyWithRetry(session.access_token);
      if (!data?.user?.role) throw new Error("Dữ liệu người dùng không hợp lệ");

      console.log("✅ Backend verification successful");

      // 🔐 Lưu thông tin người dùng vào AuthContext
      setAuthUser({
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });

      console.log("🎯 AuthContext updated successfully!");

      // 🎉 Hiển thị chào mừng
      toast.success(`Chào mừng ${data.user.name || data.user.email}! 🎉`, {
        duration: 3000,
      });

      // 🚀 Chuyển hướng
      const route = roleRoutes[data.user.role] || DEFAULT_ROUTE;
      console.log("🚀 Navigating to:", route);
      navigate(route, { replace: true });
    } catch (err) {
      const statusCode = err.response?.status;
      handleError(err, statusCode);
    } finally {
      if (isMountedRef.current) setIsProcessing(false);
    }
  }, [navigate, setAuthUser, handleError, verifyWithRetry]);

  useEffect(() => {
    hasProcessedRef.current = false;
    isMountedRef.current = true;
    handleCallback();

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleCallback]);

  // ❌ UI khi lỗi
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập thất bại
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/signin", { replace: true })}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // ⏳ UI khi loading
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đang xử lý đăng nhập...
        </h2>
        <p className="text-gray-600">
          {isProcessing
            ? "Vui lòng đợi trong giây lát"
            : "Đang chuyển hướng..."}
        </p>
      </div>
    </div>
  );
}
