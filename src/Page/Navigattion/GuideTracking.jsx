import React, { useMemo, useState } from "react";
import {
  Search,
  Barcode,
  ClipboardList,
  PlaneTakeoff,
  Plane,
  PlaneLanding,
  Truck,
  PackageSearch,
  CircleAlert,
  Clock,
  MapPin,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const DEMO_DATA = {
  TXM123456: {
    trackingNo: "TXM123456",
    route: "Chiba (JP) → Đà Nẵng (VN)",
    eta: "2025-11-14",
    status: "customs_vn",
    checkpoints: [
      {
        ts: "2025-11-09 10:15",
        code: "created",
        name: "Tạo mã kiện / received at JP hub",
        icon: PackageSearch,
      },
      {
        ts: "2025-11-10 09:05",
        code: "dep_origin",
        name: "Rời kho Chiba",
        icon: PlaneTakeoff,
      },
      {
        ts: "2025-11-10 14:10",
        code: "in_flight",
        name: "Đang bay (NRT → SGN)",
        icon: Plane,
      },
      {
        ts: "2025-11-10 18:45",
        code: "arr_vn",
        name: "Đến Việt Nam (SGN)",
        icon: PlaneLanding,
      },
      {
        ts: "2025-11-11 09:30",
        code: "customs_vn",
        name: "Đang thông quan VN",
        icon: ClipboardList,
      },
    ],
  },
  TXM987654: {
    trackingNo: "TXM987654",
    route: "Seoul (KR) → Hà Nội (VN)",
    eta: "2025-11-12",
    status: "arr_vn",
    checkpoints: [
      {
        ts: "2025-11-08 11:20",
        code: "created",
        name: "Tạo mã kiện / received at KR hub",
        icon: PackageSearch,
      },
      {
        ts: "2025-11-09 08:30",
        code: "dep_origin",
        name: "Rời kho Seoul",
        icon: PlaneTakeoff,
      },
      {
        ts: "2025-11-09 12:00",
        code: "in_flight",
        name: "Đang bay (ICN → HAN)",
        icon: Plane,
      },
      {
        ts: "2025-11-09 14:50",
        code: "arr_vn",
        name: "Đến Việt Nam (HAN)",
        icon: PlaneLanding,
      },
    ],
  },
};

const STATUS_ORDER = [
  "created",
  "dep_origin",
  "in_flight",
  "arr_vn",
  "customs_vn",
  "out_for_delivery",
  "delivered",
];

const STATUS_META = {
  created: {
    label: "Tạo mã kiện",
    color: "bg-gray-700",
    desc: "Đã nhận hàng tại kho nước ngoài",
  },
  dep_origin: {
    label: "Rời kho",
    color: "bg-yellow-600",
    desc: "Đã rời kho nước ngoài",
  },
  in_flight: {
    label: "Đang bay",
    color: "bg-yellow-500",
    desc: "Đang vận chuyển quốc tế",
  },
  arr_vn: {
    label: "Đến VN",
    color: "bg-yellow-700",
    desc: "Đã tới sân bay Việt Nam",
  },
  customs_vn: {
    label: "Thông quan",
    color: "bg-amber-700",
    desc: "Đang làm thủ tục hải quan",
  },
  out_for_delivery: {
    label: "Phát hàng",
    color: "bg-gray-900",
    desc: "Giao hàng nội địa",
  },
  delivered: {
    label: "Hoàn tất",
    color: "bg-green-600",
    desc: "Đã giao cho khách",
  },
};

const percentageFromStatus = (code) => {
  const idx = STATUS_ORDER.indexOf(code);
  const pct = ((idx + 1) / STATUS_ORDER.length) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

const GuideTracking = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onSearch = (e) => {
    e?.preventDefault?.();
    setError("");
    const key = code.trim().toUpperCase();
    if (!key) {
      setError("Nhập mã kiện/đơn ví dụ: TXM123456");
      setResult(null);
      return;
    }
    if (!/^TXM[0-9]{6,}$/i.test(key)) {
      setError("Định dạng mã không hợp lệ. Ví dụ đúng: TXM123456");
      setResult(null);
      return;
    }
    if (DEMO_DATA[key]) {
      setResult(DEMO_DATA[key]);
    } else {
      setResult({ trackingNo: key, notFound: true });
    }
  };

  const progress = useMemo(
    () => percentageFromStatus(result?.status || "created"),
    [result]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-300 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
              TRA CỨU TÌNH TRẠNG ĐƠN HÀNG
            </h1>
            <p className="text-xl md:text-2xl text-gray-800">
              Nhập mã kiện/mã vận đơn TIXIMAX để xem trạng thái chi tiết
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={onSearch} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-4 flex gap-4">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Barcode className="w-7 h-7 text-yellow-600" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã: TXM123456"
                  className="w-full text-lg md:text-xl outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-xl text-white font-bold text-lg bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Tra cứu
              </button>
            </div>
            {error && (
              <div className="mt-4 text-base md:text-lg text-red-700 flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" /> {error}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Result Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {!result ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-10 text-center min-h-[100px]" />
          ) : result.notFound ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 border-4 border-yellow-400">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <CircleAlert className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Không tìm thấy thông tin
                    </h3>
                    <p className="text-gray-700 mt-2 text-lg">
                      Mã <strong>{result.trackingNo}</strong> không có trong hệ
                      thống. Vui lòng kiểm tra lại hoặc liên hệ CSKH.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCode("");
                    setResult(null);
                    setError("");
                  }}
                  className="px-7 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl flex items-center gap-2 text-base md:text-lg"
                >
                  <RefreshCcw className="w-5 h-5" /> Tra cứu lại
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-16">
              {/* Header Info */}
              <div className="mb-14 pb-10 border-b-4 border-yellow-400">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-gray-600 text-base mb-2">Mã theo dõi</p>
                    <p className="text-3xl md:text-4xl font-black text-gray-900 break-all">
                      {result.trackingNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-base mb-2">Tuyến đường</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {result.route}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-base mb-2">ETA dự kiến</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {result.eta}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg md:text-xl font-bold text-gray-900">
                      Tiến độ vận chuyển
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-yellow-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${
                        STATUS_META[result.status]?.color
                      }`}
                    ></span>
                    <span className="text-lg font-bold text-gray-900">
                      {STATUS_META[result.status]?.label}
                    </span>
                    <span className="text-gray-600 text-base">
                      - {STATUS_META[result.status]?.desc}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-14">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <ClipboardList className="w-7 h-7 text-yellow-600" />
                  Dòng thời gian chi tiết
                </h3>
                <ul className="space-y-10 pl-8">
                  {result.checkpoints.map((cp, idx) => {
                    const Icon = cp.icon || PackageSearch;
                    return (
                      <li key={cp.ts + cp.code} className="relative">
                        <div className="flex items-start gap-5">
                          <div className="relative">
                            <span
                              className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white ${
                                STATUS_META[cp.code]?.color || "bg-gray-400"
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                            </span>
                            {idx < result.checkpoints.length - 1 && (
                              <span className="absolute left-1/2 -translate-x-1/2 top-16 w-1 h-12 bg-gray-300"></span>
                            )}
                          </div>
                          <div className="flex-1 pt-1.5">
                            <div className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                              {cp.name}
                            </div>
                            <div className="text-base md:text-lg text-gray-600 flex items-center gap-2">
                              <Clock className="w-4 h-4" /> {cp.ts}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Status Legend */}
              <div className="mb-14">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-7 pb-3 border-b-4 border-yellow-400 flex items-center gap-3">
                  <PackageSearch className="w-7 h-7 text-yellow-600" />Ý nghĩa
                  các trạng thái
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {STATUS_ORDER.map((code) => (
                    <div
                      key={code}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded-full ${STATUS_META[code].color}`}
                      ></span>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {STATUS_META[code].label}
                        </p>
                        <p className="text-gray-600 text-base">
                          {STATUS_META[code].desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-7 rounded-xl">
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                  Mẹo tra cứu hiệu quả
                </h4>
                <ul className="space-y-3 text-lg text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>
                      Mã TIXIMAX có dạng <strong>TXM + số</strong> (ví dụ:
                      TXM123456)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>
                      Nếu trạng thái không cập nhật quá 24h, liên hệ CSKH để
                      kiểm tra
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>
                      Sau <strong>Thông quan</strong>, hàng sẽ được gán{" "}
                      <strong>Phát hàng</strong> và giao nội địa
                    </span>
                  </li>
                </ul>
              </div>

              {/* Note */}
              <div className="mt-7 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                Thông tin demo chỉ mang tính minh họa
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 pb-4 border-b-4 border-yellow-400 flex items-center gap-3">
              <Truck className="w-7 h-7 text-yellow-600" />
              Câu hỏi thường gặp
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              {/* FAQ Item 1 */}
              <motion.div
                className="border-l-4 border-yellow-500 pl-7 py-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.0 }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Bao lâu tiến độ được cập nhật?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Thông thường mỗi mốc xử lý sẽ được cập nhật trong vòng 1–3 giờ
                  làm việc; các mốc bay/đến sân bay phụ thuộc lịch của hãng vận
                  chuyển.
                </p>
              </motion.div>

              {/* FAQ Item 2 */}
              <motion.div
                className="border-l-4 border-yellow-500 pl-7 py-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Tôi có thể lấy số AWB/MAWB không?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Có. Sau khi đơn được gán chuyến bay, bạn có thể yêu cầu cung
                  cấp số HAWB/MAWB để đối chiếu hoặc làm chứng từ.
                </p>
              </motion.div>

              {/* FAQ Item 3 */}
              <motion.div
                className="border-l-4 border-yellow-500 pl-7 py-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  ETA có thể thay đổi không?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Có. ETA phụ thuộc lịch bay thực tế và tình trạng thông quan.
                  Nếu có thay đổi, hệ thống sẽ cập nhật lại thời gian dự kiến
                  sớm nhất có thể.
                </p>
              </motion.div>

              {/* FAQ Item 4 */}
              <motion.div
                className="border-l-4 border-yellow-500 pl-7 py-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Hàng tôi tới VN nhưng lâu giao?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Có thể đơn đang chờ thông quan hoặc chờ gom tuyến giao nội
                  địa. Bạn có thể liên hệ CSKH để được kiểm tra và ưu tiên phát
                  hàng nếu cần gấp.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuideTracking;
