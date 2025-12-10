import React from "react";
import {
  FileText,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Thêm prop noMotion để tắt/bật hiệu ứng cho từng section
const Section = ({ title, bg = "white", children, noMotion = false }) => (
  <section
    className={`py-16 border-t border-amber-100 ${
      bg === "gray" ? "bg-gray-50" : "bg-white"
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {noMotion ? (
        // KHÔNG hiệu ứng
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            {title}
          </h2>
          <div className="mt-4 mb-10 h-[3px] w-20 mx-auto bg-amber-500 rounded-full" />
          <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 space-y-4">
            {children}
          </div>
        </div>
      ) : (
        // CÓ hiệu ứng
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            {title}
          </h2>
          <div className="mt-4 mb-10 h-[3px] w-20 mx-auto bg-amber-500 rounded-full" />
          <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 space-y-4">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  </section>
);

const ServicesCustoms = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/40">
      {/* HERO – đồng bộ style AboutUs / Service pages, vẫn dùng hiệu ứng */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-amber-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/30 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 sm:py-20 lg:py-24 relative">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-8 text-white"
          >
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-amber-300 mb-2">
                <span>Tiximax Thông Quan Hộ</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight text-center">
              Tiximax Thông Quan Hộ – Giải pháp xử lý hải quan nhanh, chính xác
              &amp; minh bạch
            </h1>

            <div className="mt-2 mb-2 h-[3px] w-24 mx-auto bg-amber-500 rounded-full" />

            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700"
              >
                Liên hệ tư vấn thông quan hộ
              </Link>
              <Link
                to="/tracking"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Tra cứu tình trạng lô hàng
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION NÀY: KHÔNG HIỆU ỨNG (nội dung trùng H1) */}
      <Section
        title="Tiximax Thông Quan Hộ – Giải pháp xử lý hải quan nhanh, chính xác & minh bạch"
        bg="white"
        noMotion
      >
        <>
          <p>
            Trong bối cảnh vận chuyển hàng quốc tế ngày càng phổ biến, thủ tục
            hải quan tại sân bay lại trở thành “nút thắt” lớn khiến nhiều khách
            hàng lo lắng. Chỉ cần sai 1 mã HS, thiếu 1 chữ trong hóa đơn hoặc
            đánh giá nhầm thuế suất, hàng có thể bị giữ lại, kiểm hóa kéo dài
            hoặc phát sinh phí lưu kho cao. Đó là lý do{" "}
            <strong>Tiximax thông quan hộ</strong> ra đời — nhằm giúp khách xử
            lý toàn bộ thủ tục một cách nhanh – chuẩn – minh bạch, đảm bảo hàng
            được giải phóng sớm và hạn chế tối đa phát sinh.
          </p>

          <p>
            Tiximax có kinh nghiệm thực tế tại nhiều kho hàng lớn, am hiểu quy
            định từng nhóm hàng: hàng cá nhân, hàng thương mại, đồ điện tử, mỹ
            phẩm, thực phẩm khô, hàng mẫu, hàng giá trị cao hoặc hàng cần chứng
            từ chuyên ngành. Nhờ quy trình chuẩn hóa và kiểm tra kỹ từ đầu,
            Tiximax giúp mọi hồ sơ “đi mượt”, ít khi bị yêu cầu bổ sung hoặc
            kiểm hóa lại. Dịch vụ phù hợp cho khách nhập hàng từ Mỹ, Nhật, Hàn
            Quốc, Indonesia cũng như các shop kinh doanh cần thông quan nhanh
            trong ngày để kịp giao đơn cho khách.
          </p>
        </>
      </Section>

      {/* GIỚI THIỆU DỊCH VỤ – trắng (CÓ hiệu ứng) */}
      <Section title="Giới thiệu về dịch vụ Tiximax thông quan hộ" bg="white">
        <>
          <p>
            Dịch vụ thông quan hộ Tiximax được thiết kế đúng tiêu chuẩn hải
            quan, giúp xử lý trọn vẹn mọi yêu cầu từ cơ bản đến phức tạp. Không
            chỉ hỗ trợ khai báo, Tiximax còn tư vấn rõ các rủi ro có thể xảy ra,
            hướng dẫn cách chuẩn bị chứng từ đúng và đảm bảo hồ sơ hoàn chỉnh
            ngay từ bước đầu.
          </p>
          <p>Tiximax hỗ trợ đầy đủ các nghiệp vụ cần thiết:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Kiểm tra chứng từ &amp; xác định mã HS chính xác.</li>
            <li>Tư vấn thuế nhập khẩu – VAT theo từng mặt hàng.</li>
            <li>Khai báo tờ khai trên hệ thống hải quan điện tử.</li>
            <li>Đại diện làm việc với cán bộ hải quan tại sân bay.</li>
            <li>Hỗ trợ kiểm hóa, mở kiện khi được yêu cầu.</li>
            <li>Giải phóng hàng nhanh, hỗ trợ nhận hàng tận nơi.</li>
          </ul>
        </>
      </Section>

      {/* CÁC DỊCH VỤ THÔNG QUAN – xám */}
      <Section title="Các dịch vụ thông quan quốc tế của Tiximax" bg="gray">
        <>
          <p>
            Thời gian xử lý hồ sơ trung bình dao động từ 1–2 ngày, tùy thuộc vào
            loại hàng, mức độ phức tạp và yêu cầu kiểm hóa của từng lô hàng. Với
            những lô hàng đơn giản, Tiximax có thể xử lý trong ngày để hạn chế
            tối đa chi phí lưu kho cho khách.
          </p>
        </>
      </Section>

      {/* THÔNG QUAN ĐƯỜNG BAY – trắng */}
      <Section
        title="Tiximax thông quan đường bay – Xử lý nhanh cho hàng quốc tế"
        bg="white"
      >
        <>
          <p>
            Dịch vụ hải quan đường bay được thiết kế cho hàng hóa nhập khẩu hoặc
            xuất khẩu theo đường hàng không. Tiximax làm việc trực tiếp với hãng
            bay, kho sân bay và bộ phận nghiệp vụ nhằm đảm bảo hàng được tiếp
            nhận – kiểm tra – khai báo – giải phóng nhanh chóng.
          </p>
          <p className="font-semibold mt-2">Phù hợp với:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Hàng nhập khẩu từ Mỹ, Nhật, Hàn Quốc, Indonesia…</li>
            <li>Hàng số lượng lớn từ shop kinh doanh online.</li>
            <li>Hàng gấp trong ngày, yêu cầu tốc độ cao.</li>
            <li>Hàng điện tử, mỹ phẩm, phụ kiện công nghệ, thời trang.</li>
          </ul>
          <p className="font-semibold mt-2">Ưu điểm tuyến đường bay:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Giải phóng hàng nhanh, tránh lưu kho kéo dài.</li>
            <li>Báo giá trước – không phát sinh chi phí mập mờ.</li>
            <li>Quá trình xử lý được cập nhật theo từng bước.</li>
            <li>Phù hợp với các shop nhập hàng liên tục theo lô.</li>
          </ul>
        </>
      </Section>

      {/* THÔNG QUAN TẠI SÂN BAY – xám */}
      <Section
        title="Tiximax thông quan tại sân bay – Hỗ trợ trọn gói từ hồ sơ đến nhận hàng"
        bg="gray"
      >
        <>
          <p>
            Dịch vụ hải quan tại sân bay của Tiximax dành cho khách cần xử lý
            nhanh nhưng không muốn tốn thời gian chờ đợi hay tiếp xúc trực tiếp
            với nhiều bộ phận hải quan. Tiximax thay mặt khách chuẩn bị toàn bộ
            hồ sơ, nộp thuế, làm tờ khai, xử lý các yêu cầu phát sinh và nhận
            hàng trực tiếp trong ngày.
          </p>
          <p className="font-semibold mt-2">Phù hợp với:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Hàng cá nhân, người lần đầu nhập khẩu.</li>
            <li>Hàng thương mại yêu cầu chứng từ chuyên nghiệp.</li>
            <li>Hàng dễ bị yêu cầu kiểm tra chuyên ngành.</li>
            <li>Hàng hiệu, hàng công nghệ, hàng giá trị cao.</li>
          </ul>
          <p className="font-semibold mt-2">Ưu điểm:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Xử lý hồ sơ đồng bộ, đúng quy định.</li>
            <li>Hạn chế rủi ro sai sót giấy tờ.</li>
            <li>Theo dõi tình trạng xử lý liên tục.</li>
            <li>Hỗ trợ giao hàng tận nơi sau khi thông quan.</li>
          </ul>
        </>
      </Section>

      {/* HỖ TRỢ THỦ TỤC – trắng */}
      <Section
        title="Tiximax hỗ trợ đầy đủ thủ tục hải quan tại sân bay"
        bg="white"
      >
        <>
          <p>
            Thủ tục hải quan tại sân bay thường gây khó khăn cho khách lần đầu
            làm việc vì lượng giấy tờ nhiều, kiểm tra gắt gao và yêu cầu thông
            tin chính xác. Tiximax hỗ trợ hướng dẫn từng bước rõ ràng để khách
            chuẩn bị đúng ngay từ đầu.
          </p>
          <p className="font-semibold mt-2">Khách được hướng dẫn cụ thể về:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Bộ chứng từ bắt buộc phải có.</li>
            <li>Danh mục hàng hạn chế – hàng cấm – hàng kiểm tra đặc biệt.</li>
            <li>Thuế nhập khẩu, thuế VAT và cách tính.</li>
            <li>Quy trình kiểm hóa, mở kiện khi được yêu cầu.</li>
            <li>Cách xử lý khi hồ sơ bị yêu cầu bổ sung.</li>
          </ul>
          <p>
            Nhờ đó, khách tiết kiệm đáng kể thời gian và tránh rủi ro hàng bị
            giữ lại quá lâu.
          </p>
        </>
      </Section>

      {/* LÝ DO ĐƯỢC CHỌN – xám */}
      <Section
        title="Lý do dịch vụ thông quan hộ của Tiximax được lựa chọn nhiều"
        bg="gray"
      >
        <>
          <p>Khách hàng tin tưởng Tiximax bởi những ưu điểm nổi bật:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Xử lý hồ sơ nhanh, chính xác và đúng chuẩn.</li>
            <li>Báo giá rõ ràng, không phát sinh chi phí ẩn.</li>
            <li>Kinh nghiệm thực tế tại sân bay nhiều năm.</li>
            <li>Đại diện khách làm việc trực tiếp với cán bộ hải quan.</li>
            <li>Hỗ trợ nhiều loại hàng khác nhau, kể cả hàng đặc thù.</li>
            <li>Theo dõi toàn bộ quá trình và cập nhật liên tục cho khách.</li>
          </ul>
        </>
      </Section>

      {/* QUY TRÌNH – card vàng nhạt */}
      <Section title="Quy trình Tiximax thông quan hộ" bg="white">
        <>
          <div className="space-y-6">
            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Bước 1: Tiếp nhận thông tin hàng hóa &amp; tư vấn hồ sơ ban đầu
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax nhận thông tin về loại hàng, số lượng, chứng từ… và tư
                vấn ngay các yêu cầu cần chuẩn bị, rủi ro có thể gặp và hướng xử
                lý phù hợp.
              </p>
            </div>

            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Bước 2: Kiểm tra chứng từ – báo giá – thống nhất phương án xử lý
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Đội ngũ kiểm tra invoice, packing list, mã HS và thuế suất. Sau
                đó gửi bảng giá chi tiết để khách chốt phương án trước khi tiến
                hành khai báo.
              </p>
            </div>

            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Bước 3: Chuẩn bị giấy tờ &amp; khai báo trên hệ thống một cửa
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax soạn tờ khai điện tử, nhập dữ liệu lên VNACCS, rà soát
                lại toàn bộ để đảm bảo hồ sơ chính xác, hạn chế bị yêu cầu bổ
                sung.
              </p>
            </div>

            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Bước 4: Làm việc với hải quan – hỗ trợ kiểm hóa (nếu có)
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Đại diện khách nộp tờ khai, trao đổi với cán bộ hải quan và trực
                tiếp hỗ trợ kiểm hóa nếu lô hàng được phân luồng đỏ hoặc yêu cầu
                mở kiện.
              </p>
            </div>

            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Bước 5: Giải phóng hàng – giao hàng tận nơi hoặc cho khách tự
                nhận
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Sau khi thông quan, Tiximax nhận hàng tại kho, kiểm tra nhanh và
                bàn giao theo yêu cầu: giao tận nơi hoặc để khách tự nhận tại
                sân bay.
              </p>
            </div>
          </div>
        </>
      </Section>

      {/* FAQ – xám */}
      <Section title="Các câu hỏi thường gặp" bg="gray">
        <>
          <div className="space-y-4">
            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Thông quan hộ có cần chủ hàng đi cùng không?</span>
                <HelpCircle className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Không. Khách không cần đến sân bay. Tiximax đại diện ủy quyền xử
                lý toàn bộ thủ tục, từ nộp tờ khai đến nhận hàng.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Dịch vụ áp dụng cho hàng cá nhân hay thương mại?</span>
                <HelpCircle className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Tiximax hỗ trợ cả hai, từ hàng nhỏ lẻ đến lô hàng lớn.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Chi phí thông quan được tính thế nào?</span>
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Chi phí dựa theo loại hàng, mã HS, thuế suất, độ phức tạp của hồ
                sơ và việc hàng có kiểm hóa hay không. Tiximax cam kết báo giá
                rõ ràng trước khi tiến hành.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Tiximax có hỗ trợ hàng dễ vỡ không?</span>
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Có, nhưng khách cần thông báo trước để Tiximax tăng cường lớp
                bảo vệ, đóng gói chống sốc và ghi chú đặc biệt khi khai báo.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Nếu hồ sơ thiếu hoặc sai thì xử lý thế nào?</span>
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Tiximax hỗ trợ bổ sung và cập nhật hồ sơ ngay để tờ khai được
                duyệt nhanh nhất.
              </p>
            </details>
          </div>
        </>
      </Section>

      {/* KẾT LUẬN + CTA – card vàng nhạt */}
      <section className="py-16 border-t border-amber-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 shadow-sm"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-[3px] w-20 bg-amber-500 rounded-full" />
            </div>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              Nếu bạn đang cần hỗ trợ <strong>Tiximax thông quan hộ</strong>{" "}
              hoặc muốn sử dụng các dịch vụ như{" "}
              <strong>Dịch vụ thông quan hộ Tiximax</strong>,{" "}
              <strong>Thông quan hộ Tiximax</strong>,{" "}
              <strong>Dịch vụ hải quan đường bay</strong>,{" "}
              <strong>Dịch vụ hải quan tại sân bay</strong> hay tư vấn chuyên
              sâu về <strong>Thủ tục hải quan tại sân bay</strong>, Tiximax
              chính là lựa chọn đáng tin cậy. Với quy trình rõ ràng, chi phí
              minh bạch, nghiệp vụ chuyên sâu và khả năng xử lý nhanh – chính
              xác – an toàn, Tiximax cam kết mang đến giải pháp thông quan hiệu
              quả nhất cho mọi loại hàng hóa của bạn.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-2">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700"
              >
                Nhận tư vấn &amp; báo giá thông quan
              </Link>
              <Link
                to="/tracking"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Theo dõi tình trạng lô hàng
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ServicesCustoms;
