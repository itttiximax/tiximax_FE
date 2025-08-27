import React from "react";
import { ArrowRight, Award, Clock, Shield, Users } from "lucide-react";

const About = () => {
  return (
    <section
      className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center text-white overflow-hidden"
      style={{
        backgroundImage:
          "url('https://media.vneconomy.vn/images/upload/2024/10/31/xaydungtnkhlogis.jpg')",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-yellow-400 rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-4xl text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Award className="w-4 h-4" />
          <span>Logistics Solutions</span>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-yellow-400">TixiMax</span> - Đối tác logistics
          tin cậy
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg mb-6 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Chúng tôi là đơn vị tiên phong trong lĩnh vực logistics, cung cấp giải
          pháp vận chuyển và mua hộ toàn diện, giúp khách hàng tiết kiệm chi phí
          và thời gian.
        </p>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">500K+</div>
            <div className="text-xs text-gray-300">Đơn hàng</div>
          </div>
          <div className="w-px h-8 bg-gray-500"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">50+</div>
            <div className="text-xs text-gray-300">Quốc gia</div>
          </div>
          <div className="w-px h-8 bg-gray-500"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">99.8%</div>
            <div className="text-xs text-gray-300">Hài lòng</div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-200">Giao hàng nhanh</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-200">An toàn tuyệt đối</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Users className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-200">Hỗ trợ 24/7</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span>Tìm hiểu thêm</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white rounded-lg font-medium transition-all duration-300">
            <span>Liên hệ ngay</span>
          </button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </section>
  );
};

export default About;
