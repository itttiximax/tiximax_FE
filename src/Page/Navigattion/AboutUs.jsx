import React from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  ShieldCheck,
  PlaneTakeoff,
  Users2,
  Trophy,
  Rocket,
  Heart,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Handshake,
  Clock,
  CheckCircle2,
} from "lucide-react";

import CEOPIC from "../../assets/CEOPIC.png";
import DUNGLE from "../../assets/DUNGLE.jpg";
import DUCLE from "../../assets/DUCLE.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const coreValues = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Tử Tế Là Nền Tảng",
    desc: "Xây dựng niềm tin và sự trung thực trong ngành logistics",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Phát Triển Con Người",
    desc: "Mỗi thử thách là bài học rèn luyện ý chí",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Tôn Trọng & Trao Quyền",
    desc: "Thúc đẩy sáng tạo và phát huy năng lực cá nhân",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Lãnh Đạo Bằng Trái Tim",
    desc: "Đặt lợi ích nhân viên và khách hàng lên trên",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Cân Bằng Con Người & Lợi Nhuận",
    desc: "Đảm bảo sự thịnh vượng đi cùng nhân văn",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Văn Hóa Học Hỏi",
    desc: "Chìa khóa để thích ứng và đổi mới liên tục",
  },
];

const milestones = [
  {
    year: "2022",
    title: "THÀNH LẬP CÔNG TY TIXIMAX",
    detail:
      "Công ty Tiximax ra đời, bắt đầu với lĩnh vực xây dựng và thương mại điện tử quốc tế.",
  },
  {
    year: "2023-2024",
    title: "HOẠT ĐỘNG TẠI ĐÀ NĂNG",
    detail:
      "Hoạt động tại trụ sở Đà Nẵng, bắt đầu phát triển tuyến Indonesia - Việt Nam.",
  },
  {
    year: "2025",
    title: "MỞ VĂN PHÒNG TẠI HỒ CHÍ MINH",
    detail:
      "Mở văn phòng tại Hồ Chí Minh, phát triển thêm các tuyến Nhật - Việt, Hàn - Việt, Mỹ - Việt.",
  },
];

const leaders = [
  {
    name: "Nguyễn Ngọc Hoàng Anh",
    role: "CEO & Founder của Tiximax",
    bio: "Email: hoanganh@tiximax.net",
    initials: "HA",
    image: CEOPIC,
  },
  {
    name: "Lê Trung Dũng",
    role: "Giám đốc Kinh doanh Tiximax",
    bio: "Email: dung.le@tiximax.net",
    initials: "DL",
    image: DUCLE,
  },
  {
    name: "Trần Minh Đức",
    role: "Phó Giám đốc Kinh doanh Tiximax",
    bio: "Email: ductm@tiximax.net",
    initials: "DT",
    image: DUNGLE,
  },
];

const missionPillars = [
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "Tiếp cận thế giới dễ dàng hơn",
    desc: "Xóa bỏ rào cản thanh toán và logistics, giúp việc mua bán xuyên biên giới trở nên Đơn giản, Nhanh chóng và Tiết kiệm cho mọi khách hàng.",
  },
  {
    icon: <Users2 className="w-8 h-8" />,
    title: "Xây dựng nơi làm việc tử tế và hạnh phúc",
    desc: "Tạo môi trường để nhân viên được trân trọng, rèn luyện, phát triển và làm việc trong sự tử tế, trách nhiệm.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Đóng góp giá trị cho xã hội",
    desc: "Sử dụng lợi nhuận để tái đầu tư vào con người, công nghệ và các hoạt động phụng sự cộng đồng.",
  },
];

const customerCommitments = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Trung thực & Minh bạch",
    desc: "Tuyệt đối về chi phí, dịch vụ",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Nhanh chóng & Hiệu quả",
    desc: "Xuyên biên giới, giảm thiểu rủi ro",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Đồng hành & Thấu hiểu",
    desc: "Tìm giải pháp tối ưu cho từng nhu cầu",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Giá trị vượt trội",
    desc: "Giúp khách hàng phát triển kinh doanh bền vững",
  },
];

