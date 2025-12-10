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
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const topServices = [
  {
    icon: <Truck className="w-7 h-7 text-amber-600" />,
    title: "GIAO HÀNG TOÀN QUỐC",
    desc: "Tiximax đảm bảo giao hàng an toàn, hiệu quả đến mọi tỉnh thành Việt Nam. Chúng tôi hợp tác với các đơn vị vận chuyển hàng đầu để tối ưu tốc độ và chất lượng dịch vụ. Mọi đơn hàng đều được theo dõi minh bạch từ kho quốc tế đến tận tay bạn, với cam kết trách nhiệm và sự tử tế trong mọi khâu.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-amber-600" />,
    title: "CHĂM SÓC ĐƠN HÀNG",
    desc: "Đội ngũ chuyên viên Tiximax tận tâm hỗ trợ bạn 24/7. Chúng tôi không chỉ giải quyết vấn đề mà còn đồng hành cùng khách hàng tìm kiếm giải pháp tối ưu nhất. Mọi thắc mắc về báo giá, thủ tục hải quan hay trạng thái đơn hàng đều được phản hồi nhanh chóng và chính xác.",
  },
  {
    icon: <Warehouse className="w-7 h-7 text-amber-600" />,
    title: "KHO HÀNG QUỐC TẾ",
    desc: "Tiximax cung cấp hệ thống kho hàng quốc tế hiện đại tại Mỹ, Nhật, Hàn, và Indonesia. Kho được trang bị để gom hàng, kiểm đếm và đóng gói chuẩn quốc tế, đảm bảo hàng hóa luôn được bảo quản an toàn. Dịch vụ ký gửi kho chuyên nghiệp giúp bạn tiết kiệm chi phí vận chuyển.",
  },
];

const services = [
  {
    icon: <Globe2 className="w-6 h-6 text-amber-400" />,
    title: "DỊCH VỤ VẬN CHUYỂN",
    desc: "Vận chuyển từ Nhật Bản, Hàn Quốc, Indonesia và Mỹ về Việt Nam.",
    features: ["Minh bạch chi phí.", "Kho hàng tại nhiều quốc gia."],
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: <Plane className="w-6 h-6 text-amber-400" />,
    title: "DỊCH VỤ ĐẤU GIÁ",
    desc: "Đấu giá Yahoo Auction và eBay theo yêu cầu của khách hàng.",
    features: ["Tỷ lệ đấu giá thắng cao."],
    image:
      "https://i.pinimg.com/736x/74/28/e6/7428e6b80ecd09bb6590d7ae175d5400.jpg",
  },
  {
    icon: <Package className="w-6 h-6 text-amber-400" />,
    title: "DỊCH VỤ MUA HỘ",
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
    icon: <Truck className="w-6 h-6 text-amber-400" />,
    title: "DỊCH VỤ THÔNG QUAN HỘ",
    desc: "Thông quan hộ từ nước ngoài về Việt Nam, dịch vụ nhanh chóng, thủ tục đơn giản.",
    features: ["Hỗ trợ thủ tục nhập khẩu", "Giao nhận 63 tỉnh thành"],
    image:
      "https://i.pinimg.com/736x/f3/9e/5d/f39e5d1a48ee85e87ffdf551e03919c1.jpg",
  },
  {
    icon: <Package className="w-6 h-6 text-amber-400" />,
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
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/40">
      {/* Hero / Title Page – style giống AboutUs */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/25 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24 relative">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-5 text-white"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-amber-300 uppercase">
              Tiximax Logistics
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Dịch vụ Tiximax – Giải pháp logistics đường bay toàn diện
            </h1>
            <p className="text-sm md:text-base text-gray-200 max-w-2xl leading-relaxed">
              Mua hộ, đấu giá, vận chuyển, thông quan và ký gửi kho từ Nhật,
              Hàn, Mỹ, Indonesia về Việt Nam với quy trình minh bạch, tối ưu chi
              phí và trải nghiệm tử tế cho khách hàng.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TOP SERVICES – BG XÁM, CARD VÀNG + TEXT TO HƠN */}
      <motion.section
        className="bg-gray-50 py-16 lg:py-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-amber-600 uppercase">
              Tiximax
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
              Dịch vụ vận chuyển & mua hộ quốc tế
            </h2>
            <div className="mt-4 mx-auto h-[2px] w-16 bg-amber-500 rounded-full" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {topServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-amber-100 rounded-2xl shadow-sm border border-amber-200 px-8 py-9 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex justify-center mb-4">{s.icon}</div>
                <h3 className="text-base md:text-lg font-bold tracking-wide text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-4 text-base text-gray-700 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services List – BG TRẮNG, CARD VÀNG + TEXT TO HƠN */}
      <motion.section
        className="py-16 lg:py-20 bg-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-xs md:text-sm font-semibold tracking-wider text-amber-600 uppercase">
              Chi tiết dịch vụ
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
              Giải pháp Logistics chuyên nghiệp
            </h2>
            <div className="mt-4 mx-auto h-[2px] w-16 bg-amber-500 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden bg-amber-100 border border-amber-200 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 group"
              >
                <div className="relative h-52 lg:h-60">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-3 left-4 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    {s.icon}
                    <span className="tracking-wide">
                      {s.title.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-7 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {s.desc}
                  </p>
                  <ul className="mt-3 space-y-2 text-base text-gray-800">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quy trình đơn hàng – BG XÁM, CARD VÀNG + TEXT TO HƠN */}
      <motion.section
        className="py-16 lg:py-20 bg-gray-50"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-xs md:text-sm font-semibold tracking-wider text-amber-600 uppercase">
              Quy trình hoạt động
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
              Quy trình xử lý đơn hàng tại Tiximax
            </h2>
            <div className="mt-4 mx-auto h-[2px] w-16 bg-amber-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="bg-amber-100 rounded-2xl shadow-sm border border-amber-200 px-6 py-8 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <span className="flex justify-center mb-4">
                    <Icon className="w-8 h-8 text-amber-600" />
                  </span>
                  <p className="font-bold text-base md:text-lg text-gray-900 tracking-wide">
                    {step.title}
                  </p>
                  <p className="text-gray-700 text-sm md:text-base mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default ServiceList;
