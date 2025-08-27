import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Globe2,
  ExternalLink,
  Truck,
  Package,
} from "lucide-react";

const services = [
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
    domain: "tiximax.net",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg",
    market: "Global",
    description: "Tổng quan tất cả dịch vụ vận chuyển và mua hàng quốc tế",
    specialties: ["Multi-platform", "Consolidated", "Express"],
    estimatedTime: "Varies",
  },
];

const ServicesPage = () => {
  const [showAll, setShowAll] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const displayedServices = showAll ? services : services.slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-yellow-50 py-10 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-yellow-300 rounded-lg rotate-45"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl mb-3 shadow-lg">
            <Globe2 className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              TIXIMAX
            </span>
            <span className="text-gray-800"> Global Services</span>
          </h1>

          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Khám phá mạng lưới dịch vụ vận chuyển và mua hàng quốc tế với công
            nghệ tiên tiến, đảm bảo an toàn và nhanh chóng
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">50+</div>
              <div className="text-xs text-gray-500">Quốc gia</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">1M+</div>
              <div className="text-xs text-gray-500">Đơn hàng</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">99.8%</div>
              <div className="text-xs text-gray-500">Thành công</div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        {services.length > 4 && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-yellow-50 border border-yellow-400 text-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              {showAll ? (
                <>
                  <span className="text-sm font-medium">Ẩn bớt</span>
                  <ChevronUp className="w-4 h-4 text-yellow-600" />
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">Xem tất cả</span>
                  <ChevronDown className="w-4 h-4 text-yellow-600" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-yellow-200 relative overflow-hidden"
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Hover overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-yellow-500/5 transition-opacity duration-300 ${
                  hoveredCard === service.id ? "opacity-100" : "opacity-0"
                }`}
              ></div>

              {/* Header */}
              <div className="relative z-10 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <img
                      src={service.country}
                      alt={`${service.market} flag`}
                      className="w-10 h-7 rounded-md shadow-sm object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Truck className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    {service.market}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-yellow-600 transition-colors">
                  {service.market}
                </h2>

                <p className="text-gray-600 leading-relaxed text-xs">
                  {service.description}
                </p>
              </div>

              {/* Specialties */}
              <div className="relative z-10 mb-3">
                <div className="flex items-center space-x-1 mb-2">
                  <Package className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Chuyên môn:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {service.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Time */}
              <div className="relative z-10 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Thời gian:</span>
                  <span className="font-semibold text-yellow-600">
                    {service.estimatedTime}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="relative z-10">
                <a
                  href={`https://${service.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center justify-between w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Truy cập</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <p className="text-center text-xs text-gray-400 mt-1">
                  {service.domain}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-yellow-200/20 to-transparent rounded-bl-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">
              Cần hỗ trợ tư vấn dịch vụ?
            </h3>
            <p className="text-yellow-100 mb-4 text-sm max-w-xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn giải pháp
              logistics phù hợp nhất cho nhu cầu của bạn.
            </p>
            <button className="bg-white text-yellow-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-50 transition-colors shadow-md">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
