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
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-300 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              TRA CỨU TÌNH TRẠNG ĐƠN HÀNG
            </h1>
            <p className="text-xl text-gray-800">
              Nhập mã kiện/mã vận đơn TIXIMAX để xem trạng thái chi tiết
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={onSearch} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-3 flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Barcode className="w-6 h-6 text-yellow-600" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã: TXM123456 hoặc TXM987654"
                  className="w-full text-lg outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-lg text-white font-bold bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Tra cứu
              </button>
            </div>
            {error && (
              <div className="mt-3 text-base text-red-700 flex items-center gap-2 justify-center">
                <CircleAlert className="w-5 h-5" /> {error}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Result Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {!result ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
              <p className="text-lg text-gray-700">
                💡 <span className="font-semibold">Mẹo:</span> Thử nhập mã{" "}
                <span className="bg-yellow-200 px-3 py-1 rounded font-bold">
                  TXM123456
                </span>{" "}
                hoặc{" "}
                <span className="bg-yellow-200 px-3 py-1 rounded font-bold">
                  TXM987654
                </span>{" "}
                để xem ví dụ
              </p>
            </div>
          ) : result.notFound ? (
            <div className="bg-white rounded-xl shadow-lg p-8 border-4 border-yellow-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CircleAlert className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Không tìm thấy thông tin
                    </h3>
                    <p className="text-gray-700 mt-1">
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
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg flex items-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" /> Tra cứu lại
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12">
              {/* Header Info */}
              <div className="mb-12 pb-8 border-b-4 border-yellow-400">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600 text-base mb-2">Mã theo dõi</p>
                    <p className="text-3xl font-black text-gray-900">
                      {result.trackingNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-base mb-2">Tuyến đường</p>
                    <p className="text-xl font-bold text-gray-900">
                      {result.route}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-base mb-2">ETA dự kiến</p>
                    <p className="text-xl font-bold text-gray-900">
                      {result.eta}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      Tiến độ vận chuyển
                    </span>
                    <span className="text-2xl font-black text-yellow-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${
                        STATUS_META[result.status]?.color
                      }`}
                    ></span>
                    <span className="text-lg font-bold text-gray-900">
                      {STATUS_META[result.status]?.label}
                    </span>
                    <span className="text-gray-600">
                      - {STATUS_META[result.status]?.desc}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-yellow-600" />
                  Dòng thời gian chi tiết
                </h3>
                <ul className="space-y-6 pl-8">
                  {result.checkpoints.map((cp, idx) => {
                    const Icon = cp.icon || PackageSearch;
                    return (
                      <li key={cp.ts + cp.code} className="relative">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <span
                              className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white ${
                                STATUS_META[cp.code]?.color || "bg-gray-400"
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                            </span>
                            {idx < result.checkpoints.length - 1 && (
                              <span className="absolute left-1/2 -translate-x-1/2 top-12 w-1 h-8 bg-gray-300"></span>
                            )}
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="text-xl font-bold text-gray-900 mb-1">
                              {cp.name}
                            </div>
                            <div className="text-base text-gray-600 flex items-center gap-2">
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
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-yellow-400 flex items-center gap-2">
                  <PackageSearch className="w-6 h-6 text-yellow-600" />Ý nghĩa
                  các trạng thái
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {STATUS_ORDER.map((code) => (
                    <div
                      key={code}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded-full ${STATUS_META[code].color}`}
                      ></span>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {STATUS_META[code].label}
                        </p>
                        <p className="text-gray-600">
                          {STATUS_META[code].desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
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
              <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                Thông tin demo chỉ mang tính minh họa
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-yellow-400 flex items-center gap-2">
              <Truck className="w-7 h-7 text-yellow-600" />
              Câu hỏi thường gặp
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-yellow-500 pl-6 py-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Bao lâu tiến độ được cập nhật?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Thông thường mỗi mốc xử lý sẽ cập nhật trong vòng 1–3 giờ làm
                  việc; mốc bay/đến sân bay phụ thuộc hãng.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tôi có thể lấy số AWB/MAWB không?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Có, sau khi gán chuyến bay, bạn có thể yêu cầu cung cấp số
                  HAWB/MAWB để đối chiếu.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ETA có thể thay đổi không?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Có. ETA phụ thuộc lịch bay thực tế và tình trạng thông quan;
                  sẽ được cập nhật ngay khi có thay đổi.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 py-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Hàng tôi tới VN nhưng lâu giao?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Khả năng chờ thông quan hoặc hàng đang gom tuyến nội địa. Liên
                  hệ CSKH để được ưu tiên phát hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuideTracking;
