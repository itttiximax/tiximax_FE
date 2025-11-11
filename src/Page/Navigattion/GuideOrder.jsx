import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  ClipboardCheck,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Wallet,
  ShieldCheck,
  PlaneTakeoff,
  PackageSearch,
  Clock,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * GuideOrder.jsx — Tiximax
 * Hướng dẫn đặt hàng/mua hộ/đấu giá theo tone vàng – trắng – đen.
 * Bố cục: Hero → Điều kiện chuẩn bị → Quy trình từng bước → Thời gian dự kiến → Lỗi thường gặp → FAQ → CTA.
 * Tailwind + Framer Motion, không cần ảnh ngoài.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const steps = [
  {
    title: "Gửi liên kết sản phẩm",
    desc: "Dán URL từ sàn/website (Yahoo, Mercari, Rakuma, Amazon JP, Rakuten, v.v.) cùng mô tả ngắn.",
    icon: LinkIcon,
  },
  {
    title: "Xác minh thông tin",
    desc: "Tiximax kiểm tra mô tả, ảnh, tình trạng, tuỳ chọn, model/JAN để tránh sai sót.",
    icon: PackageSearch,
  },
  {
    title: "Báo giá & xác nhận",
    desc: "Nhận báo giá tổng quan (giá hàng + phí nền tảng + phí dịch vụ + cước quốc tế ước tính).",
    icon: FileText,
  },
  {
    title: "Đặt cọc/Thanh toán",
    desc: "Thanh toán theo phương án đã chọn (VNĐ hoặc JPY/USD).",
    icon: Wallet,
  },
  {
    title: "Đặt đơn/Đặt giá",
    desc: "Tiến hành mua trực tiếp hoặc đặt giá đấu theo rule đã thống nhất.",
    icon: ClipboardCheck,
  },
  {
    title: "Nhận hàng tại kho",
    desc: "Hàng về kho (Chiba/US/KR…), kiểm ảnh, cân đo, dán nhãn, tạo mã kiện.",
    icon: ImageIcon,
  },
  {
    title: "Bay về Việt Nam",
    desc: "Gom lô, gán chuyến bay phù hợp deadline/chi phí; theo dõi tracking.",
    icon: PlaneTakeoff,
  },
  {
    title: "Thông quan & giao hàng",
    desc: "Hoàn tất thủ tục HQ, giao nội địa theo yêu cầu và đối soát chứng từ.",
    icon: ShieldCheck,
  },
];

const mistakes = [
  {
    k: "Link thiếu thông tin",
    v: "URL thiếu biến thể/màu/size làm sai sản phẩm; hãy thêm ảnh chụp/mã model/JAN.",
  },
  {
    k: "Chưa đọc kỹ mô tả",
    v: "Hàng used/for parts/không phụ kiện… cần đọc kỹ để tránh kỳ vọng sai.",
  },
  {
    k: "Đặt deadline quá sát",
    v: "Peak season có thể phát sinh chậm chuyến; nên chừa buffer 1–3 ngày.",
  },
  {
    k: "Hàng hạn chế vận chuyển",
    v: "Pin rời, chất lỏng, hoá chất… cần tư vấn trước để chọn tuyến phù hợp.",
  },
];

const faqs = [
  {
    q: "Mất bao lâu để hàng về tới tay?",
    a: "Thông thường 5–10 ngày tuỳ tuyến (Nhật/Hàn/Mỹ/Indo) và tình trạng thông quan. Mùa cao điểm có thể +1–3 ngày.",
  },
  {
    q: "Có thể huỷ đơn sau khi đã đặt?",
    a: "Với mua trực tiếp: nếu shop đã nhận hàng/đã gửi thì không huỷ được. Với đấu giá: sau khi win thì bắt buộc thanh toán theo quy định.",
  },
  {
    q: "Phí dịch vụ gồm những gì?",
    a: "Phí mua hộ/đấu giá + phí xử lý kho cơ bản; chi tiết thể hiện trên invoice/biên nhận minh bạch.",
  },
  {
    q: "Tôi muốn xuất hoá đơn VAT?",
    a: "Hỗ trợ xuất hoá đơn theo quy định, vui lòng cung cấp thông tin doanh nghiệp khi tạo yêu cầu.",
  },
];

