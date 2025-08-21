import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/authService";
import toast from "react-hot-toast";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(username, password);
      console.log("Login success:", userData);

      toast.success(`Xin chào ${userData.name || username}! 🎉`);
      navigate("/home");
    } catch {
      toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-yellow-50">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9O2t4AtqBhGCl3yzaihimlwX_etS2JRJ87A&s"
          alt="illustration"
          className="max-h-[80%] object-contain"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-black text-white">
        <h1 className="text-4xl font-bold mb-3 text-yellow-400">
          Chào Mừng Trở Lại
        </h1>
        <p className="text-gray-300 mb-8">
          Đăng nhập để tiếp tục hành trình của bạn.
        </p>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-6">
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-200 mb-2 text-sm font-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 text-yellow-400 focus:ring-yellow-400"
              />
              <span className="text-gray-300 text-sm">Ghi nhớ tôi</span>
            </label>
            <a
              href="/forgot-password"
              className="text-yellow-400 text-sm hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition mb-4"
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        {/* Google button */}
        <button className="w-full flex justify-center items-center border border-gray-600 py-3 rounded-lg hover:bg-gray-700 transition mb-6">
          <FcGoogle className="mr-2 text-xl" />
          <span className="text-gray-200">Đăng nhập bằng Google</span>
        </button>

        {/* Sign up */}
        <p className="text-sm text-gray-300 text-center">
          Chưa có tài khoản?{" "}
          <a
            href="/signup"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Đăng ký miễn phí!
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
