import React, { useState, useEffect } from "react";

const Feedback = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      position: "Giám đốc điều hành",
      company: "ABC Trading Co.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      feedback:
        "Dịch vụ logistics của TixiLogistics thật sự xuất sắc! Họ đã giúp chúng tôi tối ưu hóa chuỗi cung ứng, giảm chi phí vận chuyển đến 30%. Đội ngũ chuyên nghiệp, nhiệt tình và luôn sẵn sàng hỗ trợ 24/7.",
      bgImage:
        "https://i.pinimg.com/736x/30/3e/59/303e5955fa99dd84c83c37496a3de2a9.jpg",
    },
    {
      id: 2,
      name: "Trần Thị Bích",
      position: "Trưởng phòng Logistics",
      company: "XYZ Manufacturing",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      feedback:
        "Chúng tôi đã hợp tác với TixiLogistics được 2 năm và rất hài lòng về chất lượng dịch vụ. Hàng hóa luôn được giao đúng hạn, an toàn. Hệ thống tracking hiện đại giúp chúng tôi kiểm soát tốt mọi lô hàng.",
      bgImage:
        "https://img.freepik.com/premium-photo/realistic-plane-loading-cargo-airport_1308441-1715.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      id: 3,
      name: "Lê Minh Tuấn",
      position: "CEO",
      company: "Global Import Export",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      feedback:
        "TixiLogistics là đối tác logistics đáng tin cậy nhất mà chúng tôi từng làm việc. Họ xử lý các thủ tục hải quan nhanh chóng, chính xác. Đặc biệt ấn tượng với dịch vụ kho bãi hiện đại và quản lý hàng tồn kho chuyên nghiệp.",
      bgImage:
        "https://i.pinimg.com/736x/de/6a/4d/de6a4d9431c4e3e2bc5b1ba4ad393f89.jpg",
    },
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Background Images with Transition */}
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`absolute inset-0 transition-opacity duration-5000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${testimonial.bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI?
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        {/* Testimonial Content */}
        <div className="max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-all duration-700 ${
                currentSlide === index
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 absolute translate-x-10"
              }`}
            >
              <div className="flex flex-row items-center gap-8">
                {/* Customer Image - Left Side */}
                <div className="flex-shrink-0">
                  <div className="w-36 h-48 md:w-44 md:h-56 rounded-lg overflow-hidden border-4 border-white shadow-2xl bg-white">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Feedback Content - Right Side */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wide">
                      {testimonial.name}
                    </h3>
                    <p className="text-yellow-400 text-base font-semibold">
                      {testimonial.position}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {testimonial.company}
                    </p>
                  </div>

                  <div className="relative">
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                      " {testimonial.feedback} "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-12 h-3 bg-yellow-400"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;
