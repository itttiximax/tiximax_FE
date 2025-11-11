import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Tag,
  Flame,
  ArrowRight,
  RefreshCcw,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * New.jsx — Tiximax
 * News/Blog page in a **magazine** layout, distinct from prior pages:
 * - Hero Featured with big image overlay
 * - Curated "Top Stories" horizontal scroll
 * - Masonry-like image grid (2 heights) for freshness
 * - Sidebar: Trending, Tags, Newsletter
 * - Category filter tabs (no external API)
 * Tailwind + Framer Motion. You can replace image URLs with your CDN.
 */

const CATEGORIES = [
  "Tất cả",
  "Nhật – Việt",
  "Hàn – Việt",
  "Indo – Việt",
  "Mỹ – Việt",
  "Tips HQ",
  "Case study",
];

const POSTS = [
  {
    id: "p1",
    title: "Cập nhật lịch bay Nhật → Việt dịp cuối năm (slot gia tăng)",
    excerpt:
      "Các đường bay tăng slot giúp rút ngắn lead time 12–24h cho lô hàng thương mại.",
    image: "https://www.japan-guide.com/blog/g/koyo25_251107_fuji_feature.jpg",
    category: "Nhật – Việt",
    minutes: 4,
    date: "2025-11-09",
  },
  {
    id: "p2",
    title: "Checklist khai HQ hàng đấu giá: chuẩn bị chứng từ nào?",
    excerpt:
      "Từ invoice đến ảnh chụp tình trạng — 7 mục cần có để thông quan nhanh.",
    image: "https://lingvist.com/assets/images/posts/korea-main.jpeg",
    category: "Tips HQ",
    minutes: 6,
    date: "2025-11-05",
  },
  {
    id: "p3",
    title: "Kinh nghiệm gom lô tại Chiba: giảm cước 8–12%",
    excerpt:
      "Thực tế tuyến Nhật – Việt cho thấy pallet hoá đúng quy cách tiết kiệm đáng kể.",
    image:
      "https://i.pinimg.com/originals/c2/74/73/c274739a0f8b81fbf2e43db29866fd19.jpg",
    category: "Nhật – Việt",
    minutes: 5,
    date: "2025-11-01",
  },
  {
    id: "p4",
    title: "Case: Điện tử tiêu dùng Indo về VN trong 5 ngày",
    excerpt: "Tối ưu transit + làm trước hồ sơ — rút còn 5 ngày cửa-kho.",
    image:
      "https://media.vietravel.com/images/Content/dia-diem-du-lich-indonesia-1.png",
    category: "Indo – Việt",
    minutes: 3,
    date: "2025-10-28",
  },
  {
    id: "p5",
    title: "Hàn – Việt: set KPI thông quan mùa Tết",
    excerpt: "Gợi ý KPI theo ngành hàng và volume mùa cao điểm.",
    image:
      "https://migrationology.com/wp-content/uploads/2015/01/banh_mi_op_la_vietnamese_breakfast.jpg",
    category: "Hàn – Việt",
    minutes: 5,
    date: "2025-10-20",
  },
  {
    id: "p6",
    title: "US – VN: lựa chọn tuyến bay thẳng hay nối chuyến?",
    excerpt: "So sánh chi phí – lead time – rủi ro peak season.",
    image:
      "https://i.guim.co.uk/img/media/6c0ff8437724edd631e4a82454c954a9d55b353f/0_89_3500_2100/master/3500.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=ed1e65080df10b8b8383566c2aa3641d",
    category: "Mỹ – Việt",
    minutes: 7,
    date: "2025-10-12",
  },
];

const TRENDING = [
  { id: "t1", title: "Cập nhật quy định pin lithium", date: "2025-11-07" },
  { id: "t2", title: "Giảm 10% cước tuyến Nhật tuần 47", date: "2025-11-06" },
  { id: "t3", title: "Case: mỹ phẩm HQ xử lý tem nhãn", date: "2025-11-02" },
  { id: "t4", title: "Tỷ giá JPY/VND & tác động cước", date: "2025-10-30" },
];

