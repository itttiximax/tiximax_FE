import React from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  Plane,
  Package,
  Truck,
  ShieldCheck,
  Clock,
  Users2,
  ChartNoAxesCombined,
  Handshake,
  Warehouse,
  PackageSearch,
  Rocket,
} from "lucide-react";

/**
 * ServiceList.jsx — Tiximax (Danh sách dịch vụ chính với chi tiết và CTA)
 * Sử dụng bảng màu amber / white / black, animation fade-up, và grid responsive.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const services = [
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: "Mua hộ & Đấu giá Quốc tế",
    desc: "Hỗ trợ mua hàng từ Nhật, Hàn, Indo, Mỹ — thanh toán đa tệ, đấu giá Yahoo Auction, Amazon.",
    features: [
      "Tư vấn sản phẩm & giá cả",
      "Thanh toán JPY/USD/KRW",
      "Theo dõi đấu giá realtime",
    ],
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Plane className="w-6 h-6" />,
    title: "Vận chuyển Xuyên biên giới",
    desc: "Tuyến bay thẳng: Nhật-Hàn-Indo-Mỹ về VN với SLA 3-7 ngày, tối ưu chi phí theo khối lượng.",
    features: [
      "Tuyến air/sea tùy chọn",
      "Theo dõi realtime qua app",
      "Bảo hiểm hàng hóa tùy chỉnh",
    ],
    image:
      "https://i.pinimg.com/736x/74/28/e6/7428e6b80ecd09bb6590d7ae175d5400.jpg",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Gom hàng & Đóng gói",
    desc: "Kho ngoại quan đa điểm: gom lô, kiểm tra chất lượng, đóng gói chuẩn xuất khẩu.",
    features: [
      "Kiểm tra mã JAN/SKU",
      "Ảnh chụp & cân đo chi tiết",
      "Tối ưu thể tích giảm cước",
    ],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Khai quan & Giao nhận",
    desc: "Dịch vụ thông quan nhanh, giao tận nơi nội địa VN với tracking end-to-end.",
    features: [
      "Hồ sơ hải quan điện tử",
      "Hỗ trợ thủ tục nhập khẩu",
      "Giao nhận 63 tỉnh thành",
    ],
    image:
      "https://i.pinimg.com/736x/f3/9e/5d/f39e5d1a48ee85e87ffdf551e03919c1.jpg",
  },
];

const strengths = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "An toàn & Tuân thủ",
    desc: "Tuân thủ quy định hải quan, bảo mật dữ liệu khách hàng.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Tốc độ Cao",
    desc: "Lead time rút ngắn nhờ tuyến bay tối ưu và tự động hóa.",
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ tư vấn đa ngôn ngữ, hỗ trợ mọi lúc.",
  },
  {
    icon: <ChartNoAxesCombined className="w-6 h-6" />,
    title: "Minh bạch Chi phí",
    desc: "Báo giá realtime, không phí ẩn, hóa đơn điện tử.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Đối tác Toàn cầu",
    desc: "Mạng lưới hãng bay, kho bãi, đại lý HQ đáng tin cậy.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Tùy chỉnh Giải pháp",
    desc: "Cá nhân hóa theo ngành hàng: điện tử, thời trang, thực phẩm.",
  },
];

const ServiceList = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero */}
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
              <PackageSearch className="w-3.5 h-3.5" /> Dịch vụ Logistics
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
              Dịch vụ Tiximax – Giải pháp Vận chuyển & Mua hộ Toàn diện
            </h1>
            <p className="mt-5 text-gray-600 text-lg leading-8">
              Từ mua hộ quốc tế đến giao nhận tận nơi, chúng tôi mang hàng hóa
              toàn cầu về Việt Nam nhanh chóng, an toàn và tối ưu chi phí.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group"
              >
                <div className="relative h-48 lg:h-56">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    {s.icon} {s.title.toUpperCase()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-3 text-gray-600">{s.desc}</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Lý do Chọn Tiximax
            </h2>
            <p className="mt-2 text-gray-600">
              Năng lực vượt trội giúp chúng tôi dẫn dắt thị trường logistics
              xuyên biên giới.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengths.map((s) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                    {s.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <p className="text-gray-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm text-center"
          >
            <h3 className="text-2xl font-extrabold text-gray-900">
              Sẵn sàng Bắt đầu Hành trình Logistics của Bạn?
            </h3>
            <p className="mt-3 text-gray-600">
              Liên hệ Tiximax để nhận tư vấn miễn phí và báo giá nhanh chóng.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow"
              >
                Liên hệ Ngay
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Xem Bảng Giá
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ServiceList;
