import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  ClipboardList,
  Stamp,
  PackageSearch,
  CheckCircle2,
  Calculator,
  AlertTriangle,
  Truck,
  PlaneTakeoff,
  Building2,
  ArrowRight,
} from "lucide-react";

/**
 * ServicesCustoms.jsx — Tiximax
 * Dịch vụ: Thông quan hộ / Khai báo hải quan
 * Tone màu: vàng – trắng – đen (đồng bộ với Shipping & Purchase)
 * Bố cục: Hero → USP → Duty/Tax Estimator (demo) → Checklist hồ sơ → Quy trình → Hạn mục & Lưu ý → FAQ → CTA
 * TailwindCSS + Framer Motion + Lucide icons. Không phụ thuộc ảnh ngoài.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const usps = [
  {
    icon: ShieldCheck,
    title: "Tuân thủ & Minh bạch",
    desc: "Khai báo chính xác HS code, theo dõi hồ sơ realtime.",
  },
  {
    icon: Stamp,
    title: "Xử lý nhanh",
    desc: "Ưu tiên tuyến hồ sơ, hạn chế phát sinh lưu kho/lưu bãi.",
  },
  {
    icon: PackageSearch,
    title: "Đối soát chứng từ",
    desc: "Đầy đủ invoice, packing list, hình ảnh và biên bản kiểm.",
  },
  {
    icon: FileText,
    title: "Tư vấn HS & chính sách",
    desc: "Gợi ý phân loại hàng hoá & mức thuế áp dụng tham khảo.",
  },
];

// Ước tính thuế/phí đơn giản (demo): Thuế NK + VAT tính trên CIF
const useTaxEstimate = ({
  goodsValue,
  freight,
  insurance,
  dutyRate,
  vatRate,
}) => {
  return useMemo(() => {
    const v = Number(goodsValue) || 0;
    const f = Number(freight) || 0;
    const i = Number(insurance) || 0;
    const duty = Number(dutyRate) || 0; // %
    const vat = Number(vatRate) || 0; // %

    const cif = v + f + i;
    const importDuty = (cif * duty) / 100;
    const vatTax = ((cif + importDuty) * vat) / 100;
    const totalTax = Math.max(0, Math.round(importDuty + vatTax));

    return { cif, importDuty, vatTax, totalTax };
  }, [goodsValue, freight, insurance, dutyRate, vatRate]);
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

const ServicesCustoms = () => {
  const [inputs, setInputs] = useState({
    goodsValue: "50000000", // VND
    freight: "2000000", // VND
    insurance: "0", // VND
    dutyRate: "10", // %
    vatRate: "8", // %
  });

  const est = useTaxEstimate(inputs);
  const handle = (k) => (e) =>
    setInputs((s) => ({ ...s, [k]: e.target.value.replace(/[^0-9.]/g, "") }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-yellow-50/40 text-gray-900">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-yellow-200 to-transparent opacity-70 -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-24 lg:pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              <ClipboardList className="w-3.5 h-3.5" /> Thông quan hộ / Khai báo
              hải quan
            </span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Thông quan nhanh, đúng chuẩn — hồ sơ minh bạch, tối ưu thuế phí.
            </h1>
            <p className="mt-4 text-gray-700 text-lg leading-8">
              Tiximax hỗ trợ phân loại HS code, chuẩn bị chứng từ, nộp tờ khai
              và xử lý phát sinh để hàng hóa thông quan đúng hẹn.
            </p>
          </motion.div>

          {/* USP */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {usps.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-md"
              >
                <u.icon className="w-6 h-6 text-yellow-600" />
                <p className="mt-2 font-semibold text-gray-900">{u.title}</p>
                <p className="text-sm text-gray-600">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TAX CALCULATOR */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Ước tính thuế & VAT (tham khảo)
              </h2>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              <input
                value={inputs.goodsValue}
                onChange={handle("goodsValue")}
                placeholder="Giá trị hàng (VND)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <input
                value={inputs.freight}
                onChange={handle("freight")}
                placeholder="Cước vận chuyển (VND)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <input
                value={inputs.insurance}
                onChange={handle("insurance")}
                placeholder="Bảo hiểm (VND)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <input
                value={inputs.dutyRate}
                onChange={handle("dutyRate")}
                placeholder="Thuế NK (%)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <input
                value={inputs.vatRate}
                onChange={handle("vatRate")}
                placeholder="VAT (%)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="mt-5 rounded-xl bg-yellow-50 p-4">
              <Row
                label="Giá CIF (VND)"
                value={`${Math.round(est.cif).toLocaleString()} VND`}
                hint="CIF = Giá trị hàng + Cước + Bảo hiểm"
              />
              <Row
                label="Thuế nhập khẩu (VND)"
                value={`${Math.round(est.importDuty).toLocaleString()} VND`}
              />
              <Row
                label="VAT (VND)"
                value={`${Math.round(est.vatTax).toLocaleString()} VND`}
                hint="Tính trên (CIF + Thuế NK)"
              />
              <div className="mt-2 pt-3 border-t border-yellow-200 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">
                  TỔNG THUẾ DỰ KIẾN
                </div>
                <div className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-700">
                  {est.totalTax.toLocaleString()} VND
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                *Chỉ là ước tính tham khảo. Mức thực tế phụ thuộc HS code/chính
                sách/biểu thuế áp dụng tại thời điểm thông quan.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CHECKLIST DOCUMENTS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Bộ hồ sơ cần thiết
            </h2>
            <p className="text-gray-600">
              Chuẩn bị đầy đủ giúp hồ sơ thông quan nhanh hơn.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Commercial Invoice",
                items: [
                  "Tên/địa chỉ người bán – người mua",
                  "Mô tả hàng hoá/Model/JAN",
                  "Đơn giá – trị giá – điều kiện Incoterms",
                ],
              },
              {
                title: "Packing List",
                items: [
                  "Số kiện – trọng lượng – kích thước",
                  "Số PO/Đơn đặt hàng",
                  "Cách đóng gói/Pallet/Carton",
                ],
              },
              {
                title: "Vận đơn & khác",
                items: [
                  "MAWB/HAWB/BL",
                  "CO/COO nếu cần",
                  "MSDS/Chứng nhận chất lượng (nếu áp dụng)",
                ],
              },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-yellow-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5" /> {b.title}
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {b.items.map((it) => (
                    <li key={it}>• {it}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Quy trình xử lý hồ sơ
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Tiếp nhận hồ sơ & tư vấn HS code",
              "Chuẩn hoá invoice/packing list",
              "Lập tờ khai & nộp phí",
              "Kiểm tra hồ sơ — phản hồi yêu cầu bổ sung",
              "Thông quan & lấy hàng",
              "Giao hàng nội địa & bàn giao chứng từ",
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-bold mb-3">
                  {i + 1}
                </div>
                <p className="font-semibold text-gray-900">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTRICTIONS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold">
              <AlertTriangle className="w-5 h-5" /> Hạn mục & lưu ý
            </div>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <li>
                • Hàng cấm/nguy hiểm theo quy định HQ VN: chất dễ cháy nổ, ma
                tuý, vũ khí, văn hoá phẩm cấm...
              </li>
              <li>
                • Hàng có pin/hoá chất cần MSDS và tư vấn tuyến bay phù hợp.
              </li>
              <li>• Thuế/phí thay đổi theo thời điểm và biểu thuế cập nhật.</li>
              <li>
                • Hồ sơ thiếu sẽ kéo dài thời gian thông quan và phát sinh lưu
                bãi.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-3xl border border-yellow-200 bg-white p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" /> Câu hỏi thường gặp
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <details className="rounded-xl border border-gray-100 p-4">
                  <summary className="font-semibold cursor-pointer">
                    Bao lâu có thể thông quan?
                  </summary>
                  <p className="mt-2">
                    Trong điều kiện hồ sơ đầy đủ và tuyến bay thông suốt, thường
                    1–2 ngày làm việc kể từ khi hàng đến cửa khẩu.
                  </p>
                </details>
                <details className="rounded-xl border border-gray-100 p-4">
                  <summary className="font-semibold cursor-pointer">
                    Tiximax có hỗ trợ xin giấy phép chuyên ngành?
                  </summary>
                  <p className="mt-2">
                    Có, chúng tôi phối hợp với đối tác chuyên trách để xử lý hồ
                    sơ chuyên ngành khi cần thiết (phát sinh phí).
                  </p>
                </details>
                <details className="rounded-xl border border-gray-100 p-4">
                  <summary className="font-semibold cursor-pointer">
                    Có thể xem trạng thái hồ sơ ở đâu?
                  </summary>
                  <p className="mt-2">
                    Trên cổng khách hàng của Tiximax: trạng thái tờ khai,
                    thuế/phí, thời gian dự kiến và chứng từ số hoá.
                  </p>
                </details>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-yellow-500 to-yellow-700 p-1">
              <div className="rounded-3xl p-6 bg-white/90 backdrop-blur">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-yellow-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Cần tư vấn HS code & mức thuế?
                  </h3>
                </div>
                <p className="mt-2 text-gray-700">
                  Gửi mô tả hàng hoá, hình ảnh và invoice để Tiximax tham khảo,
                  tư vấn lộ trình và chi phí dự kiến.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                  >
                    Liên hệ tư vấn
                  </a>
                  <a
                    href="/services/shipping"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                  >
                    Xem vận chuyển quốc tế
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER BADGE */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <PlaneTakeoff className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">
                Kết nối tuyến bay ổn định — hạn chế chậm trễ
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Truck className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">
                Giao hàng nội địa linh hoạt theo yêu cầu
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesCustoms;
