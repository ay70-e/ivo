import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const NEWS_KEY = "news_data";
const REPORT_KEY = "reports_data";
const USERS_KEY = "users_data";

function loadNews() {
  const raw = localStorage.getItem(NEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function loadReports() {
  const raw = localStorage.getItem(REPORT_KEY);
  return raw ? JSON.parse(raw) : [];
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [latestNews, setLatestNews] = useState([]);
  const [latestReports, setLatestReports] = useState([]);

  const [newsCount, setNewsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);


  useEffect(() => {
    const allNews = loadNews().sort(
      (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
    );
    setLatestNews(allNews.slice(0, 3));
    setNewsCount(allNews.length);

    const allReports = loadReports().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatestReports(allReports.slice(0, 3));
    setReportsCount(allReports.length);

    const allUsers = loadUsers();
    setUsersCount(allUsers.length || 5);
  }, []);

  return (
    <div className="p-6 text-right">
      <div className="flex justify-between items-center mb-8 ">
      <div  data-aos="fade-zoom-in" 
      className="flex gap-4">
      <button
          onClick={() => navigate("/reports/create")}
          className="bg-[#ef6b23] text-white shadow p-2  rounded-lg hover:bg-[#e3611f] "
        >
          <span className="font-bold text-sm">إضافة تقرير</span> ➕
          
        </button>
        <button
          onClick={() => navigate("/news/create")}
          className="bg-[#ef6b23] text-white shadow p-2 rounded-lg hover:bg-[#e3611f] "
        >
          <span className="font-bold text-sm">إضافة خبر</span> ➕
    
        </button>
       </div>
      <h1 className="text-3xl font-bold text-[#1056ab] mb-6">
        لوحة التحكم
      </h1>
      </div>
{/* ===== Quick Links ===== */}
      <div  data-aos="fade-zoom-in" data-aos-delay="100"
       className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-4">
        
        <button
          onClick={() => navigate("/settings")}
          className="bg-white shadow p-3 rounded-2xl hover:bg-gray-50"
        >
          ⚙️ <span className="font-bold">الإعدادات</span>
          <p className="text-gray-500 text-sm mt-2">تحديث الحساب والصلاحيات</p>
        </button>
        
        
        <button
          onClick={() => navigate("/archive")}
          className="bg-white shadow p-3 rounded-2xl hover:bg-gray-50"
        >
          📂 <span className="font-bold">الأرشيف</span>
          <p className="text-gray-500 text-sm mt-2">جميع الملفات القديمة</p>
        </button>
        

        <button
          onClick={() => navigate("/reports")}
          className="bg-white shadow p-3 rounded-2xl hover:bg-gray-50"
        >
          📑 <span className="font-bold">التقارير</span>
          <p className="text-gray-500 text-sm mt-2">عرض ورفع التقارير</p>
        </button>

        

        <button
          onClick={() => navigate("/news")}
          className="bg-white shadow p-3 rounded-2xl hover:bg-gray-50"
        >
          📰 <span className="font-bold">الأخبار</span>
          <p className="text-gray-500 text-sm mt-2">عرض وإدارة الأخبار</p>
        </button>

      </div>

      {/* ===== Stats Cards ===== */}
      <div  data-aos="fade-zoom-in" data-aos-delay="200"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="bg-white shadow p-3 rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-[#1056ab]">{usersCount}</h2>
          <p className="text-gray-500 text-sm">عدد المستخدمين</p>
        </div>

        <div className="bg-white shadow p-3 rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-[#1056ab]">{newsCount}</h2>
          <p className="text-gray-500 text-sm">عدد الأخبار</p>
        </div>

        <div className="bg-white shadow p-3 rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-[#1056ab]">{reportsCount}</h2>
          <p className="text-gray-500 text-sm">عدد التقارير</p>
        </div>

        
      </div>

      
<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ===== Latest News ===== */}
      <section  data-aos="fade-zoom-in" data-aos-delay="300"
       className="bg-white p-6 rounded-2xl shadow mb-0">
        <h2 className="text-xl font-bold mb-4 text-gray-800">آخر الأخبار</h2>
        {latestNews.length === 0 ? (
          <p className="text-gray-500 text-center">لا توجد أخبار</p>
        ) : (
          <div className="space-y-3">
            {latestNews.map((n) => (
              <div
                key={n.id}
                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
              >
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => navigate(`/news/detail/${n.id}`)}
                >
                  عرض
                </button>
                <span className="text-right flex-1">{n.title}</span>
                
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Latest Reports ===== */}
      <section  data-aos="fade-zoom-in" data-aos-delay="400"
      className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">أحدث التقارير</h2>
        {latestReports.length === 0 ? (
          <p className="text-gray-500 text-center">لا توجد تقارير</p>
        ) : (
          <div className="space-y-3">
            {latestReports.map((r) => (
              <div
                key={r.id}
                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
              >
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => navigate(`/reports/detail/${r.id}`)}
                >
                  عرض
                </button>
                <span className="text-right flex-1">{r.title}</span>
                
              </div>
            ))}
          </div>
        )}
      </section></div>
    </div>
  );
}
