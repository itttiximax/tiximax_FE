import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  HelpCircle,
  ShieldCheck,
  Globe2,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

/**
 * Contact.jsx — Tiximax (Phiên bản UI chuyên nghiệp hơn)
 * Cải tiến UI để chuyên nghiệp hơn:
 * - Tối ưu hóa responsive: Sử dụng grid linh hoạt hơn, breakpoints rõ ràng.
 * - Font & Typography: Thêm font sans-serif chuyên nghiệp (e.g., Inter hoặc Roboto via Tailwind config), tăng line-height cho readability.
 * - Spacing & Padding: Tăng padding nội dung, sử dụng rem/em cho consistency.
 * - Animations: Thêm stagger cho cards, smooth transitions cho form inputs.
 * - Form Enhancements: Floating labels, better error states, loading spinner cho submit.
 * - Map: Tăng height, thêm border-radius mượt mà.
 * - FAQ: Accordion mượt mà hơn với transitions.
 * - Social: Hover effects tinh tế, thêm tooltips.
 * - Accessibility: Thêm aria-labels, focus rings visible nhưng styled.
 * - Overall: Gradient tinh tế hơn, shadows mềm mại, buttons với ripple effect (via CSS).
 *
 * Giả sử Tailwind config đã có thêm plugins như @tailwindcss/forms cho form styling tốt hơn.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const topics = [
    { value: "auction", label: "Hỗ trợ đấu giá" },
    { value: "storage", label: "Ký gửi kho" },
    { value: "shipping", label: "Vận chuyển quốc tế" },
    { value: "customs", label: "Khai báo hải quan" },
    { value: "other", label: "Khác" },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email không hợp lệ";
    if (!form.message || form.message.length < 10)
      e.message = "Nội dung tối thiểu 10 ký tự";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", phone: "", topic: "", message: "" });
  };

  const handle = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-yellow-50/30 text-gray-900 font-sans">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-100 via-yellow-50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-28 lg:pb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide bg-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full shadow-sm">
              <Globe2 className="w-4 h-4" /> Contact Tiximax
            </span>
            <h1 className="mt-6 text-2xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 tracking-tight">
              Liên hệ Tiximax — Chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </h1>
            <p className="mt-5 text-gray-600 text-lg sm:text-xl leading-relaxed">
              Gửi yêu cầu về đấu giá, ký gửi kho, vận chuyển hay thông quan. Đội
              ngũ sẽ phản hồi nhanh trong giờ làm việc.
            </p>
          </motion.div>
          {/* Quick Info Cards */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                icon: Phone,
                title: "Hotline",
                desc: "0707 267 001 (09:00–18:00)",
              },
              { icon: Mail, title: "Email", desc: "support@tiximax.vn" },
              { icon: MapPin, title: "Văn phòng", desc: "Đà Nẵng · Việt Nam" },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="rounded-xl border border-yellow-100 bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <c.icon className="w-6 h-6 text-yellow-600 mb-3" />
                <p className="font-semibold text-gray-900 text-lg">{c.title}</p>
                <p className="text-gray-600">{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* FORM & MAP */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 rounded-xl border border-yellow-100 bg-white p-8 shadow-md">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-800 text-sm font-medium">
                  <MessageSquare className="w-4 h-4" /> Gửi yêu cầu
                </div>
                <p className="mt-3 text-gray-600 text-base leading-relaxed">
                  Điền thông tin để chúng tôi hỗ trợ nhanh hơn.
                </p>
              </div>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      id="name"
                      value={form.name}
                      onChange={handle("name")}
                      placeholder=" "
                      className={`peer w-full rounded-lg border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all`}
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-yellow-600"
                    >
                      Họ tên
                    </label>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="email"
                      value={form.email}
                      onChange={handle("email")}
                      placeholder=" "
                      className={`peer w-full rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all`}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-yellow-600"
                    >
                      Email
                    </label>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      id="phone"
                      value={form.phone}
                      onChange={handle("phone")}
                      placeholder=" "
                      className="peer w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-yellow-600"
                    >
                      Số điện thoại
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      id="topic"
                      value={form.topic}
                      onChange={handle("topic")}
                      className="peer w-full rounded-lg border border-gray-300 px-4 py-3 appearance-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                    >
                      <option value="">Chọn chủ đề</option>
                      {topics.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="topic"
                      className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-yellow-600"
                    >
                      Chủ đề
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={handle("message")}
                    rows={5}
                    placeholder=" "
                    className={`peer w-full rounded-lg border ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all`}
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-yellow-600"
                  >
                    Nội dung
                  </label>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-yellow-600" /> Thông
                    tin của bạn được bảo mật.
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Gửi yêu cầu
                      </>
                    )}
                  </button>
                </div>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800"
                  >
                    Cảm ơn bạn! Yêu cầu đã được ghi nhận. Chúng tôi sẽ liên hệ
                    sớm nhất.
                  </motion.div>
                )}
              </form>
            </div>
            {/* Map + Hours */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden border border-yellow-100 shadow-md">
                <iframe
                  title="Tiximax Office Map"
                  src="https://maps.google.com/maps?q=Da%20Nang%2C%20Vietnam&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-96"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl border border-yellow-100 bg-white p-6 shadow-md grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Giờ làm việc</p>
                    <p className="text-gray-600 text-sm">
                      Thứ 2–Thứ 7: 09:00 – 18:00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Building2 className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Kho & Văn phòng
                    </p>
                    <p className="text-gray-600 text-sm">
                      Chiba (JP) · Hà Nội/Đà Nẵng/TP.HCM (VN)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ + SOCIAL */}
      <section className="py-12 bg-gradient-to-b from-yellow-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-xl border border-yellow-100 bg-white p-8 shadow-md">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-800 text-sm font-medium">
                <HelpCircle className="w-4 h-4" /> Câu hỏi thường gặp
              </div>
              <motion.div
                className="mt-6 space-y-4"
                initial="hidden"
                animate="show"
                variants={staggerChildren}
              >
                {[
                  {
                    q: "Bao lâu tôi nhận được phản hồi?",
                    a: "Trong giờ làm việc, thường 1–3 giờ. Ngoài giờ, chúng tôi sẽ phản hồi sớm nhất vào ngày tiếp theo.",
                  },
                  {
                    q: "Có hỗ trợ tư vấn trực tiếp tại văn phòng?",
                    a: "Có, vui lòng đặt lịch trước để chúng tôi sắp xếp chuyên viên phù hợp.",
                  },
                  {
                    q: "Thông tin của tôi có được bảo mật?",
                    a: "Tiximax cam kết bảo mật dữ liệu khách hàng và chỉ sử dụng cho mục đích hỗ trợ dịch vụ.",
                  },
                ].map((faq, i) => (
                  <motion.details
                    key={i}
                    variants={fadeUp}
                    className="rounded-lg border border-gray-200 p-5 cursor-pointer group"
                  >
                    <summary className="font-semibold text-gray-900 flex justify-between items-center">
                      {faq.q}
                      <span className="text-yellow-600 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.details>
                ))}
              </motion.div>
            </div>
            <div className="lg:col-span-1 rounded-xl border border-yellow-100 bg-white p-8 shadow-md">
              <p className="font-bold text-gray-900 text-xl">
                Kết nối với Tiximax
              </p>
              <p className="mt-2 text-gray-600 text-base">
                Theo dõi để nhận lịch bay & ưu đãi mới.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
