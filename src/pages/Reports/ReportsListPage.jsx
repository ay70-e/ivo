import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "reports_data";

function loadReports() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export default function ReportsListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all"); // all, my (author), status...
  const [search, setSearch] = useState("");

  useEffect(() => {
    setReports(loadReports());
  }, []);

  const handleDelete = (id) => {
    if (!confirm("هل تريد حذف هذا التقرير؟")) return;
    const updated = loadReports().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setReports(updated);
  };

  const filtered = reports.filter((r) => {
    const text = search.trim().toLowerCase();
    const matchSearch = !text || r.title.toLowerCase().includes(text) || r.author.toLowerCase().includes(text);
    const matchFilter = filter === "all" ? true : r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/reports/create")} className="px-4 py-2 bg-[#1056ab] text-white rounded">رفع تقرير جديد</button>
        <h1 className="text-2xl font-bold text-[#1056ab] text-right">التقارير</h1>
      </div>

      <div className="flex gap-3 mb-4">
        <input placeholder="...ابحث" className="p-3 border rounded-full flex-1 text-right" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="p-3 border rounded-full text-center" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">الكل</option>
          <option value="مرفوع">مرفوع</option>
          <option value="قيد المراجعة">قيد المراجعة</option>
          <option value="معتمد">معتمد</option>
          <option value="مرفوض">مرفوض</option>
        </select>
      </div>

      <div  data-aos="fade-zoom-in"
      className="bg-white  shadow overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">لا توجد تقارير</div>
        ) : (
          <ul className="divide-y-4" >
            {filtered.map((r) => (
              <li key={r.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-50 ">
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(r.id)} className="px-3 py-1 border rounded">حذف</button>
                  <button onClick={() => navigate(`/reports/detail/${r.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">عرض / مراجعة</button>
                  
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm text-gray-600">{r.author} </div>
                  <div className="text-sm mt-1">الحالة: <span className="font-medium">{r.status}</span></div>
                  <div className="text-sm mt-1">  {r.assignedTo}: مرسل إلى </div>
                  <div className="text-sm text-gray-600">  {new Date(r.createdAt).toLocaleString()}</div>
                </div>

                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
