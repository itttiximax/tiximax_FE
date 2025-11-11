import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Warehouse,
  PackageSearch,
  ShieldCheck,
  Boxes,
  ScanBarcode,
  Camera,
  CalendarClock,
  Ruler,
  Truck,
  PlaneTakeoff,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Plug,
  ThermometerSun,
  Lock,
  MapPin,
  DollarSign,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * ServicesStorage.jsx — Tiximax (with imagery)
 * Trang dịch vụ Ký gửi kho / Lưu kho thông minh
 * + Thêm ảnh minh hoạ ở Hero, Strengths, Footprint.
 * Tone: vàng – trắng – đen, ảnh có overlay để chữ nổi.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const usps = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "An toàn & minh bạch",
    desc: "Kho chuẩn, camera 24/7, đối soát ảnh/cân/nhãn; chứng từ số hoá đầy đủ.",
  },
  {
    icon: <PackageSearch className="w-6 h-6" />,
    title: "Theo dõi realtime",
    desc: "Số kiện, trọng lượng, thể tích, trạng thái xử lý hiển thị trên dashboard.",
  },
  {
    icon: <Boxes className="w-6 h-6" />,
    title: "Gom hàng tối ưu",
    desc: "Chia/tách/gom lô theo tuyến bay — giảm chi phí linehaul.",
  },
  {
    icon: <ThermometerSun className="w-6 h-6" />,
    title: "Điều kiện bảo quản",
    desc: "Khu vực khô ráo, kiểm soát nhiệt độ/độ ẩm phù hợp danh mục hàng.",
  },
];

const strengths = [
  {
    icon: <ScanBarcode className="w-6 h-6" />,
    title: "Mã hoá & nhãn kiện",
    desc: "Dán label barcode/QR, quy đổi SKU linh hoạt theo yêu cầu.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Chụp ảnh kiểm đếm",
    desc: "Ảnh inbound/outbound, đối chiếu số lượng & tình trạng.",
    img: "https://i.pinimg.com/736x/6e/cb/f0/6ecbf0af77efa465e8ef264781a4099f.jpg",
  },
  {
    icon: <Ruler className="w-6 h-6" />,
    title: "Đo kích thước – cân nặng",
    desc: "Cập nhật D/W/H, weight và m³ để tính phí chính xác.",
    img: "https://i.pinimg.com/564x/29/5f/9e/295f9ea4a6e97d360e314e27d60fc776.jpg",
  },
  {
    icon: <CalendarClock className="w-6 h-6" />,
    title: "Lịch xử lý linh hoạt",
    desc: "Xử lý giờ hành chính, ưu tiên gấp theo SLA riêng.",
    img: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Plug className="w-6 h-6" />,
    title: "Tích hợp hệ thống",
    desc: "Xuất dữ liệu API/CSV, đồng bộ về ERP/WMS của khách.",
    img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Khu vực an ninh",
    desc: "Niêm phong khu vực hàng giá trị cao, kiểm soát ra/vào.",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1600&auto=format&fit=crop",
  },
];

const footprints = [
  {
    country: "Nhật Bản",
    city: "Chiba",
    note: "Kho gom quốc tế – ưu tiên tuyến bay về VN",
    img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1600&auto=format&fit=crop",
  },
  {
    country: "Việt Nam",
    city: "Hà Nội / Đà Nẵng / TP.HCM",
    note: "Fulfillment nội địa & giao nhận",
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop",
  },
];

const feeTiers = [
  {
    name: "Gói Cơ bản",
    badge: "Phổ biến",
    items: [
      "Lưu kho: từ 55,000 VND/m³/ngày",
      "Xử lý inbound: từ 8,000 VND/kiện",
      "Xử lý outbound: từ 10,000 VND/kiện",
      "Nhãn barcode cơ bản",
    ],
  },
  {
    name: "Gói Tối ưu",
    badge: "Khuyên dùng",
    items: [
      "Lưu kho: từ 50,000 VND/m³/ngày",
      "Inbound + kiểm ảnh 2 mặt",
      "Pallet hoá – quấn màng",
      "Ưu tiên xử lý trong ngày",
    ],
  },
  {
    name: "Gói Doanh nghiệp",
    badge: "SLA riêng",
    items: [
      "Lưu kho theo hợp đồng",
      "Linehaul & khai HQ theo KPI",
      "Khu vực riêng – camera độc lập",
      "Tích hợp API tùy biến",
    ],
  },
];

