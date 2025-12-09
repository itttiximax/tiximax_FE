import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, Search, PackageSearch } from "lucide-react";
import PHONE1 from "../../assets/PHONE1.jpg"; // ảnh phone của bạn
import PHONE2 from "../../assets/PHONE2.jpg";
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const guides = [
  {
    icon: <PackageSearch className="w-6 h-6" />,
    title: "Hướng dẫn Đặt hàng",
    desc: "Quy trình đặt hàng tại Tiximax giúp bạn mua hộ hoặc vận chuyển hàng quốc tế dễ dàng và nhanh chóng.",
    steps: [
      "Tìm sản phẩm và gửi link yêu cầu trên website Tiximax.",
      "Nhận báo giá chi tiết bao gồm toàn bộ chi phí.",
      "Xác nhận đơn và thanh toán.",
      "Theo dõi trạng thái đơn hàng realtime trên hệ thống.",
    ],
    image: PHONE1,
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Hướng dẫn Tra cứu & Theo dõi đơn hàng",
    desc: "Kiểm tra hành trình đơn hàng từ nước ngoài về Việt Nam, trạng thái kho, hải quan và giao nội địa.",
    steps: [
      "Nhập mã đơn trên trang Tra cứu đơn hàng.",
      "Xem trạng thái chi tiết từng chặng vận chuyển.",
      "Nhận thông báo tự động qua SMS hoặc hệ thống.",
      "Liên hệ hỗ trợ nếu có vấn đề phát sinh.",
    ],
    image: PHONE2,
  },
];

const GuideList = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-yellow-200 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-24 lg:pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" /> Hướng dẫn sử dụng
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
              Hướng dẫn cơ bản – Bắt đầu với Tiximax
            </h1>

            <p className="mt-5 text-gray-600 text-lg">
              Hai hướng dẫn quan trọng nhất giúp bạn đặt hàng và theo dõi đơn
              hiệu quả.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guides List (2 card) */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {guides.map((g, i) => (
              <motion.div
                key={g.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
              >
                <div className="relative h-56">
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
    </main>
  );
};

export default GuideList;
