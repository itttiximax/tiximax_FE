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
  Warehouse,
  PackageSearch,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const topServices = [
  {
    icon: <Truck className="w-6 h-6 text-amber-500" />,
    title: "GIAO HÀNG TOÀN QUỐC",
    desc: "Tiximax đảm bảo giao hàng an toàn, hiệu quả đến mọi tỉnh thành Việt Nam. Chúng tôi hợp tác với các đơn vị vận chuyển hàng đầu để tối ưu tốc độ và chất lượng dịch vụ. Mọi đơn hàng đều được theo dõi minh bạch từ kho quốc tế đến tận tay bạn, với cam kết trách nhiệm và sự tử tế trong mọi khâu.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
    title: "CHĂM SÓC ĐƠN HÀNG",
    desc: "Đội ngũ chuyên viên Tiximax tận tâm hỗ trợ bạn 24/7. Chúng tôi không chỉ giải quyết vấn đề mà còn đồng hành cùng khách hàng tìm kiếm giải pháp tối ưu nhất. Mọi thắc mắc về báo giá, thủ tục hải quan hay trạng thái đơn hàng đều được phản hồi nhanh chóng và chính xác.",
  },
  {
    icon: <Warehouse className="w-6 h-6 text-amber-500" />,
    title: "KHO HÀNG QUỐC TẾ",
    desc: "Tiximax cung cấp hệ thống kho hàng quốc tế hiện đại tại Mỹ, Nhật, Hàn, và Indonesia. Kho được trang bị để gom hàng, kiểm đếm và đóng gói chuẩn quốc tế, đảm bảo hàng hóa luôn được bảo quản an toàn. Dịch vụ ký gửi kho chuyên nghiệp giúp bạn tiết kiệm chi phí vận chuyển.",
  },
];

const services = [
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: " DỊCH VỤ VẬN CHUYỂN",
    desc: "Vận chuyển từ Nhật Bản, Hàn Quốc, Indonesia và Mỹ về Việt Nam.",
    features: [
      "Minh bạch chi phí.",
      "Kho hàng tại ",
      // "Theo dõi đấu giá realtime",
    ],
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Plane className="w-6 h-6" />,
    title: "DỊCH VỤ ĐẤU GIÁ",
    desc: "Đấu giá Yahoo Auction và eBay theo yêu cầu của khách hàng.",
    features: [
      "Tỷ lệ đấu giá thắng cao.",
      // "Theo dõi realtime qua app",
      // "Bảo hiểm hàng hóa tùy chỉnh",
    ],
    image:
      "https://i.pinimg.com/736x/74/28/e6/7428e6b80ecd09bb6590d7ae175d5400.jpg",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: " DỊCH VỤ MUA HỘ",
    desc: "Mua hộ hàng Nhật, Indonesia, Hàn, Mỹ và vận chuyển về Việt Nam theo yêu cầu.",
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
    title: "DỊCH VỤ THÔNG QUAN HỘ",
    desc: "Thông quan hộ từ nước ngoài về Việt Nam, dịch vụ nhanh chóng, thủ tục đơn giản.",
    features: [
      // "Hồ sơ hải quan điện tử",
      "Hỗ trợ thủ tục nhập khẩu",
      "Giao nhận 63 tỉnh thành",
    ],
    image:
      "https://i.pinimg.com/736x/f3/9e/5d/f39e5d1a48ee85e87ffdf551e03919c1.jpg",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "DỊCH VỤ KÝ GỬI KHO",
    desc: "Kho ngoại quan tại Nhật, Hàn, Mỹ và Indonesia hỗ trợ nhận hàng, lưu kho cho khách hàng có nhu cầu.",
    features: [
      "Kiểm tra mã JAN/SKU",
      "Ảnh chụp & cân đo chi tiết",
      "Tối ưu thể tích giảm cước",
    ],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
  },
];

const orderSteps = [
  {
    icon: ShieldCheck,
    title: "GỬI YÊU CẦU",
    desc: "Khách hàng gửi yêu cầu mua hộ, vận chuyển hoặc đấu giá qua website hoặc fanpage Tiximax. Hãy cung cấp chi tiết về sản phẩm để chúng tôi xử lý yêu cầu nhanh chóng và chính xác nhất.",
  },
  {
    icon: Clock,
    title: "NHẬN BÁO GIÁ",
    desc: "Chuyên viên Tiximax sẽ gửi báo giá chi tiết, minh bạch và tối ưu nhất qua email/tin nhắn. Báo giá bao gồm mọi chi phí trọn gói, không phát sinh, đảm bảo bạn nắm rõ thông tin trước khi quyết định.",
  },
  {
    icon: Users2,
    title: "XÁC NHẬN & THANH TOÁN",
    desc: "Sau khi đồng ý với báo giá, khách hàng tiến hành xác nhận đơn hàng và thanh toán. Hệ thống Tiximax bắt đầu thực hiện các bước mua hàng và logistics ngay lập tức, đảm bảo tiến độ.",
  },
  {
    icon: Package,
    title: "NHẬN HÀNG TẬN TAY",
    desc: "Khách có thể theo dõi đơn hàng qua hệ thống tracking hoặc qua sự hỗ trợ của nhân viên Tiximax. Chúng tôi sẽ giao hàng tận nơi, đảm bảo đúng, đủ và chính xác.",
  },
];

const ServiceList = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero / Title Page */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-yellow-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12 lg:pt-20 lg:pb-16 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              <PackageSearch className="w-3.5 h-3.5" /> Dịch vụ Logistics
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
              Dịch Vụ Tiximax - Giải Pháp Logistics Đường Bay Toàn Diện
            </h1>
          </motion.div>
        </div>
      </section>

      {/* TOP SERVICES */}
      <section className="bg-[#f7f7f7] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold tracking-[0.25em] text-gray-500 uppercase">
              Tiximax
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
              Dịch vụ vận chuyển & mua hộ quốc tế
            </h2>
            <div className="mt-3 mx-auto h-[2px] w-12 bg-amber-500" />
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {topServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-7 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3">{s.icon}</div>
                <h3 className="text-sm font-bold tracking-wide text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Chi tiết dịch vụ
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
              Giải pháp Logistics chuyên nghiệp
            </h2>
            <div className="mt-3 mx-auto h-[2px] w-12 bg-amber-500" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
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
                  <p className="mt-3 text-gray-600 leading-relaxed">{s.desc}</p>
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

      {/* Quy trình đơn hàng */}
      <section className="py-12 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Quy trình hoạt động
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
              Tiximax
            </h2>
            <div className="mt-3 mx-auto h-[2px] w-12 bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-center hover:shadow-md transition-shadow"
                >
                  <span className="flex justify-center mb-3">
                    <Icon className="w-7 h-7 text-amber-500" />
                  </span>
                  <p className="font-bold text-sm text-gray-900 tracking-wide">
                    {step.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceList;
