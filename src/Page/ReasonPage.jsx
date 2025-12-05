import React, { useState, useEffect } from "react";
import servicepic1 from "../assets/servicepic1.jpg";
import servicepic2 from "../assets/servicepic2.jpg";

const ReasonPage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [servicepic1, servicepic2];

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);
  const reasons = [
    {
      id: 1,
      title: "99% KHÁCH HÀNG HÀI LÒNG",
      description:
        "Những phản hồi tích cực của hàng trăm ngàn khách hàng là động lực để Tiximax tiếp tục hoàn thiện và nâng cấp dịch vụ.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "GIÁ CẢ DỊCH VỤ HỢP LÝ",
      description:
        "Chúng tôi cung cấp bảng giá minh bạch, cạnh tranh nhất thị trường với nhiều gói dịch vụ linh hoạt phù hợp mọi nhu cầu.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "HỆ THỐNG KHO QUỐC TẾ",
      description:
        "Tiximax có hệ thống kho tại nhiều quốc gia: Mỹ, Hàn, Nhật, Indonesia. Đây là lợi thế lớn giúp ",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "GIAO HÀNG TOÀN QUỐC",
      description:
        "Phủ sóng 63 tỉnh thành với đội ngũ giao hàng chuyên nghiệp, cam kết giao hàng đúng hạn và an toàn tuyệt đối.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gray-50 py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-gray-600 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            Những lý do
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            LỰA CHỌN TIXIMAX
          </h2>

          {/* Decorative line with icon */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-24 h-0.5 bg-gray-300"></div>
            <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
            <div className="w-24 h-0.5 bg-gray-300"></div>
          </div>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Với kinh nghiệm lâu năm trong logistics và thương mại quốc tế,
            Tiximax cam kết mang lại giải pháp Mua hộ - Vận chuyển xuyên biên
            giới tử tế và minh bạch. Chúng tôi giúp khách hàng tiếp cận thế giới
            dễ dàng, nhanh chóng và an tâm tuyệt đối.
          </p>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Reasons */}
            <div className="space-y-8">
              {reasons.map((reason, index) => (
                <div
                  key={reason.id}
                  className="flex items-start gap-6 group"
                  data-aos="fade-right"
                  data-aos-delay={index * 100}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center text-gray-700 group-hover:border-yellow-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-all duration-300 shadow-sm">
                      {reason.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 uppercase">
                        {reason.title}
                      </h3>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Image Carousel */}
            <div className="relative max-w-2lg mx-auto lg:mx-0">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Image Slider */}
                <div className="relative h-[400px]">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        currentImage === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Logistics ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`transition-all duration-300 rounded-full ${
                        currentImage === index
                          ? "w-8 h-2 bg-yellow-400"
                          : "w-2 h-2 bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>

              {/* Decorative Dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {[...Array(11)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === 5 ? "bg-yellow-400 scale-125" : "bg-gray-300"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { number: "3+", label: "Năm kinh nghiệm" },
              { number: "5000+", label: "Khách hàng tin dùng" },
              { number: "63/63", label: "Tỉnh thành phủ sóng" },
              { number: "24/7", label: "Hỗ trợ khách hàng" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-yellow-400"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default ReasonPage;
