import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Globe2,
  CreditCard,
  ShieldCheck,
  Truck,
  Calculator,
  ArrowRight,
} from "lucide-react";

/**
 * ServicesPurchase.jsx — Tiximax Logistics
 * Tone màu: vàng - trắng - đen, bố cục tương tự Shipping nhưng tối ưu cho dịch vụ “Mua hộ”.
 * Bao gồm: Hero, USP, Calculator demo, Quy trình, CTA.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const ServicesPurchase = () => {
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
              <ShoppingBag className="w-3.5 h-3.5" /> Dịch vụ mua hộ
            </span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Mua hàng quốc tế dễ dàng — Tiximax hỗ trợ toàn diện.
            </h1>
            <p className="mt-4 text-gray-700 text-lg leading-8">
              Dịch vụ mua hộ giúp bạn dễ dàng sở hữu sản phẩm chính hãng từ
              Nhật, Hàn, Mỹ, Indonesia mà không lo rào cản thanh toán hay vận
              chuyển.
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              {
                icon: Globe2,
                title: "Nhiều quốc gia",
                desc: "Hỗ trợ mua hộ từ Nhật, Hàn, Mỹ, Indo, Anh, EU.",
              },
              {
                icon: CreditCard,
                title: "Thanh toán linh hoạt",
                desc: "Chuyển khoản VNĐ hoặc JPY/USD theo báo giá Tiximax.",
              },
              {
                icon: ShieldCheck,
                title: "Bảo đảm uy tín",
                desc: "Giao dịch qua tài khoản doanh nghiệp, kiểm soát rủi ro.",
              },
              {
                icon: Truck,
                title: "Trọn gói vận chuyển",
                desc: "Giao tận tay Việt Nam, có invoice & tracking minh bạch.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <f.icon className="w-6 h-6 text-yellow-600" />
                <p className="mt-2 font-semibold text-gray-900">{f.title}</p>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
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
                Ước tính chi phí mua hộ
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <input
                placeholder="Giá sản phẩm (¥, $)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <input
                placeholder="Phí nội địa / vận chuyển (¥)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500">
                <option>Thị trường Nhật</option>
                <option>Thị trường Hàn</option>
                <option>Thị trường Mỹ</option>
                <option>Thị trường Indo</option>
              </select>
              <button className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold px-5 py-2.5 hover:from-yellow-600 hover:to-yellow-700">
                Tính ngay
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *Giá tạm tính chưa bao gồm phí đấu giá (nếu có) và cước quốc tế.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Quy trình mua hộ hàng quốc tế
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Khách gửi link sản phẩm / nhu cầu",
              "Tiximax báo giá & xác nhận thanh toán",
              "Đặt hàng tại quốc gia sở tại",
              "Kiểm tra, đóng gói và tạo mã kiện",
              "Giao hàng theo chuyến bay về Việt Nam",
              "Thông quan & giao hàng tận tay khách",
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-bold mb-3">
                  {i + 1}
                </div>
                <p className="font-semibold text-gray-900">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">
          Bắt đầu mua hàng quốc tế cùng Tiximax
        </h2>
        <p className="max-w-2xl mx-auto text-yellow-50 mb-6">
          Chỉ cần gửi link sản phẩm — đội ngũ Tiximax sẽ giúp bạn mua, thanh
          toán và vận chuyển về Việt Nam trọn gói.
        </p>
        <button className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-50 transition">
          Liên hệ ngay <ArrowRight className="w-5 h-5 text-yellow-600" />
        </button>
      </section>
    </main>
  );
};

export default ServicesPurchase;
