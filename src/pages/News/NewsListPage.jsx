import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../../api";

export default function NewsListPage() {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const canCreate = user && (user.role === "مشرف" || user.role === "مدير");
  const canEditOrDelete = (n) => {
    if (!user) return false;
    if (user.role === "مدير") return true;
    if (user.role === "مشرف" && n.userId === user.id) return true;
    return false;
  };

  // ===== Load news from backend =====
  useEffect(() => {
    async function loadNews() {
      try {
        const res = await apiGet("/api/news");
        setNews(res);
      } catch (err) {
        console.error("Failed to load news", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // ===== Delete news =====
  async function deleteNews(id) {
    if (!window.confirm("هل أنت متأكد من حذف الخبر؟")) return;

    try {
      await apiDelete(`/api/news/${id}`);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert("فشل حذف الخبر");
    }
  }

  // ===== Search & Filter =====
  const filtered = news.filter((n) => {
    const s = search.toLowerCase();

    const matchSearch =
      !s ||
      n.title.toLowerCase().includes(s) ||
      (n.category || "").toLowerCase().includes(s) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(s));

    const matchFilter = filter === "all" ? true : n.category === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 text-right">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {canCreate && <button
          onClick={() => navigate("/news/create")}
          className="px-4 py-2 bg-[#1056ab] text-white rounded"
        >
          إضافة خبر
        </button>}

        <h1 className="text-2xl font-bold text-[#1056ab]">الأخبار</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4 justify-end text-right">
        <input
          placeholder="...ابحث "
          className="p-3 border rounded-full flex-1 text-right"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-2xl"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">كل الفئات</option>
          <option>أكاديمية</option>
          <option>إدارية</option>
          <option>تقنية</option>
          <option>عامة</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white max-w-4xl mx-auto shadow">
        {loading ? (
          <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">لا توجد أخبار</div>
        ) : (
          <ul className="divide-y-4">
                       

            {filtered.map((n) => (
              <li
                key={n.id}
                className= "p-4 border-b flex justify-between items-center hover:bg-gray-50 "
                onClick={() => navigate(`/news/detail/${n.id}`)}
              >
                <div className="flex justify-between items-center w-full">
                
                   {/* Actions */}
                  {canEditOrDelete(n) && <div className=" gap-2 flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/news/edit/${n.id}`);
                      }}
                      className="px-3  bg-blue-600 text-white rounded"
                    >
                      تعديل
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNews(n.id);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      حذف
                    </button>
                  </div>}

                    {/* Info */}
                  <div className="flex-1">
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-sm text-gray-600">
                      {n.category} •{" "}
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                  :    الوسوم {(n.tags || []).join(", ")}
                    </div>
                  </div>

                 
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
