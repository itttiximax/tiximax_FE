import React from "react";
import {
  ShoppingBag,
  ShieldCheck,
  DollarSign,
  HelpCircle,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Thêm noMotion để tắt hiệu ứng cho section cần
const Section = ({ title, bg = "white", children, noMotion = false }) => (
  <section
    className={`py-16 border-t border-amber-100 ${
      bg === "gray" ? "bg-gray-50" : "bg-white"
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {noMotion ? (
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

const ServicesPurchase = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/40">
      {/* HERO – đồng bộ style với AboutUs / ServicesStorage */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-amber-900/30">
        {/* overlay glow */}
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
                <span>Dịch vụ mua hộ Tiximax</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight text-center">
              Tiximax Mua Hộ – Dịch vụ mua hộ hàng quốc tế minh bạch, an toàn,
              tối ưu cho bạn
            </h1>

            <div className="mt-2 mb-2 h-[3px] w-24 mx-auto bg-amber-500 rounded-full" />
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700"
              >
                Liên hệ tư vấn mua hộ
              </Link>
              <Link
                to="/tracking"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Tra cứu đơn hàng
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GIỚI THIỆU DỊCH VỤ – trắng, KHÔNG hiệu ứng */}
      <Section bg="white" noMotion>
        <>
          <p>
            Tiximax là đơn vị cung cấp dịch vụ mua hộ chuyên tuyến giữa Việt Nam
            và các thị trường lớn: Nhật, Indonesia, Hàn Quốc, Mỹ. Am hiểu sàn
            thương mại địa phương, có tài khoản mua hàng, đội ngũ chúng tôi tự
            tin có thể làm hài lòng bạn với kinh nghiệm xử lý thủ tục xuất nhập
            khẩu đã tích lũy.
          </p>
          <p>
            Dịch vụ <strong>Tiximax mua hộ</strong> tập trung vào: tìm đúng link
            sản phẩm, mua theo yêu cầu, gom hàng tại kho, vận chuyển quốc tế và
            giao tận tay khách hàng. Với thế mạnh là minh bạch báo giá, tư vấn
            chi tiết, có tùy chọn gói bảo hiểm hàng hóa, Tiximax sẽ giúp bạn
            giảm rủi ro khi dùng dịch vụ mua hộ.
          </p>
        </>
      </Section>

      {/* ĐỘI NGŨ – xám */}
      <Section title="Giới thiệu về đội ngũ Tiximax" bg="gray">
        <>
          <p>
            Đội ngũ chúng tôi gồm nhân viên mua hàng địa phương, nhân sự kiểm
            hàng, và bộ phận logistics quốc tế. Họ có kinh nghiệm làm việc trực
            tiếp trên nhiều sàn như Rakuten, Mercari, Tokopedia, Coupang,
            Amazon,...
          </p>
          <p>
            Cam kết kiểm tra tình trạng trước khi xuất kho, báo cáo bằng
            ảnh/video khi mua thành công, Tiximax đảm bảo sự minh bạch trong
            từng bước. Nếu bạn cần <strong>tiximax mua hàng nhật</strong>, mua
            hàng Hàn Quốc hay Mỹ, đội ngũ sẽ tư vấn chi tiết về bảo hành và các
            chi phí cụ thể trước khi chốt đơn.
          </p>
        </>
      </Section>

      {/* TẠI SAO ĐƯỢC YÊU THÍCH – trắng */}
      <Section
        title="Tại sao dịch vụ Tiximax mua hộ được yêu thích?"
        bg="white"
      >
        <>
          <p>Tiximax là lựa chọn được yêu thích của những người muốn:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Săn hàng giá tốt, tìm kiếm mẫu mã nội địa độc đáo.</li>
            <li>
              Mua đồ trên các sàn thương mại điện tử vào các ngày sale lớn.
            </li>
            <li>Tránh các thủ tục phức tạp khi mua hàng quốc tế.</li>
            <li>Sở hữu các mặt hàng không kinh doanh tại Việt Nam.</li>
          </ul>
          <p>
            Tiximax sẽ xử lý toàn bộ các quy trình: tìm link, đặt hàng bằng tài
            khoản nội địa, gom hàng và vận chuyển. Khi bạn muốn Tiximax mua hàng
            Nhật, Hàn, Mỹ,… vào các mùa sale như Black Friday, Tiximax sẽ theo
            dõi mã khuyến mãi, tối ưu chi phí ship để bạn hưởng lợi.
          </p>
        </>
      </Section>

      {/* CÁC DỊCH VỤ MUA HỘ – xám */}
      <Section title="Khám phá các dịch vụ mua hộ Tiximax cung cấp" bg="gray">
        <>
          <p>
            Tiximax cung cấp gói dịch vụ linh hoạt theo tuyến và theo nhu cầu
            khách:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Mua hộ lẻ (1–2 món) hoặc đơn hàng số lượng lớn.</li>
            <li>Săn sale (Black Friday, Cyber Monday).</li>
            <li>
              Mua hộ theo yêu cầu: kiểm hàng, chụp ảnh/video, đóng gói kỹ.
            </li>
          </ul>
          <p>
            Để tìm hiểu cụ thể thông tin dịch vụ, hãy tiếp tục xem chi tiết từng
            tuyến mua hộ dưới đây.
          </p>

          <div className="mt-6 space-y-6">
            {/* Nhật */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Tiximax mua hộ hàng Nhật
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax hỗ trợ mua trên Rakuten, Mercari, Amazon Nhật và các chợ
                nội địa. Đặc điểm: nhiều mặt hàng độc đáo, hàng second-hand chất
                lượng, và phiên bản Nhật của một số sản phẩm.
              </p>
              <p className="mt-2">
                Tiximax có tài khoản mua hàng, kinh nghiệm đấu giá, và quy trình
                kiểm hàng tại kho Nhật. Báo giá bao gồm: giá gốc, phí mua hộ,
                phí gom hàng, phí vận chuyển quốc tế và VAT dự kiến nếu có.
                Chính sách minh bạch giúp khách yên tâm khi order hàng Nhật.
              </p>
            </div>

            {/* Indonesia */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Mua hộ hàng Indonesia Tiximax
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax mua hộ trên Tokopedia, Shopee Indonesia, Lazada
                Indonesia và nhiều sàn địa phương. Ưu thế: tiếp cận hàng nội địa
                Indonesia, đồ gia dụng, nội thất và phụ kiện độc đáo.
              </p>
              <p className="mt-2">
                Tiximax hỗ trợ gửi hai chiều Indonesia ↔ Việt Nam, xử lý đóng
                gói chuyên cho hàng dễ vỡ và cồng kềnh. Khi bạn cần{" "}
                <strong>tiximax mua hàng Indonesia</strong>, đội sẽ báo rõ chi
                phí vận chuyển nội địa, phí xuất khẩu và phí nhập khẩu về VN để
                bạn so sánh tổng chi phí.
              </p>
            </div>

            {/* Hàn Quốc */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Tiximax mua hộ hàng Hàn Quốc
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax mua hàng trên Coupang, Gmarket, Amazon Hàn; chuyên săn
                sale mỹ phẩm, quần áo và giày. Dịch vụ hỗ trợ kiểm mã hàng, so
                sánh nhà bán, và hướng dẫn chọn size chuẩn khi mua thời trang.
              </p>
              <p className="mt-2">
                Với hàng mỹ phẩm, Tiximax lưu ý chính sách hạn sử dụng và thành
                phần. Đây là lựa chọn phù hợp nếu bạn muốn nhập số lượng nhỏ
                hoặc mua lẻ.
              </p>
            </div>

            {/* Mỹ */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Tiximax mua hộ hàng Mỹ
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax hỗ trợ mua trên Amazon Mỹ, eBay và theo dõi sự kiện sale
                lớn (Black Friday, Cyber Monday). Ưu điểm: tiếp cận hàng giá
                tốt, hàng brand chính hãng.
              </p>
              <p className="mt-2">
                Tiximax xử lý: mua hộ, kiểm hàng, gom nhiều đơn nhỏ để tối ưu
                chi phí vận chuyển và khai báo hải quan. Khi mua hàng Mỹ, lưu ý
                phí ship nội Mỹ, phí ship quốc tế, và chính sách trả hàng của
                nhà bán.
              </p>
            </div>
          </div>
        </>
      </Section>

      {/* LÝ DO NÊN CHỌN – trắng */}
      <Section title="Tại sao nên chọn dịch vụ Tiximax mua hộ?" bg="white">
        <>
          <p>Sau đây là những ưu điểm nổi bật của dịch vụ mua hộ Tiximax:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Kinh nghiệm chuyên tuyến:</strong> xử lý hiệu quả Nhật -
              Việt, Indonesia - Việt, Hàn - Việt, Mỹ - Việt.
            </li>
            <li>
              <strong>Phạm vi sàn đa dạng:</strong> Tokopedia, Shopee ID,
              Rakuten, Mercari, Coupang, Amazon, eBay.
            </li>
            <li>
              <strong>Hỗ trợ tận tình:</strong> tư vấn sản phẩm, kiểm tra mẫu
              mã, kích thước và chính sách bảo hành trước khi mua.
            </li>
            <li>
              <strong>Minh bạch báo giá:</strong> tách rõ giá hàng, phí mua hộ,
              phí vận chuyển và thuế dự kiến.
            </li>
            <li>
              <strong>Chính sách bảo hiểm & hậu mãi:</strong> tùy chọn mua bảo
              hiểm, quy trình khiếu nại rõ ràng.
            </li>
          </ul>
          <p>
            Những yếu tố này tối thiểu hóa rủi ro cho khách hàng cá nhân và
            doanh nghiệp nhập hàng, giúp bạn biết chính xác{" "}
            <strong>tiximax mua hàng hộ</strong> có hữu ích hay không.
          </p>
        </>
      </Section>

      {/* QUY TRÌNH CHUNG – xám */}
      <Section title="Quy trình mua hộ quốc tế của Tiximax" bg="gray">
        <>
          <p>
            Quy trình chuẩn gồm:{" "}
            <strong>
              gửi link sản phẩm → nhận báo giá chi tiết → thanh toán đặt cọc →{" "}
              Tiximax mua hộ và gom hàng tại kho nước ngoài → vận chuyển về VN →{" "}
              giao hàng tận tay và hỗ trợ hậu mãi.
            </strong>
          </p>
          <p>
            Thời gian dòng hàng sẽ tùy tuyến. Ví dụ tuyến Nhật thường 3 - 7 ngày
            sau khi xuất kho; tuyến Mỹ/Indonesia có thể lâu hơn. Mỗi bước có
            biên nhận rõ ràng để bảo vệ quyền lợi khách hàng.
          </p>
        </>
      </Section>

      {/* CÁC BƯỚC CHI TIẾT – card vàng giống QUY TRÌNH ký gửi kho */}
      <Section
        title="Các bước chi tiết trong dịch vụ Tiximax mua hộ"
        bg="white"
      >
        <>
          <div className="space-y-6">
            {/* Gửi link */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Gửi link sản phẩm
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Gửi link trực tiếp từ sàn hoặc chụp ảnh sản phẩm kèm mô tả (màu,
                size, mã SKU). Nếu bạn không biết cách lấy link, Tiximax hướng
                dẫn chi tiết cách copy link trên từng sàn.
              </p>
              <p className="mt-2">
                Lưu ý cung cấp thông tin bổ sung: số lượng, yêu cầu đóng gói, ưu
                tiên nhà bán có rating cao.
              </p>
            </div>

            {/* Báo giá */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Nhận báo giá chi tiết
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Tiximax sẽ gửi báo giá phân tách: giá sản phẩm, phí mua hộ, phí
                vận chuyển nội địa, phí vận chuyển quốc tế, thuế/hải quan ước
                tính, phí bảo hiểm (nếu có).
              </p>
              <p className="mt-2">
                Yêu cầu báo giá bằng văn bản (Zalo) để làm căn cứ thanh toán.
                Bạn nên so sánh ít nhất 2 báo giá trước khi đồng ý.
              </p>
            </div>

            {/* Thanh toán */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Thanh toán đơn hàng
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Khi xác nhận, khách thanh toán đặt cọc theo tỉ lệ thỏa thuận
                (thường 30–70%). Tiximax cung cấp hợp đồng dịch vụ, biên lai đặt
                cọc và lịch mua hàng.
              </p>
              <p className="mt-2">
                Thanh toán phần còn lại khi hàng về hoặc theo điều khoản đã ký.
              </p>
            </div>

            {/* Gom & vận chuyển */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Gom và vận chuyển hàng về Việt Nam
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Hàng sẽ được gom tại kho nước ngoài, kiểm hàng trước khi xuất.
                Tiximax tổ chức các chuyến gom định kỳ (ví dụ tuyến Nhật 3
                chuyến/tuần).
              </p>
              <p className="mt-2">
                Hàng về Việt Nam sẽ qua thủ tục hải quan, sau đó khách hàng sẽ
                nhận thông báo mã vận đơn và lịch giao cụ thể. Thời gian nhận
                hàng sẽ phụ thuộc tuyến và thủ tục hải quan. Tiximax cập nhật
                tiến độ liên tục để bạn nắm được thông tin đơn hàng.
              </p>
            </div>

            {/* Giao hàng & hậu mãi */}
            <div className="border border-amber-200 rounded-2xl p-6 bg-amber-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                Giao tận tay và hậu mãi
              </h3>
              <div className="mt-3 h-[2px] w-16 mx-auto bg-amber-500 rounded-full" />
              <p className="mt-3">
                Hàng đặt về sẽ được Tiximax giao tận nhà (hoặc bạn có thể chọn
                tự đến lấy). Khách kiểm tra ngay khi nhận. Nếu phát hiện hư hỏng
                hoặc sai mô tả, bạn có thể mở khiếu nại theo chính sách bảo
                hiểm/hoàn tiền.
              </p>
              <p className="mt-2">
                Để được hỗ trợ tốt nhất, bạn có thể lựa chọn gói bảo hiểm hàng
                hóa của Tiximax. Và đừng quên lưu giữ ảnh/video làm chứng từ khi
                cần khiếu nại.
              </p>
            </div>
          </div>
        </>
      </Section>

      {/* FAQ – xám */}
      <Section
        title="Những câu hỏi thường gặp về dịch vụ mua hộ hàng Tiximax"
        bg="gray"
      >
        <>
          <p>
            Phần FAQ này sẽ giải đáp các thắc mắc phổ biến: order lẻ, cách tính
            phí, chính sách hoàn/đền, mặt hàng bị từ chối, hỗ trợ COD cho khách
            hàng quan tâm.
          </p>

          <div className="mt-4 space-y-4">
            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Tiximax có nhận order 1 - 2 món lẻ không?</span>
                <HelpCircle className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Có. Tiximax nhận order lẻ từ 1 sản phẩm, không yêu cầu số lượng
                lớn. Tuy nhiên phí tối thiểu có thể áp dụng cho các đơn quá nhỏ
                để bù chi phí vận hành. Để đảm bảo quyền lợi, bạn nên hỏi rõ phí
                tối thiểu trước khi nhờ Tiximax mua hộ hàng hóa.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Phí mua hộ được tính cụ thể như thế nào?</span>
                <DollarSign className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Tiximax có bảng phí theo tuyến. Công thức cơ bản:
              </p>
              <p className="mt-1 text-base sm:text-lg text-gray-700">
                <strong>
                  Tổng = Giá hàng + Phí mua hộ (phần trăm hoặc cố định) + Phí
                  vận chuyển nội địa + Phí vận chuyển quốc tế + Thuế/khai báo +
                  Phí bảo hiểm (tuỳ chọn).
                </strong>
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Để được tư vấn cụ thể, hãy liên hệ hotline{" "}
                <strong>0901 834 283</strong> và nhận báo giá từ nhân viên của
                Tiximax.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Chính sách mua hộ của Tiximax như thế nào?</span>
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Tiximax áp dụng chính sách bảo hiểm và hoàn tiền tùy trường hợp:
                hư hỏng trong vận chuyển, sai sản phẩm do nhà bán, hoặc hàng bị
                giữ hải quan do thiếu chứng từ (tùy nguyên nhân). Chi tiết điều
                kiện sẽ được tư vấn rõ ràng trong quá trình trao đổi với nhân
                viên của chúng tôi.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>Những mặt hàng nào bị từ chối mua hộ tại Tiximax?</span>
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Các mặt hàng bị cấm theo quy định của Nhà nước Việt Nam và nước
                xuất xứ sẽ không được Tiximax mua hộ. Ví dụ: hàng cấm xuất nhập
                khẩu, vũ khí, chất dễ cháy/nổ, thuốc lá lậu, chất cấm. Hãy liên
                hệ Tiximax để hỏi thêm nếu sản phẩm bạn quan tâm có nghi vấn.
              </p>
            </details>

            <details className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer text-base sm:text-lg font-semibold text-gray-900">
                <span>TIXIMAX có hỗ trợ COD không?</span>
                <Truck className="w-5 h-5 text-amber-600" />
              </summary>
              <p className="mt-2 text-base sm:text-lg text-gray-700">
                Có. Với sản phẩm giao về Việt Nam, Tiximax hỗ trợ giao COD tận
                tay khách nếu quy trình vận chuyển và thanh toán nội bộ cho
                phép. Liên hệ trước để xác nhận điều kiện COD cho đơn hàng cụ
                thể.
              </p>
            </details>
          </div>
        </>
      </Section>

      {/* KẾT LUẬN + CTA – trắng, card vàng nhạt */}
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
              <strong>TIXIMAX mua hộ</strong> là lựa chọn tốt nếu bạn muốn mua
              hàng quốc tế mà không phải xử lý rào cản kỹ thuật và thủ tục. Điểm
              mạnh nằm ở kinh nghiệm chuyên tuyến, minh bạch báo giá và hậu mãi.
              Trước khi đặt cọc, hãy yêu cầu báo giá chi tiết, hợp đồng dịch vụ
              và hình ảnh/biên nhận mua hàng. Nếu bạn đang tìm mua hàng Nhật,
              Indonesia, hàng Hàn Quốc hay Mỹ, liên hệ Tiximax ngay để nhận báo
              giá miễn phí!
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-2">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700"
              >
                Nhận tư vấn & báo giá mua hộ
              </Link>
              <Link
                to="/tracking"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Theo dõi đơn mua hộ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPurchase;
