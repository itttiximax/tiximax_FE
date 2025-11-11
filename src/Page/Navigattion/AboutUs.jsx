import React from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  ShieldCheck,
  PlaneTakeoff,
  PackageSearch,
  Users2,
  Trophy,
  Rocket,
  Warehouse,
  Handshake,
  ChartNoAxesCombined,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

/**
 * AboutUs.jsx — Tiximax (with imagery for Vision / Mission / Values)
 * Added hero images to V/M/V cards while preserving brand palette (amber / white / black).
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stats = [
  { label: "Đơn hàng/năm", value: "25,000+" },
  { label: "Đối tác toàn cầu", value: "150+" },
  { label: "Tỉ lệ đúng hẹn", value: "98.7%" },
  { label: "Điểm hài lòng", value: "4.8/5" },
];

const values = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Chính trực & Trách nhiệm",
    desc: "Minh bạch, đúng cam kết — đặt an toàn & tuân thủ lên hàng đầu.",
  },
  {
    icon: <PlaneTakeoff className="w-6 h-6" />,
    title: "Tốc độ & Tối ưu",
    desc: "Thiết kế tuyến bay và kho bãi tinh gọn để rút ngắn lead time.",
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: "Lấy khách hàng làm trung tâm",
    desc: "Cá nhân hoá giải pháp theo từng ngành hàng và từng lô.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Đổi mới liên tục",
    desc: "Tự động hoá vận hành và theo dõi để tăng chất lượng dịch vụ.",
  },
];

const milestones = [
  {
    year: "2019",
    title: "Khởi nguồn tại Việt Nam",
    detail: "Bắt đầu với dịch vụ mua hộ & vận chuyển quốc tế quy mô nhỏ.",
  },
  {
    year: "2021",
    title: "Mở rộng kho ngoại quan",
    detail: "Thiết lập quy trình đóng gói & kiểm soát chất lượng chuẩn hoá.",
  },
  {
    year: "2023",
    title: "Nâng cấp hệ thống số",
    detail:
      "Ra mắt cổng khách hàng, tracking thời gian thực và hoá đơn điện tử.",
  },
  {
    year: "2025",
    title: "Vươn tầm khu vực",
    detail: "Vận hành đa tuyến Nhật – Hàn – Indo – Mỹ về Việt Nam với SLA cao.",
  },
];

const footprints = [
  {
    country: "Việt Nam",
    city: "Đà Nẵng / Hà Nội / TP.HCM",
    role: "Headquarters & Fulfillment",
  },
  {
    country: "Nhật Bản",
    city: "Chiba / Tokyo",
    role: "Kho ngoại – thanh toán JPY",
  },
  {
    country: "Hàn Quốc",
    city: "Seoul / Incheon",
    role: "Thu gom – khai thuê HQ",
  },
  {
    country: "Indonesia",
    city: "Jakarta",
    role: "Source hàng – consolidation",
  },
  { country: "Hoa Kỳ", city: "Los Angeles", role: "Mua hộ – gom lô – air/sea" },
];

const strengths = [
  {
    icon: <PackageSearch className="w-6 h-6" />,
    title: "Kiểm soát chất lượng",
    desc: "Ảnh chụp, cân đo, đối soát mã/JAN, chứng từ đồng nhất.",
  },
  {
    icon: <Warehouse className="w-6 h-6" />,
    title: "Kho bãi đa điểm",
    desc: "Kho ngoại & nội địa kết nối API, tối ưu gom hàng & linehaul.",
  },
  {
    icon: <ChartNoAxesCombined className="w-6 h-6" />,
    title: "Theo dõi minh bạch",
    desc: "Dashboard realtime: trạng thái đơn, kiện, cân nặng, cước.",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "SLA chuẩn hoá",
    desc: "Cam kết thời gian bay & thông quan theo tuyến chuẩn.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Mạng lưới đối tác",
    desc: "Hãng bay, kho, đại lý HQ — bảo đảm thông suốt mùa cao điểm.",
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: "Mở rộng linh hoạt",
    desc: "Dịch vụ trọn gói: mua hộ, đấu giá, vận chuyển, thông quan.",
  },
];

const leaders = [
  {
    name: "Nguyễn A.",
    role: "Giám đốc Vận hành",
    bio: "10+ năm quản lý chuỗi cung ứng khu vực APAC.",
    initials: "NA",
  },
  {
    name: "Trần B.",
    role: "Head of Sales",
    bio: "Phát triển đối tác & khách hàng xuyên biên giới.",
    initials: "TB",
  },
  {
    name: "Lê C.",
    role: "Ops Tech Lead",
    bio: "Tự động hoá hệ thống, tracking & báo cáo real-time.",
    initials: "LC",
  },
];

const AboutUs = () => {
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
              <Globe2 className="w-3.5 h-3.5" /> Cross‑Border Logistics
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
              Tiximax – Kết nối hàng hóa toàn cầu về Việt Nam nhanh, minh bạch,
              đáng tin cậy.
            </h1>
            <p className="mt-5 text-gray-600 text-lg leading-8">
              Chúng tôi thiết kế giải pháp vận chuyển trọn chuỗi — từ mua hộ/đấu
              giá, gom hàng, khai HQ đến giao nhận. Mọi kiện hàng đều được theo
              dõi chuẩn xác theo từng giờ.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
              >
                <div className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-500">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision – Mission – Values with imagery */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Vision */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group"
            >
              <div className="relative h-44">
                <img
                  src="https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop"
                  alt="Tầm nhìn — mở rộng toàn cầu"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                  <Globe2 className="w-4 h-4" /> TẦM NHÌN
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Tầm nhìn</h3>
                <p className="mt-3 text-gray-600">
                  Trở thành đối tác logistics xuyên biên giới đáng tin cậy nhất
                  cho doanh nghiệp Việt tại châu Á – Thái Bình Dương.
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group"
            >
              <div className="relative h-44">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop"
                  alt="Sứ mệnh — vận hành hiệu quả"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                  <Rocket className="w-4 h-4" /> SỨ MỆNH
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Sứ mệnh</h3>
                <p className="mt-3 text-gray-600">
                  Chuẩn hoá dịch vụ, rút ngắn lead time và tối ưu chi phí cho
                  từng tuyến bay – từng ngành hàng.
                </p>
              </div>
            </motion.div>

            {/* Core Values */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group"
            >
              <div className="relative h-44">
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop"
                  alt="Giá trị cốt lõi — gắn kết đội ngũ"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                  <ShieldCheck className="w-4 h-4" /> GIÁ TRỊ CỐT LÕI
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Giá trị cốt lõi
                </h3>
                <ul className="mt-3 space-y-3">
                  {values.map((v) => (
                    <li key={v.title} className="flex items-start gap-3">
                      <span className="text-amber-600 mt-1">{v.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{v.title}</p>
                        <p className="text-gray-600 text-sm">{v.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Cột mốc phát triển
            </h2>
            <p className="mt-2 text-gray-600">
              Những bước đi quan trọng định hình năng lực vận hành của Tiximax.
            </p>
          </div>
          <div className="relative pl-6 md:pl-10">
            <div className="absolute left-2 md:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 to-yellow-500 rounded-full" />
            <ul className="space-y-8">
              {milestones.map((m, i) => (
                <li key={m.year} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="ml-6 md:ml-10"
                  >
                    <div className="absolute -left-6 md:-left-10 w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                      <p className="text-sm font-semibold text-amber-700">
                        {m.year}
                      </p>
                      <h4 className="mt-1 text-lg font-bold text-gray-900">
                        {m.title}
                      </h4>
                      <p className="mt-1 text-gray-600">{m.detail}</p>
                    </div>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Global footprint */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Mạng lưới toàn cầu
              </h2>
              <p className="mt-2 text-gray-600">
                Các điểm thu gom, kho bãi và trung tâm hỗ trợ khách hàng.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {footprints.map((f) => (
              <motion.div
                key={f.country + f.city}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{f.country}</p>
                    <p className="text-sm text-gray-600">{f.city}</p>
                    <p className="mt-1 text-sm text-amber-700 font-medium">
                      {f.role}
                    </p>
                  </div>
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
              Điểm mạnh vận hành
            </h2>
            <p className="mt-2 text-gray-600">
              Hệ thống – quy trình – con người tạo nên năng lực cạnh tranh của
              Tiximax.
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

      {/* Leadership */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Đội ngũ lãnh đạo
            </h2>
            <p className="mt-2 text-gray-600">
              Những người dẫn dắt Tiximax phát triển bền vững và khác biệt.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 font-bold grid place-items-center shadow-inner">
                    {p.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-sm text-amber-700 font-medium">
                      {p.role}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{p.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-500 p-1"
            >
              <div className="rounded-3xl p-6 bg-white/90 backdrop-blur">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Chứng nhận & Tuân thủ
                  </h3>
                </div>
                <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li>• Quy trình đóng gói – dán nhãn chuẩn</li>
                  <li>• Hợp đồng đối tác hãng bay/kho</li>
                  <li>• E-invoice & lưu trữ chứng từ</li>
                  <li>• Bảo hiểm hàng hoá theo yêu cầu</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm"
            >
              <h3 className="text-2xl font-extrabold text-gray-900">
                Sẵn sàng tối ưu tuyến hàng của bạn
              </h3>
              <p className="mt-3 text-gray-600">
                Nói cho Tiximax biết điểm đi/điểm đến, đặc thù sản phẩm và
                deadline — chúng tôi sẽ đề xuất phương án khả thi nhất.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow"
                >
                  Liên hệ tư vấn
                </a>
                <a
                  href="/services/shipping"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                >
                  Xem dịch vụ vận chuyển
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer badge */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span className="text-sm">
                Bảo mật dữ liệu & tuân thủ chuẩn ngành
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <PlaneTakeoff className="w-5 h-5 text-amber-600" />
              <span className="text-sm">
                Ưu tiên tuyến bay thẳng – đúng hẹn
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Users2 className="w-5 h-5 text-amber-600" />
              <span className="text-sm">Hỗ trợ khách hàng 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
