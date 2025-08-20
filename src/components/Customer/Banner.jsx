import React from "react";

const Banner = () => {
  const content = `📍 TixiMax - 123 Đường Lê Lợi, Quận 1, TP.HCM  |  📞 Liên hệ: 0909 444 909`;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-3 px-6 shadow-md overflow-hidden">
      <div className="flex whitespace-nowrap">
        <p className="animate-banner font-medium text-sm md:text-base px-2">
          {content} &nbsp; {content}
        </p>
        <p className="animate-banner font-medium text-sm md:text-base px-2">
          {content} &nbsp; {content}
        </p>
      </div>

      <style>{`
        @keyframes banner {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-banner {
          display: inline-block;
          animation: banner 20s linear infinite; /* chạy nhanh hơn, gần nhau hơn */
        }
      `}</style>
    </div>
  );
};

export default Banner;
