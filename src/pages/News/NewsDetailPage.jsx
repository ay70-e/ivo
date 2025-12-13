import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "news_data";

function loadNews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const arr = loadNews();
    const found = arr.find((n) => n.id === id);
    setNews(found);
  }, [id]);

  if (!news) return <div className="p-6">الخبر غير موجود.</div>;

  return (
    <div className="p-6 max-w-4xl justify-between mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 px-3 py-1  border-full rounded  text-white bg-[#ef6b23]">
        رجوع
      </button>

      <h1 className="text-3xl font-bold mb-2 text-[#1056ab] text-right">{news.title}</h1>

      <div className="text-right text-sm text-gray-600 mb-4">
        الفئة: {news.category}<p className="text-right">
 
        {new Date(news.publishDate).toLocaleString()} :تاريخ نشر الخبر</p>
      </div>
      <div  data-aos="fade-zoom-in" className="bg-white rounded shadow">
      <div className=" p-4  text-right mb-4">
        <p className="leading-8 whitespace-pre-wrap">{news.content}</p>
      </div>
      <div>
        <hr className="mr-4 ml-4"/>
       </div>
      {news.media.length > 0 && (
        <div className=" p-4  text-right mb-4">
          <h3 className="font-semibold mb-3">الصور / الفيديوهات</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-between mx-auto">
            {news.media.map((m, i) => (
              <div key={i} className="border p-2 rounded">
                {m.type.startsWith("image") ? (
                  <img src={m.dataUrl} className="rounded" />
                ) : (
                  <video src={m.dataUrl} controls className="rounded"></video>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
       <div>
        <hr className="mr-4 ml-4"/>
       </div>
      <div className=" p-4  text-right">
        <h3 className="font-semibold mb-2">الوسوم</h3>
        <div className="flex flex-wrap gap-2 justify-end">
          {news.tags.map((t, i) => (
            <div key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
