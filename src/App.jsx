import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./pages/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import NewsListPage from "./pages/News/NewsListPage";
import ReportsListPage from "./pages/Reports/ReportsListPage";
import ReportDetailPage from "./pages/Reports/ReportDetailPage";
import NewsDetailPage from "./pages/News/NewsDetailPage";
import NewsEditPage from "./pages/News/NewsEditPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";

// الصفحة الموحدة للأخبار والتقارير
import ContentCreatePage from "./pages/Content/ContentCreatePage.jsx";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* All pages with sidebar */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="news" element={<NewsListPage />} />
        <Route path="news/create" element={<ContentCreatePage />} />  {/* استخدمنا الصفحة الموحدة */}
        <Route path="news/detail/:id" element={<NewsDetailPage />} />
        <Route path="news/edit/:id" element={<NewsEditPage />} />
        <Route path="reports" element={<ReportsListPage />} />
        <Route path="reports/create" element={<ContentCreatePage />} />  {/* استخدمنا الصفحة الموحدة */}
        <Route path="reports/detail/:id" element={<ReportDetailPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="text-center mt-20 text-2xl">صفحة غير موجودة</div>} />
    </Routes>
  );
}

export default App;
