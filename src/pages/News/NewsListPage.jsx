import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "news_data";

function loadNews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveNews(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function NewsListPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setNews(loadNews());
  }, []);

  // 👉 حذف الخبر
  const deleteNews = (id) => {
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    saveNews(updated);
  };

  const filtered = news.filter((n) => {
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      n.title.toLowerCase().includes(s) ||
      n.category.toLowerCase().includes(s) ||
      n.tags.some((t) => t.toLowerCase().includes(s));

    const matchFilter = filter === "all" ? true : n.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/news/create")}
          className="px-4 py-2 bg-[#1056ab] text-white rounded"
        >
          إضافة خبر
        </button>
        <h1 className="text-2xl font-bold text-[#1056ab] text-right">
          الأخبار
        </h1>
        
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="بحث حسب العنوان أو الفئة أو الوسوم..."
          className="p-3 border rounded flex-1 text-right"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">كل الفئات</option>
          <option>أكاديمية</option>
          <option>إدارية</option>
          <option>مالية</option>
          <option>تقنية</option>
          <option>عامة</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white   overflow-hidden max-w-4xl mx-auto ">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">لا توجد أخبار</div>
        ) : (
          <ul>
            {filtered.map((n) => (
              <li
                key={n.id}
                className="p-4 border-b-4  hover:bg-gray-50 cursor-pointer justify-between items-center "
                onClick={() => navigate(`/news/detail/${n.id}`)}
              >
               
                <div className="flex gap-2">
                  
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNews(n.id);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    حذف
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/news/edit/${n.id}`);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    تعديل
                  </button>

                 
                
                </div>

                <div  data-aos="fade-zoom-in" className="text-right flex-1">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-gray-600">
                    {n.category} • {new Date(n.publishDate).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    الوسوم: {n.tags.join(", ")}
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
