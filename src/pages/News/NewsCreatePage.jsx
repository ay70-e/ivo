import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "news_data";
const NOTIFY_KEY = "notifications_data";

const CATEGORIES = ["أكاديمية", "إدارية", "مالية", "تقنية", "عامة"];

function saveNews(news) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift(news);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function pushNotification(message) {
  const raw = localStorage.getItem(NOTIFY_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift({
    id: "n" + Date.now(),
    message,
    time: new Date().toISOString(),
    seen: false,
  });
  localStorage.setItem(NOTIFY_KEY, JSON.stringify(arr));
}

export default function NewsCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleMedia = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("الرجاء كتابة عنوان الخبر.");
      return;
    }

    const filePromises = mediaFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: reader.result,
            });
          reader.readAsDataURL(file);
        })
    );

    const storedFiles = await Promise.all(filePromises);

    const news = {
      id: "news" + Date.now(),
      title,
      content,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      media: storedFiles,
      publishDate: publishDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    saveNews(news);

    // send notification to users (local)
    pushNotification(`تم نشر خبر جديد: ${title}`);

    navigate("/news");
  };

  return (
    <div className="p-6 max-w-3xl justify-center mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab] text-right">إضافة خبر جديد</h1>

      <form  data-aos="fade-zoom-in" className="bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">عنوان الخبر</label>
          <input
            className="w-full p-3 border rounded text-right"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">محتوى الخبر</label>
          <textarea
            rows={6}
            className="w-full p-3 border rounded text-right"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-right">
            <label className="block mb-1 font-medium">الفئة</label>
            <select className="w-full p-3 border rounded" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <label className="block mb-1 font-medium">وسوم (tags)</label>
            <input
              placeholder="مثال: طلاب, قسم المالية"
              className="w-full p-3 border rounded text-right"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="text-right">
            <label className="block mb-1 font-medium">جدولة النشر</label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">رفع صور / فيديو</label>
          <input type="file" multiple onChange={handleMedia} />
        </div>

        <div className="flex justify-between">
          <button className="px-6 py-2 bg-[#1056ab] text-white rounded">
            نشر الخبر
          </button>
          <button
            type="button"
            onClick={() => navigate("/news")}
            className="px-4 py-2 border rounded"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
