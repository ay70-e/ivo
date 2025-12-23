import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost, apiPostFormData } from "../../api";

const TAGS = ["خبر", "تقرير اداري", "بحث", "قوانين"];
const CATEGORIES = ["أكاديمية", "إدارية", "عامة"];
const MANAGERS = [
  { id: "m1", name: "رئيس قسم الموارد البشرية" },
  { id: "m2", name: "رئيس قسم الأنشطة" },
  { id: "m3", name: "رئيس القسم المالي" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ContentCreatePage() {
  const navigate = useNavigate();

  const [contentType, setContentType] = useState("news");
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [department, setDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState(MANAGERS[0].id);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState([]);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const oversize = selectedFiles.find((f) => f.size > MAX_FILE_SIZE);
    if (oversize) {
      alert(`الملف "${oversize.name}" أكبر من الحد المسموح (5MB).`);
      return;
    }
    setFiles(selectedFiles);

    if (
      selectedFiles.some(
        (f) => !f.type.startsWith("image") && !f.type.startsWith("video")
      )
    ) {
      setContentType("report");
    } else {
      setContentType("news");
    }
  };

  const handleTags = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setTags(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || (!textContent.trim() && files.length === 0)) {
      alert("الرجاء تعبئة العنوان والمحتوى أو رفع ملف.");
      return;
    }

    try {
      if (contentType === "report") {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("notes", textContent);
        formData.append("department", department);
        formData.append("assignedTo", assignedTo);
        files.forEach((file) => formData.append("files", file));

        await apiPostFormData("/api/reports", formData);
        navigate("/reports");
      } else {
        const fileObjs = await Promise.all(
          files.map(
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
          )
        );

        const payload = {
          title,
          content: textContent,
          category,
          tags,        
          media: fileObjs,
        };

        await apiPost("/api/news", payload);
        navigate("/news");
      }
    } catch (err) {
      console.error(err);
      alert("فشل الإرسال، تحقق من الاتصال بالخادم.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab] text-right">
        إضافة محتوى جديد
      </h1>

      <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">العنوان</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded text-right"
          />
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">
            {contentType === "report" ? "نص التقرير" : "محتوى الخبر"}
          </label>
          <textarea
            rows={6}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full p-3 border rounded text-right"
          />
        </div>

       {contentType === "news" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="text-right">
      <label className="block mb-1 font-medium">الفئة</label>
      <select
        className="w-full p-3 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    <div className="text-right">
      <label className="block mb-1 font-medium">الوسوم</label>
      <div className="flex flex-col gap-2 border p-3 rounded max-h-40 overflow-y-auto">
        {TAGS.map(tag => (
          <label key={tag} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={tag}
              checked={tags.includes(tag)}
              onChange={() => {
                setTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
              }}
            />
            {tag}
          </label>
        ))}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        الوسوم المختارة: {tags.join(", ") || "لا يوجد"}
      </p>
    </div>
  </div>
)}


        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">رفع ملفات</label>
          <input type="file" multiple onChange={handleFiles} />
          {files.length > 0 && (
            <ul className="mt-2 text-sm">
              {files.map((f, i) => (
                <li key={i}>{f.name} ({Math.round(f.size/1024)} KB)</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-between">
          <button className="px-6 py-2 bg-[#1056ab] text-white rounded">
            رفع المحتوى
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(contentType === "report" ? "/reports" : "/news")
            }
            className="px-4 py-2 border rounded"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