const TAGS = [
  "auction",
  "storage",
  "shipping",
  "customs",
  "air-freight",
  "SLA",
  "tracking",
  "invoice",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const New = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tất cả");

  const filtered = useMemo(() => {
    const base =
      cat === "Tất cả" ? POSTS : POSTS.filter((p) => p.category === cat);
    const ql = q.trim().toLowerCase();
    return ql
      ? base.filter(
          (p) =>
            p.title.toLowerCase().includes(ql) ||
            p.excerpt.toLowerCase().includes(ql)
        )
      : base;
  }, [q, cat]);

  const featured = POSTS[0];
  const topStories = POSTS.slice(1, 5);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* HERO FEATURED (big image with overlay) */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 lg:pt-16">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured */}
            <motion.article
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-[360px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-6 md:p-8 text-white">
                <span className="inline-flex items-center gap-2 text-xs font-semibold bg-amber-500/90 rounded-full px-3 py-1">
                  <Newspaper className="w-3.5 h-3.5" /> {featured.category}
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-extrabold leading-tight">
                  {featured.title}
                </h1>
                <p className="mt-2 text-sm md:text-base text-white/90 max-w-3xl">
                  {featured.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featured.minutes}' đọc
                  </span>
                  <span>{featured.date}</span>
                </div>
                <Link
                  to={`/news/${featured.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  Đọc tiếp <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>

            {/* Sidebar: search + trending */}
            <aside className="lg:col-span-1">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tìm bài viết…"
                    className="w-full text-sm outline-none"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    Đang thịnh hành
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {TRENDING.map((t) => (
                      <li key={t.id} className="py-2 flex items-start gap-3">
                        <Flame className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <Link
                            to={`/news/${t.id}`}
                            className="text-sm font-medium text-gray-900 hover:underline"
                          >
                            {t.title}
                          </Link>
                          <div className="text-xs text-gray-500">{t.date}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 p-1"
              >
                <div className="rounded-2xl p-4 bg-white/90">
                  <h3 className="text-sm font-bold text-gray-900">
                    Nhận bản tin Tiximax
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">
                    Lịch bay, ưu đãi cước & quy định mới mỗi tuần.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <input
                      placeholder="Email của bạn"
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                    <button className="rounded-xl px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                      Đăng ký
                    </button>
                  </div>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* FILTER TABS + TOP STORIES (horizontal cards) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  cat === c
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white border-gray-200 text-gray-700 hover:border-amber-300"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => {
                setCat("Tất cả");
                setQ("");
              }}
              className="ml-auto flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700"
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          <div className="mt-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 min-w-max">
              {topStories.map((p) => (
                <article
                  key={p.id}
                  className="w-[280px] flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Tag className="w-3 h-3" /> {p.category}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-gray-900 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {p.excerpt}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {p.minutes}'
                      </span>
                      <span>{p.date}</span>
                    </div>
                    <Link
                      to={`/news/${p.id}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700"
                    >
                      Đọc <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MASONRY GRID (two heights) */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, idx) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.02 }}
                className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
              >
                <div className={`relative ${idx % 3 === 0 ? "h-64" : "h-48"}`}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50/90 px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" /> {p.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-extrabold text-gray-900 line-clamp-2 group-hover:underline">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {p.excerpt}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {p.minutes}'
                    </span>
                    <span>{p.date}</span>
                  </div>
                  <Link
                    to={`/news/${p.id}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-700"
                  >
                    Đọc tiếp <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Tags cloud */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                className="px-3 py-1.5 rounded-full text-xs bg-white border border-gray-200 text-gray-700 hover:border-amber-300"
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Pagination (static UI demo) */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-xl border text-sm font-semibold ${
                  i === 0
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-700 border-gray-200 hover:border-amber-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default New;
