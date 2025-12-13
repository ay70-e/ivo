import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const STORAGE_KEY = "reports_data";
const MANAGERS = {
  m1: "رئيس قسم الموارد البشرية",
  m2: "رئيس قسم الأنشطة",
  m3: "رئيس القسم المالي",
};

function loadReports() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveReports(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [actionNotes, setActionNotes] = useState("");

  useEffect(() => {
    const arr = loadReports();
    const found = arr.find((r) => r.id === id);
    setReport(found || null);
  }, [id]);

  if (!report) {
    return <div className="p-6">التقرير غير موجود.</div>;
  }

  const updateStatus = (newStatus) => {
    const arr = loadReports();
    const idx = arr.findIndex((r) => r.id === id);
    if (idx === -1) return;
    arr[idx] = {
      ...arr[idx],
      status: newStatus,
      notes: newStatus === "مرفوض" ? actionNotes : "",
      updatedAt: new Date().toISOString(),
    };
    saveReports(arr);
    setReport(arr[idx]);
    alert("تم تحديث حالة التقرير إلى: " + newStatus);
  };

  return (
    <div className="p-6 max-w-3xl justify-between mx-auto ">
     
      
      <h1 className="text-2xl font-bold mb-2 text-[#1056ab] text-right">{report.title}</h1>
      
      <div  className="text-sm  text-gray-600 text-right mb-4 flex justify-between">
         <button onClick={() => navigate(-1)} className=" px-3 py-1 border-full rounded mb-4 text-white bg-[#ef6b23]">رجوع</button>
         {new Date(report.createdAt).toLocaleString()} 
         <p> {report.author} • {report.department} </p>
      </div>
      <div  data-aos="fade-zoom-in" className="bg-white p-4 rounded shadow text-right mb-4">
      <div className=" p-4 text-right mb-4">
        <strong>نوع التقرير:</strong> {report.type} <br />
        <strong>حالة التقرير:</strong> {report.status} <br />
        <strong>مُسنَد إلى:</strong> {MANAGERS[report.assignedTo] || report.assignedTo}
        
      </div>
      <div>
        <hr />
      </div>
      <div className=" p-4 text-right mb-4">
        <h3 className="font-semibold mb-2">محتوى التقرير</h3>
        <p className="whitespace-pre-wrap">{report.textContent || "(لا يوجد محتوى نصي)"}</p>
      </div>
       <div>
        <hr />
      </div>
      <div className=" p-4  text-right mb-4">
        <h3 className="font-semibold mb-2">الملفات المرفقة</h3>
        <ul>
          {report.files && report.files.length > 0 ? (
            report.files.map((f, i) => (
              <li key={i} className="mb-2 flex items-center justify-between">
                <div className="flex gap-2">
                  <a href={f.dataUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded">فتح</a>
                  <a href={f.dataUrl} download={f.name} className="px-3 py-1 bg-green-600 text-white rounded">تحميل</a>
                </div>
                
                <div className="text-sm">
                  {f.name} • {(f.size / 1024).toFixed(1)} KB
                </div>
                
              </li>
            ))
          ) : (
            <div className="text-sm text-gray-500">لا يوجد ملفات مرفقة.</div>
          )}
        </ul>
      </div>
      <div>
        <hr />
      </div>
      {/* Manager actions */}
      <div className=" p-4 ">
        <h3 className="font-semibold mb-2">إجراءات المراجع</h3>

        <div className="mb-3">
          <label className="block mb-1">ملاحظات (عند الرفض)</label>
          <textarea className="w-full p-3 border rounded text-right" rows={3} value={actionNotes} onChange={(e) => setActionNotes(e.target.value)} />
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={() => updateStatus("قيد المراجعة")} className="px-3 py-1 bg-yellow-500 text-white rounded">وضع قيد المراجعة</button>
          <button onClick={() => updateStatus("معتمد")} className="px-3 py-1 bg-green-600 text-white rounded">اعتماد</button>
          <button onClick={() => {
            if (!actionNotes.trim()) { if(!confirm('لم تكتب ملاحظات. هل تريد المتابعة والرفض بدون ملاحظات؟')) return; }
            updateStatus("مرفوض");
          }} className="px-3 py-1 bg-red-600 text-white rounded">رفض</button>
        </div>
      </div></div>
    </div>
  );
}
