import React from "react";

const About = () => {
  return (
    <section
      className="relative w-full h-[600px] flex items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://media.vneconomy.vn/images/upload/2024/10/31/xaydungtnkhlogis.jpg')",
      }}
    >
      {/* Overlay mờ để chữ dễ đọc */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 max-w-3xl text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Về Chúng Tôi</h1>
        <p className="text-lg md:text-xl mb-6">
          Chúng tôi là đơn vị tiên phong trong lĩnh vực Logistic, cung cấp giải
          pháp vận chuyển và mua hộ toàn diện, giúp khách hàng tiết kiệm chi phí
          và thời gian.
        </p>
        <button className="px-6 py-3 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition duration-300 shadow-lg">
          Tìm hiểu thêm
        </button>
      </div>
    </section>
  );
};

export default About;
