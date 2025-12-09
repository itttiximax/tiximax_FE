import React, { useEffect, useRef, useState } from "react";
import { HelpCircle, Search, PackageSearch, ArrowRight } from "lucide-react";
import PHONE1 from "../../assets/PHONE1.jpg";
import PHONE2 from "../../assets/PHONE2.jpg";

const GuideList = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(
              (prev) => new Set([...prev, entry.target.dataset.section])
            );
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => {
      observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const AnimatedSection = ({ children, sectionId, delay = 0 }) => {
    const isVisible = visibleSections.has(sectionId);
    return (
      <div
        data-section={sectionId}
        className={`transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  };

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-10 to-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection sectionId="header">
          <div className="text-center mb-24">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              HƯỚNG DẪN CƠ BẢN – BẮT ĐẦU VỚI TIXIMAX
            </h1>

            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Hai hướng dẫn quan trọng nhất giúp bạn đặt hàng và theo dõi đơn
              hiệu quả với TIXIMAX LOGISTICS.
            </p>
          </div>
        </AnimatedSection>

        {/* Guides Grid */}
        <div className="grid lg:grid-cols-2 gap-16">
          {guides.map((guide, index) => (
            <AnimatedSection
              key={guide.title}
              sectionId={`guide-${index}`}
              delay={index * 100}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Icon Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-yellow-400 text-gray-900 p-3.5 rounded-xl shadow-lg">
                      {guide.icon}
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="text-3xl font-bold text-white">
                      {guide.title}
                    </h2>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10">
                  <p className="text-lg text-gray-700 leading-relaxed mb-10">
                    {guide.desc}
                  </p>

                  {/* Steps */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b-2 border-yellow-400">
                      Các bước thực hiện:
                    </h3>
                    <ol className="space-y-5">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm flex items-center justify-center mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="text-lg text-gray-700 leading-relaxed pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={guide.link}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 group"
                  >
                    Xem hướng dẫn chi tiết
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom Info */}
        <AnimatedSection sectionId="bottom-info">
          <div className="mt-24 bg-white rounded-2xl p-12 shadow-sm">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Cần hỗ trợ thêm?
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-10">
                Đội ngũ TIXIMAX luôn sẵn sàng hỗ trợ bạn 24/7 qua các kênh:
                Hotline, Messenger, Zalo hoặc Email. Đừng ngần ngại liên hệ khi
                cần tư vấn!
              </p>

              <div className="flex flex-wrap justify-center gap-5">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300"
                >
                  Liên hệ hỗ trợ
                </a>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300"
                >
                  Câu hỏi thường gặp
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default GuideList;
