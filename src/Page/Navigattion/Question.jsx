import React from "react";
import {
  HelpCircle,
  Globe2,
  PackageSearch,
  ShoppingCart,
  Clock,
  Phone,
  Mail,
  Facebook,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    icon: Globe2,
    question: "1. Tiximax Logistics cung cấp những dịch vụ gì?",
    answer: (
      <>
        <p className="mb-3">
          Tiximax Logistics cung cấp các giải pháp nhập hàng và vận chuyển từ
          các thị trường quốc tế về Việt Nam, bao gồm 4 tuyến chính (Nhật, Indo,
          Mỹ, Hàn):
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">Mua hộ:</span> Mua hàng từ các sàn
            thương mại điện tử lớn (Amazon, Rakuten, Mercari, eBay,
            Shopee/Tokopedia Indo, Coupang/Gmarket KR, v.v.).
          </li>
          <li>
            <span className="font-semibold">Đấu giá hộ:</span> Hỗ trợ đấu giá
            trên các nền tảng đấu giá quốc tế (đặc biệt là Yahoo Auction Japan).
          </li>
          <li>
            <span className="font-semibold">Thanh toán hộ:</span> Hỗ trợ thanh
            toán các giao dịch yêu cầu thẻ hoặc phương thức thanh toán nội địa.
          </li>
          <li>
            <span className="font-semibold">Ký gửi hàng:</span> Nhận và lưu kho
            hàng tại các kho quốc tế của Tiximax.
          </li>
          <li>
            <span className="font-semibold">
              Vận chuyển trọn gói (Logistics):
            </span>{" "}
            Vận chuyển hàng hóa từ các kho quốc tế về Việt Nam và giao hàng tận
            nơi.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 2,
    icon: ShoppingCart,
    question: "2. Làm sao để sử dụng dịch vụ mua hộ tại Tiximax Logistics?",
    answer: (
      <>
        <p className="mb-3">
          Quy trình mua hộ hàng hóa quốc tế của chúng tôi rất đơn giản:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">Gửi thông tin:</span> Gửi link sản
            phẩm (từ các sàn quốc tế), ảnh sản phẩm và số lượng cần mua.
          </li>
          <li>
            <span className="font-semibold">Báo giá:</span> Tiximax Logistics sẽ
            báo giá chi tiết (Giá sản phẩm + Phí dịch vụ + Phí vận chuyển về
            Việt Nam).
          </li>
          <li>
            <span className="font-semibold">Xác nhận và Thanh toán:</span> Khách
            hàng xác nhận đơn hàng và thanh toán/đặt cọc theo hướng dẫn.
          </li>
          <li>
            <span className="font-semibold">Đặt hàng:</span> Tiximax Logistics
            tiến hành đặt hàng ngay lập tức.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    icon: PackageSearch,
    question:
      "3. Dịch vụ đấu giá hộ trên sàn Nhật (Yahoo Auction) hoạt động ra sao?",
    answer: (
      <>
        <p className="mb-3">
          Chúng tôi chuyên hỗ trợ đấu giá trên sàn Yahoo Auction Japan và các
          nền tảng đấu giá khác.
        </p>
        <p className="mb-3">
          <span className="font-semibold">Quy trình:</span> Gửi link sản phẩm
          đấu giá → Nhận báo giá và tư vấn chiến lược đấu giá → Tiximax thực
          hiện đấu giá thay bạn → Thanh toán (nếu thắng đấu giá) → Vận chuyển về
          Việt Nam.
        </p>
        <p className="text-sm md:text-base text-gray-700">
          <span className="font-semibold">Lưu ý:</span> Sau khi bạn đã xác nhận
          tham gia đấu giá, bạn không thể hủy khi phiên đấu vẫn đang diễn ra
          hoặc nếu bạn đã thắng phiên đấu đó.
        </p>
      </>
    ),
  },
  {
    id: 4,
    icon: Clock,
    question:
      "4. Thời gian vận chuyển hàng trung bình từ các tuyến về Việt Nam là bao lâu?",
    answer: (
      <>
        <p className="mb-2">
          Thời gian vận chuyển trung bình từ kho quốc tế về Việt Nam là:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">Tuyến Nhật – Việt:</span> Khoảng 7
            đến 10 ngày làm việc.
          </li>
          <li>
            <span className="font-semibold">
              Các tuyến khác (Mỹ, Hàn, Indo):
            </span>{" "}
            Từ 7 đến 15 ngày làm việc, tùy thuộc vào phương thức vận chuyển
            (bay/biển) và quy trình thông quan tại Việt Nam.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 5,
    icon: PackageSearch,
    question: "5. Tôi có thể theo dõi đơn hàng của mình như thế nào?",
    answer: (
      <>
        <p className="mb-3">
          Tiximax Logistics cung cấp mã vận đơn (Tracking number). Bạn nhập mã
          này trên hệ thống theo dõi đơn hàng của chúng tôi để xem trạng thái
          đơn hàng theo thời gian thực:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hàng về kho quốc tế.</li>
          <li>Đang vận chuyển về Việt Nam.</li>
          <li>Đang thông quan/Phân loại tại Việt Nam.</li>
          <li>Đang giao nội địa.</li>
        </ul>
      </>
    ),
  },
  {
    id: 6,
    icon: HelpCircle,
    question: "6. Tôi có được kiểm tra hàng khi nhận không?",
    answer: (
      <p className="text-base md:text-lg">
        Có. Bạn được kiểm tra ngoại quan (tình trạng bên ngoài kiện hàng, số
        lượng, mẫu mã) trước khi ký nhận. Nếu phát hiện hàng sai mô tả hoặc hư
        hỏng, vui lòng thông báo ngay cho nhân viên giao hàng và bộ phận hỗ trợ
        của Tiximax để được hỗ trợ xử lý khiếu nại kịp thời.
      </p>
    ),
  },
  {
    id: 7,
    icon: Globe2,
    question:
      "7. Tôi cần cung cấp thông tin gì khi muốn ký gửi hàng vào kho quốc tế?",
    answer: (
      <p className="text-base md:text-lg">
        Bạn cần xin địa chỉ kho quốc tế của Tiximax (tại Nhật, Mỹ, Hàn, hoặc
        Indo) và đảm bảo ghi đúng mã khách hàng của bạn lên kiện hàng. Mã này là
        yếu tố bắt buộc giúp chúng tôi nhận diện, nhập kho và xử lý hàng của bạn
        chính xác.
      </p>
    ),
  },
  {
    id: 8,
    icon: PackageSearch,
    question: "8. Những mặt hàng nào Tiximax Logistics không nhận vận chuyển?",
    answer: (
      <>
        <p className="mb-3">
          Chúng tôi không nhận vận chuyển các mặt hàng bị cấm theo quy định của
          nước xuất khẩu, Việt Nam, và quy định của hãng vận chuyển quốc tế (ví
          dụ: vũ khí, chất nổ, chất cấm, văn hóa phẩm đồi trụy, hàng giả/vi phạm
          bản quyền).
        </p>
        <p className="text-base md:text-lg">
          Đối với các mặt hàng đặc thù như mỹ phẩm, thực phẩm chức năng, đồ điện
          tử có pin, vui lòng liên hệ để được tư vấn về giới hạn số lượng và thủ
          tục thông quan chi tiết cho từng tuyến.
        </p>
      </>
    ),
  },
  {
    id: 9,
    icon: PackageSearch,
    question:
      "9. Tiximax Logistics có hỗ trợ đóng gói và gia cố hàng hóa không?",
    answer: (
      <>
        <p className="mb-3">
          Có. Tiximax Logistics hỗ trợ các dịch vụ tại kho quốc tế:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Đóng gói lại theo tiêu chuẩn vận chuyển quốc tế.</li>
          <li>
            Bọc chống sốc, gia cố hàng dễ vỡ, chống ẩm (có thể tính thêm phí vật
            liệu).
          </li>
          <li>
            Gom nhiều đơn hàng nhỏ vào một kiện lớn để tối ưu hóa chi phí vận
            chuyển.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 10,
    icon: ShoppingCart,
    question: "10. Phí dịch vụ của Tiximax Logistics được tính như thế nào?",
    answer: (
      <>
        <p className="mb-3">
          Tổng chi phí bạn thanh toán sẽ bao gồm các khoản sau:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Giá gốc sản phẩm (theo giá niêm yết của shop).</li>
          <li>Phí dịch vụ mua hộ/đấu giá hộ (phí xử lý đơn hàng).</li>
          <li>
            Phí vận chuyển quốc tế (tính theo trọng lượng thực hoặc trọng lượng
            quy đổi thể tích).
          </li>
          <li>Phí xử lý/Thông quan (nếu có, tùy từng loại hàng và tuyến).</li>
        </ul>
        <p className="mt-3 text-base md:text-lg">
          Tiximax Logistics luôn cam kết báo giá trọn gói bằng tiền Việt Nam
          (VND) trước khi bạn xác nhận đơn hàng, đảm bảo không có phí ẩn.
        </p>
      </>
    ),
  },
  {
    id: 11,
    icon: Globe2,
    question:
      "11. Tiximax Logistics có nhiều website đúng không? Sự khác biệt giữa Tiximax.net và các trang tuyến dịch vụ (ví dụ: Tiximax.jp) là gì?",
    answer: (
      <>
        <p className="mb-3">
          Đúng, Tiximax hoạt động với một hệ thống các website chuyên biệt để
          tối ưu trải nghiệm người dùng:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">
              Tiximax Logistics (tiximax.net):
            </span>{" "}
            Là cổng thông tin chính và thương hiệu mẹ, chịu trách nhiệm quản lý
            chung và cung cấp thông tin tổng quan về 4 tuyến dịch vụ (Nhật,
            Indo, Mỹ, Hàn).
          </li>
          <li>
            <span className="font-semibold">
              Các website chuyên biệt (ví dụ: tiximax.jp, tiximax.us,
              tiximax.kr):
            </span>{" "}
            Là các trang được thiết kế riêng để cung cấp thông tin chi tiết, báo
            giá, tỷ giá chuyên sâu cho từng tuyến dịch vụ cụ thể.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 12,
    icon: Phone,
    question: "12. Làm sao để liên hệ Tiximax Logistics khi cần hỗ trợ?",
    answer: (
      <>
        <p className="mb-3">
          Bạn có thể liên hệ với đội ngũ Tiximax Logistics qua các kênh sau (vui
          lòng kiểm tra giờ làm việc):
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">Hotline Hỗ trợ:</span> 090 183 42
            83.
          </li>
          <li>
            <span className="font-semibold">Email Hỗ trợ:</span>{" "}
            global.trans@tiximax.net.
          </li>
          <li>
            <span className="font-semibold">Website:</span>{" "}
            <a
              href="https://tiximax.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              https://tiximax.net
            </a>
          </li>
          <li>
            <span className="font-semibold">Kênh mạng xã hội:</span>{" "}
            <a
              href="https://www.facebook.com/tiximax.logistics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              https://www.facebook.com/tiximax.logistics
            </a>
          </li>
        </ul>
        <p className="mt-3 text-base md:text-lg">
          Nếu bạn còn bất kỳ thắc mắc nào ngoài các câu hỏi thường gặp này, đừng
          ngần ngại liên hệ với nhân viên hỗ trợ của Tiximax Logistics. Chúng
          tôi luôn sẵn lòng hỗ trợ!
        </p>
      </>
    ),
  },
];

const Question = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HERO / HEADER */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-3xl shadow-xl py-10 md:py-14 px-6 md:px-14 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              CÂU HỎI THƯỜNG GẶP (FAQ)
            </h1>
            <p className="text-lg md:text-2xl text-gray-800 max-w-3xl mx-auto">
              Tiximax Logistics – Giải pháp logistics quốc tế, mua hộ, đấu giá
              hộ và vận chuyển đa tuyến (Nhật, Indo, Mỹ, Hàn) về Việt Nam.
            </p>
          </div>
        </section>

        {/* INTRO TEXT */}
        <section className="mb-10 text-gray-800 max-w-4xl mx-auto">
          <p className="text-base md:text-lg leading-relaxed text-center">
            Dưới đây là các câu hỏi thường gặp giúp bạn hiểu rõ hơn về dịch vụ
            của chúng tôi. Nếu vẫn còn thắc mắc, hãy liên hệ trực tiếp đội ngũ
            Tiximax để được hỗ trợ chi tiết.
          </p>
        </section>

        {/* FAQ LIST */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-yellow-200">
            <HelpCircle className="w-7 h-7 text-yellow-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Danh sách câu hỏi thường gặp
            </h2>
          </div>

          <div className="space-y-8">
            {faqs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="border-l-4 border-yellow-500 pl-5 md:pl-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">
                      <Icon className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {item.question}
                    </h3>
                  </div>
                  <div className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTACT CTA */}
          <div className="mt-12 pt-8 border-t border-yellow-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="font-semibold text-gray-900 text-base md:text-lg">
                    Cần hỗ trợ thêm?
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    Liên hệ trực tiếp để được tư vấn chi tiết cho từng đơn hàng
                    cụ thể.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:ml-auto">
                <a
                  href="tel:0901834283"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-sm md:text-base font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Hotline: 090 183 42 83
                </a>
                <a
                  href="mailto:global.trans@tiximax.net"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 text-sm md:text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email: global.trans@tiximax.net
                </a>
                <a
                  href="https://www.facebook.com/tiximax.logistics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 text-sm md:text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Fanpage Tiximax
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Question;
