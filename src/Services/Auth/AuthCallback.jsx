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
const SESSION_TIMEOUT = 30000;
const RETRY_DELAY = 1500;

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const hasProcessedRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleError = useCallback(
    (err, statusCode) => {
      const errorMessages = {
        404: "Tài khoản không tồn tại trong hệ thống!",
        401: "Xác thực thất bại!",
        403: "Bạn không có quyền truy cập!",
        timeout: "Kết nối quá chậm! Vui lòng thử lại.",
        network: "Lỗi kết nối mạng! Vui lòng kiểm tra internet.",
      };

      let message = "Đăng nhập thất bại";

      // Ưu tiên message từ BE
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (
        err?.message?.includes("timeout") ||
        err?.code === "ECONNABORTED"
      ) {
        message = errorMessages.timeout;
      } else if (err?.message?.toLowerCase().includes("network")) {
        message = errorMessages.network;
      } else if (statusCode && errorMessages[statusCode]) {
        message = errorMessages[statusCode];
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
      setIsProcessing(false);
      toast.error(message, {
        duration: 4000,
        position: "top-center",
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => navigate("/signin", { replace: true }),
        REDIRECT_DELAY
      );
    },
    [navigate]
  );

  const verifyWithRetry = useCallback(async (accessToken) => {
    let lastErr;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        setRetryCount(attempt + 1);
        return await verifySupabaseToken(accessToken);
      } catch (e) {
        lastErr = e;

        const isTimeout =
          e?.message?.includes("timeout") || e?.code === "ECONNABORTED";
        const isNetwork = e?.message?.toLowerCase?.().includes("network");

        // Retry nếu là timeout/network và chưa hết lượt
        if ((isTimeout || isNetwork) && attempt < MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * (attempt + 1))
          );
          continue;
        }

        break;
      }
    }

    throw lastErr;
  }, []);

  const handleCallback = useCallback(async () => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    try {
      const searchParams = new URLSearchParams(window.location.search);

      // (1) Kiểm tra lỗi từ OAuth provider
      const providerErr =
        searchParams.get("error_description") || searchParams.get("error");
      if (providerErr) {
        throw new Error(decodeURIComponent(providerErr));
      }

      // (2) PKCE Code flow (Supabase v2)
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      } else {
        // (3) Fallback: Hash token flow
        const hash = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");

        if (accessToken) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setSessionError) throw setSessionError;
        }
      }

      // (4) Lấy session với timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Session timeout - Vui lòng thử lại")),
          SESSION_TIMEOUT
        )
      );

      const {
        data: { session },
        error: sessionError,
      } = await Promise.race([sessionPromise, timeoutPromise]);

      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("Không tìm thấy phiên đăng nhập hợp lệ");
      }
      if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }

      // (5) Verify với backend (có retry) hoặc fallback
      let userData;
      try {
        const data = await verifyWithRetry(session.access_token);
        userData = data?.user;
      } catch {
        // Fallback: sử dụng dữ liệu từ Supabase
        userData = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.email?.split("@")[0] || "user",
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email,
          role: session.user.user_metadata?.role || ROLES.CUSTOMER,
        };
      }

      if (!userData) throw new Error("Dữ liệu người dùng không hợp lệ");

      // (6) Cập nhật AuthContext + localStorage
      const userInfo = {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      setAuthUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // (7) Điều hướng theo role
      toast.success(`Chào mừng ${userData.name || userData.email}! `, {
        duration: 3000,
        position: "top-center",
      });

      const route = roleRoutes[userData.role] || DEFAULT_ROUTE;

      // Dọn URL
      window.history.replaceState(null, "", window.location.pathname);

      navigate(route, { replace: true });
    } catch (err) {
      handleError(err, err?.response?.status);
    } finally {
      setIsProcessing(false);
    }
  }, [handleError, navigate, setAuthUser, verifyWithRetry]);

  useEffect(() => {
    hasProcessedRef.current = false;
    handleCallback();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleCallback]);

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
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition duration-200"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đang xử lý đăng nhập...
        </h2>
        <p className="text-gray-600 mb-2">
          {isProcessing
            ? "Vui lòng đợi trong giây lát"
            : "Đang chuyển hướng..."}
        </p>
        {retryCount > 0 && (
          <p className="text-sm text-yellow-600 mb-2">
            Đang thử lại... (Lần {retryCount}/{MAX_RETRIES + 1})
          </p>
        )}
        <p className="text-sm text-gray-500">
          Lần đầu có thể mất 30-60 giây để kết nối server...
        </p>
      </div>
    </div>
  );
}
