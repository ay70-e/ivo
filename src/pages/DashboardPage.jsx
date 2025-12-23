import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiGet } from "../api";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [latestNews, setLatestNews] = useState([]);
  const [latestReports, setLatestReports] = useState([]);

  const [newsCount, setNewsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // الأخبار
      const news = await apiGet("/api/news");
      setNewsCount(news.length);
      setLatestNews(news.slice(0, 3));

      // التقارير
      const reports = await apiGet("/api/reports");
      setReportsCount(reports.length);
      setLatestReports(reports.slice(0, 3));

      // المستخدمين
      const users = await apiGet("/api/users");
      setUsersCount(users.length);

    } catch (err) {
      console.error("Dashboard load error", err);
    }
  }

  return (
    <div className="p-6 text-right">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/reports/create")}
            className="bg-[#ef6b23] text-white p-2 rounded-lg"
          >
            ➕ إضافة محتوى
          </button>

          
        </div>

        <h1 className="text-3xl font-bold text-[#1056ab]">لوحة التحكم</h1>
      </div>

      {/* ===== Quick Links ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <QuickBtn title="الإعدادات" icon="⚙️" path="/settings" />
        <QuickBtn title="الأرشيف" icon="📂" path="/archive" />
        <QuickBtn title="التقارير" icon="📑" path="/reports" />
        <QuickBtn title="الأخبار" icon="📰" path="/news" />
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard value={usersCount} label="عدد المستخدمين" />
        <StatCard value={newsCount} label="عدد الأخبار" />
        <StatCard value={reportsCount} label="عدد التقارير" />
      </div>

      {/* ===== Latest Sections ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestSection
          title="آخر الأخبار"
          data={latestNews}
          onView={(id) => navigate(`/news/detail/${id}`)}
        />

        <LatestSection
          title="أحدث التقارير"
          data={latestReports}
          onView={(id) => navigate(`/reports/detail/${id}`)}
        />
      </div>
    </div>
  );
}

/* ================= Components ================= */

function QuickBtn({ title, icon, path }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="bg-white shadow p-4 rounded-2xl hover:bg-gray-50"
    >
      {icon} <span className="font-bold">{title}</span>
    </button>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white shadow p-4 rounded-2xl text-center">
      <h2 className="text-3xl font-bold text-[#1056ab]">{value}</h2>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

function LatestSection({ title, data, onView }) {
  return (
    <section className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center">لا يوجد محتوى</p>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-3 rounded-lg mb-2"
          >
            <button
              onClick={() => onView(item.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              عرض
            </button>
            <span className="flex-1 text-right">{item.title}</span>
          </div>
        ))
      )}
    </section>
  );
}
