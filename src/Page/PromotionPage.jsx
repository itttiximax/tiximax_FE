import React, { useEffect, useMemo, useState } from "react";
import {
  Bolt,
  Truck,
  Percent,
  Gift,
  Clock,
  Copy,
  Check,
  Info,
  Mail,
} from "lucide-react";

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
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAilBMVEXaJR3//wDZEh7qmRXYAB7ZHR3ZGh3//QDbJhz99AP87gXZEB7++QHbKhzoiBXmfRb0yA3ldhfzww7iYxnwtRDurBH54QjhXhnjbhjdPBvxuQ/eRhvcNRzpkxT42grpjhX20gzjaRjgVRrspBTfTRr76QflehfuqhH43Qn21Av1zAzwtw/rnRPhYBkDKDW4AAAED0lEQVR4nO3d6VbqMBQFYBJOwlAUEZmEgkwq6H3/17tAKXRIoAyu0pP9/RVd7bE7bdMTWioBAAAAAAAAAAAAAAAAAAAAAAAAwNFT3hvweOiV8t6ER6MGYqDy3ogHI8uiLPPeiAdDXfGN8MSokRBihPBESX9TEx/hiaLxpiZjhCeqKraqeW/GI5GTXU0mCM8RrXY1WSE8R0F0EJ4I+byvyTPCE6KPfU0+EJ6QEiFcte3J5qEmTYQnQOtDTdYIT4DEEWqyo5uRmjR13pvzEOglUpMXHChbUkRhkN3QrVhNWgjPdnI6VhNMVW94lVhNKl7eG5Q/3RdxfYQnER2EZ4MqiZpUnK+JnoqkqevhofdUTd5dP1CokapJzfGaqHaqJEK03Z5F8d4MNXlz+xKFaoaauB0eNTOURIiZy+ExRsfx8Bij43Z4LNHhGR4lM6GOpSYdyvYHClQ61ZqXs/DrlprU/Uy/P28VqCj6x7Kz9/VTqDsjmiZvd++vMi3YUCxLqz8uyapavOls8v+0JD4VaCw5oIVtCL1dfVGw3ISUYXLkPl69Ih4kAfr8k5J8FvQgCchR9+4V6Y4KfjukaH7nknwVcnCNo156evF6jV6hcxPSen1+XzNa60Jdup5Az+f3NpMJi4Mk4A2Xd6jIcljwwTVOkXlG7RI/DAbXOOrfdldY6TPKTUhWxzeUZPxUvDu+DBSVry7JL7vchGhmnpM+pzZjmJuQ9pLdJlm8SC4XJWbUPF+DhCbjgyTgDS67K+wOWF2UmCnrEwyTDtvBNY7aWYfaWtGmoa+X6uuzcajfT2eODu8TToTOPiP56UpRYgsxTnNmmYaXuSRCOHAi3kosxDjNkWUamc86W46ceVLd5Ke40WmeWohxmhPLNC58YOpEp7mhm/yUhgM1MSzEOM2BZRoX9xo4EJ4Lo+NCeFTPejzYftDjPoNi6SYXtQUtLLMq7DvNLd3kr54uKcsENvdOc0t09tPQlgls5uHxTHOxx8Yjz9jW1OEdHjK0QkYbjxR9pT9QZx0ew0KMRju+x/QvfbLmuEzjwEsdBR8qeZmqVaqt6YtzeFLR8U2xoIlD4VHDxL5aGo+8YaJ2Q77h8eJ9oe/WZ3zJDuw53/BQrKutdSoRFJu0XbINTyw632caj2T124XweL+RNJx9Nq4o8vFfruGhw0VqtsajSFtTl2l41CDcw6yNR1oenhgyfSGADFv8nrP/0w8d2ExfCLCPzvKixiNvsGQcnt3X+gvxdmHjUdjWxPKFALuv9b+mGzpYl8vyhQC0ud4Yq2v2TOqVYPk2jW10ytc27G3X5TIMjyw3blj/SosGwzOP9vUt/2i1+f27bcvDuHWXGJYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAmf/IgiyXNAAkFQAAAABJRU5ErkJggg==",
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
];

const TABS = [
  { key: "all", label: "Tất cả", icon: <Gift className="w-4 h-4" /> },
  { key: "flash", label: "Flash Sale", icon: <Bolt className="w-4 h-4" /> },
  { key: "deal", label: "Nội địa", icon: <Truck className="w-4 h-4" /> },
  { key: "finance", label: "Tài chính", icon: <Percent className="w-4 h-4" /> },
  {
    key: "business",
    label: "Doanh nghiệp",
    icon: <Info className="w-4 h-4" />,
  },
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
  <div className="absolute -top-2 -left-2 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900 shadow-md">
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
      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      title="Sao chép mã"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {copied ? "Đã copy" : code}
    </button>
  );
};

