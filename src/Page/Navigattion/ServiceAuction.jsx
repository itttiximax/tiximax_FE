import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Gavel,
  ShieldCheck,
  CreditCard,
  FileText,
  PlaneTakeoff,
  PackageSearch,
  DollarSign,
  Calculator,
  CheckCircle2,
  Clock,
  MessageSquare,
  CircleHelp,
  ClipboardCheck,
  TrendingUp,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * ServiceAuction.jsx — Tiximax
 * Trang dịch vụ Đấu giá Nhật (Yahoo! Auctions / Mercari / Rakuma ...)
 * - Hero + USP
 * - Bảng phí minh bạch + Calculator ước tính nhanh
 * - Quy trình 6 bước (S-Curve bid rule ready)
 * - Điều kiện & chính sách (KYC / thanh toán JPY / hạn mục cấm)
 * - FAQ
 * - CTA liên hệ/đăng nhập
 * Tailwind + Framer Motion — single file, production-ready.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const usps = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Minh bạch & bảo vệ người mua",
    desc: "Đối soát ảnh chụp – mô tả – phụ phí rõ ràng, lưu vết giao dịch đầy đủ.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Chiến lược đặt giá S‑Curve",
    desc: "Đặt mức an toàn sớm + nhảy bước ở 10’/3’/30s cuối, hạn chế bị outbid sớm.",
  },
  {
    icon: <PlaneTakeoff className="w-6 h-6" />,
    title: "Tối ưu tuyến bay",
    desc: "Gom lô tại Chiba, chọn linehaul phù hợp deadline & chi phí.",
  },
  {
    icon: <PackageSearch className="w-6 h-6" />,
    title: "Kiểm hàng – đóng gói chuẩn",
    desc: "Cân đo, chụp ảnh, xác minh mã/JAN, đóng kiện theo yêu cầu.",
  },
];

const feeTiers = [
  {
    name: "Cơ bản",
    badge: "Phổ biến",
    items: [
      "Phí dịch vụ 5% (min 150k)",
      "Thanh toán JPY hộ",
      "Kiểm ảnh cơ bản",
      "Gom lô định kỳ",
    ],
    monthly: false,
  },
  {
    name: "Chuyên sâu",
    badge: "Khuyên dùng",
    items: [
      "Phí dịch vụ 4% (min 250k)",
      "Chiến lược S‑Curve + theo dõi sát",
      "Ưu tiên đóng gói & linehaul",
      "CSKH 1‑1 giờ hành chính",
    ],
    monthly: false,
  },
  {
    name: "Doanh nghiệp",
    badge: "SLA riêng",
    items: [
      "Phí dịch vụ 3% (min 500k)",
      "Hạn mức tín dụng nội bộ",
      "Khoang bay ưu tiên theo thoả thuận",
      "KPI đóng gói/khai HQ tùy chỉnh",
    ],
    monthly: false,
  },
];

const faqs = [
  {
    q: "Tôi cần đặt cọc bao nhiêu?",
    a: "Thông thường 20% giá trần (MaxBid) đã chốt. Nếu thua phiên sẽ hoàn cọc trong 24h (trừ phí nền tảng nếu có).",
  },
  {
    q: "Phí nền tảng và vận chuyển nội địa Nhật tính thế nào?",
    a: "Phí bán hàng/nền tảng theo điều khoản từng sàn. Ship nội địa Nhật tính theo bảng cước của hãng chuyển phát trong nước, sẽ xuất hóa đơn chi tiết.",
  },
  {
    q: "Thanh toán bằng VND hay JPY?",
    a: "Tiximax có tài khoản JPY tại Nhật. Bạn có thể chuyển JPY trực tiếp, hoặc quy đổi theo tỷ giá niêm yết ngày thanh toán nếu chọn VND.",
  },
  {
    q: "Mặt hàng nào bị hạn chế?",
    a: "Hàng cấm/nhạy cảm theo quy định hải quan VN & JP (pin rời dung lượng lớn, chất dễ cháy, thực phẩm tươi sống, vũ khí, v.v.). Liên hệ để được tư vấn chi tiết.",
  },
];

