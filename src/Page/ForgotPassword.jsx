import React from "react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-yellow-50">
        <img
          src="https://i.ibb.co/8c7HptR/running.png"
          alt="illustration"
          className="max-h-[80%] object-contain"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-black text-white">
        <h1 className="text-4xl font-bold mb-3 text-yellow-400">
          Quên Mật Khẩu
        </h1>
        <p className="text-gray-300 mb-8">
          Nhập email để đặt lại mật khẩu của bạn.
        </p>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-200 mb-2 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        {/* Reset Password button */}
        <button className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition mb-4">
          Gửi Liên Kết Đặt Lại
        </button>

        {/* Back to Sign In */}
        <p className="text-sm text-gray-300 text-center">
          Nhớ mật khẩu?{" "}
          <a
            href="/signin"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Quay lại Đăng Nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