const PromoCard = ({ p }) => {
  const { d, h, m, s } = useCountdown(p.endAt);
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Ribbon text={p.badge} />

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={p.img}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4 space-y-1">
          <span className="rounded-full bg-yellow-400/20 px-2 py-1 text-xs font-medium text-yellow-300 backdrop-blur-sm">
            {p.tag}
          </span>
          <h3 className="text-xl font-bold text-white">{p.title}</h3>
          <p className="text-sm text-gray-200">{p.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Countdown */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600 font-medium">
            <Clock className="w-4 h-4" />
            Kết thúc sau
          </span>
          <div className="flex gap-1">
            {["d", "h", "m", "s"].map((label, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-md bg-gray-100 px-2 py-1 min-w-[40px]"
              >
                <span className="font-bold text-gray-900">
                  {String([d, h, m, s][i]).padStart(2, "0")}
                </span>
                <span className="text-xs text-gray-500 uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <ul className="space-y-2 text-sm text-gray-600">
          {p.conditions.map((c, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {c}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <CopyCode code={p.code} />
          <a
            href={p.cta.href}
            className="flex-1 rounded-full bg-yellow-400 px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-yellow-500 transition-colors"
          >
            {p.cta.label}
          </a>
        </div>
      </div>
    </div>
  );
};

const PromoBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-100 shadow-xl border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            <Bolt className="w-4 h-4" /> Tuần lễ khuyến mãi Tiximax
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Ưu đãi đỉnh cao cho mọi tuyến vận chuyển
          </h1>
          <p className="text-lg text-gray-600">
            Giảm sâu cước quốc tế, nội địa siêu rẻ, ưu đãi tài chính & combo cho
            doanh nghiệp. Săn mã nhanh tay – số lượng có hạn!
          </p>
          <div className="flex gap-4">
            <a
              href="#promos"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Xem ưu đãi ngay
            </a>
            <a
              href="/contact"
              className="rounded-full border border-gray-900 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition"
            >
              Tư vấn gói phù hợp
            </a>
          </div>
        </div>
        <div className="relative h-64 md:h-auto overflow-hidden rounded-xl">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMF6jH2SvCY5qkMkuCas9JPanDs6vcBA83UpAfY4Yzgi_YVkM9m4LBNr20-QPuHIgf1g&usqp=CAU"
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
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Câu hỏi thường gặp
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{it.q}</h4>
            <p className="text-sm text-gray-600">{it.a}</p>
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
    <div className="mt-12 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 lg:p-12 text-white shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            <Mail className="w-4 h-4" /> Nhận mã sớm nhất
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold">
            Đăng ký nhận bản tin khuyến mãi
          </h3>
          <p className="text-gray-300">
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
          className="flex flex-col md:flex-row gap-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="flex-1 rounded-full border-none bg-gray-700 px-6 py-3 text-white placeholder-gray-400 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="rounded-full bg-yellow-500 px-6 py-3 font-medium text-gray-900 hover:bg-yellow-400 transition"
          >
            Đăng ký
          </button>
        </form>
        {ok && (
          <div className="md:col-span-2 text-center text-green-300 font-medium">
            Đã đăng ký thành công!
          </div>
        )}
      </div>
    </div>
  );
};

const PromotionPage = () => {
  const [tab, setTab] = useState("all");

  const promos = useMemo(() => {
    const now = Date.now();
    return RAW_PROMOS.filter(
      (p) =>
        new Date(p.startAt).getTime() <= now &&
        new Date(p.endAt).getTime() >= now
    );
  }, []);

  const filtered =
    tab === "all" ? promos : promos.filter((p) => p.type === tab);

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Banner */}
        <PromoBanner />

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap gap-3">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-yellow-400 text-black"
                    : "bg-white border border-gray-200 text-gray-900 hover:border-yellow-500"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-xl bg-white p-4 text-sm shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">
              {filtered.length} ưu đãi khả dụng
            </span>
            <span className="text-gray-600">
              Áp dụng điều kiện & thời hạn mỗi chương trình.
            </span>
          </div>
        </div>

        {/* Promos Grid */}
        <div
          id="promos"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((p) => (
            <PromoCard key={p.id} p={p} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Hiện chưa có ưu đãi ở mục này. Vui lòng chọn tab khác.
            </div>
          )}
        </div>

        {/* FAQ & Newsletter */}
        <FAQ />
        <Newsletter />

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl bg-white p-8 text-center shadow-xl border border-gray-200">
          <h4 className="text-2xl font-bold text-gray-900">
            Sẵn sàng bùng nổ đơn hàng?
          </h4>
          <p className="mt-2 text-gray-600">
            Kết nối kho bãi, tối ưu tuyến quốc tế & nội địa — bắt đầu ngay hôm
            nay.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/signup"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Tạo tài khoản miễn phí
            </a>
            <a
              href="/pricing"
              className="rounded-full border border-gray-900 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition"
            >
              Bảng giá & gói dịch vụ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionPage;
