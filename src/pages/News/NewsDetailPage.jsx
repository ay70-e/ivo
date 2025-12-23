import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiDelete } from "../../api";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchNews() {
      try {
        const data = await apiGet(`/api/news/${id}`);
        if (mounted) setNews(data);
      } catch (err) {
        if (mounted) setNews(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchNews();
    return () => (mounted = false);
  }, [id]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const canEditOrDelete = (() => {
    if (!user) return false;
    if (user.role === "مدير") return true; // مدير can edit/delete all
    if (user.role === "مشرف" && news && news.userId === user.id) return true; // مشرف only their own
    return false;
  })();

  async function handleDelete() {
    if (!window.confirm("حذف هذا الخبر؟")) return;
    try {
      await apiDelete(`/api/news/${id}`);
      navigate("/news");
    } catch (err) {
      alert("فشل حذف الخبر");
    }
  }

  if (loading) return <div className="p-6">جاري التحميل</div>;
  if (!news) return <div className="p-6">الخبر غير موجود</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#ef6b23] text-white rounded"
        >
          رجوع
        </button>
        {canEditOrDelete && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/news/edit/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              تعديل
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              حذف
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2 text-[#1056ab] text-right">
        {news.title}
      </h1>

      <div className="text-right text-sm text-gray-600 mb-4">
        الفئة: {news.category}
        <p>{new Date(news.createdAt || news.publishDate).toLocaleString()} :تاريخ النشر</p>
      </div>
 <div className="bg-white rounded shadow p-4 text-right">
      <div className=" p-4 text-right">
        <p className="leading-8 whitespace-pre-wrap">{news.content}</p>
      </div>
   <div><hr></hr></div>
      {news.media?.length > 0 && (
        <div className="mt-6 text-right">
          <h3 className="font-semibold mb-3">الصور / الفيديوهات</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {news.media.map((m, i) => (
              <div key={i} className="border p-2 rounded">
                {m.type?.startsWith("image") ? (
                  <img src={m.dataUrl || m.url} className="rounded" alt="" />
                ) : (
                  <video src={m.dataUrl || m.url} controls className="rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
 <div className="mt-8"><hr></hr></div>
      {news.tags?.length > 0 && (
        <div className="mt-6 text-right">
          <h3 className="font-semibold mb-2">الوسوم</h3>
          <div className="flex flex-wrap gap-2 justify-end">
            {news.tags.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div></div>
  );
}
