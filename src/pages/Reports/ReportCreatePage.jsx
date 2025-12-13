import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// key in localStorage
const STORAGE_KEY = "reports_data";

// some example managers (you can load from API later)
const MANAGERS = [
  { id: "m1", name: "رئيس قسم الموارد البشرية" },
  { id: "m2", name: "رئيس قسم الأنشطة" },
  { id: "m3", name: "رئيس القسم المالي" },
];

function saveReport(report) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default function ReportCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("تقرير أسبوعي");
  const [textContent, setTextContent] = useState("");
  const [assignedTo, setAssignedTo] = useState(MANAGERS[0].id);
  const [files, setFiles] = useState([]); // store File objects

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files);
    setFiles(chosen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !department.trim()) {
      alert("الرجاء تعبئة العنوان والكاتب والقسم.");
      return;
    }

    // convert files to serializable objects (store metadata + data URL)
    const filePromises = files.map(
      (file) =>
        new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () =>
            res({
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: reader.result,
            });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(filePromises).then((fileObjs) => {
      const now = new Date();
      const report = {
        id: "r" + Date.now(),
        title: title.trim(),
        author: author.trim(),
        department: department.trim(),
        type,
        textContent,
        assignedTo,
        files: fileObjs,
        status: "مرفوع",
        notes: "",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      saveReport(report);
      // go to reports list or detail
      navigate("/reports");
    });
  };

  return (
    <div className="justify-between mx-auto  p-6 ">
        <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab] text-right">رفع تقرير جديد</h1>
</div>

      <form  data-aos="fade-zoom-in" className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow " onSubmit={handleSubmit}>
        <div className="mb-4 text-right justify-right">
          <label className="block mb-1 font-medium">العنوان</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded text-right" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-right">
            <label className="block mb-1 font-medium">الكاتب</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 border rounded text-right" />
          </div>
          <div className="text-right">
            <label className="block mb-1 font-medium">القسم</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-3 border rounded text-right" />
          </div>
          <div className="text-right">
            <label className="block mb-1 font-medium">نوع التقرير</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border rounded text-right">
              <option>تقرير أسبوعي</option>
              <option>تقرير شهري</option>
              <option>تقرير حالة</option>
              <option>تقرير مشاكل</option>
              <option>تقرير إنجازات</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">نص التقرير (اختياري)</label>
          <textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} rows={6} className="w-full p-3 border rounded text-right" />
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">إسناد إلى (رئيس قسم)</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full p-3 border rounded text-right">
            {MANAGERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 text-right">
          <label className="block mb-1 font-medium">رفع ملفات (PDF, Word, Excel, صور)</label>
          <input type="file" multiple onChange={handleFiles} className="w-full" />
          {files.length > 0 && (
            <ul className="mt-2 text-sm">
              {files.map((f, i) => (
                <li key={i} className="py-1">{f.name} ({Math.round(f.size / 1024)} KB)</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button type="submit" className="px-6 py-2 bg-[#1056ab] text-white rounded">رفع التقرير</button>
          <button type="button" onClick={() => navigate("/reports")} className="px-4 py-2 border rounded">إلغاء</button>
        </div>
      </form></div>
    
  );
}
