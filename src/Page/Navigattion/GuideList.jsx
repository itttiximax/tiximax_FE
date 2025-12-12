import React, { useEffect, useRef, useState } from "react";
import { Search, PackageSearch, ArrowRight } from "lucide-react";
import PHONE1 from "../../assets/PHONE1.jpg";
import PHONE2 from "../../assets/PHONE2.jpg";

const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const GuideList = () => {
  const guides = [
    {
      icon: <PackageSearch className="w-6 h-6" />,
      title: "Hướng dẫn Đặt hàng",
      desc: "Quy trình đặt hàng tại Tiximax giúp bạn mua hộ hoặc vận chuyển hàng quốc tế dễ dàng và nhanh chóng.",
      steps: [
        "Tìm sản phẩm và gửi link yêu cầu trên website Tiximax.",
        "Nhận báo giá chi tiết bao gồm toàn bộ chi phí.",
        "Xác nhận đơn và thanh toán.",
        "Theo dõi trạng thái đơn hàng realtime trên hệ thống.",
      ],
      image: PHONE1,
      link: "/guide/order",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Hướng dẫn Tra cứu & Theo dõi đơn hàng",
      desc: "Kiểm tra hành trình đơn hàng từ nước ngoài về Việt Nam, trạng thái kho, hải quan và giao nội địa.",
      steps: [
        "Nhập mã đơn trên trang Tra cứu đơn hàng.",
        "Xem trạng thái chi tiết từng chặng vận chuyển.",
        "Nhận thông báo tự động qua SMS hoặc hệ thống.",
        "Liên hệ hỗ trợ nếu có vấn đề phát sinh.",
      ],
      image: PHONE2,
      link: "/guide/tracking",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/40">
      {/* ===================== HEADER ĐỒNG BỘ ===================== */}
      <section className="relative overflow-hidden mb-12 lg:mb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Radial amber giống các trang khác */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/25 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 lg:py-24">
          <div className="space-y-5 text-white">
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-amber-300 uppercase">
              Hướng dẫn Tiximax
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Hướng dẫn sử dụng Tiximax
            </h1>
            <p className="text-sm md:text-base text-gray-200 max-w-2xl leading-relaxed">
              Tất cả những gì bạn cần để bắt đầu: cách đặt hàng, theo dõi đơn và
              sử dụng các tính năng của TIXIMAX LOGISTICS một cách hiệu quả.
            </p>
          </div>
        </div>
      </section>
      {/* ============================================================ */}

      <div className="max-w-7xl mx-auto px-6 pb-16 lg:pb-20">
        {/* INTRO – NO ANIMATION */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            HƯỚNG DẪN CƠ BẢN – BẮT ĐẦU VỚI TIXIMAX
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Hai hướng dẫn quan trọng nhất giúp bạn đặt hàng và theo dõi đơn hiệu
            quả, phù hợp cho cả khách lẻ và chủ shop.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {guides.map((guide, index) => (
            <AnimatedSection key={guide.title} delay={index * 100}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Image Section */}
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                  <div className="absolute top-6 left-6">
                    <div className="bg-yellow-400 text-gray-900 p-3.5 rounded-xl shadow-lg">
                      {guide.icon}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                      {guide.title}
                    </h2>
                  </div>
                </div>

                {/* Text Section */}
                <div className="p-8 md:p-10">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                    {guide.desc}
                  </p>

                  {/* Steps */}
                  <div className="mb-8 md:mb-10">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-5 pb-3 border-b-2 border-yellow-400">
                      Các bước thực hiện:
                    </h3>

                    <ol className="space-y-4 md:space-y-5">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm flex items-center justify-center mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="text-base md:text-lg text-gray-700 leading-relaxed pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <a
                    href={guide.link}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold text-sm md:text-base px-7 md:px-8 py-3.5 md:py-4 rounded-xl transition-all duration-300 group"
                  >
                    Xem hướng dẫn chi tiết
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </main>
  );
};

export default GuideList;
