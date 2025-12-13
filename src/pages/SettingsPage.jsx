import React, { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("آيه ");
  const [email, setEmail] = useState("example@email.com");
  const [role, setRole] = useState("مشرف");

  // Toggle Password Form
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="p-10 text-right">
      <h1 className="text-2xl font-bold mb-6 text-[#1056ab]">الإعدادات</h1>

      {/* Account Information */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-[#1056ab]">
          معلومات الحساب
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-1">
          

          <div>
            <label className="block mb-1 font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-right">الاسم</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-50 text-right"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div></div>
          <div>
            <label className="block mb-1 font-medium text-right">الدور</label>
            <select
              className="w-full border rounded-lg p-2 bg-gray-50 text-right"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>مشرف</option>
              <option>مدير</option>
              <option>كاتب</option>
              <option>موظف</option>
            </select>
          </div>
          
        </div>

        <button className="mt-6 bg-[#1056ab] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          حفظ التغييرات
        </button>

        {/* Toggle password form button */}
        <div className="mt-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-[#1056ab] underline hover:text-blue-700"
          >
            تعديل كلمة المرور
          </button>
        </div>
      </div>

      {/* Password Form (Hidden until clicked) */}
      {showPasswordForm && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#1056ab]">
            تغيير كلمة المرور
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
            <div>
              <label className="block mb-1 font-medium">كلمة المرور الحالية</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">تأكيد كلمة المرور</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 bg-gray-50"
              />
            </div>
          </div>

          <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            تحديث كلمة المرور
          </button>

          {/* Close button */}
          <button
            onClick={() => setShowPasswordForm(false)}
            className="mt-4 block text-red-600 underline hover:text-red-800 "
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
}
