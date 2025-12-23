import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPut } from "../../api";

export default function NewsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [media, setMedia] = useState([]);
  const [newFile, setNewFile] = useState(null);

  // ===== Load news =====
  useEffect(() => {
    async function load() {
      try {
        const n = await apiGet(`/api/news/${id}`);
        setTitle(n.title || "");
        setCategory(n.category || "");
        setTagsInput((n.tags || []).join(", "));
        setPublishDate(
          n.publishDate ? n.publishDate.substring(0, 16) : ""
        );
        setMedia(n.media || []);
      } catch (err) {
        alert("الخبر غير موجود");
        navigate("/news");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  // ===== File preview (temporary – frontend only) =====
  function handleNewFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewFile({
        name: file.name,
        type: file.type,
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  // ===== Save =====
  async function handleSave(e) {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      category,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publishDate: publishDate
        ? new Date(publishDate).toISOString()
        : null,
      media: newFile ? [newFile, ...media] : media,
    };

    try {
      await apiPut(`/api/news/${id}`, payload);
      alert("تم حفظ التعديلات");
      navigate(`/news/detail/${id}`);
    } catch (err) {
      alert("فشل حفظ التعديلات");
    }
  }

  function removeMedia(index) {
    if (!window.confirm("حذف هذا المرفق؟")) return;
    setMedia((prev) => prev.filter((_, i) => i !== index));
  }

  if (loading) {
    return <div className="p-6 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-right">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab]">
        تعديل الخبر
      </h1>

      <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleSave}>
        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">العنوان</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">الفئة</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">الوسوم</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="مثال: تعليم, تقنية"
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">موعد النشر</label>
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>
        </div>

        {/* Upload */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">إضافة ملف</label>
          <input type="file" onChange={handleNewFile} />
          {newFile && (
            <div className="text-sm mt-1 text-gray-600">
              سيتم إضافة: {newFile.name}
            </div>
          )}
        </div>

        {/* Media */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">المرفقات</label>

          {media.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد مرفقات</p>
          ) : (
            <ul className="space-y-2">
              {media.map((m, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span className="text-sm">
                    {m.name || `ملف ${i + 1}`}
                  </span>

                  <div className="flex gap-2">
                    {m.type?.startsWith("image") && (
                      <img
                        src={m.dataUrl || m.url}
                        alt=""
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-6 py-2 bg-[#1056ab] text-white rounded"
          >
            حفظ
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
