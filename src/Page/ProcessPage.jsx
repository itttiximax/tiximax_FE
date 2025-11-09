import React from "react";

const steps = [
  {
    text: "Điền thông tin món hàng bạn đang cần mua",
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    text: "Kết nối bạn với người mua hộ",
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    text: "Thanh toán đơn hàng của bạn",
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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  {
    text: "Hàng được mua và vận chuyển",
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
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
  },
  {
    text: "Giao về tận nơi của bạn",
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
];

const ProcessPage = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-gray-600 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            Quy trình đơn giản
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-yellow-400">TIXIMAX</span> HOẠT ĐỘNG NHƯ THẾ
            NÀO?
          </h2>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-24 h-0.5 bg-gray-300"></div>
            <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
            <div className="w-24 h-0.5 bg-gray-300"></div>
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chỉ với 5 bước đơn giản, bạn có thể mua hàng và vận chuyển quốc tế
            một cách nhanh chóng, an toàn và tiết kiệm
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center flex flex-col items-center bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 group"
            >
              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-400 text-gray-900 text-lg font-bold flex items-center justify-center rounded-full shadow-lg z-10 group-hover:scale-110 transition-transform">
                {index + 1}
              </div>

              {/* Icon container */}
              <div className="mb-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-yellow-50 transition-colors">
                  <div className="text-gray-700 group-hover:text-yellow-600 transition-colors">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {step.text}
              </p>

              {/* Connection Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-0">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
            <span>Bắt đầu mua hàng ngay</span>
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessPage;
