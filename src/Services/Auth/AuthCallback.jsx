import { useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { verifySupabaseToken } from "./authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ROLES } from "./authService";
export default function AuthCallback() {

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

  const navigate = useNavigate();
  

  useEffect(() => {
    const handleCallback = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        const data = await verifySupabaseToken(session.access_token);
        toast.success(`Chào mừng ${data.user.name || data.user.email}! 🎉`);
        const route = roleRoutes[data.user.role] || "/";
        navigate(route);
      } else {
        toast.error("Không tìm thấy session Supabase!");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}