const employeeCommitments = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Môi trường tử tế & hạnh phúc",
    desc: "Nơi làm việc đầy tôn trọng và nhân văn",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Cơ hội phát triển toàn diện",
    desc: "Rèn luyện kỹ năng, nâng cao năng lực",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Trao quyền & tin tưởng",
    desc: "Để mỗi cá nhân phát huy năng lực",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Chia sẻ thành quả",
    desc: "Thành công của công ty là thành công của tập thể",
  },
];

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero - Simple Text Only */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24 relative">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-6 text-white"
          >
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              VỀ TIXIMAX
            </h1>

            <div className="space-y-4 text-gray-200 text-lg leading-relaxed">
              <p>
                Tiximax ra đời với sứ mệnh trở thành cầu nối thương mại toàn
                cầu, giúp khách hàng và doanh nghiệp Việt Nam vươn ra thế giới
                thông qua dịch vụ logistics, thanh toán và fulfillment. Chúng
                tôi tin rằng một doanh nghiệp chỉ có thể phát triển bền vững khi
                xây dựng trên nền tảng văn hóa và giá trị cốt lõi vững chắc.
              </p>

              <p>
                Giá trị cốt lõi không phải là những khẩu hiệu để treo trên
                tường, mà là kim chỉ nam cho mọi hành động, là cách chúng ta ứng
                xử với khách hàng, đồng nghiệp và xã hội.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-500 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-80 lg:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop"
                    alt="Tầm nhìn toàn cầu"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-yellow-900/40" />
                </div>
                <div className="p-8 lg:p-12 text-white">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                    <Globe2 className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wider">
                      Tầm Nhìn
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-6">
                    Mạng lưới toàn cầu lớn mạnh
                  </h2>
                  <div className="space-y-4 text-white/95">
                    <p className="leading-relaxed">
                      Tầm nhìn của Tiximax là trở thành một{" "}
                      <strong>Mạng lưới Toàn cầu</strong> lớn mạnh trong 5-10
                      năm tới, với sự hiện diện tại hơn 20 quốc gia, đóng vai
                      trò cầu nối thương mại cho hàng triệu cá nhân và doanh
                      nghiệp nhỏ trên khắp thế giới.
                    </p>
                    <p className="leading-relaxed">
                      Tiximax cam kết là một{" "}
                      <strong>Công ty Công nghệ Logistics</strong> tiên phong,
                      nơi khách hàng có thể mua hàng, thanh toán và vận chuyển
                      xuyên quốc gia chỉ với vài thao tác, với khả năng theo dõi
                      đơn hàng toàn cầu dễ dàng, minh bạch.
                    </p>
                    <p className="leading-relaxed">
                      Cuối cùng, Tiximax hướng đến là một{" "}
                      <strong>Doanh nghiệp Tử tế và Hạnh phúc</strong> – là nơi
                      nhân viên tự hào, là đối tác đáng tin cậy của khách hàng,
                      và mang tinh thần trách nhiệm, chính trực của Việt Nam
                      vươn ra thế giới.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
                <Rocket className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Sứ Mệnh
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Giúp con người kết nối với thế giới
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                "Giúp con người, đặc biệt là người Việt Nam, dễ dàng kết nối với
                thế giới"
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {missionPillars.map((pillar, idx) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-2xl bg-white border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white mb-6">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-6 text-center"
            >
              <p className="text-lg font-bold text-gray-900">
                <span className="text-amber-600">Kết nối</span> –{" "}
                <span className="text-yellow-600">Phát triển</span> –{" "}
                <span className="text-orange-600">Phụng sự</span>
              </p>
              <p className="text-gray-600 mt-2">với sự tử tế là nền tảng</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Giá Trị Cốt Lõi
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Tử Tế Là Nền Tảng
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Giá trị cốt lõi của Tiximax xoay quanh nguyên tắc Tử Tế Là Nền
                Tảng, giúp xây dựng niềm tin và sự trung thực trong ngành
                logistics.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, idx) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-amber-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
              <Handshake className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">
                Cam Kết Của Chúng Tôi
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Trách nhiệm với từng đối tượng
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customer Commitments */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Users2 className="w-10 h-10" />
                  <h3 className="text-2xl font-bold">Đối với Khách hàng</h3>
                </div>
                <p className="text-blue-100">
                  Chúng tôi cam kết mang đến trải nghiệm vượt trội và giá trị
                  bền vững
                </p>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {customerCommitments.map((commitment) => (
                    <div
                      key={commitment.title}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {commitment.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {commitment.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {commitment.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Employee Commitments */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-10 h-10" />
                  <h3 className="text-2xl font-bold">Đối với Nhân viên</h3>
                </div>
                <p className="text-green-100">
                  Xây dựng môi trường làm việc tử tế, phát triển và hạnh phúc
                </p>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {employeeCommitments.map((commitment) => (
                    <div
                      key={commitment.title}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        {commitment.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {commitment.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {commitment.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">
                Hành Trình Phát Triển
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Cột mốc quan trọng
            </h2>
            <p className="text-lg text-gray-600">
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
                    <div className="absolute -left-6 md:-left-10 w-10 h-10 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <p className="text-sm font-bold text-amber-600 mb-2">
                        {m.year}
                      </p>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {m.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {m.detail}
                      </p>
                    </div>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-amber-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">
                Ban Lãnh Đạo
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-lg text-gray-600">
              Những người dẫn dắt Tiximax phát triển bền vững và khác biệt.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((p, idx) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-bold text-white text-xl mb-1">
                      {p.name}
                    </p>
                    <p className="text-base text-amber-300 font-medium">
                      {p.role}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-base font-medium text-gray-700">{p.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
export default AboutUs;
