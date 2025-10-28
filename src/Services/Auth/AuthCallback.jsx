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

  const hasProcessedRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleError = useCallback(
    (err, statusCode) => {
      const message = err?.message || "Đăng nhập thất bại";
      setError(message);
      setIsProcessing(false);

      if (statusCode === 404)
        toast.error("Tài khoản không tồn tại trong hệ thống!");
      else if (statusCode === 401) toast.error("Xác thực thất bại!");
      else if (statusCode === 403) toast.error("Bạn không có quyền truy cập!");
      else toast.error(message);

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
    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        return await verifySupabaseToken(accessToken);
      } catch (e) {
        lastErr = e;
        const isNetwork = e?.message?.toLowerCase?.().includes("network");
        if (!isNetwork || i === MAX_RETRIES) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    throw lastErr;
  }, []);

  const handleCallback = useCallback(async () => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    try {
      // (0) bắt lỗi từ provider (nếu có) trên query
      const searchParams = new URLSearchParams(window.location.search);
      const providerErr =
        searchParams.get("error_description") || searchParams.get("error");
      if (providerErr) {
        throw new Error(decodeURIComponent(providerErr));
      }

      // (1) Code flow (PKCE) – Supabase v2
      const hasCode = searchParams.get("code");
      if (hasCode) {
        const { error: xErr } = await supabase.auth.exchangeCodeForSession({
          currentUrl: window.location.href, // truyền rõ ràng để chắc chắn
        });
        if (xErr) throw xErr;
      } else {
        // (2) Fallback: hash token flow (một số trường hợp vẫn trả access_token trên hash)
        const hash = new URLSearchParams(window.location.hash.substring(1));
        const accessTokenFromHash = hash.get("access_token");
        const refreshTokenFromHash = hash.get("refresh_token");
        if (accessTokenFromHash) {
          await supabase.auth.setSession({
            access_token: accessTokenFromHash,
            refresh_token: refreshTokenFromHash || undefined,
          });
        }
      }

      // (3) Lấy session (timeout 10s)
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
      if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }

      // (4) Verify với backend, có retry – fallback dùng dữ liệu supabase user
      let userData;
      try {
        const data = await verifyWithRetry(session.access_token);
        userData = data?.user;
      } catch {
        userData = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.email?.split("@")[0] || "user",
          name: session.user.user_metadata?.full_name || session.user.email,
          role: session.user.user_metadata?.role || ROLES.CUSTOMER,
        };
      }
      if (!userData) throw new Error("Dữ liệu người dùng không hợp lệ");

      // (5) Cập nhật AuthContext + localStorage
      setAuthUser({
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      localStorage.setItem("user", JSON.stringify(userData));

      // (6) Điều hướng theo role
      toast.success(`Chào mừng ${userData.name || userData.email}! 🎉`, {
        duration: 3000,
      });
      const route = roleRoutes[userData.role] || DEFAULT_ROUTE;

      // Dọn sạch query/hash để URL đẹp
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);

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
        <p className="text-gray-600">
          {isProcessing
            ? "Vui lòng đợi trong giây lát"
            : "Đang chuyển hướng..."}
        </p>
        {/* ⚠️ THÊM DÒng NÀY */}
        <p className="text-sm text-gray-500">
          Lần đầu có thể mất 30-60 giây để kết nối server...
        </p>
      </div>
    </div>
  );
}