// Hook ước tính chi phí lưu kho
const useStorageEstimate = ({
  lengthCm,
  widthCm,
  heightCm,
  weightKg,
  days,
  ratePerM3PerDay,
  inboundFeePerParcel,
  outboundFeePerParcel,
  palletFee,
  needPallet,
  parcels,
  labelFee,
  needLabel,
}) => {
  return useMemo(() => {
    const L = Number(lengthCm) || 0;
    const W = Number(widthCm) || 0;
    const H = Number(heightCm) || 0;
    const weight = Number(weightKg) || 0;
    const d = Math.max(1, Number(days) || 1);
    const m3 = (L * W * H) / 1_000_000; // cm->m³
    const parcelsCount = Math.max(1, Number(parcels) || 1);
    const rate = Number(ratePerM3PerDay) || 50000;
    const inbound = (Number(inboundFeePerParcel) || 8000) * parcelsCount;
    const outbound = (Number(outboundFeePerParcel) || 10000) * parcelsCount;
    const pallet = needPallet ? Number(palletFee) || 80000 : 0;
    const label = needLabel ? (Number(labelFee) || 2000) * parcelsCount : 0;
    const storage = m3 * rate * d;
    const total = Math.ceil(storage + inbound + outbound + pallet + label);
    return { m3, weight, storage, inbound, outbound, pallet, label, total };
  }, [
    lengthCm,
    widthCm,
    heightCm,
    weightKg,
    days,
    ratePerM3PerDay,
    inboundFeePerParcel,
    outboundFeePerParcel,
    palletFee,
    needPallet,
    parcels,
    labelFee,
    needLabel,
  ]);
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
      <span>{title}</span>
    </div>
    {desc ? <p className="mt-3 text-gray-600">{desc}</p> : null}
  </div>
);

