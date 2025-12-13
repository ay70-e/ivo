import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "news_data";

function loadNews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveNews(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default function NewsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsItem, setNewsItem] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [mediaPreview, setMediaPreview] = useState([]); // dataUrls or fileUrls
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    const arr = loadNews();
    const found = arr.find((n) => String(n.id) === String(id));
    if (!found) {
      setNewsItem(null);
      return;
    }
    setNewsItem(found);
    setTitle(found.title || "");
    setCategory(found.category || "");
    setTagsInput((found.tags || []).join(", "));
    setPublishDate(found.publishDate ? found.publishDate.substring(0, 16) : ""); // for datetime-local
    setMediaPreview(found.media ? found.media : []);
  }, [id]);

  if (newsItem === null) {
    return (
      <div className="p-6">
        <div className="text-right">الخبر غير موجود أو تم حذفه.</div>
        <button onClick={() => navigate("/news")} className="mt-4 px-3 py-1 border rounded">رجوع</button>
      </div>
    );
  }

  // قراءة ملف جديد وتحويله إلى dataURL (ممكن تعديل لرفع إلى سيرفر لاحقاً)
  const handleNewFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const arr = loadNews();
    const idx = arr.findIndex((n) => String(n.id) === String(id));
    if (idx === -1) {
      alert("لم أجد الخبر للحفظ.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // إذا أضفنا ملف جديد نضعه في بداية مصفوفة media
    const updatedMedia = [...(newsItem.media || [])];
    if (newFile) {
      updatedMedia.unshift(newFile);
    }

    const updated = {
      ...arr[idx],
      title: title.trim(),
      category,
      tags,
      publishDate: publishDate ? new Date(publishDate).toISOString() : arr[idx].publishDate,
      media: updatedMedia,
      updatedAt: new Date().toISOString(),
    };

    arr[idx] = updated;
    saveNews(arr);
    alert("تم حفظ التعديلات.");
    navigate("/news"); // أو: navigate(`/news/detail/${id}`);
  };

  const handleDeleteMedia = (index) => {
    if (!confirm("هل تريد حذف هذا الملف المرفق؟")) return;
    const updatedMedia = (mediaPreview || []).filter((_, i) => i !== index);
    setMediaPreview(updatedMedia);

    // أيضاً نحدث newsItem فورياً (سيتم حفظ عند الضغط Save)
    setNewsItem({ ...newsItem, media: updatedMedia });
  };

  return (
    <div className="p-6 max-w-3xl justify-between mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab] text-right">تعديل الخبر</h1>

      <form  data-aos="fade-zoom-in" className="bg-white p-6 rounded-lg shadow" onSubmit={handleSave}>
        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">العنوان</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded text-right" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-right">
            <label className="block mb-1 font-medium">الفئة</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded text-right" />
          </div>

          <div className="text-right">
            <label className="block mb-1 font-medium">وسوم (Tags)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="فاصل بcoma" className="w-full p-3 border rounded text-right" />
          </div>

          <div className="text-right">
            <label className="block mb-1 font-medium">موعد النشر</label>
            <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full p-3 border rounded" />
          </div>
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">رفع ملف جديد (اختياري)</label>
          <input type="file" onChange={handleNewFile} />
          {newFile && <div className="mt-2 text-sm">سيتم إضافة: {newFile.name}</div>}
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">المرفقات الحالية</label>
          {mediaPreview && mediaPreview.length > 0 ? (
            <ul className="space-y-2">
              {mediaPreview.map((m, i) => (
                <li key={i} className="flex justify-between items-center border p-2 rounded">
                  <div className="text-sm">
                    {m.name || `ملف ${i+1}`} • {m.type}
                  </div>
                  <div className="flex gap-2">
                    {/* preview */}
                    {m.type && m.type.startsWith("image") && (
                      <img src={m.dataUrl || m.url} alt="" className="w-16 h-12 object-cover rounded" />
                    )}
                    {m.type && m.type.includes("pdf") && (
                      <a href={m.dataUrl || m.url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded">عرض PDF</a>
                    )}
                    {/* delete */}
                    <button type="button" onClick={() => handleDeleteMedia(i)} className="px-3 py-1 bg-red-600 text-white rounded">حذف</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">لا توجد مرفقات</div>
          )}
        </div>

        <div className="flex gap-3 justify-between">
          <button type="submit" className="px-6 py-2 bg-[#1056ab] text-white rounded">حفظ التعديلات</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">إلغاء</button>
        </div>
      </form>
    </div>
  );
}
