import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";

export default function ArchivePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [news, reports] = await Promise.all([apiGet("/api/news"), apiGet("/api/reports")]);
        // normalize
        const mappedNews = news.map((n) => ({
          id: `news-${n.id}`,
          origId: n.id,
          name: n.title,
          tag: "خبر",
          date: n.createdAt || n.updatedAt || new Date().toISOString(),
          type: "خبر",
          kind: "news",
        }));
        const mappedReports = reports.map((r) => ({
          id: `report-${r.id}`,
          origId: r.id,
          name: r.title,
          tag: "تقرير",
          date: r.createdAt || r.updatedAt || new Date().toISOString(),
          type: "تقرير",
          kind: "reports",
        }));

        if (mounted) setData([...mappedNews, ...mappedReports]);
      } catch (err) {
        console.error("Failed to load archive", err);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // فلترة البحث
  const filtered = data
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.tag || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab] text-right">الأرشيف</h1>

      {/* Search + Sort */}
      <div className="flex items-center  justify-end gap-4 mb-6">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="...ابحث"
          className="w-1/2 border p-3 rounded-full flex-1 text-right"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Sort */}
        <select
          className="border p-3 rounded-2xl text-right"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">△</option>
          <option value="asc"> ▽</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-2xl">
          <thead className="bg-[#ef6b23] text-white text-right">
            <tr>
              <th className="p-3 border">الملف</th>
              <th className="p-3 border">النوع</th>
              <th className="p-3 border">التاريخ</th>
              <th className="p-3 border">الوسم</th>
              <th className="p-3 border">الاسم</th>
            </tr>
          </thead>

          <tbody className="text-right bg-white">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="border p-3">
                  <button
                    onClick={() => navigate(`/${item.kind}/detail/${item.origId}`)}
                    className="text-blue-600 hover:underline"
                  >
                    فتح
                  </button>
                </td>

                <td className="border p-3">{item.type}</td>
                <td className="border p-3">{item.date}</td>
                <td className="border p-3">{item.tag}</td>
                <td className="border p-3">{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center mt-4 text-gray-500">لا توجد نتائج مطابقة للبحث.</p>
        )}
      </div>
    </div>
  );
}
