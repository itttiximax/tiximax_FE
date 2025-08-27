import React from "react";
import About from "./About";
import DowApp from "./DowApp";
import SideMenu from "./SideMenu";
import ServicePage from "./ServicePage";

const steps = [
  {
    img: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
    text: "Điền thông tin món hàng bạn đang cần mua",
    color: "bg-blue-500",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    text: "Kết nối bạn với người mua hộ",
    color: "bg-green-500",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/2331/2331970.png",
    text: "Thanh toán đơn hàng của bạn",
    color: "bg-purple-500",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    text: "Hàng được mua và vận chuyển",
    color: "bg-orange-500",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    text: "Giao về tận nơi của bạn",
    color: "bg-yellow-500",
  },
];

const Home = () => {
  return (
    <div className="bg-white relative overflow-x-hidden">
      {/* Side Menu */}
      <SideMenu />

      {/* About section */}
      <About />

      {/* Steps section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-yellow-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-yellow-300 rounded-lg rotate-45"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl mb-3 shadow-lg">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-xs">?</span>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                TixiMax
              </span>{" "}
              hoạt động như thế nào?
            </h2>

            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Quy trình đơn giản 5 bước để mua hàng và vận chuyển quốc tế một
              cách nhanh chóng và an toàn
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative text-center flex flex-col items-center bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg z-10">
                  {index + 1}
                </div>

                {/* Icon container */}
                <div className="relative mb-3">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <img
                      src={step.img}
                      alt={`step-${index}`}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>

                {/* Text */}
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {step.text}
                </p>

                {/* Connection line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-yellow-300 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                )}

                {/* Corner decoration */}
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-tr-full"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span>Bắt đầu mua hàng ngay</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Service Page section */}
      <section className="py-12">
        <ServicePage />
      </section>

      {/* DowApp section */}
      <section className="py-12">
        <DowApp />
      </section>

      {/* Bottom spacing */}
      <div className="pb-8"></div>
    </div>
  );
};

export default Home;
