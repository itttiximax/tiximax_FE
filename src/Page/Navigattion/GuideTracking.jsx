import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Barcode,
  ClipboardList,
  PlaneTakeoff,
  Plane,
  PlaneLanding,
  Truck,
  PackageSearch,
  CheckCircle2,
  CircleAlert,
  Clock,
  MapPin,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

/**
 * GuideTracking.jsx — Tiximax
 * Hướng dẫn tra cứu đơn hàng (tone vàng – trắng – đen)
 * - Hero + ô tra cứu mã vận đơn/mã kiện
 * - Mô phỏng API: nhập mã demo để hiện chi tiết (VD: TXM123456, TXM987654)
 * - Dòng thời gian (timeline) trạng thái + tiến độ (progress)
 * - Bảng legend trạng thái & ý nghĩa
 * - FAQ + mẹo xử lý tình huống
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

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
    status: "linehaul",
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

const LegendRow = ({ code }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100">
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_META[code].color}`}
      ></span>
      <span className="text-sm font-medium text-gray-900">
        {STATUS_META[code].label}
      </span>
    </div>
    <span className="text-xs text-gray-600">{STATUS_META[code].desc}</span>
  </div>
);

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
      // Không tìm thấy demo
      setResult({ trackingNo: key, notFound: true });
    }
  };

  const progress = useMemo(
    () => percentageFromStatus(result?.status || "created"),
    [result]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-yellow-50/40 text-gray-900">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-yellow-200 to-transparent opacity-70 -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-24 lg:pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              <Search className="w-3.5 h-3.5" /> Hướng dẫn tra cứu đơn hàng
            </span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-black leading-tight">
              Tra cứu tình trạng đơn — nhanh, rõ, minh bạch.
            </h1>
            <p className="mt-4 text-gray-700 text-lg leading-8">
              Nhập mã kiện/mã vận đơn Tiximax (ví dụ: TXM123456) để xem trạng
              thái chi tiết và mốc thời gian.
            </p>
          </motion.div>

          {/* Search box */}
          <form onSubmit={onSearch} className="mt-6 max-w-3xl">
            <div className="flex gap-2 bg-white rounded-2xl border border-yellow-200 p-2 shadow-sm">
              <div className="flex items-center gap-2 flex-1 px-2">
                <Barcode className="w-5 h-5 text-yellow-700" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã: TXM123456"
                  className="w-full text-base outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
              >
                Tra cứu
              </button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <CircleAlert className="w-4 h-4" /> {error}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* RESULT */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {!result ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Mẹo: Thử mã <span className="font-semibold">TXM123456</span> hoặc{" "}
              <span className="font-semibold">TXM987654</span> để xem ví dụ hiển
              thị.
            </div>
          ) : result.notFound ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-sm text-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CircleAlert className="w-5 h-5 text-yellow-700" />
                <span>
                  Không tìm thấy thông tin cho mã{" "}
                  <strong>{result.trackingNo}</strong>. Vui lòng kiểm tra lại
                  chính tả hoặc liên hệ CSKH.
                </span>
              </div>
              <button
                onClick={() => {
                  setCode("");
                  setResult(null);
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 bg-white px-3 py-2 rounded-xl border border-yellow-200 hover:bg-yellow-50"
              >
                <RefreshCcw className="w-4 h-4" /> Tra cứu mã khác
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Left: Summary + progress */}
              <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm text-gray-600">Mã theo dõi</div>
                <div className="text-xl font-extrabold">
                  {result.trackingNo}
                </div>
                <div className="mt-2 text-sm text-gray-600">Tuyến</div>
                <div className="font-semibold text-gray-900">
                  {result.route}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Tiến độ</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-yellow-200 p-3">
                    <div className="text-gray-600">Trạng thái</div>
                    <div className="font-semibold flex items-center gap-2">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          STATUS_META[result.status]?.color || "bg-gray-400"
                        }`}
                      ></span>
                      {STATUS_META[result.status]?.label || result.status}
                    </div>
                  </div>
                  <div className="rounded-xl border border-yellow-200 p-3">
                    <div className="text-gray-600">ETA dự kiến</div>
                    <div className="font-semibold">{result.eta || "—"}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-yellow-700" /> Thông tin
                  chỉ mang tính minh hoạ demo.
                </div>
              </div>

              {/* Middle: Timeline */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-yellow-700 font-semibold">
                  <ClipboardList className="w-5 h-5" /> Dòng thời gian trạng
                  thái
                </div>
                <ul className="mt-4 space-y-4">
                  {result.checkpoints.map((cp, idx) => {
                    const Icon = cp.icon || PackageSearch;
                    return (
                      <li
                        key={cp.ts + cp.code}
                        className="flex items-start gap-3"
                      >
                        <div className="relative pt-1">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${
                              STATUS_META[cp.code]?.color || "bg-gray-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          {idx < result.checkpoints.length - 1 && (
                            <span className="absolute left-1/2 -translate-x-1/2 top-8 w-0.5 h-6 bg-gray-200"></span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {cp.name}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> {cp.ts}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LEGEND + TIPS */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold">
              <PackageSearch className="w-5 h-5" /> Ý nghĩa các trạng thái
            </div>
            <div className="mt-3 divide-y divide-gray-100">
              {STATUS_ORDER.map((s) => (
                <LegendRow key={s} code={s} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold">
              <MapPin className="w-5 h-5" /> Mẹo tra cứu
            </div>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              <li>
                • Mã Tiximax có dạng <strong>TXM + số</strong> (ví dụ:
                TXM123456).
              </li>
              <li>
                • Nếu lộ trình không cập nhật quá 24h, hãy liên hệ CSKH để kiểm
                tra tuyến bay/HL AWB.
              </li>
              <li>
                • Sau trạng thái <strong>Thông quan</strong>, hàng sẽ được gán{" "}
                <strong>Phát hàng</strong> và giao nội địa.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5" /> Câu hỏi thường gặp
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <details className="rounded-xl border border-gray-100 p-4">
                <summary className="font-semibold cursor-pointer">
                  Bao lâu tiến độ được cập nhật?
                </summary>
                <p className="mt-2">
                  Thông thường mỗi mốc xử lý sẽ cập nhật trong vòng 1–3 giờ làm
                  việc; mốc bay/đến sân bay phụ thuộc hãng.
                </p>
              </details>
              <details className="rounded-xl border border-gray-100 p-4">
                <summary className="font-semibold cursor-pointer">
                  Tôi có thể lấy số AWB/MAWB không?
                </summary>
                <p className="mt-2">
                  Có, sau khi gán chuyến bay, bạn có thể yêu cầu cung cấp số
                  HAWB/MAWB để đối chiếu.
                </p>
              </details>
              <details className="rounded-xl border border-gray-100 p-4">
                <summary className="font-semibold cursor-pointer">
                  ETA có thể thay đổi không?
                </summary>
                <p className="mt-2">
                  Có. ETA phụ thuộc lịch bay thực tế và tình trạng thông quan;
                  sẽ được cập nhật ngay khi có thay đổi.
                </p>
              </details>
              <details className="rounded-xl border border-gray-100 p-4">
                <summary className="font-semibold cursor-pointer">
                  Hàng tôi tới VN nhưng lâu giao?
                </summary>
                <p className="mt-2">
                  Khả năng chờ thông quan hoặc hàng đang gom tuyến nội địa. Liên
                  hệ CSKH để được ưu tiên phát hàng.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GuideTracking;