const GuideOrder = () => {
  const [copied, setCopied] = useState(false);

  const checklist = `\n— Link sản phẩm chính xác (bao gồm biến thể)\n— Ảnh tham khảo/mã model-JAN nếu có\n— Ngân sách/MaxBid (với đấu giá)\n— Thông tin nhận hàng tại VN\n— Ghi chú đóng gói (nếu cần)\n`;

  const copyChecklist = async () => {
    try {
      await navigator.clipboard.writeText(checklist);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

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
              <ListChecks className="w-3.5 h-3.5" /> Hướng dẫn đặt hàng
            </span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-black leading-tight">
              Đặt hàng cùng Tiximax — nhanh, đúng, minh bạch.
            </h1>
            <p className="mt-4 text-gray-700 text-lg leading-8">
              Làm theo các bước bên dưới để đặt mua/đấu giá sản phẩm quốc tế và
              nhận hàng tại Việt Nam an toàn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PREPARE */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold">
              <ClipboardCheck className="w-5 h-5" /> Chuẩn bị trước khi tạo yêu
              cầu
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>
                  • Link sản phẩm chính xác + tuỳ chọn (màu/size/phiên bản).
                </li>
                <li>• Ảnh tham khảo, model/JAN nếu có.</li>
                <li>• Ngân sách/MaxBid (đối với đấu giá).</li>
              </ul>
              <ul className="space-y-2">
                <li>• Địa chỉ/SDT nhận hàng tại Việt Nam.</li>
                <li>• Ghi chú đóng gói (pallet/fragile) nếu cần.</li>
                <li>• Ghi chú deadline mong muốn.</li>
              </ul>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={copyChecklist}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              >
                <Download className="w-4 h-4" /> Sao chép checklist
              </button>
              {copied && (
                <span className="text-xs text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã sao chép!
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-extrabold mb-6">Quy trình từng bước</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <s.icon className="w-5 h-5 text-yellow-600" />
                  <p className="font-semibold">
                    {i + 1}. {s.title}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-700">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold">
              <Clock className="w-5 h-5" /> Thời gian dự kiến
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-yellow-200 p-4">
                <p className="font-semibold text-gray-900">Nhật → Việt</p>
                <p className="text-gray-700">~ 5–7 ngày làm việc</p>
              </div>
              <div className="rounded-xl border border-yellow-200 p-4">
                <p className="font-semibold text-gray-900">Hàn → Việt</p>
                <p className="text-gray-700">~ 4–6 ngày làm việc</p>
              </div>
              <div className="rounded-xl border border-yellow-200 p-4">
                <p className="font-semibold text-gray-900">Mỹ/Indo → Việt</p>
                <p className="text-gray-700">~ 7–10 ngày làm việc</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *Thời gian phụ thuộc lịch bay/khai HQ và có thể dài hơn vào mùa
              cao điểm.
            </p>
          </div>
        </div>
      </section>

      {/* MISTAKES */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-extrabold mb-4">
            Lỗi thường gặp & cách tránh
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mistakes.map((m, i) => (
              <motion.div
                key={m.k}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-yellow-700 font-semibold">
                  <AlertCircle className="w-5 h-5" /> {m.k}
                </div>
                <p className="mt-2 text-sm text-gray-700">{m.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" /> Câu hỏi thường gặp
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <summary className="font-semibold cursor-pointer">
                    {f.q}
                  </summary>
                  <p className="mt-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl bg-gradient-to-br from-yellow-500 to-yellow-700 p-1">
              <div className="rounded-3xl p-6 bg-white/90 backdrop-blur">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-yellow-700" />
                  <h3 className="text-lg font-bold">Sẵn sàng đặt hàng?</h3>
                </div>
                <p className="mt-2 text-gray-700">
                  Đăng nhập để tạo yêu cầu, thiết lập MaxBid (nếu đấu giá) và
                  theo dõi trạng thái.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/signin"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                  >
                    Hỏi nhanh
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold">Mẹo đặt hàng nhanh</h3>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li>
                  • Gửi tối thiểu 2–3 link tương tự để có phương án dự phòng.
                </li>
                <li>
                  • Với đấu giá: chốt MaxBid thực tế và rule thời điểm nhảy giá.
                </li>
                <li>
                  • Cung cấp deadline nhận hàng để tối ưu tuyến bay phù hợp.
                </li>
                <li>
                  • Hàng đặc thù (pin/hoá chất) cần tư vấn tuyến trước khi đặt.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GuideOrder;
