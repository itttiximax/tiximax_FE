import React from "react";
import {
  ShoppingCart,
  ClipboardList,
  Bell,
  Truck,
  Smartphone,
  Star,
  MapPin,
  Download,
  Play,
  QrCode,
  CheckCircle,
} from "lucide-react";

const DowApp = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Đặt dịch vụ nhanh chóng",
      description: "Đặt dịch vụ vận chuyển chỉ với vài thao tác đơn giản",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: ClipboardList,
      title: "Quản lý đơn hàng",
      description: "Theo dõi và quản lý tất cả đơn hàng một cách thông minh",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: Bell,
      title: "Thông báo real-time",
      description: "Nhận cập nhật trạng thái đơn hàng ngay lập tức",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Truck,
      title: "Tracking GPS chính xác",
      description: "Theo dõi hành trình giao hàng với độ chính xác cao",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden flex items-center justify-center min-h-screen">
      {/* Simplified and Enhanced Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)] opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Text Content - Made more professional and clean */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <Smartphone className="w-4 h-4" />
                <span>Ứng dụng di động</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                Tải ứng dụng{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                  TixiMax
                </span>{" "}
                ngay hôm nay
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Quản lý logistics dễ dàng ngay trên điện thoại. Theo dõi đơn
                hàng, đặt dịch vụ và nhận thông báo real-time với trải nghiệm
                mượt mà và chuyên nghiệp.
              </p>
            </div>

            {/* Features List - Grid layout for better presentation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* App Rating - Cleaner design */}
            <div className="flex items-center gap-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-bold text-base">4.8</span>
              </div>
              <div className="h-6 border-l border-gray-200"></div>
              <div className="text-gray-600 text-base">
                <span className="font-bold text-gray-900">50K+</span> lượt tải
              </div>
            </div>

            {/* Download Buttons - Larger and more prominent */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-xl text-base font-medium min-w-[180px]">
                <span className="text-xl"></span>
                <div className="text-left">
                  <p className="text-xs opacity-80">Tải về từ</p>
                  <p>App Store</p>
                </div>
              </button>

              <button className="flex items-center justify-center gap-3 bg-[#34A853] hover:bg-[#2E9647] text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-xl text-base font-medium min-w-[180px]">
                <Play className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <p className="text-xs opacity-80">Tải về từ</p>
                  <p>Google Play</p>
                </div>
              </button>
            </div>

            {/* QR Code Section - Integrated neatly */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <QrCode className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-gray-700 font-medium text-base">
                Quét QR để tải app nhanh chóng
              </span>
            </div>
          </div>

          {/* Phone Mockup - Larger, more detailed, with subtle animation */}
          <div className="flex justify-center">
            <div className="relative w-64 h-128 bg-gray-900 rounded-3xl p-2 shadow-2xl transform perspective-1000 rotate-y-[-10deg] hover:rotate-y-0 transition-all duration-500">
              {/* Screen */}
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center justify-between px-4 text-white text-xs">
                  <span>9:41</span>
                  <div className="flex items-center gap-2">
                    <span>5G</span>
                    <div className="w-4 h-1 bg-white rounded-full"></div>
                    <span>100%</span>
                  </div>
                </div>

                {/* App Content */}
                <div className="pt-8 px-4 bg-gradient-to-b from-yellow-400 to-orange-500 h-full text-white">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold">TixiMax</h3>
                    <p className="text-sm opacity-80">Logistics Made Simple</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5" />
                        <div className="flex-1">
                          <p className="font-semibold">Đơn hàng #TXM001</p>
                          <p className="text-sm">Đang vận chuyển</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      </div>
                    </div>

                    <div className="bg-white/20 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <div className="flex-1">
                          <p className="font-semibold">GPS Tracking</p>
                          <p className="text-sm">Cập nhật real-time</p>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-sm opacity-80">Thời gian dự kiến</p>
                      <p className="font-bold">15:30 - 16:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow delay-200">
                <Download className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default DowApp;
