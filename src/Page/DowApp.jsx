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
    <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden flex items-center justify-center min-h-screen">
      {/* Enhanced Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-8"></div>
        <div className="absolute bottom-20 left-10 w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg rotate-45 opacity-10"></div>
        <div className="absolute bottom-1/2 left-5 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full opacity-8"></div>

        {/* Floating dots pattern */}
        <div className="absolute top-1/4 left-1/4 grid grid-cols-3 gap-2 opacity-5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          {/* Enhanced Text Content */}
          <div className="space-y-4">
            {/* Header Section */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-yellow-200">
                <Smartphone className="w-3 h-3" />
                <span>Ứng dụng di động</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 bg-clip-text text-transparent">
                    TixiMax
                  </span>
                  <br />
                  <span className="text-gray-800">Mobile App</span>
                </h1>

                <p className="text-sm text-gray-600 leading-relaxed max-w-md font-medium">
                  Quản lý logistics dễ dàng ngay trên điện thoại. Theo dõi đơn
                  hàng, đặt dịch vụ và nhận thông báo real-time với trải nghiệm
                  tuyệt vời.
                </p>
              </div>
            </div>

            {/* Enhanced Features List */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    <feature.icon className={`w-4 h-4 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced App Rating */}
            <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold text-sm">
                  4.8/5
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-gray-600 text-sm">
                <span className="font-bold text-gray-800">50K+</span>
                <span className="ml-1">lượt tải</span>
              </div>
            </div>

            {/* Enhanced Download Buttons */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="group flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[140px]">
                  <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                    <span className="text-black font-bold text-sm">🍎</span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-300">Tải về từ</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </button>

                <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[140px]">
                  <Play className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <p className="text-xs text-green-100">Tải về từ</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </button>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-white rounded-md border-2 border-gray-300 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-gray-600 font-medium text-sm">
                  Quét mã QR để tải app nhanh chóng
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone mockup with enhanced design */}
              <div className="relative w-32 h-40 bg-gradient-to-b from-gray-900 to-black rounded-2xl p-1 shadow-xl transform hover:rotate-2 transition-all duration-500">
                {/* Screen with realistic bezels */}
                <div className="w-full h-full bg-gradient-to-b from-yellow-400 via-yellow-500 to-orange-500 rounded-xl relative overflow-hidden shadow-inner">
                  {/* Realistic status bar */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-black/20 backdrop-blur-sm flex items-center justify-between px-2 text-white text-xs font-medium">
                    <span className="text-xs">9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">5G</span>
                      <div className="flex gap-px">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 h-2 bg-white rounded-full opacity-80"
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs">100%</span>
                    </div>
                  </div>

                  {/* App interface mockup */}
                  <div className="pt-6 px-2 text-white">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold mb-1">TixiMax</h3>
                      <p className="text-xs opacity-90">
                        Logistics Made Simple
                      </p>
                    </div>

                    {/* Enhanced mock interface */}
                    <div className="space-y-2">
                      <div className="bg-white/25 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                            <Truck className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-xs">
                              Đơn hàng #TXM001
                            </p>
                            <p className="text-xs opacity-90">
                              Đang vận chuyển
                            </p>
                          </div>
                          <CheckCircle className="w-3 h-3 text-green-300" />
                        </div>
                      </div>

                      <div className="bg-white/25 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-xs">
                              GPS Tracking
                            </p>
                            <p className="text-xs opacity-90">
                              Cập nhật real-time
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      <div className="bg-white/15 rounded-lg p-2">
                        <div className="text-center">
                          <p className="text-xs opacity-80">
                            Thời gian giao hàng dự kiến
                          </p>
                          <p className="font-bold text-xs">15:30 - 16:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced floating elements */}
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Bell className="w-3 h-3 text-white" />
              </div>

              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Download className="w-3 h-3 text-white" />
              </div>

              <div className="absolute top-1/2 -left-3 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DowApp;
