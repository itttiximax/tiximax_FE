import React from "react";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaWarehouse,
  FaFileAlt,
  FaMapMarkerAlt,
  FaLink,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaComment,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 py-16 relative overflow-hidden border-t-4 border-yellow-400">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-yellow-500 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-yellow-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Company Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mb-2">
                TixiLogistics
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6 max-w-md">
              Giải pháp logistics toàn diện với công nghệ tiên tiến, mang đến
              dịch vụ vận chuyển và kho bãi chuyên nghiệp, nhanh chóng và tin
              cậy cho sự phát triển bền vững của doanh nghiệp.
            </p>

            {/* Key highlights */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">ISO 9001:2015</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Nationwide Coverage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Tech-Driven Solutions</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              <span className="text-gray-800">Dịch vụ</span>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-yellow-500"></div>
            </h3>
            <ul className="space-y-3">
              {[
                {
                  to: "/transport",
                  label: "Vận chuyển hàng hóa",
                  icon: FaTruck,
                },
                {
                  to: "/warehouse",
                  label: "Kho bãi & lưu trữ",
                  icon: FaWarehouse,
                },
                { to: "/customs", label: "Thủ tục hải quan", icon: FaFileAlt },
                {
                  to: "/tracking",
                  label: "Tracking đơn hàng",
                  icon: FaMapMarkerAlt,
                },
                {
                  to: "/supply-chain",
                  label: "Quản lý chuỗi cung ứng",
                  icon: FaLink,
                },
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.to}
                    className="group flex items-center text-gray-600 hover:text-yellow-600 transition-all duration-300 text-sm"
                  >
                    <service.icon className="w-4 h-4 text-yellow-500 group-hover:text-yellow-600 mr-3 transition-colors duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              <span className="text-gray-800">Liên hệ</span>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-yellow-500"></div>
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <FaMapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Địa chỉ:</p>
                  <p className="text-gray-600">
                    123 Đường Lê Lợi, Quận 1, TP.HCM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <FaPhone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Hotline:</p>
                  <p className="text-yellow-600 font-bold text-lg">
                    0909 444 909
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <FaEnvelope className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Email:</p>
                  <p className="text-gray-600">support@tixilogistics.com</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-gray-600 text-xs mb-3">
                Kết nối với chúng tôi:
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white hover:bg-blue-600 border border-gray-300 hover:border-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300 group shadow-sm"
                >
                  <FaLinkedin className="w-4 h-4 text-blue-600 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white hover:bg-blue-500 border border-gray-300 hover:border-blue-500 rounded-lg flex items-center justify-center transition-colors duration-300 group shadow-sm"
                >
                  <FaFacebook className="w-4 h-4 text-blue-500 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white hover:bg-blue-400 border border-gray-300 hover:border-blue-400 rounded-lg flex items-center justify-center transition-colors duration-300 group shadow-sm"
                >
                  <FaComment className="w-4 h-4 text-blue-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()}{" "}
                <span className="text-yellow-600 font-semibold">
                  TixiLogistics
                </span>
                . All rights reserved. |
                <span className="ml-1">Công ty TNHH Logistics Tixi</span>
              </p>
            </div>

            <div className="flex space-x-6 text-xs text-gray-500">
              <Link
                to="/privacy"
                className="hover:text-yellow-600 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="/terms"
                className="hover:text-yellow-600 transition-colors"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-yellow-600 transition-colors"
              >
                Sơ đồ trang web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
