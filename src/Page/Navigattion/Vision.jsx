import React from "react";
import { motion } from "framer-motion";
import PICCEO from "../../assets/PICCEO.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Vision = () => {
  return (
    <main className="bg-white py-20">
      {/* TITLE */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-center text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide text-gray-900"
      >
        Hiểu Thêm Về Chúng Tôi
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center mt-6 text-gray-600 text-lg leading-relaxed"
      >
        Chúng tôi tin rằng một doanh nghiệp bền vững không chỉ dựa vào lợi
        nhuận, mà dựa vào con người và những giá trị cốt lõi. Tiximax mang sứ
        mệnh kết nối thế giới bằng logistics, thanh toán và mua bán toàn cầu.
        <br />
        {/* Tiximax mang sứ mệnh kết nối thế giới bằng logistics, thanh toán và mua
        bán toàn cầu. */}
      </motion.p>

      {/* PROFILE + TEXT AROUND */}
      <div className="relative max-w-4xl mx-auto mt-20">
        {/* PROFILE IMAGE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src={PICCEO}
            alt="CEO"
            className="w-[430px] h-[430px] object-cover rounded-full"
            // Nếu không muốn bo tròn: className="w-[430px] h-[430px] object-cover"
          />
        </motion.div>

        {/* TEXT LABELS AROUND IMAGE */}
        {/* Top Left */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute left-0 top-0 transform -translate-x-10 -translate-y-6 text-center"
        >
          <h3 className="font-bold text-gray-900 text-lg uppercase">
            Tầm Nhìn
          </h3>
          <span className="text-amber-600 font-semibold text-sm cursor-pointer hover:text-amber-700">
            Xem thêm &gt;&gt;
          </span>
        </motion.div>

        {/* Top Right */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute right-0 top-0 transform translate-x-10 -translate-y-6 text-center"
        >
          <h3 className="font-bold text-gray-900 text-lg uppercase">Sứ Mệnh</h3>
          <span className="text-amber-600 font-semibold text-sm cursor-pointer hover:text-amber-700">
            Xem thêm &gt;&gt;
          </span>
        </motion.div>

        {/* Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute left-0 bottom-0 transform -translate-x-10 translate-y-6 text-center"
        >
          <h3 className="font-bold text-gray-900 text-lg uppercase">
            Giá Trị Cốt Lõi
          </h3>
          <span className="text-amber-600 font-semibold text-sm cursor-pointer hover:text-amber-700">
            Xem thêm &gt;&gt;
          </span>
        </motion.div>

        {/* Bottom Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute right-0 bottom-0 transform translate-x-10 translate-y-6 text-center"
        >
          <h3 className="font-bold text-gray-900 text-lg uppercase">
            Quy Tắc Ứng Xử
          </h3>
          <span className="text-amber-600 font-semibold text-sm cursor-pointer hover:text-amber-700">
            Xem thêm &gt;&gt;
          </span>
        </motion.div>
      </div>
    </main>
  );
};

export default Vision;