// Bộ ước tính chi phí
const useAuctionEstimate = ({
  priceJPY,
  domesticJPY,
  servicePct,
  intlShipVND,
  fxRate,
  platformJPY,
}) => {
  return useMemo(() => {
    const p = Number(priceJPY) || 0;
    const dom = Number(domesticJPY) || 0;
    const plat = Number(platformJPY) || 0;
    const rate = Number(fxRate) || 170; // fallback tỉ giá demo
    const svcPct = Number(servicePct) / 100 || 0.05; // 5% mặc định
    const intl = Number(intlShipVND) || 0;

    const subtotalJPY = p + dom + plat;
    const serviceFeeVND = Math.max(150000, subtotalJPY * rate * svcPct);
    const goodsVND = subtotalJPY * rate;
    const estimated = goodsVND + serviceFeeVND + intl;

    return {
      subtotalJPY,
      goodsVND,
      serviceFeeVND,
      estimated,
    };
  }, [priceJPY, domesticJPY, platformJPY, servicePct, intlShipVND, fxRate]);
};

const Row = ({ label, value, hint }) => (
  <div className="flex items-start justify-between py-2">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-right">
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      {hint && <div className="text-xs text-gray-500">{hint}</div>}
    </div>
  </div>
);

const SectionTitle = ({ icon: Icon, title, desc }) => (
  <div className="mb-8">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
      {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      <span> {title} </span>
    </div>
    {desc ? <p className="mt-3 text-gray-600">{desc}</p> : null}
  </div>
);

const ServiceAuction = () => {
  const [inputs, setInputs] = useState({
    priceJPY: "25000",
    domesticJPY: "1200",
    platformJPY: "0",
    servicePct: "5",
    intlShipVND: "350000",
    fxRate: "175",
  });

  const est = useAuctionEstimate({
    priceJPY: inputs.priceJPY,
    domesticJPY: inputs.domesticJPY,
    servicePct: inputs.servicePct,
    intlShipVND: inputs.intlShipVND,
    fxRate: inputs.fxRate,
    platformJPY: inputs.platformJPY,
  });

  const handle = (k) => (e) =>
    setInputs((s) => ({ ...s, [k]: e.target.value.replace(/[^0-9.]/g, "") }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-yellow-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-24 lg:pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              <Gavel className="w-3.5 h-3.5" /> Auction Service
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
              Đấu giá Nhật cùng Tiximax — an tâm đặt giá, minh bạch chi phí,
              giao về Việt Nam đúng hẹn.
            </h1>
            <p className="mt-5 text-gray-600 text-lg leading-8">
              Hỗ trợ trọn gói Yahoo! Auctions / Mercari / Rakuma…: đặt giá hộ,
              thanh toán JPY, gom hàng tại kho Chiba, đóng gói và vận chuyển về
              VN.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {usps.map((u) => (
                <div
                  key={u.title}
                  className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
                >
                  <div className="text-amber-700">{u.icon}</div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {u.title}
                  </p>
                  <p className="text-xs text-gray-600">{u.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow"
              >
                Đăng nhập để đấu giá
              </Link>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Liên hệ tư vấn nhanh
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CALCULATOR + PRICING */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Calculator */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={Calculator}
                title="Ước tính chi phí nhanh"
                desc="Nhập các thông số cơ bản để tham khảo tổng chi phí. Con số chỉ mang tính ước lượng; báo giá cuối cùng dựa trên thực tế phiên và chứng từ."
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Giá thắng phiên (JPY)
                  </label>
                  <input
                    value={inputs.priceJPY}
                    onChange={handle("priceJPY")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Ship nội địa Nhật (JPY)
                  </label>
                  <input
                    value={inputs.domesticJPY}
                    onChange={handle("domesticJPY")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Phí nền tảng/khác (JPY)
                  </label>
                  <input
                    value={inputs.platformJPY}
                    onChange={handle("platformJPY")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Phí dịch vụ (%)
                  </label>
                  <input
                    value={inputs.servicePct}
                    onChange={handle("servicePct")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Cước quốc tế về VN (VND)
                  </label>
                  <input
                    value={inputs.intlShipVND}
                    onChange={handle("intlShipVND")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Tỷ giá (VND/JPY)
                  </label>
                  <input
                    value={inputs.fxRate}
                    onChange={handle("fxRate")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-amber-50 p-4">
                <Row
                  label="Tạm tính (JPY)"
                  value={`${est.subtotalJPY.toLocaleString()} JPY`}
                />
                <Row
                  label="Giá trị hàng (VND)"
                  value={`${est.goodsVND.toLocaleString()} VND`}
                  hint="Quy đổi theo tỷ giá nhập ở trên"
                />
                <Row
                  label="Phí dịch vụ (VND)"
                  value={`${est.serviceFeeVND.toLocaleString()} VND`}
                  hint=">= 150,000 VND"
                />
                <Row
                  label="Cước quốc tế (VND)"
                  value={`${Number(
                    inputs.intlShipVND || 0
                  ).toLocaleString()} VND`}
                />
                <div className="mt-2 pt-3 border-t border-amber-200 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">
                    ƯỚC TÍNH TỔNG
                  </div>
                  <div className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
                    {est.estimated.toLocaleString()} VND
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                *Số liệu demo. Báo giá chính thức sẽ thể hiện trong hợp
                đồng/biên nhận của Tiximax.
              </p>
            </div>

            {/* Pricing */}
            <div className="lg:col-span-2 grid gap-4">
              <SectionTitle icon={DollarSign} title="Bảng phí dịch vụ" />
              {feeTiers.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {t.name}
                    </h3>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                      {t.badge}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {t.items.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600" />{" "}
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-xs text-gray-500">
                *Phí có thể thay đổi theo mùa cao điểm/loại hàng. Liên hệ để
                nhận bảng phí cập nhật.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionTitle
            icon={ClipboardCheck}
            title="Quy trình 6 bước"
            desc="Chuẩn hoá từng bước để đảm bảo tỉ lệ thắng và thời gian về hàng."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "B1 – Chốt yêu cầu & MaxBid",
                desc: "Chọn link sản phẩm, xác minh tình trạng, chốt giá trần và điều kiện trả giá.",
              },
              {
                icon: Gavel,
                title: "B2 – Đặt cọc & tạo phiên",
                desc: "Nhận cọc (thường 20%), khởi tạo phiên theo lịch, kích hoạt rule S‑Curve.",
              },
              {
                icon: Clock,
                title: "B3 – Theo dõi phiên",
                desc: "Theo dõi 24/7, nhảy bước ở 10’/3’/30s cuối; log giá/đối thủ theo mốc thời gian.",
              },
              {
                icon: CreditCard,
                title: "B4 – Thanh toán & nhận hàng nội địa",
                desc: "Nếu Win: thanh toán JPY hộ; nhận hàng về kho Chiba (đối soát ảnh/cân).",
              },
              {
                icon: PlaneTakeoff,
                title: "B5 – Gom lô & bay về VN",
                desc: "Đóng gói, dán nhãn; gán chuyến bay phù hợp (ưu tiên tuyến thẳng/kết nối nhanh).",
              },
              {
                icon: Globe2,
                title: "B6 – Thông quan & giao nhận",
                desc: "Khép chứng từ, thông quan; giao nội địa VN theo yêu cầu khách.",
              },
            ].map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <s.icon className="w-6 h-6 text-amber-700" />
                <p className="mt-3 font-semibold text-gray-900">{s.title}</p>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POLICY */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionTitle icon={ShieldCheck} title="Điều kiện & chính sách" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-gray-900">KYC & Thanh toán</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• Xác minh danh tính & thông tin liên hệ.</li>
                <li>• Đặt cọc 20% MaxBid; hoàn cọc 24h nếu thua phiên.</li>
                <li>• Thanh toán JPY qua tài khoản Nhật hoặc VND quy đổi.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-gray-900">Hạn mục & tuân thủ</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>
                  • Tuân thủ quy định hải quan JP/VN, hàng cấm sẽ bị từ chối.
                </li>
                <li>• Hàng có pin/hoá chất cần tư vấn trước khi tạo phiên.</li>
                <li>
                  • Hoá đơn/packing list minh bạch, lưu trữ chứng từ đầy đủ.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionTitle icon={CircleHelp} title="Câu hỏi thường gặp" />
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm group open:shadow-md"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-gray-900">{f.q}</span>
                  <span className="text-amber-700 group-open:rotate-180 transition">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-500 p-1">
              <div className="rounded-3xl p-6 bg-white/90 backdrop-blur">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Sẵn sàng tham gia phiên đấu giá?
                  </h3>
                </div>
                <p className="mt-2 text-gray-700">
                  Đăng nhập để tạo yêu cầu, nạp cọc và chốt MaxBid cho phiên
                  tiếp theo.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/signin"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow"
                  >
                    Đăng nhập ngay
                  </Link>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                  >
                    Hỏi nhanh trên Zalo/Hotline
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold text-gray-900">
                Thông tin liên hệ
              </h3>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li>• Hotline: 0707 267 001</li>
                <li>• Email: support@tiximax.vn</li>
                <li>• Địa chỉ: Tiximax — Đà Nẵng, Việt Nam</li>
                <li>• Giờ làm việc: 09:00 – 18:00 (T2–T7)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceAuction;
