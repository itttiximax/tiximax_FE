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

  // Refs to prevent race conditions
  const isMountedRef = useRef(true);
  const hasProcessedRef = useRef(false);
  const timeoutRef = useRef(null);

  // Handle production redirect fix
  useEffect(() => {
    // Fix for localhost redirect issue in production
    if (
      window.location.hostname === "localhost" &&
      window.location.hash &&
      window.location.hash.includes("access_token")
    ) {
      console.log("⚠️ Detected localhost redirect in production context");

      // Check if we should be on production
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const stateParam = hashParams.get("state");

      if (stateParam) {
        try {
          // Decode the JWT state to check site_url
          const [, payload] = stateParam.split(".");
          const decodedPayload = JSON.parse(atob(payload));

          // If state contains a production URL, redirect there
          if (
            decodedPayload.site_url?.includes("vercel.app") ||
            decodedPayload.referrer?.includes("vercel.app")
          ) {
            const productionUrl =
              "https://tiximax-three.vercel.app/auth/callback" +
              window.location.hash;
            console.log("🔄 Redirecting to production:", productionUrl);
            window.location.href = productionUrl;
            return;
          }
        } catch (e) {
          console.error("Failed to decode state:", e);
        }
      }
    }
  }, []);

  const handleError = useCallback(
    (err, statusCode) => {
      if (!isMountedRef.current) return;

      console.error("❌ Auth Callback Error:", err);

      const errorMessage = err.message || "Đăng nhập thất bại";
      setError(errorMessage);
      setIsProcessing(false);

      // Show appropriate toast based on error type
      if (statusCode === 404) {
        toast.error("Tài khoản không tồn tại trong hệ thống!");
      } else if (statusCode === 401) {
        toast.error("Xác thực thất bại!");
      } else if (statusCode === 403) {
        toast.error("Bạn không có quyền truy cập!");
      } else {
        toast.error(errorMessage);
      }

      // Cleanup previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Redirect after delay
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
    // Prevent double processing
    if (hasProcessedRef.current) {
      console.log("⚠️ Callback already processed, skipping...");
      return;
    }
    hasProcessedRef.current = true;

    try {
      console.log("🔵 Auth Callback started...");

      if (!isMountedRef.current) return;

      // Try to get session from URL hash first (implicit flow)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessTokenFromHash = hashParams.get("access_token");
      const refreshTokenFromHash = hashParams.get("refresh_token");

      if (accessTokenFromHash) {
        console.log("📍 Found token in URL hash");

        // Set the session manually if found in hash
        await supabase.auth.setSession({
          access_token: accessTokenFromHash,
          refresh_token: refreshTokenFromHash,
        });
      }

      // Get session from Supabase
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Session timeout")), 10000)
      );

      const {
        data: { session },
        error: sessionError,
      } = await Promise.race([sessionPromise, timeoutPromise]);

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("Không tìm thấy phiên đăng nhập hợp lệ");
      }

      console.log("✅ Session found:", {
        user: session.user.email,
        provider: session.user.app_metadata?.provider,
        expiresAt: new Date(session.expires_at * 1000).toISOString(),
      });

      // Check if session is expired
      if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }

      if (!isMountedRef.current) return;

      // Verify token with backend (with retry)
      let userData;
      try {
        const data = await verifyWithRetry(session.access_token);
        userData = data.user;
      } catch (verifyError) {
        console.warn("⚠️ Backend verification failed, using Supabase data");
        // Fallback to Supabase user data
        userData = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.email?.split("@")[0] || "user",
          name: session.user.user_metadata?.full_name || session.user.email,
          role: session.user.user_metadata?.role || ROLES.CUSTOMER,
        };
      }

      if (!userData) {
        throw new Error("Dữ liệu người dùng không hợp lệ");
      }

      console.log("✅ User data retrieved:", userData);

      if (!isMountedRef.current) return;

      // Update AuthContext
      setAuthUser({
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });

      console.log("🎯 AuthContext updated successfully!");

      // Store user data in localStorage as backup
      localStorage.setItem("user", JSON.stringify(userData));

      // Show success message
      toast.success(`Chào mừng ${userData.name || userData.email}! 🎉`, {
        duration: 3000,
      });

      // Navigate to appropriate route
      const route = roleRoutes[userData.role] || DEFAULT_ROUTE;

      // Validate route exists
      if (userData.role && !roleRoutes[userData.role]) {
        console.warn(
          `⚠️ Unknown role: ${userData.role}, redirecting to default`
        );
      }

      console.log("🚀 Navigating to:", route);

      // Clear the URL hash to clean up
      if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
      }

      if (isMountedRef.current) {
        navigate(route, { replace: true });
      }
    } catch (err) {
      const statusCode = err.response?.status;
      handleError(err, statusCode);
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [navigate, setAuthUser, handleError, verifyWithRetry]);

  useEffect(() => {
    // Reset processing flag on mount
    hasProcessedRef.current = false;
    isMountedRef.current = true;

    handleCallback();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleCallback]);

  // Error UI
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
            disabled={!isMountedRef.current}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Loading UI
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
