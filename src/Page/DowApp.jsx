import React from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaClipboardList,
  FaBell,
  FaShippingFast,
  FaApple,
  FaGooglePlay,
  FaMobile,
  FaStar,
  FaTruck,
  FaMapMarkerAlt,
} from "react-icons/fa";

const DowApp = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-5 right-5 w-20 h-20 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 left-5 w-16 h-16 bg-yellow-300 rounded-lg rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          {/* Text Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                <FaMobile className="w-3 h-3" />
                <span>Ứng dụng di động</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  TixiMax
                </span>
                <br />
                <span className="text-gray-800">Mobile App</span>
              </h2>

              <p className="text-base text-gray-600 leading-relaxed max-w-lg">
                Quản lý logistics dễ dàng ngay trên điện thoại. Theo dõi đơn
                hàng, đặt dịch vụ và nhận thông báo real-time.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                {
                  icon: FaShoppingCart,
                  text: "Đặt dịch vụ vận chuyển nhanh chóng",
                  color: "text-blue-500",
                },
                {
                  icon: FaClipboardList,
                  text: "Quản lý đơn hàng thông minh",
                  color: "text-green-500",
                },
                {
                  icon: FaBell,
                  text: "Nhận thông báo real-time về trạng thái đơn hàng",
                  color: "text-purple-500",
                },
                {
                  icon: FaShippingFast,
                  text: "Tracking GPS chính xác, giao hàng toàn quốc",
                  color: "text-orange-500",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div
                    className={`w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-3 h-3 ${feature.color}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* App Rating */}
            <div className="flex items-center space-x-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-3 h-3 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm font-medium">4.8/5</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <p className="text-gray-600 text-sm">
                <span className="font-bold text-gray-800">50K+</span> lượt tải
              </p>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/download/ios"
                className="group flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <FaApple className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-xs text-gray-300">Tải về từ</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </Link>

              <Link
                to="/download/android"
                className="group flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <FaGooglePlay className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-xs text-green-100">Tải về từ</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </Link>
            </div>

            {/* QR Code hint */}
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
              </div>
              <span>Quét mã QR để tải app nhanh chóng</span>
            </div>
          </div>

          {/* Image/Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone mockup container */}
              <div className="relative w-48 h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-1 shadow-xl transform hover:rotate-3 transition-transform duration-500">
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl relative overflow-hidden">
                  {/* Status bar */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black bg-opacity-20 flex items-center justify-between px-3 text-white text-xs">
                    <span>9:41</span>
                    <span>100%</span>
                  </div>

                  {/* App content mockup */}
                  <div className="pt-8 px-3 text-white">
                    <h3 className="text-lg font-bold mb-1">TixiMax</h3>
                    <p className="text-xs opacity-90 mb-4">
                      Logistics Made Simple
                    </p>

                    {/* Mock interface elements */}
                    <div className="space-y-2">
                      <div className="bg-white bg-opacity-20 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <FaTruck className="w-3 h-3" />
                          <div className="flex-1">
                            <p className="text-xs font-medium">
                              Đơn hàng #TXM001
                            </p>
                            <p className="text-xs opacity-80">
                              Đang vận chuyển
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white bg-opacity-20 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <div className="flex-1">
                            <p className="text-xs font-medium">Tracking Live</p>
                            <p className="text-xs opacity-80">
                              Cập nhật real-time
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <FaBell className="w-4 h-4 text-white" />
              </div>

              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FaShippingFast className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DowApp;
