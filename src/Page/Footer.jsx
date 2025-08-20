import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 via-green-600 to-blue-800 text-white py-12 shadow-inner">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo & Intro */}
        <div>
          <h2 className="text-3xl font-extrabold mb-4">TixiLogistics</h2>
          <p className="text-sm leading-relaxed text-gray-200">
            Giải pháp vận chuyển và kho bãi chuyên nghiệp – nhanh chóng, an
            toàn, tối ưu chi phí cho doanh nghiệp của bạn.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Dịch vụ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/transport"
                className="block transition-all duration-300 hover:text-yellow-300 hover:translate-x-1"
              >
                Vận chuyển hàng hóa
              </Link>
            </li>
            <li>
              <Link
                to="/warehouse"
                className="block transition-all duration-300 hover:text-yellow-300 hover:translate-x-1"
              >
                Kho bãi & lưu trữ
              </Link>
            </li>
            <li>
              <Link
                to="/customs"
                className="block transition-all duration-300 hover:text-yellow-300 hover:translate-x-1"
              >
                Thủ tục hải quan
              </Link>
            </li>
            <li>
              <Link
                to="/tracking"
                className="block transition-all duration-300 hover:text-yellow-300 hover:translate-x-1"
              >
                Tracking đơn hàng
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block transition-all duration-300 hover:text-yellow-300 hover:translate-x-1"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP.HCM</li>
            <li>Điện thoại: 0909 444 909</li>
            <li>Email: support@tixilogistics.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-400 text-center pt-4 text-xs text-gray-300">
        © {new Date().getFullYear()} TixiLogistics. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
