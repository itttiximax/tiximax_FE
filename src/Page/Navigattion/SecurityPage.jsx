import React from "react";

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* HERO / HEADER */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-3xl shadow-xl py-10 md:py-12 px-6 md:px-12 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              CHÍNH SÁCH BẢO MẬT – TIXIMAX LOGISTICS
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto">
              Tiximax Logistics cam kết bảo vệ dữ liệu cá nhân và thông tin giao
              dịch của khách hàng trong suốt quá trình sử dụng dịch vụ.
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12 space-y-10 text-gray-800">
          {/* Intro */}
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-semibold">
                Tiximax Logistics (Tiximax.net)
              </span>{" "}
              là doanh nghiệp hoạt động trong lĩnh vực logistics quốc tế và
              thương mại điện tử xuyên biên giới, chuyên cung cấp các giải pháp
              vận chuyển, mua hộ, thanh toán và đấu giá quốc tế cho khách hàng
              cá nhân, cửa hàng trực tuyến và doanh nghiệp.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Trong suốt quá trình cung cấp dịch vụ, chúng tôi luôn coi trọng
              việc bảo vệ dữ liệu cá nhân và thông tin giao dịch của khách hàng.
              Chính sách bảo mật này được xây dựng nhằm giúp bạn hiểu rõ cách
              Tiximax Logistics thu thập, sử dụng, lưu trữ và bảo vệ thông tin
              cá nhân khi bạn sử dụng dịch vụ của chúng tôi.
            </p>
          </div>

          {/* 1. Mục đích và phạm vi thu thập */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              1. Mục đích và phạm vi thu thập thông tin
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Trong quá trình sử dụng dịch vụ tại website/ứng dụng của Tiximax
              Logistics, chúng tôi có thể thu thập các thông tin sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                <span className="font-semibold">Thông tin khách hàng:</span> Họ
                và tên khách hàng, tên đăng nhập (nếu có), mật khẩu đăng nhập
                (khách hàng tự tạo), số điện thoại liên hệ, địa chỉ email.
              </li>
              <li>
                <span className="font-semibold">Thông tin giao nhận:</span> Địa
                chỉ nhận hàng, người nhận, số điện thoại người nhận, v.v. (Thông
                tin này là bắt buộc để thực hiện dịch vụ logistics).
              </li>
              <li>
                <span className="font-semibold">Thời điểm thu thập:</span> Khi
                bạn đăng ký sử dụng hệ thống dịch vụ của Tiximax Logistics, đặt
                hàng, hoặc sử dụng các tính năng trên website/app.
              </li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-semibold">Lưu ý quan trọng:</span> Trong quá
              trình thực hiện giao dịch/thanh toán, Tiximax Logistics chỉ lưu
              giữ các thông tin chi tiết về đơn hàng đã thanh toán và cam kết
              không lưu giữ thông tin về số tài khoản ngân hàng hoặc số thẻ ngân
              hàng của khách hàng.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-semibold">Trách nhiệm của Khách hàng:</span>{" "}
              Khách hàng có trách nhiệm tự bảo mật tên đăng nhập, mật khẩu và
              hộp thư điện tử cá nhân của mình. Nếu phát hiện có hành vi lạm
              dụng, sử dụng trái phép hoặc vi phạm bảo mật từ bên thứ ba, bạn
              cần thông báo kịp thời cho Tiximax Logistics để chúng tôi phối hợp
              xử lý.
            </p>
          </div>

          {/* 2. Phạm vi sử dụng thông tin */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              2. Phạm vi sử dụng thông tin
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax Logistics cam kết không sử dụng thông tin cá nhân của bạn
              cho các mục đích ngoài những gì đã được nêu. Cụ thể, thông tin thu
              thập được sử dụng cho các mục đích sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                Cung cấp các sản phẩm/dịch vụ logistics (vận chuyển, mua hộ, đấu
                giá) mà bạn đăng ký tại Tiximax Logistics.
              </li>
              <li>
                Gửi thông báo liên quan tới hoạt động, chương trình ưu đãi,
                khuyến mại (nếu bạn đồng ý nhận thông báo).
              </li>
              <li>
                Liên lạc, hỗ trợ và giải quyết tình huống phát sinh trong quá
                trình sử dụng dịch vụ (ví dụ: thông báo tình trạng đơn hàng,
                giải quyết khiếu nại vận chuyển).
              </li>
              <li>
                Ngăn chặn, phát hiện các hoạt động giả mạo, phá hoại tài khoản
                người dùng hoặc vi phạm an ninh hệ thống.
              </li>
              <li>
                Trong một số trường hợp đặc biệt, nếu có yêu cầu hợp pháp từ cơ
                quan có thẩm quyền theo quy định pháp luật hiện hành, Tiximax
                Logistics có trách nhiệm hợp tác và cung cấp thông tin cá nhân
                để điều tra hành vi vi phạm pháp luật.
              </li>
            </ul>
          </div>

          {/* 3. Thời gian lưu trữ */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              3. Thời gian lưu trữ thông tin
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax Logistics lưu trữ thông tin cá nhân mà bạn cung cấp trong
              hệ thống nội bộ theo các nguyên tắc sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                <span className="font-semibold">
                  Thời gian sử dụng dịch vụ:
                </span>{" "}
                Thông tin được lưu trữ trong suốt thời gian bạn sử dụng dịch vụ
                hoặc cho đến khi mục đích thu thập thông tin hoàn thành.
              </li>
              <li>
                <span className="font-semibold">
                  Giải quyết tranh chấp/Khiếu nại:
                </span>{" "}
                Sau khi kết thúc việc cung cấp dịch vụ, thông tin vẫn có thể
                được lưu giữ trong một khoảng thời gian nhất định (thường là 1–3
                năm) nhằm mục đích đối chiếu, giải quyết khiếu nại, tra cứu lịch
                sử giao dịch.
              </li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed">
              Bạn có quyền yêu cầu xóa hoặc ngừng lưu trữ thông tin cá nhân của
              mình theo quy định nếu không còn sử dụng dịch vụ.
            </p>
          </div>

          {/* 4. Công cụ tiếp cận/chỉnh sửa */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              4. Phương tiện và công cụ tiếp cận, chỉnh sửa dữ liệu cá nhân
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân
              của mình bằng cách:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                <span className="font-semibold">Truy cập trực tiếp:</span> Truy
                cập vào tài khoản cá nhân trên website{" "}
                <span className="font-semibold">Tiximax.net</span> và thực hiện
                chỉnh sửa thông tin trực tiếp trong mục hồ sơ cá nhân.
              </li>
              <li>
                <span className="font-semibold">Gửi yêu cầu:</span> Liên hệ qua
                hotline hỗ trợ hoặc email hỗ trợ (được cung cấp tại trang Liên
                Hệ) để gửi yêu cầu thay đổi hoặc xóa thông tin cá nhân.
              </li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax Logistics sẽ xử lý yêu cầu của bạn trong thời gian hợp lý
              (thường là 24–72 giờ làm việc) và thông báo kết quả.
            </p>
          </div>

          {/* 5. Cam kết bảo mật */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              5. Cam kết bảo mật thông tin
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax Logistics cam kết thực hiện các nguyên tắc bảo mật sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                Bảo mật tuyệt đối thông tin cá nhân của khách hàng theo chính
                sách này và theo quy định pháp luật về bảo vệ dữ liệu cá nhân
                của Việt Nam và Nhật Bản.
              </li>
              <li>
                Không mua bán, trao đổi thông tin cá nhân khách hàng với bên thứ
                ba nhằm mục đích thương mại.
              </li>
              <li>
                Áp dụng các biện pháp kỹ thuật và quy trình quản lý phù hợp để
                ngăn chặn truy cập trái phép, sử dụng sai mục đích hoặc rò rỉ
                thông tin cá nhân.
              </li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-semibold">
                Khuyến nghị &amp; Miễn trừ trách nhiệm:
              </span>{" "}
              Tiximax Logistics khuyến nghị bạn sử dụng mật khẩu mạnh, không
              đăng nhập trên các thiết bị công cộng, và thường xuyên cập nhật
              phần mềm bảo mật. Tiximax Logistics sẽ không chịu trách nhiệm nếu
              thông tin cá nhân bị lộ ra ngoài do lỗi từ phía bạn (ví dụ: bạn
              tiết lộ mật khẩu, sử dụng thiết bị không an toàn…).
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Chính sách bảo mật này chỉ áp dụng cho thông tin bạn cung cấp trên
              website/ứng dụng chính thức của Tiximax Logistics. Mọi thông tin
              đăng ký tại các nền tảng khác không thuộc phạm vi bảo mật này.
            </p>
          </div>

          {/* 6. Cơ chế khiếu nại */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              6. Cơ chế tiếp nhận và giải quyết khiếu nại
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Khi bạn phát hiện hoặc nghi ngờ thông tin cá nhân của mình bị lạm
              dụng, xâm phạm, vui lòng liên hệ ngay lập tức với Tiximax
              Logistics qua các thông tin đã cung cấp tại Mục 4.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax Logistics sẽ tiếp nhận yêu cầu, kiểm tra và phản hồi trong
              thời gian tối đa 24–72 giờ làm việc. Trong trường hợp cần thiết,
              chúng tôi sẽ phối hợp với cơ quan chức năng có liên quan để điều
              tra và xử lý vi phạm.
            </p>
          </div>

          {/* 7. Hiệu lực & thay đổi */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              7. Hiệu lực và thay đổi chính sách bảo mật
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Chính sách này có hiệu lực kể từ khi được đăng tải trên website{" "}
              <span className="font-semibold">Tiximax.net</span>.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax Logistics có quyền cập nhật, chỉnh sửa hoặc thay đổi chính
              sách này để phù hợp với hoạt động kinh doanh thực tế hoặc tuân thủ
              các quy định pháp luật mới. Khi có thay đổi đáng kể, chúng tôi sẽ
              thông báo rõ ràng trên website.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Việc bạn tiếp tục sử dụng dịch vụ sau khi có cập nhật đồng nghĩa
              bạn chấp nhận nội dung của chính sách bảo mật mới.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;
