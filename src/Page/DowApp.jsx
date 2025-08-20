import React from "react";
import { Link } from "react-router-dom";

const DowApp = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-700 text-white py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-white text-blue-700 px-2 py-1 rounded">
              TixiMax App
            </span>
          </h2>
          <ul className="space-y-3 text-lg text-gray-100">
            <li>✔ Mua sắm nhanh chóng và tiện lợi</li>
            <li>✔ Quản lý đơn hàng dễ dàng</li>
            <li>✔ Nhận thông báo khuyến mãi độc quyền</li>
            <li>✔ Ship hàng toàn quốc, an toàn</li>
          </ul>
          <Link
            to="/download"
            className="inline-block bg-green-400 text-blue-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-green-300 transition duration-300"
          >
            Tải miễn phí ngay hôm nay
          </Link>
        </div>

        {/* Image Content */}
        <div className="flex justify-center">
          <img
            src="data:image/jpeg;base64,..."
            alt="TixiMax App"
            className="w-full max-w-md rounded-xl shadow-2xl transform hover:scale-105 transition duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default DowApp;