const ServicesStorage = () => {
  const [inputs, setInputs] = useState({
    lengthCm: "60",
    widthCm: "40",
    heightCm: "35",
    weightKg: "12",
    days: "7",
    parcels: "5",
    ratePerM3PerDay: "50000",
    inboundFeePerParcel: "8000",
    outboundFeePerParcel: "10000",
    palletFee: "80000",
    needPallet: false,
    labelFee: "2000",
    needLabel: true,
  });
  const est = useStorageEstimate(inputs);
  const handle = (k) => (e) => {
    const v =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value.replace(/[^0-9.]/g, "");
    setInputs((s) => ({ ...s, [k]: v }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* HERO with background image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
            alt="Warehouse hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/70" />
        </div>
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-yellow-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-24 lg:pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              <Warehouse className="w-3.5 h-3.5" /> Storage Service
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
              Ký gửi kho Tiximax — lưu kho minh bạch, an toàn, tối ưu gom lô cho
              tuyến bay quốc tế.
            </h1>
            <p className="mt-5 text-gray-700 text-lg leading-8">
              Từ inbound, kiểm đếm, dán nhãn đến lưu kho và outbound: tất cả
              được chuẩn hoá và hiển thị realtime trên hệ thống.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {usps.map((u) => (
                <div
                  key={u.title}
                  className="rounded-xl border border-amber-100 bg-white/95 backdrop-blur p-4 shadow-sm"
                >
                  <div className="text-amber-700">{u.icon}</div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {u.title}
                  </p>
                  <p className="text-xs text-gray-700">{u.desc}</p>
                </div>
              ))}
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
                title="Ước tính phí lưu kho"
                desc="Nhập kích thước/thời gian và tuỳ chọn xử lý để tham khảo chi phí."
              />
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Dài (cm)</label>
                  <input
                    value={inputs.lengthCm}
                    onChange={handle("lengthCm")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Rộng (cm)</label>
                  <input
                    value={inputs.widthCm}
                    onChange={handle("widthCm")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Cao (cm)</label>
                  <input
                    value={inputs.heightCm}
                    onChange={handle("heightCm")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Cân nặng (kg)</label>
                  <input
                    value={inputs.weightKg}
                    onChange={handle("weightKg")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Số ngày lưu kho
                  </label>
                  <input
                    value={inputs.days}
                    onChange={handle("days")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Số kiện (parcels)
                  </label>
                  <input
                    value={inputs.parcels}
                    onChange={handle("parcels")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Đơn giá lưu kho (VND/m³/ngày)
                  </label>
                  <input
                    value={inputs.ratePerM3PerDay}
                    onChange={handle("ratePerM3PerDay")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Inbound/kiện (VND)
                  </label>
                  <input
                    value={inputs.inboundFeePerParcel}
                    onChange={handle("inboundFeePerParcel")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Outbound/kiện (VND)
                  </label>
                  <input
                    value={inputs.outboundFeePerParcel}
                    onChange={handle("outboundFeePerParcel")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Pallet hoá (VND/pallet)
                  </label>
                  <input
                    value={inputs.palletFee}
                    onChange={handle("palletFee")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={inputs.needPallet}
                      onChange={handle("needPallet")}
                    />{" "}
                    Cần pallet
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Label (VND/kiện)
                  </label>
                  <input
                    value={inputs.labelFee}
                    onChange={handle("labelFee")}
                    className="mt-1 w-full rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={inputs.needLabel}
                      onChange={handle("needLabel")}
                    />{" "}
                    Cần dán nhãn
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-amber-50 p-4">
                <Row
                  label="Thể tích (m³)"
                  value={est.m3.toFixed(3)}
                  hint="Tính từ D x R x C (cm)"
                />
                <Row
                  label="Phí lưu kho"
                  value={`${Math.ceil(est.storage).toLocaleString()} VND`}
                  hint={`${inputs.ratePerM3PerDay} VND/m³/ngày × ${inputs.days} ngày`}
                />
                <Row
                  label="Xử lý inbound"
                  value={`${est.inbound.toLocaleString()} VND`}
                  hint={`${inputs.inboundFeePerParcel} × ${inputs.parcels} kiện`}
                />
                <Row
                  label="Xử lý outbound"
                  value={`${est.outbound.toLocaleString()} VND`}
                  hint={`${inputs.outboundFeePerParcel} × ${inputs.parcels} kiện`}
                />
                {inputs.needPallet && (
                  <Row
                    label="Pallet hoá"
                    value={`${est.pallet.toLocaleString()} VND`}
                  />
                )}
                {inputs.needLabel && (
                  <Row
                    label="Dán nhãn"
                    value={`${est.label.toLocaleString()} VND`}
                  />
                )}
                <div className="mt-2 pt-3 border-t border-amber-200 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">
                    ƯỚC TÍNH TỔNG
                  </div>
                  <div className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
                    {est.total.toLocaleString()} VND
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  *Số liệu demo. Báo giá chính thức thể hiện trong hợp đồng/biên
                  nhận của Tiximax.
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="lg:col-span-2 grid gap-4">
              <SectionTitle icon={DollarSign} title="Bảng phí mẫu" />
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
                *Phí thay đổi theo mùa cao điểm, loại hàng và SLA. Liên hệ để
                nhận bảng phí cập nhật.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STRENGTHS with image tiles */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionTitle
            icon={ClipboardCheck}
            title="Điểm mạnh vận hành kho"
            desc="Chuẩn hoá quy trình để tối ưu chi phí và thời gian."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengths.map((s) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="relative h-36">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    <span className="p-1.5 rounded-lg bg-white/20 text-white">
                      {s.icon}
                    </span>
                    {s.title}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTPRINT with image cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Mạng lưới kho
            </h2>
            <p className="mt-2 text-gray-600">
              Vị trí chiến lược giúp gom lô nhanh và tối ưu tuyến bay.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {footprints.map((f) => (
              <motion.div
                key={f.country + f.city}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="relative h-40">
                  <img
                    src={f.img}
                    alt={`${f.city} — ${f.country}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold">
                      <MapPin className="w-4 h-4" /> {f.country}
                    </div>
                    <div className="text-sm">{f.city}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-amber-700 font-medium">{f.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POLICY */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionTitle icon={Info} title="Quy định & lưu ý" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-gray-900">Hàng hoá & đóng gói</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• Từ chối hàng cấm/nguy hiểm theo quy định HQ VN/JP.</li>
                <li>
                  • Hàng có pin/hoá chất cần thông tin MSDS & tư vấn trước.
                </li>
                <li>
                  • Quy chuẩn thùng/bao bì; khuyến nghị pallet hoá khi cần.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-gray-900">SLA xử lý</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• Inbound trong 24h giờ hành chính (trừ mùa cao điểm).</li>
                <li>
                  • Outbound theo lịch bay đã chốt hoặc yêu cầu gấp (có phí).
                </li>
                <li>
                  • Báo cáo ảnh/cân/dimension lưu trên hệ thống theo mã kiện.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold text-gray-900">
                Câu hỏi thường gặp
              </h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <details className="rounded-xl border border-gray-100 p-4">
                  <summary className="font-semibold cursor-pointer">
                    Phí lưu kho tính theo trọng lượng hay thể tích?
                  </summary>
                  <p className="mt-2">
                    Tiximax áp dụng theo m³/ngày (quy đổi từ kích thước). Một số
                    danh mục đặc thù có thể tính theo trọng lượng hoặc đơn
                    giá/thùng.
                  </p>
                </details>
                <details className="rounded-xl border border-gray-100 p-4">
                  <summary className="font-semibold cursor-pointer">
                    Tôi có thể xem ảnh/nhật ký xử lý của kiện không?
                  </summary>
                  <p className="mt-2">
                    Có. Ảnh inbound/outbound, cân nặng, dimension và thời gian
                    xử lý đều lưu trên hệ thống; có thể xuất CSV.
                  </p>
                </details>
                <details className="rounded-xl border border-gray-100 p-4">
                  <summary className="font-semibold cursor-pointer">
                    Có hỗ trợ gom lô bay thẳng về Việt Nam?
                  </summary>
                  <p className="mt-2">
                    Có. Kho Chiba tối ưu gom lô cho các tuyến Nhật → Việt, có
                    tuỳ chọn tuyến thẳng/transfer theo deadline.
                  </p>
                </details>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-500 p-1">
              <div className="rounded-3xl p-6 bg-white/90 backdrop-blur">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Cần báo giá & lịch xử lý?
                  </h3>
                </div>
                <p className="mt-2 text-gray-700">
                  Gửi kích thước/thời gian dự kiến và tuyến bay — Tiximax sẽ đề
                  xuất phương án tối ưu.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow"
                  >
                    Liên hệ tư vấn
                  </Link>
                  <a
                    href="/services/shipping"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                  >
                    Xem dịch vụ vận chuyển
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesStorage;
