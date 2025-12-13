import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./pages/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import NewsListPage from "./pages/News/NewsListPage";
import NewsCreatePage from "./pages/News/NewsCreatePage";
import ReportsListPage from "./pages/Reports/ReportsListPage";
import ReportCreatePage from "./pages/Reports/ReportCreatePage";
import ReportDetailPage from "./pages/Reports/ReportDetailPage";
import NewsDetailPage from "./pages/News/NewsDetailPage";
import NewsEditPage from "./pages/News/NewsEditPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";


function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* All pages with sidebar */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="news" element={<NewsListPage />} />
        <Route path="news/create" element={<NewsCreatePage />} />
        <Route path="news/detail/:id" element={<NewsDetailPage />} />
        <Route path="news/edit/:id" element={<NewsEditPage />} />
        <Route path="reports" element={<ReportsListPage />} />
        <Route path="reports/create" element={<ReportCreatePage />} />
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
