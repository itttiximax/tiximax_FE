import React from "react";

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* HERO / HEADER */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-3xl shadow-xl py-10 md:py-12 px-6 md:px-12 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              QUY ĐỊNH CHUNG – TIXIMAX LOGISTICS
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto">
              Vui lòng đọc kỹ Điều khoản và Quy định khi sử dụng website{" "}
              <span className="font-semibold">https://tiximax.net</span> hoặc
              các dịch vụ của TIXIMAX LOGISTICS.
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12 space-y-10 text-gray-800">
          {/* Intro */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              QUY ĐỊNH CHUNG
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Chào mừng Quý khách đến với Tiximax Logistics! Khi sử dụng website{" "}
              <span className="font-semibold">https://tiximax.net</span> hoặc
              các dịch vụ của TIXIMAX LOGISTICS (gọi tắt là{" "}
              <span className="font-semibold">&quot;Tiximax&quot;</span>), bạn
              đồng ý với toàn bộ các điều khoản và quy định được nêu dưới đây.
              Nếu không đồng ý, vui lòng dừng việc sử dụng dịch vụ.
            </p>
          </div>

          {/* 1. Giới thiệu & phạm vi áp dụng */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              1. Giới thiệu &amp; phạm vi áp dụng
            </h3>

            <div>
              <h4 className="font-semibold text-gray-900">1.1. Về Tiximax</h4>
              <p className="text-base md:text-lg leading-relaxed">
                Tiximax là đơn vị chuyên cung cấp các dịch vụ trung gian trong
                lĩnh vực logistics quốc tế và thương mại điện tử xuyên biên
                giới, bao gồm: mua hàng hộ, thanh toán hộ, đấu giá hộ và vận
                chuyển hàng hóa giữa Nhật Bản – Việt Nam.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                1.2. Phạm vi áp dụng
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Điều khoản này áp dụng cho mọi khách hàng cá nhân và doanh
                nghiệp sử dụng các kênh chính thức của Tiximax, bao gồm:
                website, ứng dụng (nếu có), fanpage, Zalo, và hotline hỗ trợ.
              </p>
            </div>
          </div>

          {/* 2. Dịch vụ chính */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              2. Các dịch vụ chính của Tiximax
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              Tùy từng thời điểm và khả năng vận hành, Tiximax có thể cung cấp
              một hoặc nhiều dịch vụ sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                <span className="font-semibold">Mua hàng hộ:</span> Nhận link
                hoặc thông tin sản phẩm từ các sàn/website/cửa hàng quốc tế, báo
                giá và đặt mua theo yêu cầu của khách hàng.
              </li>
              <li>
                <span className="font-semibold">Thanh toán hộ:</span> Thanh toán
                giúp đơn hàng mà khách đã tự đặt khi khách không có phương thức
                thanh toán phù hợp.
              </li>
              <li>
                <span className="font-semibold">Đấu giá hộ:</span> Hỗ trợ tham
                gia đấu giá trên các sàn thương mại điện tử (ví dụ: Yahoo
                Auction) hoặc cho khách sử dụng tài khoản đấu giá theo thỏa
                thuận cụ thể.
              </li>
              <li>
                <span className="font-semibold">Vận chuyển:</span> Vận chuyển
                hàng từ quốc tế về Việt Nam (Nhật, Hàn, Mỹ, Indonesia) và từ
                Việt Nam đi quốc tế (Indonesia).
              </li>
              <li>
                <span className="font-semibold">Ký gửi kho:</span> Nhận hàng tại
                kho Tiximax, gom hàng, làm thủ tục hải quan và chuyển về Việt
                Nam, giao cho khách theo địa chỉ cung cấp hoặc nhận tại kho.
              </li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax có quyền bổ sung, tạm dừng hoặc thay đổi dịch vụ và sẽ
              thông báo trên các kênh chính thức khi cần thiết.
            </p>
          </div>

          {/* 3. Quy trình sử dụng dịch vụ */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              3. Quy trình sử dụng dịch vụ chung
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                <span className="font-semibold">Gửi yêu cầu:</span> Khách hàng
                gửi yêu cầu (link sản phẩm, mô tả hàng, loại dịch vụ, địa chỉ
                nhận hàng, v.v.).
              </li>
              <li>
                <span className="font-semibold">Báo giá:</span> Tiximax báo giá
                chi tiết, nêu rõ tiền hàng dự kiến, phí dịch vụ, phí vận chuyển
                quốc tế, và các phụ thu khác (nếu có).
              </li>
              <li>
                <span className="font-semibold">
                  Xác nhận &amp; Thanh toán/Đặt cọc:
                </span>{" "}
                Khách hàng xác nhận và thanh toán/đặt cọc theo hướng dẫn và tỷ
                giá quy đổi hiện hành của Tiximax.
              </li>
              <li>
                <span className="font-semibold">Thực hiện dịch vụ:</span>{" "}
                Tiximax tiến hành mua/đấu giá/thanh toán, nhận hàng ở kho Nhật,
                gom hàng và sắp xếp vận chuyển về Việt Nam.
              </li>
              <li>
                <span className="font-semibold">Giao hàng:</span> Hàng về Việt
                Nam, Tiximax thông báo và giao hàng theo thỏa thuận (giao tận
                nơi hoặc nhận tại kho/điểm nhận).
              </li>
            </ul>
          </div>

          {/* 4. Giá cả, phí và thanh toán */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              4. Quy định về giá cả, phí dịch vụ và thanh toán
            </h3>

            <div>
              <h4 className="font-semibold text-gray-900">
                4.1. Cấu trúc chi phí
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Giá, phí dịch vụ áp dụng theo bảng giá và chính sách hiện hành
                được Tiximax công bố trên website hoặc thông báo trực tiếp qua
                nhân viên. Các loại chi phí có thể bao gồm:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
                <li>Giá hàng gốc (nếu có).</li>
                <li>Phí dịch vụ.</li>
                <li>Phí vận chuyển nội địa (nếu có).</li>
                <li>Phí vận chuyển quốc tế (Đường bay).</li>
                <li>
                  Phụ thu theo tính chất hàng (cồng kềnh, có pin, chất lỏng, dễ
                  vỡ, hàng giá trị cao…).
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                4.2. Quy định thanh toán
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Khách hàng cần thanh toán đúng số tiền và đúng thời hạn Tiximax
                thông báo. Tiximax hỗ trợ thanh toán qua: chuyển khoản ngân
                hàng, tiền mặt hoặc phương thức khác đã được Tiximax hỗ trợ
                chính thức.
              </p>
            </div>
          </div>

          {/* 5. Hàng cấm và hạn chế */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              5. Quy định về hàng hóa cấm và hạn chế
            </h3>

            <div>
              <h4 className="font-semibold text-gray-900">
                5.1. Hàng hóa bị cấm
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Tiximax từ chối nhận các loại hàng bị cấm theo luật pháp Việt
                Nam, luật pháp tại quốc gia sử dụng dịch vụ, quy định hải quan
                và quy định của hãng vận chuyển (ví dụ: chất nổ, chất gây
                nghiện, văn hóa phẩm đồi trụy, hàng vi phạm bản quyền…).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                5.2. Hàng hóa hạn chế
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Một số mặt hàng hạn chế (thực phẩm, mỹ phẩm, chất lỏng, hàng có
                pin, pin rời,…) chỉ được nhận khi phù hợp quy định từng thời kỳ
                và phải được Tiximax chấp thuận trước khi gửi.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                5.3. Trách nhiệm khai báo
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Khách hàng có trách nhiệm khai báo trung thực về tên hàng, số
                lượng, giá trị. Nếu khai sai dẫn đến việc hàng bị giữ, phạt,
                tịch thu, hay phát sinh các chi phí khác, khách hàng tự chịu mọi
                trách nhiệm và chi phí liên quan.
              </p>
            </div>
          </div>

          {/* 6. Thời gian vận chuyển */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              6. Quy định về thời gian vận chuyển và giao hàng
            </h3>

            <div>
              <h4 className="font-semibold text-gray-900">
                6.1. Thời gian vận chuyển
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Thời gian vận chuyển được Tiximax thông báo theo từng tuyến
                (tiết kiệm, nhanh) chỉ là thời gian dự kiến, không phải cam kết
                tuyệt đối.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                6.2. Các trường hợp chậm trễ
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Thời gian thực tế có thể thay đổi do: thủ tục hải quan, kiểm tra
                ngẫu nhiên, sự cố từ hãng vận chuyển, thiên tai, dịch bệnh, hoặc
                các lý do khách quan khác nằm ngoài khả năng kiểm soát hợp lý.
                Tiximax sẽ cố gắng thông báo sớm cho khách nếu có chậm trễ nhưng
                không chịu trách nhiệm bồi thường trong các trường hợp bất khả
                kháng.
              </p>
            </div>
          </div>

          {/* 7. Tài khoản & thông tin KH */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              7. Quy định về tài khoản và thông tin khách hàng
            </h3>

            <div>
              <h4 className="font-semibold text-gray-900">
                7.1. Nghĩa vụ cung cấp thông tin
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Khi tạo tài khoản hoặc cung cấp thông tin trên Tiximax, khách
                hàng cần:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
                <li>
                  Cung cấp thông tin đúng và đủ, đặc biệt là thông tin giao
                  nhận.
                </li>
                <li>Cập nhật thông tin ngay khi có thay đổi.</li>
                <li>
                  Giữ bí mật thông tin đăng nhập (tên đăng nhập, mật khẩu).
                </li>
              </ul>
              <p className="text-base md:text-lg leading-relaxed mt-2">
                Mọi thao tác phát sinh từ tài khoản hoặc thông tin do khách cung
                cấp được coi là do chính khách thực hiện.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                7.2. Tạm khóa/Chấm dứt dịch vụ
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Tiximax có quyền tạm khóa hoặc chấm dứt hỗ trợ đối với tài
                khoản/trường hợp có dấu hiệu gian lận, lạm dụng, vi phạm điều
                khoản hoặc theo yêu cầu hợp pháp của cơ quan có thẩm quyền.
              </p>
            </div>
          </div>

          {/* 8. Khiếu nại & bồi thường */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              8. Khiếu nại &amp; chính sách bồi thường
            </h3>

            <div>
              <h4 className="font-semibold text-gray-900">
                8.1. Kiểm tra và Thời hạn khiếu nại
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-semibold">Kiểm tra khi nhận hàng:</span>{" "}
                Khách hàng có trách nhiệm kiểm tra tình trạng bên ngoài kiện
                hàng (niêm phong, móp méo, rách, ướt…) khi nhận. Nếu phát hiện
                bất thường, cần phản hồi ngay cho đơn vị giao hàng và thông báo
                cho Tiximax trong vòng 24 giờ kể từ khi nhận.
              </p>
              <p className="text-base md:text-lg leading-relaxed mt-2">
                <span className="font-semibold">Thời hạn khiếu nại:</span> Khi
                phát hiện thiếu hàng, sai hàng hoặc hư hỏng rõ rệt do quá trình
                vận chuyển, khách hàng cần thông báo cho Tiximax trong thời hạn
                quy định trên vận đơn/chứng từ. Quá thời hạn này, Tiximax có thể
                từ chối tiếp nhận do khó xác minh nguyên nhân.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                8.2. Nguyên tắc bồi thường
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Nếu xác định lỗi thuộc về Tiximax hoặc đối tác vận chuyển do
                Tiximax chỉ định, việc bồi thường sẽ thực hiện theo Chính sách
                bảo hiểm và đền bù hiện hành, cụ thể:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
                <li>
                  <span className="font-semibold">
                    Trường hợp có mua bảo hiểm hàng hóa:
                  </span>{" "}
                  Đền bù tối đa đến 100% giá trị hàng hóa khách đã khai báo.
                </li>
                <li>
                  <span className="font-semibold">
                    Trường hợp không mua bảo hiểm hàng hóa:
                  </span>{" "}
                  Đền bù tối đa 100% phí vận chuyển, nhưng không vượt quá
                  3.000.000 VNĐ/đơn hàng (hoặc theo quy định tại thời điểm khiếu
                  nại).
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                8.3. Miễn trừ trách nhiệm bồi thường
              </h4>
              <p className="text-base md:text-lg leading-relaxed">
                Tiximax không chịu trách nhiệm bồi thường trong các trường hợp
                sau:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base md:text-lg mt-1">
                <li>
                  Lỗi thuộc về nhà bán/nhà sản xuất (hàng lỗi sẵn, sai mô tả ban
                  đầu).
                </li>
                <li>
                  Hàng bị giữ, tịch thu, xử lý bởi cơ quan chức năng do vi phạm
                  quy định pháp luật hoặc khai báo sai của khách hàng.
                </li>
                <li>
                  Hư hỏng do khách hàng sử dụng sai cách, tự ý can thiệp, bảo
                  quản không đúng hướng dẫn sau khi đã nhận hàng.
                </li>
              </ul>
            </div>
          </div>

          {/* 9. Giới hạn trách nhiệm */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              9. Giới hạn trách nhiệm
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>
                <span className="font-semibold">Vai trò trung gian:</span>{" "}
                Tiximax chỉ đóng vai trò đơn vị trung gian mua hộ, đấu giá hộ và
                vận chuyển hàng hóa, không phải nhà sản xuất hay nhà phân phối
                chính thức, nên không chịu trách nhiệm bảo hành chất lượng sản
                phẩm như nhà sản xuất.
              </li>
              <li>
                <span className="font-semibold">Thiệt hại gián tiếp:</span>{" "}
                Tiximax không chịu trách nhiệm đối với các thiệt hại gián tiếp
                như: mất lợi nhuận, mất cơ hội kinh doanh, hoặc các thiệt hại
                phát sinh từ sự chậm trễ nằm ngoài khả năng kiểm soát hợp lý.
              </li>
              <li>
                <span className="font-semibold">Mức bồi thường tối đa:</span>{" "}
                Tổng mức bồi thường tối đa (nếu pháp luật buộc) cũng không vượt
                quá tổng giá trị dịch vụ/đơn hàng cụ thể mà khách hàng đã thanh
                toán cho Tiximax liên quan đến vụ việc đó.
              </li>
            </ul>
          </div>

          {/* 10. Bảo mật thông tin */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              10. Bảo mật thông tin
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax cam kết tôn trọng và bảo vệ thông tin cá nhân của khách
              hàng theo Chính sách bảo mật được công bố riêng trên website.
              Tiximax không bán, cho thuê thông tin khách hàng cho bên thứ ba vì
              mục đích thương mại trái quy định.
            </p>
          </div>

          {/* 11. Thay đổi điều khoản */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              11. Thay đổi điều khoản
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              Tiximax có thể cập nhật Điều khoản dịch vụ này khi cần thiết. Bản
              mới nhất sẽ được đăng tải trên website và ngày hiệu lực sẽ được
              ghi rõ. Khi tiếp tục sử dụng dịch vụ sau thời điểm đó, khách hàng
              được xem như đã đồng ý với bản điều khoản mới.
            </p>
          </div>

          {/* 12. Luật áp dụng & liên hệ */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              12. Luật áp dụng và liên hệ
            </h3>

            <div>
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-semibold">Luật áp dụng:</span> Điều khoản
                này được áp dụng và giải thích theo pháp luật Việt Nam.
              </p>
              <p className="text-base md:text-lg leading-relaxed mt-2">
                <span className="font-semibold">Giải quyết tranh chấp:</span>{" "}
                Mọi tranh chấp phát sinh, hai bên ưu tiên thương lượng và hòa
                giải. Nếu không thể giải quyết bằng thương lượng, tranh chấp sẽ
                được chuyển đến cơ quan có thẩm quyền giải quyết theo quy định.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50/60 rounded-r-xl">
              <h4 className="font-semibold text-gray-900 mb-2">
                Thông tin liên hệ TIXIMAX LOGISTICS:
              </h4>
              <ul className="space-y-1 text-base md:text-lg">
                <li>
                  <span className="font-semibold">Địa chỉ văn phòng:</span> 65
                  Đ. 9, Hiệp Bình Phước, Thủ Đức, Thành phố Hồ Chí Minh, Việt
                  Nam.
                </li>
                <li>
                  <span className="font-semibold">Hotline:</span> 0901 834 283.
                </li>
                <li>
                  <span className="font-semibold">Email:</span>{" "}
                  global.trans@tiximax.net.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PolicyPage;
