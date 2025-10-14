import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

const Logout = ({
  className = "",
  buttonText = "Đăng xuất",
  iconSize = 16,
  redirectTo = "/login",
  onSuccess = () => {},
  onError = () => {},
  showIcon = true,
  confirmMessage = "Bạn có chắc chắn muốn đăng xuất?",
  useConfirm = false,
}) => {
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (useConfirm && !window.confirm(confirmMessage)) {
      return; // User cancelled
    }

    setIsLoggingOut(true);
    try {
      await authLogout(); // Gọi logout từ AuthContext
      toast.success("Đăng xuất thành công!");
      onSuccess(); // Callback tùy chỉnh
      navigate(redirectTo, { replace: true }); // Redirect sau logout
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error(error.message || "Đăng xuất thất bại!");
      onError(error); // Callback lỗi
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition duration-150 ${
        isLoggingOut
          ? "opacity-50 cursor-not-allowed"
          : "text-red-600 hover:bg-red-50 hover:text-red-700"
      } ${className}`}
    >
      {showIcon && <LogOut size={iconSize} />}
      <span>{isLoggingOut ? "Đang đăng xuất..." : buttonText}</span>
    </button>
  );
};

Logout.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
  iconSize: PropTypes.number,
  redirectTo: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  showIcon: PropTypes.bool,
  confirmMessage: PropTypes.string,
  useConfirm: PropTypes.bool,
};

export default Logout;
