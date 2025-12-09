import React from "react";
import {
  Briefcase,
  Users2,
  Globe2,
  Rocket,
  ArrowRight,
  Facebook,
} from "lucide-react";

const CareerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HERO / HEADER */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-3xl shadow-xl py-10 md:py-14 px-6 md:px-14 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              TUYỂN DỤNG – TIXIMAX LOGISTICS
            </h1>
            <p className="text-lg md:text-2xl text-gray-800 max-w-3xl mx-auto">
              Gia nhập đội ngũ trẻ, năng động của Tiximax và cùng định hình
              tương lai ngành E-Logistics tại Việt Nam.
            </p>
          </div>
        </section>

        <div className="space-y-16 md:space-y-20">
          {/* SECTION 1 – Tại sao chọn TIXIMAX */}
          <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Globe2 className="w-7 h-7 text-yellow-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                1. Tại sao bạn nên chọn Tiximax Logistics?
              </h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Tiximax Logistics là công ty hoạt động trong lĩnh vực logistics
              quốc tế và thương mại điện tử. Chúng tôi không chỉ cung cấp dịch
              vụ vận chuyển mà còn là cầu nối giúp khách hàng tại Việt Nam tiếp
              cận các thị trường khó tính và tiềm năng như Nhật Bản, Mỹ, Hàn
              Quốc và Indonesia một cách dễ dàng và minh bạch.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Gia nhập Tiximax, bạn sẽ trở thành một phần của đội ngũ trẻ, năng
              động. Chúng tôi tìm kiếm những cá nhân đam mê, không ngừng học
              hỏi, sẵn sàng cùng chúng tôi định hình lại tương lai của ngành
              E-Logistics. Tiximax tin rằng đội ngũ là tài sản quý giá nhất và
              luôn cam kết tạo ra một môi trường làm việc khuyến khích phát
              triển, ổn định và nhiều cơ hội thăng tiến trong ngành logistics
              quốc tế.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Môi trường làm việc */}
              <div className="border-l-4 border-yellow-500 pl-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users2 className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Môi trường làm việc & phát triển nghề nghiệp
                  </h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base md:text-lg">
                  <li>
                    <span className="font-semibold">Làm việc quốc tế:</span>{" "}
                    Tiếp xúc trực tiếp với các quy trình logistics, thương mại
                    điện tử từ những thị trường hàng đầu (Nhật, Mỹ, Hàn,
                    Indonesia), giúp bạn mở rộng kiến thức và kỹ năng toàn cầu.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Văn hóa mở & linh hoạt:
                    </span>{" "}
                    Đề cao sự chủ động, sáng tạo và trao đổi thẳng thắn. Chúng
                    tôi khuyến khích nhân sự thử nghiệm các giải pháp mới để tối
                    ưu hiệu suất công việc.
                  </li>
                  <li>
                    <span className="font-semibold">Đón đầu công nghệ:</span>{" "}
                    Làm việc với các hệ thống quản lý đơn hàng, tracking và công
                    cụ công nghệ tiên tiến, giúp bạn nâng cao kỹ năng số
                    (digital skills).
                  </li>
                </ul>
              </div>

              {/* Phúc lợi */}
              <div className="border-l-4 border-yellow-500 pl-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Phúc lợi và chính sách đãi ngộ
                  </h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base md:text-lg">
                  <li>
                    <span className="font-semibold">Phúc lợi cơ bản:</span> Thu
                    nhập cạnh tranh cùng các chế độ theo quy định pháp luật.
                  </li>
                  <li>
                    <span className="font-semibold">Đào tạo & gắn kết:</span>{" "}
                    Được tham gia các khóa đào tạo chuyên sâu và nhiều hoạt động
                    nội bộ, teambuilding giúp gắn kết đội ngũ.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2 – Bạn sẽ làm gì */}
          <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-7 h-7 text-yellow-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                2. Bạn sẽ làm gì cùng chúng tôi?
              </h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Chúng tôi thường xuyên tìm kiếm nhân sự cho nhiều phòng ban khác
              nhau, phục vụ cho sự mở rộng liên tục của các tuyến dịch vụ.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Operation & Warehouse */}
              <div className="border-l-4 border-yellow-500 pl-5 py-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Vận hành & kho bãi (Operation & Warehouse)
                </h3>
                <p className="text-base md:text-lg text-gray-700">
                  Quản lý luồng hàng, tối ưu hóa quy trình nhập, xuất, đóng gói
                  tại kho Việt Nam và các kho quốc tế, đảm bảo hàng hóa được xử
                  lý nhanh chóng và chính xác.
                </p>
              </div>

              {/* Sales & CS */}
              <div className="border-l-4 border-yellow-500 pl-5 py-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Kinh doanh & chăm sóc khách hàng (Sales & CS)
                </h3>
                <p className="text-base md:text-lg text-gray-700">
                  Tư vấn giải pháp logistics, đồng hành cùng khách hàng doanh
                  nghiệp và cá nhân, xây dựng và duy trì mối quan hệ bền vững
                  dài lâu.
                </p>
              </div>

              {/* Marketing & E-commerce */}
              <div className="border-l-4 border-yellow-500 pl-5 py-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Marketing & E-commerce
                </h3>
                <p className="text-base md:text-lg text-gray-700">
                  Phát triển thương hiệu Tiximax, triển khai các chiến dịch số,
                  tối ưu trải nghiệm người dùng trên nền tảng công nghệ và kênh
                  bán hàng trực tuyến.
                </p>
              </div>

              {/* Supporting roles */}
              <div className="border-l-4 border-yellow-500 pl-5 py-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Các vị trí hỗ trợ
                </h3>
                <p className="text-base md:text-lg text-gray-700">
                  Kế toán, Hành chính, IT Hỗ trợ và các vị trí chức năng khác
                  cùng giữ vai trò quan trọng trong việc vận hành bộ máy Tiximax
                  hiệu quả.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3 – Cách thức ứng tuyển */}
          <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <ArrowRight className="w-7 h-7 text-yellow-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                3. Cách thức ứng tuyển
              </h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Để đảm bảo thông tin tuyển dụng được cập nhật nhanh chóng và chính
              xác nhất, các tin tuyển dụng chi tiết về mô tả công việc, yêu cầu
              và quyền lợi cụ thể được đăng tải tại Fanpage tuyển dụng chính
              thức của Tiximax Logistics.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Facebook className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-base md:text-lg text-gray-800 mb-1 font-semibold">
                    Fanpage tuyển dụng chính thức:
                  </p>
                  <a
                    href="https://www.facebook.com/tiximaxCareer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base md:text-lg font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    facebook.com/tiximaxCareer
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-sm md:text-base text-gray-600 mt-2">
                    Hãy theo dõi fanpage để không bỏ lỡ các cơ hội nghề nghiệp
                    mới nhất từ Tiximax Logistics.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-lg text-gray-700 leading-relaxed">
              Chúng tôi mong muốn sớm chào đón bạn gia nhập đội ngũ Tiximax
              Logistics để cùng nhau kiến tạo những hành trình vận chuyển an
              toàn và thành công!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
