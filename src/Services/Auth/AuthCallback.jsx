import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from URL hash
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          // Transform Supabase user to app user format
          const userData = {
            id: session.user.id,
            accountId: session.user.id,
            email: session.user.email,
            username: session.user.email?.split("@")[0],
            name: session.user.user_metadata?.full_name || session.user.email,
            role: "CUSTOMER", // Default role
          };

          // Save to localStorage
          localStorage.setItem("jwt", session.access_token);
          localStorage.setItem("user", JSON.stringify(userData));

          // Update auth context
          login(userData);

          toast.success("Đăng nhập thành công!");

          // Wait a bit to ensure state is set
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        } else {
          throw new Error("No session found");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Đăng nhập thất bại!");
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
