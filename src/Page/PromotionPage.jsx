import React, { useEffect, useMemo, useState } from "react";

/** Dữ liệu demo — thay bằng API thật nếu có */
const RAW_PROMOS = [
  {
    id: "flash-1",
    title: "Flash Sale Quốc Tế",
    subtitle: "Giảm ngay 25% cước tuyến HK, JP, KR",
    tag: "Quốc tế",
    type: "flash",
    badge: "HOT",
    startAt: "2025-11-01T00:00:00Z",
    endAt: "2025-12-01T00:00:00Z",
    conditions: ["Đơn từ 3kg trở lên", "Áp dụng tối đa 2 triệu"],
    code: "FLASH25",
    cta: { label: "Đặt tuyến ngay", href: "/booking" },
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "local-ship",
    title: "Nội địa siêu rẻ",
    subtitle: "Chỉ từ 12K, giao 48h toàn quốc",
    tag: "Nội địa",
    type: "deal",
    badge: "NEW",
    startAt: "2025-10-20T00:00:00Z",
    endAt: "2025-12-31T00:00:00Z",
    conditions: ["Áp dụng cho GHN/GHTK", "Tối đa 20 đơn/tháng"],
    code: "ND12K",
    cta: { label: "Tạo đơn ngay", href: "/create-order" },
    img: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=500&q=80",
  },
  {
    id: "b2b",
    title: "B2B Doanh Nghiệp",
    subtitle: "Giảm 15% cho hợp đồng > 300 đơn",
    tag: "Doanh nghiệp",
    type: "business",
    badge: "-15%",
    startAt: "2025-11-05T00:00:00Z",
    endAt: "2026-01-31T00:00:00Z",
    conditions: ["Ký hợp đồng 3 tháng", "Có mã số thuế"],
    code: "B2B15",
    cta: { label: "Liên hệ Sales", href: "/contact" },
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "cod",
    title: "Miễn phí COD",
    subtitle: "0đ phí thu hộ cho 10 đơn đầu",
    tag: "Tài chính",
    type: "finance",
    badge: "0đ",
    startAt: "2025-11-01T00:00:00Z",
    endAt: "2025-12-31T00:00:00Z",
    conditions: ["Chỉ áp dụng nội địa", "Tối đa 10 đơn/khách"],
    code: "COD0",
    cta: { label: "Kích hoạt COD", href: "/cod" },
    img: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1600&auto=format&fit=crop",
  },

  /** ======= Thêm 2 promotion mới ======= */
  {
    id: "sea-combo",
    title: "SEA Mega Combo",
    subtitle: "Giảm 18% cước gói SEA (ID, PH, SG → VN)",
    tag: "Quốc tế",
    type: "flash",
    badge: "-18%",
    startAt: "2025-11-08T00:00:00Z",
    endAt: "2026-01-15T00:00:00Z",
    conditions: ["Áp dụng lô > 30kg", "Gom tối đa 3 người nhận/đơn"],
    code: "SEA18",
    cta: { label: "Đặt tuyến SEA", href: "/booking?route=sea" },
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "express-weekend",
    title: "Express Weekend",
    subtitle: "Thứ 6–CN: -12% cước nhanh JP/KR",
    tag: "Nội địa & Quốc tế",
    type: "deal",
    badge: "-12%",
    startAt: "2025-11-07T00:00:00Z",
    endAt: "2026-02-28T00:00:00Z",
    conditions: [
      "Áp dụng khi tạo đơn trong 3 ngày cuối tuần",
      "Không cộng dồn mã khác",
    ],
    code: "WEEKEND12",
    cta: { label: "Tạo đơn cuối tuần", href: "/create-order?speed=express" },
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  },

  /** (Bạn có thể bổ sung thêm các promo khác nếu cần) */
];

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "flash", label: "Flash Sale" },
  { key: "deal", label: "Nội địa" },
  { key: "finance", label: "Tài chính" },
  { key: "business", label: "Doanh nghiệp" },
];

function useCountdown(targetIso) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, isOver: diff === 0 };
}

const Ribbon = ({ text }) => (
  <div className="absolute -top-2.5 -left-2.5 z-10 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-md">
    {text}
  </div>
);

