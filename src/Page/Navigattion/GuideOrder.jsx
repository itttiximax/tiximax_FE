import React from "react";

const GuideOrder = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-10 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            HƯỚNG DẪN SỬ DỤNG DỊCH VỤ
          </h1>
          <p className="text-2xl text-gray-700">
            TIXIMAX LOGISTICS - Dịch vụ logistics trọn gói
          </p>
        </div>

        {/* Content - Đặt Hàng */}
        <div className="bg-white  rounded-2xl p-12 mb-12">
          {/* Title Section */}
          <div className="-mx-32 mb-12">
            {" "}
            {/* Negative margin để vượt ra ngoài padding */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-xl p-8">
              <h2 className="text-4xl font-bold text-gray-900 text-center">
                HƯỚNG DẪN ĐẶT HÀNG
              </h2>
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              TIXIMAX LOGISTICS là đơn vị cung cấp dịch vụ logistics trọn gói,
              hỗ trợ mua hộ, vận chuyển và nhập khẩu hàng quốc tế với quy trình
              rõ ràng, chi phí minh bạch, đảm bảo an toàn hàng hóa.
            </p>
          </div>

          {/* Quy trình */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              QUY TRÌNH ĐẶT HÀNG TẠI TIXIMAX
            </h3>

            {/* Bước 1 */}
            <div className="mb-10">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 1: Gửi yêu cầu cho TIXIMAX
                </h4>
              </div>
              <div className="pl-8">
                <p className="font-semibold text-lg text-gray-900 mb-4">
                  Bạn chuẩn bị:
                </p>
                <ul className="list-disc pl-8 space-y-3 mb-6 text-lg text-gray-700">
                  <li>
                    Link sản phẩm từ các website nước ngoài (Indonesia, Nhật,
                    Hàn, Mỹ…)
                  </li>
                  <li>
                    Thông tin chi tiết:
                    <ul className="list-circle pl-8 mt-2 space-y-2">
                      <li>
                        <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                          Màu sắc / size / dung tích
                        </span>
                      </li>
                      <li>
                        <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                          Số lượng
                        </span>
                      </li>
                      <li>
                        <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                          Phiên bản / model cụ thể
                        </span>{" "}
                        (nếu có)
                      </li>
                    </ul>
                  </li>
                </ul>
                <p className="font-semibold text-lg text-gray-900 mb-4">
                  Sau đó, gửi cho TIXIMAX qua:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-lg text-gray-700">
                  <li>Form "Nhận báo giá" / "Gửi yêu cầu" trên website</li>
                  <li>Các kênh tư vấn: Messenger, Zalo, hotline</li>
                </ul>
              </div>
            </div>

            {/* Bước 2 */}
            <div className="mb-10">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 2: TIXIMAX kiểm tra & báo giá
                </h4>
              </div>
              <div className="pl-8">
                <p className="mb-4 text-lg text-gray-700">
                  Sau khi nhận yêu cầu, TIXIMAX sẽ:
                </p>
                <ul className="list-disc pl-8 space-y-3 mb-6 text-lg text-gray-700">
                  <li>
                    Kiểm tra thông tin sản phẩm, độ uy tín của nhà cung cấp
                  </li>
                  <li>
                    Tư vấn nếu có lựa chọn phù hợp hơn (giá tốt hơn, phí ship rẻ
                    hơn, seller uy tín hơn…)
                  </li>
                  <li>
                    Gửi lại báo giá chi tiết, bao gồm:
                    <ul className="list-circle pl-8 mt-2 space-y-2">
                      <li>
                        <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                          Giá sản phẩm gốc
                        </span>
                      </li>
                      <li>
                        <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                          Phí vận chuyển quốc tế & nội địa
                        </span>
                      </li>
                      <li>
                        <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                          Thuế, phí dự kiến
                        </span>{" "}
                        (nếu có)
                      </li>
                    </ul>
                  </li>
                </ul>
                <p className="mb-4 text-lg text-gray-700">
                  Bạn chỉ cần xem lại:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-lg text-gray-700">
                  <li>Thông tin sản phẩm đã đúng chưa</li>
                  <li>Tổng chi phí</li>
                  <li>Thời gian dự kiến hàng về</li>
                </ul>
                <p className="mt-4 text-lg text-gray-700">
                  Nếu đồng ý, bạn xác nhận đặt hàng.
                </p>
              </div>
            </div>

            {/* Bước 3 */}
            <div className="mb-10">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 3: Xác nhận & thanh toán
                </h4>
              </div>
              <div className="pl-8">
                <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
                  <li>
                    Bạn có thể thanh toán cho TIXIMAX bằng{" "}
                    <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                      chuyển khoản ngân hàng trong nước
                    </span>{" "}
                    hoặc phương thức thanh toán quốc tế
                  </li>
                  <li>
                    Bạn{" "}
                    <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                      KHÔNG cần dùng thẻ Visa/Mastercard
                    </span>{" "}
                    hay tự thanh toán trên website nước ngoài
                  </li>
                  <li>Tất cả giao dịch quốc tế sẽ do TIXIMAX thực hiện</li>
                  <li>
                    Sau khi nhận được thanh toán/xác nhận cọc, TIXIMAX sẽ tiến
                    hành mua hàng theo đúng yêu cầu của bạn
                  </li>
                </ul>
              </div>
            </div>

            {/* Bước 4 */}
            <div className="mb-10">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 4: Vận chuyển & giao hàng tận tay
                </h4>
              </div>
              <div className="pl-8">
                <p className="mb-4 text-lg text-gray-700">TIXIMAX sẽ:</p>
                <ul className="list-disc pl-8 space-y-3 mb-6 text-lg text-gray-700">
                  <li>Nhận hàng tại kho nước ngoài</li>
                  <li>Đóng gói, sắp xếp vận chuyển quốc tế về Việt Nam</li>
                  <li>
                    Thực hiện các thủ tục hải quan, thuế, giấy tờ liên quan
                  </li>
                  <li>
                    Giao cho đơn vị vận chuyển nội địa và ship đến tận địa chỉ
                    bạn cung cấp
                  </li>
                </ul>
                <p className="font-semibold text-lg text-gray-900 mb-4">
                  Khi nhận hàng, bạn nên:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-lg text-gray-700">
                  <li>
                    <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                      Kiểm tra kiện hàng bên ngoài
                    </span>
                  </li>
                  <li>
                    <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                      Mở hàng, kiểm tra đúng mẫu, đúng số lượng, đúng phiên bản
                    </span>
                  </li>
                  <li>
                    Nếu có sai sót hoặc hư hỏng, liên hệ ngay TIXIMAX để được hỗ
                    trợ
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lưu ý */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              MỘT SỐ LƯU Ý KHI ĐẶT HÀNG QUA TIXIMAX
            </h3>
            <p className="mb-5 text-lg text-gray-700">
              Để đơn hàng được xử lý nhanh và chính xác, bạn nên:
            </p>
            <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
              <li>Gửi link sản phẩm rõ ràng, hạn chế dùng hình ảnh mơ hồ</li>
              <li>Ghi đầy đủ: màu – size – số lượng – phiên bản</li>
              <li>Yêu cầu báo giá trước khi chốt đơn để nắm rõ chi phí</li>
              <li>
                Lên kế hoạch nhập hàng sớm trước các dịp sale lớn, lễ Tết… để
                tránh trễ tiến độ
              </li>
              <li>
                Ưu tiên chọn sản phẩm từ nhà cung cấp uy tín, có nhiều đánh giá
                tốt
              </li>
            </ul>
          </div>

          {/* Ưu điểm */}
          <div className="mb-0">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              VÌ SAO NÊN ĐẶT HÀNG QUA TIXIMAX?
            </h3>

            <div className="space-y-6">
              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h4 className="font-bold text-xl text-gray-900 mb-2">
                  Tất cả các chi phí đều rõ ràng
                </h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Giá hàng, phí mua hộ, phí vận chuyển quốc tế, thuế/phí… đều
                  được thể hiện rõ trong báo giá. Không chi phí ẩn, không phát
                  sinh mập mờ.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h4 className="font-bold text-xl text-gray-900 mb-2">
                  Lộ trình minh bạch
                </h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  TIXIMAX thiết kế lộ trình vận chuyển rõ ràng, thời gian cam
                  kết theo từng thị trường, giúp bạn chủ động kế hoạch kinh
                  doanh.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h4 className="font-bold text-xl text-gray-900 mb-2">
                  Quy trình đơn giản
                </h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Gửi yêu cầu – nhận báo giá – xác nhận & thanh toán – nhận
                  hàng. Bạn không cần hiểu quá sâu về thủ tục logistics, TIXIMAX
                  đã làm thay bạn.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h4 className="font-bold text-xl text-gray-900 mb-2">
                  Hỗ trợ tận tâm
                </h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Đội ngũ TIXIMAX luôn sẵn sàng tư vấn về sản phẩm, seller, cách
                  tối ưu chi phí, lựa chọn phương án vận chuyển phù hợp với từng
                  loại hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Tra Cứu */}
        <div className="bg-white rounded-2xl  p-12">
          {/* Title Section */}
          <div className="-mx-32 mb-12">
            {" "}
            {/* Negative margin để vượt ra ngoài padding */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-xl p-8">
              <h2 className="text-4xl font-bold text-gray-900 text-center">
                TRA CỨU & THEO DÕI ĐƠN HÀNG
              </h2>
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Khi nhập hàng từ nước ngoài về Việt Nam, việc theo dõi xem đơn
              đang ở đâu, đã rời kho, qua hải quan hay đang giao nội địa là điều
              rất quan trọng. TIXIMAX hỗ trợ khách hàng tra cứu và theo dõi đơn
              hàng trực tuyến, giúp bạn dễ dàng kiểm soát hành trình hàng hóa từ
              lúc xuất kho nước ngoài đến khi giao tận tay tại Việt Nam.
            </p>
          </div>

          {/* Tra cứu là gì */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              TRA CỨU VẬN ĐƠN TIXIMAX LÀ GÌ?
            </h3>
            <p className="mb-5 text-lg text-gray-700">
              Tra cứu vận đơn là cách giúp bạn biết:
            </p>
            <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700 mb-6">
              <li>
                Đơn hàng đang ở khu vực nào (kho nước ngoài, đang bay, đang làm
                thủ tục hải quan, kho Việt Nam, giao nội địa…)
              </li>
              <li>
                Đơn đã được tiếp nhận, đang xử lý hay đã hoàn tất giao hàng
              </li>
              <li>
                Có phát sinh tình trạng bất thường hay không (kẹt hải quan,
                thiếu chứng từ, khách vắng mặt khi giao…)
              </li>
            </ul>
            <p className="mb-4 text-lg text-gray-700">
              Thông thường, mỗi đơn hàng với TIXIMAX sẽ có:
            </p>
            <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
              <li>
                <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                  Mã đơn hàng TIXIMAX
                </span>{" "}
                (mã do hệ thống TIXIMAX tạo ra)
              </li>
              <li>
                <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                  Mã vận đơn của đối tác vận chuyển
                </span>{" "}
                (nếu có), dùng để theo dõi chặng bay hoặc chặng giao nội địa
              </li>
            </ul>
          </div>

          {/* Cách tra cứu */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              CÁCH TRA CỨU ĐƠN HÀNG TIXIMAX TRÊN WEBSITE
            </h3>

            <div className="mb-8">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 1: Mở trang Tra cứu
                </h4>
              </div>
              <div className="pl-8">
                <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
                  <li>
                    Truy cập website TIXIMAX (
                    <span className="font-semibold">https://tiximax.net/</span>)
                  </li>
                  <li>
                    Trên thanh menu, chọn{" "}
                    <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                      "Tra cứu đơn hàng"
                    </span>{" "}
                    hoặc{" "}
                    <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                      "Tra cứu vận đơn"
                    </span>
                  </li>
                  <li>Trang tra cứu sẽ hiển thị ô để bạn nhập thông tin đơn</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 2: Nhập thông tin tra cứu
                </h4>
              </div>
              <div className="pl-8">
                <p className="mb-4 text-lg text-gray-700">
                  Tại form tra cứu, điền đúng loại thông tin hệ thống yêu cầu,
                  ví dụ:
                </p>
                <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700 mb-5">
                  <li>Mã đơn / mã vận đơn mà TIXIMAX đã cung cấp</li>
                  <li>
                    Số điện thoại / email dùng khi đặt hàng (nếu form yêu cầu
                    kiểu này)
                  </li>
                </ul>
                <p className="text-lg text-gray-700 mb-4">
                  Rồi nhấn{" "}
                  <span className="bg-yellow-200 px-3 py-1 font-semibold rounded">
                    Tra cứu
                  </span>
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5">
                  <p className="text-base text-gray-700">
                    <span className="font-semibold">Mẹo nhỏ:</span> nên
                    copy–paste mã đơn để tránh nhầm giữa số 0 và chữ O, số 1 và
                    chữ I,…
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Bước 3: Xem kết quả
                </h4>
              </div>
              <div className="pl-8">
                <p className="mb-4 text-lg text-gray-700">
                  Sau khi tra cứu, hệ thống sẽ hiển thị:
                </p>
                <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
                  <li>Thông tin cơ bản của đơn hàng</li>
                  <li>Trạng thái hiện tại và các cập nhật mới nhất</li>
                  <li>
                    Từ đó, bạn biết được đơn mình đang trong giai đoạn nào và
                    ước chừng thời gian nhận hàng
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              MỘT SỐ TRẠNG THÁI ĐƠN HÀNG THƯỜNG GẶP
            </h3>
            <p className="mb-6 text-lg text-gray-700">
              Tùy từng loại dịch vụ và chặng vận chuyển, trạng thái hiển thị có
              thể khác nhau, nhưng thường sẽ xoay quanh các nhóm sau:
            </p>

            <div className="space-y-5">
              <div className="border-l-4 border-blue-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Đã tiếp nhận / Đã tạo đơn
                </h4>
                <p className="text-lg text-gray-700">
                  TIXIMAX đã ghi nhận yêu cầu, đơn đang chờ xử lý.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Đang xử lý / Đang mua hàng
                </h4>
                <p className="text-lg text-gray-700">
                  Đơn vị đang tiến hành mua hộ, xác nhận với nhà cung cấp, chuẩn
                  bị nhận hàng tại kho.
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Đang vận chuyển quốc tế / Đang trên đường về Việt Nam
                </h4>
                <p className="text-lg text-gray-700">
                  Hàng đã rời kho nước ngoài và đang di chuyển về Việt Nam.
                </p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Đang thông quan / Chờ thông quan
                </h4>
                <p className="text-lg text-gray-700">
                  Hàng đang được làm thủ tục tại hải quan.
                </p>
              </div>

              <div className="border-l-4 border-teal-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Đã về kho Việt Nam / Đang giao nội địa
                </h4>
                <p className="text-lg text-gray-700">
                  Hàng đã về kho tại Việt Nam và được bàn giao cho đơn vị giao
                  trong nước.
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Giao thành công
                </h4>
                <p className="text-lg text-gray-700">
                  Đơn hàng đã giao tới địa chỉ nhận.
                </p>
              </div>

              <div className="border-l-4 border-red-600 pl-6 py-3">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  Giao không thành công / Khách vắng mặt
                </h4>
                <p className="text-lg text-gray-700">
                  Đơn vị giao không thể giao hàng (lý do thường được ghi rõ),
                  bạn nên liên hệ lại để sắp xếp giao lần sau.
                </p>
              </div>
            </div>
          </div>

          {/* Khi nào liên hệ */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              KHI NÀO NÊN LIÊN HỆ TIXIMAX?
            </h3>
            <p className="mb-5 text-lg text-gray-700">
              Bạn nên chủ động liên hệ TIXIMAX trong những trường hợp:
            </p>
            <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700 mb-6">
              <li>Tra cứu nhiều lần nhưng không thấy đơn dù đã đặt hàng</li>
              <li>
                Trạng thái đứng yên quá lâu so với thời gian dự kiến TIXIMAX
                thông báo
              </li>
              <li>
                Hệ thống báo giao không thành công nhưng bạn không nhận cuộc gọi
                / thông tin từ đơn vị giao
              </li>
              <li>
                Cần điều chỉnh gấp: đổi địa chỉ nhận, đổi người nhận, hỗ trợ
                thêm giấy tờ…
              </li>
            </ul>
            <p className="font-semibold text-lg text-gray-900 mb-4">
              Khi liên hệ, bạn nên chuẩn bị sẵn:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-lg text-gray-700">
              <li>Mã đơn / mã vận đơn (nếu có)</li>
              <li>Họ tên & số điện thoại đã dùng khi đặt hàng</li>
            </ul>
            <p className="mt-5 text-lg text-gray-700">
              Đội ngũ TIXIMAX sẽ kiểm tra trên hệ thống và phản hồi chi tiết cho
              bạn.
            </p>
          </div>

          {/* Lưu ý */}
          <div className="mb-0">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400">
              MỘT SỐ LƯU Ý ĐỂ TRA CỨU ĐƠN TIỆN HƠN
            </h3>
            <ul className="list-disc pl-8 space-y-3 text-lg text-gray-700">
              <li>Luôn lưu lại mã đơn khi TIXIMAX gửi lần đầu</li>
              <li>
                Theo dõi đơn định kỳ, đặc biệt trước các mốc quan trọng như: dự
                kiến hàng về, chuẩn bị giao cho khách, chạy chương trình khuyến
                mãi…
              </li>
              <li>
                Nếu đặt nhiều đơn cùng lúc, nên ghi chú riêng cho từng mã để
                khỏi nhầm
              </li>
              <li>
                Đối với chủ shop, có thể gửi kèm hướng dẫn tra cứu cho khách
                (hoặc hỗ trợ khách tra giúp) để tăng độ tin tưởng
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuideOrder;
