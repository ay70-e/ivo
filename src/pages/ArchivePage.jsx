import React, { useState } from "react";

export default function ArchivePage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const data = [
    {
      id: 1,
      name: "تقرير الموارد البشرية",
      tag: "HR",
      date: "2024-12-01",
      type: "PDF",
      file: "#",
      image: "https://via.placeholder.com/50"
    },
    {
      id: 2,
      name: "تقرير الأنشطة",
      tag: "Activity",
      date: "2024-11-10",
      type: "Image",
      file: "#",
      image: "https://via.placeholder.com/50"
    },
    {
      id: 3,
      name: "تقرير مالي",
      tag: "Finance",
      date: "2024-10-05",
      type: "Excel",
      file: "#",
      image: "https://via.placeholder.com/50"
    }
  ];

  // فلترة البحث
  const filtered = data
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.tag.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4 text-[#1056ab] text-right">الأرشيف</h1>

      {/* Search + Sort */}
      <div className="flex items-center  justify-end gap-4 mb-6">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="...ابحث"
          className="w-1/2 border p-3 rounded-full flex-1 text-right"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Sort */}
        <select
          className="border p-3 rounded-2xl text-right"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">△</option>
          <option value="asc"> ▽</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-2xl">
          <thead className="bg-[#ef6b23] text-white text-right">
            <tr>
              <th className="p-3 border">الملف</th>
              <th className="p-3 border">النوع</th>
              <th className="p-3 border">التاريخ</th>
              <th className="p-3 border">الوسم</th>
              <th className="p-3 border">الاسم</th>
              <th className="p-3 border">الصورة</th>
            </tr>
          </thead>

          <tbody className="text-right bg-white">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="border p-3">
                  <a
                    href={item.file}
                    className="text-blue-600 hover:underline"
                  >
                    فتح الملف
                  </a>
                </td>

                <td className="border p-3">{item.type}</td>
                <td className="border p-3">{item.date}</td>
                <td className="border p-3">{item.tag}</td>
                <td className="border p-3">{item.name}</td>
                <td className="border p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center mt-4 text-gray-500">لا توجد نتائج مطابقة للبحث.</p>
        )}
      </div>
    </div>
  );
}