const CopyCode = ({ code }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      title="Sao chép mã"
    >
      {copied ? (
        <svg
          className="w-4 h-4 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
      {copied ? "Đã copy" : code}
    </button>
  );
};

const PromoCard = ({ p }) => {
  const { d, h, m, s } = useCountdown(p.endAt);
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400">
      <Ribbon text={p.badge} />

      {/* Image — thu nhỏ */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-t-xl">
        <img
          src={p.img}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
        <div className="absolute bottom-4 left-4 space-y-1.5 max-w-[82%]">
          <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-gray-900">
            {p.tag}
          </span>
          <h3 className="text-xl font-bold text-white leading-snug">
            {p.title}
          </h3>
          <p className="text-sm text-gray-200">{p.subtitle}</p>
        </div>
      </div>

      {/* Content — thu gọn */}
      <div className="p-5 space-y-5">
        {/* Countdown */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-700 font-semibold text-sm">
            <svg
              className="w-4 h-4"
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
            Kết thúc sau
          </span>
          <div className="flex gap-1.5">
            {["d", "h", "m", "s"].map((label, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-md bg-gray-100 px-2.5 py-1.5 min-w-[42px]"
              >
                <span className="font-bold text-gray-900 text-base">
                  {String([d, h, m, s][i]).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <ul className="space-y-2 text-sm text-gray-600">
          {p.conditions.map((c, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <svg
                className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {c}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <CopyCode code={p.code} />
          <a
            href={p.cta.href}
            className="flex-1 rounded-full bg-yellow-400 px-4 py-2.5 text-center text-sm font-bold text-gray-900 hover:bg-yellow-500 transition-colors shadow-md"
          >
            {p.cta.label}
          </a>
        </div>
      </div>
    </div>
  );
};

/** Banner đồng bộ style ReasonPage, có thu chiều cao ảnh để gọn hơn */
const PromoBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-200 shadow-2xl border-2 border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center">
        <div className="space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm md:text-base font-bold text-yellow-700">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Tuần lễ khuyến mãi Tiximax
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Ưu đãi đỉnh cao cho mọi tuyến vận chuyển
          </h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Giảm sâu cước quốc tế, nội địa siêu rẻ, ưu đãi tài chính & combo cho
            doanh nghiệp. Săn mã nhanh tay – số lượng có hạn!
          </p>
          <div className="flex gap-4">
            <a
              href="#promos"
              className="rounded-full bg-gray-900 px-6 md:px-8 py-3 md:py-4 text-base font-bold text-white hover:bg-gray-800 transition shadow-lg"
            >
              Xem ưu đãi ngay
            </a>
            <a
              href="/contact"
              className="rounded-full border-2 border-gray-900 px-6 md:px-8 py-3 md:py-4 text-base font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition"
            >
              Tư vấn gói phù hợp
            </a>
          </div>
        </div>
        <div className="relative h-60 md:h-72 lg:h-[320px] overflow-hidden rounded-2xl">
          <img
            src="https://bcp.cdnchinhphu.vn/334894974524682240/2022/4/28/130706795logistic-la-gi-2-1651149124088794339588.jpg"
            alt="Promo"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const items = [
    {
      q: "Mã khuyến mãi áp dụng thế nào?",
      a: "Nhập mã tại bước xác nhận đơn hoặc gửi cho CSKH khi tạo đơn qua nhân viên. Mỗi mã có điều kiện đi kèm và thời hạn cụ thể.",
    },
    {
      q: "Doanh nghiệp muốn ký hợp đồng thì sao?",
      a: "Liên hệ đội ngũ Sales để nhận báo giá B2B, ưu đãi theo sản lượng/tháng, tích hợp API & đối soát hóa đơn.",
    },
    {
      q: "Có hoàn hủy đơn khi dùng mã không?",
      a: "Được phép nếu chưa bàn giao cho đơn vị vận chuyển. Giá trị giảm sẽ được hoàn về hình thức thanh toán đã dùng.",
    },
  ];
  return (
    <div className="mt-20">
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">
        Câu hỏi thường gặp
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow hover:border-yellow-400"
          >
            <h4 className="text-xl font-bold text-gray-900 mb-4">{it.q}</h4>
            <p className="text-base text-gray-600 leading-relaxed">{it.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <div className="mt-16 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-12 lg:p-16 text-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm md:text-base font-bold">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Nhận mã sớm nhất
          </span>
          <h3 className="text-3xl md:text-4xl font-bold">
            Đăng ký nhận bản tin khuyến mãi
          </h3>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Tin hot, mã độc quyền & ưu đãi bí mật chỉ gửi qua email.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            setOk(true);
            setEmail("");
            setTimeout(() => setOk(false), 2000);
          }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="flex-1 rounded-full border-none bg-gray-700 px-6 py-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-base text-gray-900 hover:bg-yellow-500 transition shadow-lg"
          >
            Đăng ký
          </button>
        </form>
        {ok && (
          <div className="lg:col-span-2 text-center text-green-300 font-bold text-lg">
            Đã đăng ký thành công!
          </div>
        )}
      </div>
    </div>
  );
};

const PromotionPage = () => {
  const [tab, setTab] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_LIMIT = 8;

  const promos = useMemo(() => {
    const now = Date.now();
    return RAW_PROMOS.filter(
      (p) =>
        new Date(p.startAt).getTime() <= now &&
        new Date(p.endAt).getTime() >= now
    );
  }, []);

  const filtered = useMemo(
    () => (tab === "all" ? promos : promos.filter((p) => p.type === tab)),
    [tab, promos]
  );

  const visibleList = showAll ? filtered : filtered.slice(0, VISIBLE_LIMIT);
  const canToggleAll = filtered.length >= VISIBLE_LIMIT;

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-gray-600 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            Ưu đãi tháng này
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            KHUYẾN MÃI TIXIMAX
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-24 h-0.5 bg-gray-300"></div>
            <div className="w-3 h-3 bg-yellow-400 rotate-45"></div>
            <div className="w-24 h-0.5 bg-gray-300"></div>
          </div>
          {/* <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tối ưu mọi tuyến vận chuyển với loạt ưu đãi thiết kế riêng cho cá
            nhân và doanh nghiệp. Điều kiện & thời hạn áp dụng theo từng chương
            trình.
          </p> */}
        </div>

        {/* Banner */}
        <PromoBanner />

        {/* Main content như ReasonPage: padding ngang lớn */}
        <main className="container mx-auto px-12 lg:px-24">
          {/* Tabs */}
          <div className="mt-16 flex flex-wrap gap-4">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setShowAll(false); // reset khi đổi tab
                  }}
                  className={`rounded-full px-6 py-3 text-base font-bold transition ${
                    active
                      ? "bg-yellow-400 text-gray-900 shadow-lg"
                      : "bg-white border-2 border-gray-200 text-gray-900 hover:border-yellow-400"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md border-2 border-gray-200">
            <div className="flex items-center gap-6">
              <span className="font-bold text-gray-900 text-xl">
                {filtered.length} ưu đãi khả dụng
              </span>
              <span className="text-gray-600 text-base">
                Áp dụng điều kiện & thời hạn mỗi chương trình.
              </span>
            </div>
          </div>

          {/* Promos Grid — 4 cột ở xl */}
          <div
            id="promos"
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {visibleList.map((p) => (
              <PromoCard key={p.id} p={p} />
            ))}
            {visibleList.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-500 text-lg">
                Hiện chưa có ưu đãi ở mục này. Vui lòng chọn tab khác.
              </div>
            )}
          </div>

          {/* Nút Xem tất cả / Thu gọn (khi có >= 8 ưu đãi) */}
          {canToggleAll && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="rounded-full px-8 py-3 text-base font-bold transition bg-white border-2 border-gray-200 text-gray-900 hover:border-yellow-400 shadow-sm"
              >
                {showAll ? "Thu gọn" : "Xem tất cả"}
              </button>
            </div>
          )}

          {/* FAQ & Newsletter */}
          <FAQ />
          <Newsletter />

          {/* Bottom CTA */}
          {/* <div className="mt-20 rounded-2xl bg-white p-12 text-center shadow-2xl border-2 border-gray-200">
            <h4 className="text-3xl md:text-5xl font-bold text-gray-900">
              Sẵn sàng bùng nổ đơn hàng?
            </h4>
            <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed">
              Kết nối kho bãi, tối ưu tuyến quốc tế & nội địa — bắt đầu ngay hôm
              nay.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="/signup"
                className="rounded-full bg-gray-900 px-8 py-4 text-base font-bold text-white hover:bg-gray-800 transition shadow-lg"
              >
                Tạo tài khoản miễn phí
              </a>
              <a
                href="/pricing"
                className="rounded-full border-2 border-gray-900 px-8 py-4 text-base font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                Bảng giá & gói dịch vụ
              </a>
            </div>
          </div> */}
        </main>
      </div>
    </section>
  );
};

export default PromotionPage;
