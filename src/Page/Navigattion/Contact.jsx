import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Fake API Delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    setSent(true);

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setSent(false), 4000);
  };

  const handle = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 text-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* TITLE */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide uppercase"
        >
          Liên hệ với chúng tôi
        </motion.h1>

        {/* TOP ROW */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT – COMPANY INFO */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 sm:p-10 min-h-[500px] flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-full bg-amber-100 text-amber-700">
                <MapPin className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-gray-900">
                Công ty Cổ phần TIXIMAX
              </h2>
            </div>

            <p className="mt-2 text-base text-gray-600 leading-relaxed">
              Nếu cần tư vấn hoặc hỗ trợ tham khảo thêm thông tin, vui lòng liên
              hệ với chúng tôi theo các thông tin sau:
            </p>

            <div className="mt-8 space-y-4 text-base">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-gray-800">
                  +84 901 834 283
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-gray-600">
                  08:00 - 20:00 | Thứ Hai - Chủ Nhật
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600" />
                <span className="text-gray-600">global.trans@tiximax.net</span>
              </div>
            </div>

            {/* Address */}
            <div className="mt-10">
              <h3 className="text-base font-semibold uppercase tracking-wide text-gray-800">
                Địa chỉ văn phòng & kho hàng TIXIMAX
              </h3>
              <div className="mt-4 space-y-3 text-base text-gray-600">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>
                    Văn phòng: 65 Đ. 9, Hiệp Bình Phước, Thủ Đức, Thành phố Hồ
                    Chí Minh 100000.
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>
                    Kho tại Indonesia: Alan Cinta No.2, RT.11/RW.3, Pinggir
                    Kali, Kecamatan Pulogadung, Kota Jakarta Timur, Jakarta,
                    Indonesia.
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>
                    Kho tại Nhật Bản: 千葉県 白井市 復1449-8, Shiroi-shi, Chiba,
                    Japan.
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>
                    Kho tại Hàn Quốc: 인천광역시 부평구 부평동 284-136, 302호,
                    Incheon, South Korea.
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>Kho tại Mỹ: Woodstock, Georgia, United States.</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-auto pt-8">
              <p className="text-base font-semibold uppercase tracking-wide text-gray-800">
                Kết nối với Tiximax
              </p>
              <div className="mt-3 flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-900 text-white hover:bg-amber-500 hover:text-gray-900 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-900 text-white hover:bg-amber-500 hover:text-gray-900 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-900 text-white hover:bg-amber-500 hover:text-gray-900 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT – BANNER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden min-h-[500px] flex items-center justify-center"
          >
            <img
              src="https://i.pinimg.com/736x/ee/4b/81/ee4b81d3a96a4e002225a7db7fadc147.jpg"
              alt="Banner Tiximax"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* MAP */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden min-h-[500px]"
          >
            <iframe
              title="Tiximax Map"
              src="https://maps.google.com/maps?q=65%20%C4%90.%209,%20Hi%E1%BB%87p%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc,%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c,%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20100000&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(245,158,11,0.25)] border border-amber-200 p-8 sm:p-10 min-h-[500px]"
          >
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-gray-900">
              Gửi yêu cầu nhận tư vấn
            </h2>

            <form onSubmit={onSubmit} className="mt-8 space-y-6 w-full">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold uppercase mb-2 text-gray-700">
                    Tên
                  </label>
                  <input
                    value={form.firstName}
                    onChange={handle("firstName")}
                    className="w-full border border-amber-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all bg-white placeholder-gray-400"
                    placeholder="Nhập tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase mb-2 text-gray-700">
                    Họ
                  </label>
                  <input
                    value={form.lastName}
                    onChange={handle("lastName")}
                    className="w-full border border-amber-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all bg-white placeholder-gray-400"
                    placeholder="Nhập họ"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold uppercase mb-2 text-gray-700">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={handle("email")}
                    className="w-full border border-amber-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all bg-white placeholder-gray-400"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase mb-2 text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    value={form.phone}
                    onChange={handle("phone")}
                    className="w-full border border-amber-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all bg-white placeholder-gray-400"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold uppercase mb-2 text-gray-700">
                  Yêu cầu
                </label>
                <input
                  value={form.subject}
                  onChange={handle("subject")}
                  className="w-full border border-amber-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-all bg-white placeholder-gray-400"
                  placeholder="Nhập chủ đề"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold uppercase mb-2 text-gray-700">
                  Ghi chú thêm
                </label>
                <textarea
                  rows="7"
                  value={form.message}
                  onChange={handle("message")}
                  className="w-full border border-amber-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 bg-white transition-all placeholder-gray-400"
                  placeholder="Nhập tin nhắn..."
                />
              </div>

              {/* Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-sm font-semibold uppercase rounded-lg bg-amber-500 text-white tracking-wide shadow-md hover:bg-amber-600 transition-all disabled:opacity-60"
                >
                  {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </div>

              {sent && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  Cảm ơn bạn! Chúng tôi đã nhận được thông tin.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
