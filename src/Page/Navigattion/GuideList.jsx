import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe2,
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
  HelpCircle,
  FileText,
  Search,
  CreditCard,
  MapPin,
  Plane,
} from "lucide-react";

/**
 * GuideList.jsx — Tiximax (Danh sách hướng dẫn sử dụng dịch vụ)
 * Sử dụng bảng màu amber / white / black, animation fade-up, và grid responsive.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const guides = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Hướng dẫn Mua hộ từ Nhật Bản",
    desc: "Cách tìm kiếm sản phẩm, đặt mua và thanh toán trên các nền tảng Nhật như Yahoo Auction, Amazon JP.",
    steps: [
      "Tạo tài khoản Tiximax và liên kết ví.",
      "Tìm sản phẩm và gửi link cho chúng tôi.",
      "Xác nhận báo giá và thanh toán.",
      "Theo dõi trạng thái mua hàng realtime.",
    ],
    image:
      "https://images.unsplash.com/photo-1542397284477-e6aa0739cadf?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Hướng dẫn Thanh toán & Báo giá",
    desc: "Quy trình tính phí, thanh toán đa kênh và hóa đơn điện tử cho mọi dịch vụ.",
    steps: [
      "Nhận báo giá tự động qua dashboard.",
      "Chọn phương thức: chuyển khoản, ví điện tử.",
      "Xác nhận thanh toán và nhận e-invoice.",
      "Theo dõi chi phí realtime.",
    ],
    image:
      "https://images.unsplash.com/photo-1556742048-83a33d4a5e40?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Hướng dẫn Gom hàng & Đóng gói",
    desc: "Cách yêu cầu gom lô từ nhiều nguồn, kiểm tra chất lượng và đóng gói an toàn.",
    steps: [
      "Gửi danh sách sản phẩm cần gom.",
      "Kiểm tra chất lượng tại kho ngoại.",
      "Chọn loại đóng gói: tiêu chuẩn hoặc đặc biệt.",
      "Nhận ảnh xác nhận trước khi ship.",
    ],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Plane className="w-6 h-6" />,
    title: "Hướng dẫn Vận chuyển & Theo dõi",
    desc: "Chọn tuyến vận chuyển, theo dõi đơn hàng từ điểm đi đến điểm đến.",
    steps: [
      "Chọn air/sea dựa trên thời gian và chi phí.",
      "Nhận mã tracking sau khi ship.",
      "Theo dõi qua app hoặc web portal.",
      "Nhận thông báo cập nhật tự động.",
    ],
    image:
      "https://images.unsplash.com/photo-1504151604351-1d6bd07bc779?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Hướng dẫn Khai quan & Nhập khẩu",
    desc: "Thủ tục hải quan, chứng từ cần thiết và cách xử lý các vấn đề thông quan.",
    steps: [
      "Chuẩn bị chứng từ: invoice, packing list.",
      "Khai báo hải quan điện tử qua Tiximax.",
      "Xử lý phí thuế và kiểm tra hàng hóa.",
      "Nhận hàng sau thông quan thành công.",
    ],
    image:
      "https://images.unsplash.com/photo-1566577134775-0e402ef1f68d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Hướng dẫn Giao nhận Nội địa",
    desc: "Cách nhận hàng tại kho hoặc giao tận nơi tại 63 tỉnh thành Việt Nam.",
    steps: [
      "Chọn địa chỉ nhận hàng khi đặt đơn.",
      "Theo dõi linehaul nội địa qua tracking.",
      "Kiểm tra hàng hóa khi nhận.",
      "Xử lý khiếu nại nếu có vấn đề.",
    ],
    image:
      "https://i.pinimg.com/550x/5e/1e/98/5e1e9841e9d9ca08deef603f6421eb1d.jpg",
  },
];

const tips = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "An toàn Hàng hóa",
    desc: "Luôn mua bảo hiểm cho lô hàng giá trị cao.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Tiết kiệm Thời gian",
    desc: "Sử dụng dashboard để theo dõi mọi thứ ở một nơi.",
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: "Hỗ trợ Khách hàng",
    desc: "Liên hệ hotline 24/7 nếu cần trợ giúp.",
  },
  {
    icon: <ChartNoAxesCombined className="w-6 h-6" />,
    title: "Tối ưu Chi phí",
    desc: "Gom hàng để giảm cước vận chuyển.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Đối tác Tin cậy",
    desc: "Chọn tuyến vận chuyển từ đối tác uy tín.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Cập nhật Liên tục",
    desc: "Kiểm tra app thường xuyên để cập nhật trạng thái.",
  },
];

const GuideList = () => {
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
              <HelpCircle className="w-3.5 h-3.5" /> Hướng dẫn Sử dụng
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
              Hướng dẫn Tiximax – Bắt đầu Dễ dàng với Dịch vụ của Chúng tôi
            </h1>
            <p className="mt-5 text-gray-600 text-lg leading-8">
              Các hướng dẫn chi tiết giúp bạn sử dụng dịch vụ mua hộ, vận chuyển
              và logistics một cách hiệu quả nhất.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guides List */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {guides.map((g, i) => (
              <motion.div
                key={g.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group"
              >
                <div className="relative h-48 lg:h-56">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    {g.icon} {g.title.toUpperCase()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{g.title}</h3>
                  <p className="mt-3 text-gray-600">{g.desc}</p>
                  <ol className="mt-4 space-y-2 text-sm text-gray-700 list-decimal pl-5">
                    {g.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Mẹo Sử dụng Hiệu quả
            </h2>
            <p className="mt-2 text-gray-600">
              Các mẹo nhỏ giúp bạn tối ưu hóa trải nghiệm với Tiximax.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((t) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                    {t.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{t.title}</p>
                    <p className="text-gray-600 text-sm">{t.desc}</p>
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
              Cần Hỗ trợ Thêm?
            </h3>
            <p className="mt-3 text-gray-600">
              Liên hệ đội ngũ Tiximax để được hướng dẫn chi tiết hơn.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow"
              >
                Liên hệ Hỗ trợ
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Xem Dịch vụ
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default GuideList;
