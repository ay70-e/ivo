import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPut, apiDelete } from "../../api";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [actionNotes, setActionNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // تحميل التقرير عند التحميل
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiGet(`/api/reports/${id}`);
        if (mounted) setReport(data);
      } catch (err) {
        if (mounted) setReport(null);
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  // صلاحيات المستخدم
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const canManage = (() => {
    if (!user) return false;
    if (user.role === "مدير") return true;
    if (user.role === "مشرف" && report && report.userId === user.id) return true;
    return false;
  })();

  // تحديث الحالة
  async function updateStatus(newStatus) {
  try {
    const payload = { status: newStatus };
    if (newStatus === "مرفوض") payload.notes = actionNotes || "";

    // استدعاء API
    const updated = await apiPut(`/api/reports/${id}`, payload);

    // تحديث state مباشرة بالتقرير الجديد
    setReport(prev => ({ ...prev, ...updated })); 

    alert("تم تحديث حالة التقرير إلى: " + newStatus);
  } catch (err) {
    console.error(err);
    alert("فشل تحديث الحالة");
  }
}


  // حذف التقرير
  async function handleDelete() {
    if (!window.confirm("حذف هذا التقرير؟")) return;
    try {
      await apiDelete(`/api/reports/${id}`);
      navigate("/reports");
    } catch (err) {
      console.error(err);
      alert("فشل حذف التقرير");
    }
  }

  if (loading) return <div className="p-6">جاري التحميل</div>;
  if (!report) return <div className="p-6">التقرير غير موجود</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-[#ef6b23] text-white rounded mb-4"
      >
        رجوع
      </button>

      <h1 className="text-2xl font-bold mb-2 text-[#1056ab] text-right">
        {report.title}
      </h1>

      <div className="text-right text-sm text-gray-600 mb-4">
        <p>حالة التقرير: {report.status || "غير محددة"}</p>
        <p>{new Date(report.createdAt).toLocaleString()} :تاريخ النشر</p>

      </div>

      {/* الملفات المرفقة */}
      <div className="bg-white p-4 rounded shadow text-right mb-4">
        <h3 className="font-semibold mb-2">الملفات المرفقة</h3>
        {report.fileUrls && report.fileUrls.length > 0 ? (
          <ul className="space-y-2">
            {report.fileUrls.map((file, i) => (
              <li
                key={i}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div className="flex gap-2">
                 
                  <a
                    href={`${import.meta.env.VITE_API_URL}${file}`}
                    download
                    className="text-green-600 underline"
                  >
                    تحميل
                  </a>

                </div>
                                 <span>ملف {i + 1}</span>

              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">لا يوجد ملفات مرفقة.</div>
        )}
      </div>

      {/* إجراءات المراجع */}
      {canManage && (
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">إجراءات المراجع</h3>
          <textarea
            className="w-full p-3 border rounded text-right"
            rows={3}
            placeholder="ملاحظات عند الرفض"
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => updateStatus("قيد المراجعة")}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              وضع قيد المراجعة
            </button>
            <button
              onClick={() => updateStatus("معتمد")}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              اعتماد
            </button>
            <button
              onClick={() => {
                if (
                  !actionNotes.trim() &&
                  !window.confirm(
                    "لم تكتب ملاحظات. هل تريد المتابعة والرفض بدون ملاحظات؟"
                  )
                )
                  return;
                updateStatus("مرفوض");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              رفض
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-800 text-white rounded"
            >
              حذف التقرير
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
