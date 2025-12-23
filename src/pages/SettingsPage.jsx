import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiPost, apiDelete } from "../api";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("مشاهد");

  // Toggle Password Form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      // prefer backend user info, fallback to localStorage
      try {
        const data = await apiGet("/api/auth/me");
        if (!mounted) return;
        setName(data.name || "");
        setEmail(data.email || "");
        setRole(data.role || "مشاهد");
      } catch (err) {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        if (!mounted) return;
        if (u) {
          setName(u.name || "");
          setEmail(u.email || "");
          setRole(u.role || "مشاهد");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  async function handleSave() {
    try {
      const payload = { name, email };
      await apiPut("/api/auth/me", payload);
      // update local copy
      const user = JSON.parse(localStorage.getItem("user") || "null") || {};
      const updated = { ...user, ...payload };
      localStorage.setItem("user", JSON.stringify(updated));
      alert("تم حفظ التغييرات");
    } catch (err) {
      console.error(err);
      alert("فشل حفظ التغييرات");
    }
  }

  async function handlePasswordChange() {
    if (newPassword !== confirmPassword) {
      alert("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }
    try {
      const payload = { currentPassword, newPassword };
      await apiPut("/api/auth/change-password", payload);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      alert("تم تحديث كلمة المرور بنجاح");
    } catch (err) {
      console.error(err);
      alert("فشل تحديث كلمة المرور");
    }
  }

  // --- contacts persisted in DB (fallback to localStorage if backend fails) ---
  const CONTACTS_KEY = "saved_contacts";
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadContacts() {
      try {
        const data = await apiGet("/api/contacts");
        if (!mounted) return;
        setContacts(data || []);
      } catch (err) {
        // fallback to localStorage
        try {
          const raw = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
          if (mounted) setContacts(raw);
        } catch (e) {
          if (mounted) setContacts([]);
        }
      }
    }
    loadContacts();
    return () => (mounted = false);
  }, []);

  async function addContact() {
    const nameTrim = contactName.trim();
    const emailTrim = contactEmail.trim();
    if (!nameTrim || !emailTrim) return alert("يرجى إدخال الاسم والبريد الإلكتروني");
    const exists = contacts.some((c) => c.email === emailTrim);
    if (exists) return alert("هذا البريد موجود بالفعل");
    try {
      const created = await apiPost("/api/contacts", { name: nameTrim, email: emailTrim });
      setContacts((prev) => [created, ...prev]);
      setContactName("");
      setContactEmail("");
    } catch (err) {
      // fallback to localStorage
      const next = [{ id: Date.now(), name: nameTrim, email: emailTrim }, ...contacts];
      setContacts(next);
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
      setContactName("");
      setContactEmail("");
    }
  }

  async function removeContact(id) {
    if (!confirm("حذف هذا الاتصال؟")) return;
    try {
      await apiDelete(`/api/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      // fallback: remove from local storage copy
      const next = contacts.filter((c) => c.id !== id);
      setContacts(next);
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
    }
  }

  return (
    <div className="p-10 text-right">
      <h1 className="text-2xl font-bold mb-6 text-[#1056ab]">الإعدادات</h1>

      {/* Account Information */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-[#1056ab]">معلومات الحساب</h2>

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
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-50 text-right"
              value={role}
              readOnly
            />
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="mt-6 bg-[#1056ab] disabled:opacity-50 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
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
          <h2 className="text-xl font-semibold mb-4 text-[#1056ab]">تغيير كلمة المرور</h2>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
            <div>
              <label className="block mb-1 font-medium">كلمة المرور الحالية</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 bg-gray-50"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 bg-gray-50"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">تأكيد كلمة المرور</label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 bg-gray-50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button onClick={handlePasswordChange} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">تحديث كلمة المرور</button>

          {/* Close button */}
          <button onClick={() => setShowPasswordForm(false)} className="mt-4 block text-red-600 underline hover:text-red-800 ">إغلاق</button>
        </div>
      )}
    </div>
  );
}
