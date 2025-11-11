import React from "react";
import { motion } from "framer-motion";
import {
  Ship,
  Clock,
  Globe2,
  Package,
  Calculator,
  ShieldCheck,
  ArrowRight,
  PlaneTakeoff,
} from "lucide-react";

/**
 * ServicesShipping.jsx — Tiximax Logistics
 * Tone: vàng - trắng - đen, thêm hình ảnh minh hoạ.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const features = [
  {
    icon: Globe2,
    title: "Đa quốc gia",
    desc: "Mạng lưới vận chuyển tại Nhật, Hàn, Mỹ, Indo và Việt Nam.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: Package,
    title: "Kiểm soát kiện hàng",
    desc: "Theo dõi realtime, minh bạch từng giai đoạn.",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1600&auto=format&fit=crop",
  },
  {
    icon: Clock,
    title: "Tối ưu lead time",
    desc: "Chuyến bay cố định mỗi tuần — cam kết đúng lịch.",
    img: "https://i.pinimg.com/736x/4d/21/20/4d2120a8a7c9832061058400ff8b2171.jpg",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hiểm hàng hóa",
    desc: "Bồi thường theo giá trị khai báo trong invoice.",
    img: "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?q=80&w=1600&auto=format&fit=crop",
  },
];

const routes = [
  {
    name: "Nhật → Việt",
    code: "JP → VN",
    img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop", // Tokyo
    lead: "3–5 ngày",
  },
  {
    name: "Hàn → Việt",
    code: "KR → VN",
    img: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop", // Seoul
    lead: "3–5 ngày",
  },
  {
    name: "Mỹ → Việt",
    code: "US → VN",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop", // LA
    lead: "5–8 ngày",
  },
  {
    name: "Indo → Việt",
    code: "ID → VN",
    img: "https://images.unsplash.com/photo-1543248939-a6bcf2c4a2aa?q=80&w=1600&auto=format&fit=crop", // Jakarta
    lead: "3–6 ngày",
  },
];

const ServicesShipping = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-yellow-50/40 text-gray-900">
      {/* HERO with image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=2000&auto=format&fit=crop"
            alt="Cargo aircraft loading"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/70" />
        </div>
        <div className="absolute inset-0 -z-10 opacity-60 bg-gradient-to-br from-yellow-100 via-yellow-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-24 lg:pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              <Ship className="w-3.5 h-3.5" /> Vận chuyển quốc tế
            </span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Dịch vụ vận chuyển quốc tế — nhanh, an toàn, tối ưu chi phí.
            </h1>
            <p className="mt-4 text-gray-700 text-lg leading-8">
              Tiximax cung cấp giải pháp vận chuyển từ Nhật, Hàn, Mỹ, Indonesia
              về Việt Nam với thời gian tối ưu và chi phí cạnh tranh.
            </p>
          </motion.div>

          {/* Feature tiles with image */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-2xl border border-yellow-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-28">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-2 left-2 inline-flex items-center gap-2 text-xs font-semibold text-white">
                    <span className="p-1.5 rounded-lg bg-white/20 text-white">
                      <f.icon className="w-4 h-4" />
                    </span>
                    {f.title}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-700">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR DEMO */}
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
                Ước tính chi phí vận chuyển
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <input
                placeholder="Khối lượng (kg)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <input
                placeholder="Kích thước (cm³)"
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500">
                <option>Tuyến Nhật – Việt</option>
                <option>Hàn – Việt</option>
                <option>Mỹ – Việt</option>
                <option>Indo – Việt</option>
              </select>
              <button className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold px-5 py-2.5 hover:from-yellow-600 hover:to-yellow-700">
                Tính ngay
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *Kết quả chỉ mang tính tham khảo, Tiximax sẽ báo giá chính xác sau
              khi xác nhận thông tin kiện hàng.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ROUTES with image cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-6 flex items-center gap-2">
            <PlaneTakeoff className="w-5 h-5 text-yellow-600" />
            <h2 className="text-2xl font-extrabold text-gray-900">
              Tuyến vận chuyển nổi bật
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {routes.map((r, i) => (
              <motion.div
                key={r.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative h-40">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-xs font-bold opacity-90">{r.code}</div>
                    <div className="text-sm font-semibold">{r.name}</div>
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white shadow">
                    Lead time: {r.lead}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Quy trình vận chuyển
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Tiếp nhận & kiểm tra kiện hàng",
              "Đóng gói & cân đo chính xác",
              "Khai báo HQ & gán flight",
              "Vận chuyển quốc tế & tracking",
              "Thông quan VN & giao kho",
              "Khách hàng nhận hàng & đối soát invoice",
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

      {/* CTA with image */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop"
            alt="Air cargo at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/90 to-yellow-700/90" />
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-3">
            Bắt đầu vận chuyển với Tiximax
          </h2>
          <p className="text-yellow-50">
            Nhập thông tin kiện hàng hoặc liên hệ đội ngũ Tiximax để được báo
            giá nhanh chóng và chính xác nhất.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-50 transition">
            Liên hệ ngay <ArrowRight className="w-5 h-5 text-yellow-600" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default ServicesShipping;
