import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("مشاهد");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleRegister() {
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }
    try {
      await apiPost("/api/auth/register", { name, email, password, role });
      alert("تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.");
      navigate("/login");
    } catch {
      alert("فشل التسجيل. تحقق من البيانات.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#1056ab]">التسجيل</h1>

        <div className="flex flex-col gap-4 text-right">
          <div>
            <label className="text-sm font-medium text-gray-700">الاسم</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border mt-1 focus:outline-none focus:ring-2 focus:ring-[#1056ab]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border mt-1 focus:outline-none focus:ring-2 focus:ring-[#1056ab]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl border mt-1 focus:outline-none focus:ring-2 focus:ring-[#1056ab]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 text-xl"
            >
              {showPassword ? "🐵" : "🙈"}
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">الدور</label>
            <select
              className="w-full p-3 rounded-xl border mt-1 focus:outline-none focus:ring-2 focus:ring-[#1056ab]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="مشاهد">مشاهد</option>
              <option value="مشرف">مشرف</option>
              <option value="مدير">مدير</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            className="w-full mt-4 py-3 bg-[#ef6b23] hover:bg-[#e3611f] text-white rounded-xl text-lg font-semibold"
          >
            تسجيل
          </button>

          <p className="text-center mt-4">
            لديك حساب بالفعل؟{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#1056ab] hover:underline"
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
