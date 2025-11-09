// src/pages/PartnerPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Danh sách đối tác (đã thêm VNPost, VB Bank, Techcombank, Viettel Post, GHN, GHTK)
const PARTNERS = [
  // --- Các đối tác bạn đã có ---
  {
    name: "UPS",
    logo: "https://www.ups.com/webassets/icons/logo.svg",
    url: "https://www.ups.com/",
  },
  {
    name: "DHL",
    logo: "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
    url: "https://www.dhl.com/",
  },
  {
    name: "JT Express",
    logo: "https://jtexpress.vn/themes/jtexpress/assets/images/logo.png",
    url: "https://jtexpress.vn/",
  },

  // --- Các đối tác VN bạn yêu cầu thêm ---
  {
    name: "Vietnam Post (VNPost)",
    logo: "https://vnpost.vn/apps/frontend/images/header/logo-fuild.png",
    url: "https://vnpost.vn/",
  },
  {
    name: "VietBank (VB Bank)",
    logo: "https://www.vietbank.com.vn/img/logo.png",
    url: "https://www.vietbank.com.vn/",
  },
  {
    name: "Techcombank",
    logo: "https://techcombank.com/content/dam/techcombank/public-site/seo/techcombank_logo_svg_86201e50d1.svg",
    url: "https://www.techcombank.com.vn/",
  },
  {
    name: "Viettel Post",
    logo: "data:image/png;base64,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",
    url: "https://viettelpost.com.vn/",
  },
  {
    name: "Giao Hàng Nhanh (GHN)",
    logo: "https://theme.hstatic.net/200000472237/1001083717/14/logo.png?v=880",
    url: "https://ghn.vn/",
  },
  {
    name: "Giao Hàng Tiết Kiệm (GHTK)",
    logo: "https://ghtk.vn/assets/logo.svg",
    url: "https://giaohangtietkiem.vn/",
  },
];

const PartnerCard = ({ name, logo, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="group flex items-center justify-center shrink-0 w-48 h-24 sm:w-56 sm:h-28 md:w-60 md:h-28 mx-6 rounded-xl bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-sm hover:shadow-lg border border-gray-100"
    aria-label={name}
    title={name}
  >
    <img
      src={logo}
      alt={name}
      className="max-h-12 sm:max-h-14 object-contain transition duration-300" // ← bỏ grayscale
      loading="lazy"
    />
  </a>
);

const PartnerPage = () => {
  const trackRef = useRef(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let dir = 1;
    const step = 1.2;
    let raf;

    const loop = () => {
      if (!isHover) {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2)
          dir = -1;
        if (track.scrollLeft <= 2) dir = 1;
        track.scrollLeft += step * dir;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isHover]);

  const scrollByAmount = (amount) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-gray-900">
            ĐỐI TÁC CỦA CHÚNG TÔI
          </h2>
          <div className="mt-3 flex justify-center">
            <span className="h-1 w-36 bg-yellow-400 rounded-full"></span>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {/* Prev */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByAmount(-260)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-yellow-50 hover:border-yellow-300 transition"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          {/* Track */}
          <div
            ref={trackRef}
            className="flex overflow-x-auto no-scrollbar scroll-smooth py-4 px-10 md:px-14 gap-2"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="shrink-0 w-4 md:w-10" aria-hidden="true"></div>

            {PARTNERS.map((p) => (
              <PartnerCard key={p.name} {...p} />
            ))}

            {/* Lặp lần 2 để cảm giác cuộn liên tục */}
            {PARTNERS.map((p, idx) => (
              <PartnerCard key={`${p.name}-dup-${idx}`} {...p} />
            ))}

            <div className="shrink-0 w-4 md:w-10" aria-hidden="true"></div>
          </div>

          {/* Next */}
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByAmount(260)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-yellow-50 hover:border-yellow-300 transition"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Đồng hành cùng các đối tác vận chuyển và tài chính uy tín để tối ưu
          tốc độ và chi phí cho bạn.
        </p>
      </div>
    </section>
  );
};

export default PartnerPage;
