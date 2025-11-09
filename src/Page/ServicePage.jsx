import React, { useState } from "react";

const services = [
  {
    id: 7,
    domain: "tiximax.vn",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    market: "Vietnam",
    description:
      "Tuyến nội địa và đầu mối gom hàng toàn quốc, kết nối tất cả tuyến quốc tế.",
    specialties: ["Kho vận", "Giao hàng nội địa", "Hỗ trợ doanh nghiệp"],
    estimatedTime: "1–3 ngày",
  },
  {
    id: 1,
    domain: "tiximaxindo.com",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg",
    market: "Indonesia",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Indonesia",
    specialties: ["E-commerce", "Textiles", "Food & Spices"],
    estimatedTime: "5-7 ngày",
  },
  {
    id: 2,
    domain: "tiximax.jp",
    country: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg",
    market: "Japan",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Nhật Bản",
    specialties: ["Electronics", "Cosmetics", "Fashion"],
    estimatedTime: "7-10 ngày",
  },
  {
    id: 3,
    domain: "tiximax.kr",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg",
    market: "South Korea",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Hàn Quốc",
    specialties: ["K-Beauty", "Fashion", "Electronics"],
    estimatedTime: "6-9 ngày",
  },
  {
    id: 4,
    domain: "tiximax.us",
    country:
      "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
    market: "USA",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Mỹ",
    specialties: ["Tech", "Supplements", "Books"],
    estimatedTime: "10-14 ngày",
  },
  {
    id: 5,
    domain: "tiximax.hk",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Flag_of_Hong_Kong.svg",
    market: "Hong Kong",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Hong Kong",
    specialties: ["Electronics", "Jewelry", "Fashion"],
    estimatedTime: "4-7 ngày",
  },
  {
    id: 6,
    domain: "tiximax.net",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg",
    market: "Global",
    description: "Tổng quan tất cả dịch vụ vận chuyển và mua hàng quốc tế",
    specialties: ["Multi-platform", "Consolidated", "Express"],
    estimatedTime: "Varies",
  },
  // ✅ Thêm tuyến Việt Nam
];

const ServicesPage = () => {
  const [showAll, setShowAll] = useState(false);
  const needsToggle = services.length > 8;
  const displayedServices =
    needsToggle && !showAll ? services.slice(0, 8) : services;

  return (
    <div className="bg-gray-50 py-20 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-gray-600 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            Mạng lưới toàn cầu
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            DỊCH VỤ QUỐC TẾ <span className="text-yellow-400">TIXIMAX</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-24 h-0.5 bg-gray-300"></div>
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <div className="w-24 h-0.5 bg-gray-300"></div>
          </div>

          {/* <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Khám phá mạng lưới dịch vụ vận chuyển và mua hàng quốc tế với công
            nghệ tiên tiến, đảm bảo an toàn và nhanh chóng.
          </p> */}
        </div>

        {/* Grid 4 cột rộng hơn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 group"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={service.country}
                    alt={`${service.market} flag`}
                    className="w-16 h-11 rounded shadow-md object-cover border-2 border-gray-200"
                  />
                  <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase min-w-[120px] text-center">
                    {service.market}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  {service.market}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base">
                  {service.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <svg
                    className="w-5 h-5 text-yellow-600"
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
                  <span className="text-sm font-semibold text-gray-700 uppercase">
                    Chuyên môn
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-base text-gray-600 font-medium">
                      Thời gian:
                    </span>
                  </div>
                  <span className="font-bold text-yellow-600 text-base">
                    {service.estimatedTime}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href={`https://${service.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow hover:shadow-md group/btn"
              >
                <span>Truy cập ngay</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <p className="text-center text-xs text-gray-400 mt-2 font-medium">
                {service.domain}
              </p>
            </div>
          ))}
        </div>

        {/* Toggle nếu >8 */}
        {needsToggle && (
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-yellow-50 border-2 border-yellow-400 text-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-bold"
            >
              {showAll ? (
                <>
                  <span>Ẩn bớt</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>Xem tất cả dịch vụ</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
