import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sidebarWidth = 256;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => navigate("/"); // redirect to login
  const isDesktop = windowWidth >= 1024;

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-5 flex flex-col transition-transform duration-300 z-50`}
        style={{
          width: `${sidebarWidth}px`,
          transform: isDesktop || sidebarOpen ? "translateX(0)" : `translateX(${sidebarWidth}px)`,
        }}
      >
        {/* Close button for mobile */}
        {!isDesktop && sidebarOpen && (
          <button
            className="mb-4 px-3 py-2 bg-[#1056ab] text-white rounded"
            onClick={() => setSidebarOpen(false)}
          >
            إغلاق
          </button>
        )}

        <h2 className="text-2xl font-bold text-[#1056ab] mb-8 text-right">ivo</h2>

        <nav className="flex-1 space-y-4 text-right">
          <button onClick={() => navigate("/dashboard")} className="w-full text-right p-2 hover:bg-gray-200 rounded flex items-center justify-end"> لوحة التحكم🏠</button>
          <button onClick={() => navigate("/news")} className="w-full text-right p-2 hover:bg-gray-200 rounded flex items-center justify-end"> الأخبار📰</button>
          <button onClick={() => navigate("/reports")} className="w-full text-right p-2 hover:bg-gray-200 rounded flex items-center justify-end"> التقارير📑</button>
          <button onClick={() => navigate("/archive")} className="w-full text-right p-2 hover:bg-gray-200 rounded flex items-center justify-end"> الأرشيف📂</button>
          <button onClick={() => navigate("/settings")} className="w-full text-right p-2 hover:bg-gray-200 rounded flex items-center justify-end"> الإعدادات⚙️</button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-[#ef6b23] text-white p-2 rounded hover:bg-[#d85d1f]"
        >
          تسجيل الخروج
        </button>
      </aside>

      {/* Overlay for mobile */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main
        className="transition-all duration-300"
        style={{
          marginRight: isDesktop ? `${sidebarWidth}px` : 0,
          minHeight: "100vh",
        }}
      >
        {/* Mobile toggle button */}
        {!isDesktop && (
          <button
            className="mb-4 px-3 py-2 bg-[#1056ab] text-white rounded absolute top-5 right-5 z-50"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        )}

        <div className="py-10 px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
