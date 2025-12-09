import React from "react";
import { Gavel, Globe2, PackageSearch, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * ServiceAuction.jsx — Tiximax
 * Landing page: Dịch vụ đấu giá Tiximax
 * - Text to, dễ đọc
 * - Title căn giữa
 * - Line phân tách giữa các phần
 */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Section = ({ title, children }) => (
  <motion.section
    className="py-12 border-t border-amber-100 bg-white"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.25 }}
    variants={fadeUp}
  >
    <div className="max-w-5xl mx-auto px-4">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
        {title}
      </h2>
      {/* Line dưới title */}
      <div className="mt-4 mb-8 h-[2px] w-20 mx-auto bg-amber-500 rounded-full" />

      {/* Nội dung */}
      <div className="text-base sm:text-lg leading-relaxed text-gray-700 space-y-4">
        {children}
      </div>
    </div>
  </motion.section>
);

const ServiceAuction = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/40">
      {/* HERO */}
      <motion.section
        className="bg-white border-b border-amber-100"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 md:py-20">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 mb-4">
              <Gavel className="w-5 h-5" />
              <span>Dịch vụ đấu giá Tiximax</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug text-center">
            Dịch vụ đấu giá Tiximax – Dịch vụ đấu giá hàng quốc tế uy tín, đấu
            giá hàng ngoại ship về Việt Nam
          </h1>

          {/* Line dưới H1 */}
          <div className="mt-6 mb-6 h-[2px] w-24 mx-auto bg-amber-500 rounded-full" />

          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed text-center">
            Dịch vụ đấu giá Tiximax hỗ trợ người dùng Việt tham gia đấu giá trên
            các sàn thương mại điện tử lớn như <strong>Yahoo Auction</strong> và{" "}
            <strong>eBay</strong> – hai nền tảng nổi tiếng với lượng sản phẩm
            khổng lồ được cập nhật mỗi ngày và mức độ cạnh tranh đa dạng. Với
            quy trình minh bạch, đội ngũ giàu kinh nghiệm cùng khả năng xử lý
            các tuyến vận chuyển từ Nhật, Mỹ, Hàn và Indonesia về Việt Nam,
            Tiximax mang đến cơ hội sở hữu nhiều mặt hàng chất lượng: từ đồ điện
            tử, đồng hồ, máy ảnh, đồ hiệu cho đến các sản phẩm sưu tầm đặc
            trưng.
          </p>

          <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed text-center">
            Dịch vụ được thiết kế trọn gói từ việc tìm sản phẩm, tư vấn mức giá
            hợp lý, đặt bid theo yêu cầu đến kiểm hàng và vận chuyển về Việt
            Nam. Kể cả khi khách chưa từng đấu giá hàng Nhật, Mỹ, không biết
            ngoại ngữ hay không có tài khoản nội địa,{" "}
            <strong>Dịch Vụ Đấu Giá Tiximax</strong> vẫn hỗ trợ đầy đủ và đảm
            bảo giao dịch an toàn.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/signin"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              Đăng nhập để đấu giá
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm sm:text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              Liên hệ tư vấn nhanh
            </Link>
          </div>

          {/* Nhóm keyword phụ */}
          <div className="mt-8 text-xs sm:text-sm text-gray-500 space-y-2 text-center">
            <p>
              <strong>Key chính:</strong> Dịch vụ đấu giá Tiximax
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full">
                Đấu giá hộ Yahoo Auction
              </span>
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full">
                Đấu giá hộ hàng eBay quốc tế
              </span>
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full">
                Dịch vụ đấu giá hàng quốc tế uy tín
              </span>
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full">
                Đấu giá hàng ngoại ship về Việt Nam
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* GIỚI THIỆU DỊCH VỤ */}
      <Section title="Giới thiệu dịch vụ đấu giá Tiximax">
        <>
          <p>
            Tiximax là đơn vị hỗ trợ đấu giá hộ trên Yahoo Auction và eBay, đồng
            thời vận hành hệ thống vận chuyển quốc tế chuyên 4 tuyến chính: Nhật
            – Việt, Mỹ – Việt, Hàn – Việt và Indonesia – Việt. Với kinh nghiệm
            nhiều năm theo dõi thị trường quốc tế và hiểu cách vận hành của từng
            sàn, Dịch vụ đấu giá Tiximax giúp khách hàng tham gia đấu giá dễ
            dàng hơn, hạn chế rủi ro khi giao dịch xuyên biên giới và tối ưu
            được chi phí khi mua hàng quốc tế.
          </p>
          <p>
            Điểm mạnh của Tiximax nằm ở khả năng phân tích phiên đấu giá, đánh
            giá uy tín người bán, xử lý thanh toán nội địa và hỗ trợ kiểm hàng
            trước khi vận chuyển. Tất cả thông tin, chi phí và quá trình làm
            việc đều được cập nhật rõ ràng để khách hàng nắm được toàn bộ tình
            trạng đơn hàng từ lúc gửi yêu cầu đến khi nhận sản phẩm tại Việt
            Nam.
          </p>
        </>
      </Section>

      {/* ĐỘI NGŨ */}
      <Section title="Giới thiệu về đội ngũ Tiximax">
        <>
          <p>
            Tiximax sở hữu đội ngũ nhân sự tại Nhật và Mỹ phụ trách đặt bid,
            thanh toán nội địa và kiểm hàng trước khi xuất kho. Bộ phận
            logistics hỗ trợ đóng gói, gom hàng và xử lý các thủ tục vận chuyển
            về Việt Nam.
          </p>
          <p>
            Sau khi thắng đấu giá, mỗi sản phẩm đều được kiểm tra kỹ lưỡng và
            chụp ảnh/video theo yêu cầu để khách xác nhận tình trạng hàng hóa.
            Với những khách cần đấu giá hàng ngoại ship về Việt Nam hoặc muốn
            mua các sản phẩm có độ rủi ro cao, Tiximax đặc biệt chú trọng minh
            bạch thông tin nhằm đảm bảo quyền lợi tối đa.
          </p>
        </>
      </Section>

      {/* TẠI SAO ĐƯỢC YÊU THÍCH */}
      <Section title="Tại sao dịch vụ đấu giá Tiximax được yêu thích?">
        <>
          <p>Dịch vụ của Tiximax phù hợp cho những khách hàng muốn:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Săn hàng nội địa với giá tốt.</li>
            <li>Tìm kiếm đồ hiếm, đồ cổ, đồ second-hand chất lượng cao.</li>
            <li>
              Giảm rủi ro khi tự đấu giá hoặc tự xử lý thanh toán quốc tế.
            </li>
            <li>Mua các sản phẩm không bán ở Việt Nam.</li>
            <li>Nhận hỗ trợ kiểm hàng – đóng gói – vận chuyển an toàn.</li>
          </ul>
          <p>
            Tiximax giúp khách hàng tối ưu chi phí và tăng tỉ lệ thắng, đặc biệt
            ở các phiên đấu giá cạnh tranh hoặc các đợt giảm giá lớn của từng
            quốc gia. Đội ngũ sẽ canh phiên sát thời điểm chốt để tăng tỉ lệ
            thắng.
          </p>
        </>
      </Section>

      {/* CÁC DỊCH VỤ CHÍNH */}
      <Section title="Các dịch vụ đấu giá Tiximax cung cấp">
        <>
          <div className="space-y-6">
            {/* Yahoo Auction */}
            <div className="border border-amber-100 rounded-2xl p-5 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Đấu giá Yahoo Auction (Đấu giá hộ Yahoo Auction)
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Yahoo Auction là nền tảng đấu giá lớn và phổ biến, tập trung
                nhiều sản phẩm nội địa chất lượng: đồ điện tử, máy ảnh, đồng hồ,
                linh kiện, hàng hiệu second-hand, figure anime, đồ cổ và hàng
                sưu tầm hiếm.
              </p>
              <p className="mt-2">Tiximax hỗ trợ:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Đặt bid theo yêu cầu.</li>
                <li>Tư vấn mức giá tối ưu.</li>
                <li>Đánh giá độ uy tín seller.</li>
                <li>Theo dõi thời gian thực.</li>
                <li>Thanh toán nội địa và gom hàng tại kho.</li>
              </ul>
              <p className="mt-2">
                Phù hợp cho khách muốn đấu giá hộ Yahoo Auction hoặc tìm những
                mặt hàng nội địa khó mua tại Việt Nam.
              </p>
            </div>

            {/* eBay quốc tế */}
            <div className="border border-amber-100 rounded-2xl p-5 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Đấu giá eBay quốc tế (Đấu giá hộ hàng eBay quốc tế)
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                eBay là sàn đấu giá lớn toàn cầu với nhiều sản phẩm từ Mỹ, Anh,
                Đức, Úc… Bao gồm hàng brand-new, second-hand, đồ sưu tầm
                vintage, linh kiện hiếm và nhiều sản phẩm ngoại nhập khó tìm.
              </p>
              <p className="mt-2">Ưu điểm khi đấu giá eBay qua Tiximax:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Hỗ trợ phân tích lịch sử giá.</li>
                <li>Đánh giá uy tín seller quốc tế.</li>
                <li>Tối ưu thời điểm đặt bid.</li>
                <li>Gom hàng đa quốc gia.</li>
                <li>Vận chuyển về Việt Nam qua tuyến Mỹ – Việt.</li>
              </ul>
              <p className="mt-2">
                Phù hợp cho khách muốn đấu giá hộ eBay quốc tế hoặc săn deal
                hàng Mỹ – Âu chính hãng.
              </p>
            </div>

            {/* Đấu giá hàng ngoại ship về Việt Nam */}
            <div className="border border-amber-100 rounded-2xl p-5 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Đấu giá hàng ngoại ship về Việt Nam
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax hỗ trợ vận chuyển từ 4 tuyến chính: Nhật, Mỹ, Indonesia
                và Hàn Quốc về Việt Nam, với hai hình thức:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Tuyến nhanh: khoảng 3 – 7 ngày.</li>
                <li>
                  Tuyến tiết kiệm: phù hợp đơn hàng số lượng lớn hoặc ít gấp.
                </li>
              </ul>
              <p className="mt-2">
                Tất cả hàng hóa đều được kiểm tra tình trạng tại kho trước khi
                đóng gói, đảm bảo hạn chế tối đa hư hỏng trong quá trình vận
                chuyển quốc tế.
              </p>
            </div>
          </div>
        </>
      </Section>

      {/* QUY TRÌNH */}
      <Section title="Quy trình đấu giá hộ tại Tiximax">
        <>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Bước 1: Gửi link sản phẩm hoặc mô tả chi tiết</strong> –
              Chỉ cần cung cấp link hoặc mô tả ngắn về sản phẩm bạn cần đấu giá,
              Tiximax sẽ nhanh chóng tìm đúng phiên đấu giá uy tín và phù hợp
              nhất. Bạn không cần hiểu cách vận hành của từng sàn – Tiximax hỗ
              trợ toàn bộ.
            </li>
            <li>
              <strong>Bước 2: Nhận báo giá chi tiết</strong> – Tiximax gửi bảng
              báo giá đầy đủ gồm giá dự kiến để thắng phiên, phí dịch vụ, phí
              nội địa và phí vận chuyển quốc tế. Tất cả được phân tách rõ ràng
              để bạn dễ dàng kiểm soát chi phí trước khi quyết định tham gia.
            </li>
            <li>
              <strong>Bước 3: Đấu giá – đàm phán giá tốt</strong> – Tiximax thay
              bạn đặt bid theo mức giá mong muốn, theo dõi phiên theo thời gian
              thực và tối ưu chiến lược đặt giá để tăng khả năng thắng đấu giá
              trong những giây cuối cùng.
            </li>
            <li>
              <strong>Bước 4: Chốt đơn – thanh toán</strong> – Khi phiên đấu giá
              kết thúc và bạn thắng giá, Tiximax tiến hành thanh toán nội địa và
              cập nhật chi tiết tình trạng đơn hàng. Mọi thông tin đều được báo
              lại rõ ràng để bạn dễ theo dõi.
            </li>
            <li>
              <strong>Bước 5: Vận chuyển về Việt Nam</strong> – Sản phẩm được
              vận chuyển về Việt Nam bằng tuyến nhanh hoặc tiết kiệm tùy nhu
              cầu. Tiximax hỗ trợ khai báo hải quan, cập nhật hành trình liên
              tục và giao tận tay khách hàng. Bạn có thể theo dõi đơn hàng dễ
              dàng từ lúc xuất kho nước ngoài cho đến khi nhận tại nhà.
            </li>
          </ol>
        </>
      </Section>

      {/* FAQ */}
      <Section title="Các câu hỏi thường gặp">
        <>
          <div className="space-y-4">
            <details className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-gray-900">
                <span>Nếu đấu giá không thành công thì sao?</span>
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base text-gray-700">
                Bạn sẽ được hoàn 100% số tiền đã đặt cọc hoặc chuyển sang phiên
                đấu giá tiếp theo nếu có nhu cầu.
              </p>
            </details>

            <details className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-gray-900">
                <span>Chi phí vận chuyển và thuế được tính thế nào?</span>
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base text-gray-700">
                Tổng chi phí gồm: giá hàng trúng đấu giá + phí dịch vụ đấu giá
                hộ + phí nội địa + phí vận chuyển về Việt Nam + thuế nhập khẩu
                (nếu áp dụng theo mặt hàng). Tất cả được báo rõ ràng trước khi
                đặt cọc.
              </p>
            </details>

            <details className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-gray-900">
                <span>Có được kiểm tra hàng khi nhận không?</span>
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base text-gray-700">
                Có. Bạn được kiểm tra ngoại quan trước khi nhận. Nếu phát hiện
                hàng sai mô tả hoặc không đúng đơn hàng, Tiximax sẽ hỗ trợ khiếu
                nại hoặc xử lý đổi trả (nếu shop cho phép).
              </p>
            </details>

            <details className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-gray-900">
                <span>Hàng về Việt Nam mất bao lâu?</span>
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base text-gray-700">
                Khoảng 10 – 18 ngày làm việc tùy từng mặt hàng và phương thức
                vận chuyển được chọn. Tiximax cung cấp mã theo dõi để khách kiểm
                tra hành trình đơn hàng.
              </p>
            </details>

            <details className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base font-semibold text-gray-900">
                <span>Có hợp đồng hay cam kết nào không?</span>
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base text-gray-700">
                Tiximax gửi biên nhận giao dịch và hợp đồng dịch vụ qua
                email/Zalo trước khi tiến hành thanh toán hoặc đặt cọc.
              </p>
            </details>
          </div>
        </>
      </Section>

      {/* KẾT LUẬN + CTA */}
      <motion.section
        className="py-12 border-t border-amber-100 bg-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-amber-100 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-sm">
            <div className="flex flex-col items-center text-center gap-3">
              <Globe2 className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Kết luận – Dịch vụ đấu giá Tiximax
              </h2>
              <div className="h-[2px] w-20 bg-amber-500 rounded-full" />
            </div>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
              Dịch vụ đấu giá Tiximax là lựa chọn đáng tin cậy cho khách hàng
              muốn sở hữu hàng ngoại chất lượng với mức giá hợp lý và quy trình
              minh bạch. Nhờ khả năng hỗ trợ đa quốc gia, kiểm hàng kỹ lưỡng và
              vận chuyển linh hoạt, <strong>Dịch Vụ Đấu Giá Tiximax</strong>{" "}
              giúp khách hàng tiếp cận kho hàng quốc tế dễ dàng và an toàn hơn.
              Nếu bạn đang quan tâm <strong>đấu giá hộ Yahoo Auction</strong>,{" "}
              <strong>đấu giá hộ eBay quốc tế</strong>,{" "}
              <strong>dịch vụ đấu giá hàng quốc tế uy tín</strong> hoặc{" "}
              <strong>đấu giá hàng ngoại ship về Việt Nam</strong>, hãy liên hệ
              Tiximax để được tư vấn và báo giá chi tiết.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-2">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
              >
                Đăng nhập để bắt đầu đấu giá
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm sm:text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                Nhận tư vấn & báo giá
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default ServiceAuction;
