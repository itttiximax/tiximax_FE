import React, { useState } from "react";
import { ChevronDown, ChevronUp, Globe2 } from "lucide-react";

const services = [
  {
    id: 1,
    domain: "tiximaxindo.com",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg",
    market: "Indonesia",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Indonesia",
  },
  {
    id: 2,
    domain: "tiximax.jp",
    country: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg",
    market: "Japan",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Nhật Bản",
  },
  {
    id: 3,
    domain: "tiximax.kr",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg",
    market: "South Korea",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Hàn Quốc",
  },
  {
    id: 4,
    domain: "tiximax.us",
    country:
      "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
    market: "USA",
    description: "Chuyên tuyến vận chuyển và mua hàng từ Mỹ",
  },
  {
    id: 5,
    domain: "tiximax.net",
    country:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg",
    market: "Global",
    description: "Tổng quan tất cả dịch vụ vận chuyển và mua hàng quốc tế",
  },
];

const ServicesPage = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedServices = showAll ? services : services.slice(0, 4);

  return (
    <div className=" bg-gradient-to-b from-gray-400 to-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-left">
            <div className="flex items-center mb-4">
              <Globe2 className="w-12 h-12 text-blue-600 mr-2" />
              <h1 className="text-4xl font-extrabold text-gray-800">
                TIXIMAX Services
              </h1>
            </div>
            <p className="mt-2 text-lg text-gray-600">
              Khám phá các dịch vụ vận chuyển và mua hàng quốc tế từ TIXIMAX
            </p>
          </div>

          {/* Show All Button ở trên bên phải */}
          {services.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
            >
              {showAll ? (
                <>
                  Ẩn bớt <ChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  Xem tất cả <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Grid Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <img
                  src={service.country}
                  alt={`${service.market} flag`}
                  className="w-12 h-8 rounded shadow-sm"
                />
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {service.market}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {service.market}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <a
                href={`https://${service.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 font-medium group-hover:underline"
              >
                Visit {service.domain}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
