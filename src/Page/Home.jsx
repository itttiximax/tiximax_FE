import React from "react";
import About from "./About";
import DowApp from "./DowApp";
import SideMenu from "./SideMenu"; // 👈 import SideMenu

const steps = [
  {
    img: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
    text: "Điền thông tin món hàng bạn đang cần mua",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    text: "Kết nối bạn với người mua hộ",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/2331/2331970.png",
    text: "Thanh toán đơn hàng của bạn",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    text: "Hàng được mua và vận chuyển",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    text: "Giao về tận nơi của bạn",
  },
];

const Home = () => {
  return (
    <div className="bg-white relative">
      {/* Side Menu */}
      <SideMenu />

      {/* About section */}
      <About />

      {/* Steps section */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          BuyNgon hoạt động như thế nào?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center flex flex-col items-center"
            >
              <div className="relative">
                <img
                  src={step.img}
                  alt={`step-${index}`}
                  className="w-20 h-20 mb-4 transition-transform duration-300 hover:scale-110"
                />
                <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DowApp section */}
      <section className="py-24">
        <DowApp />
      </section>
    </div>
  );
};

export default Home;
