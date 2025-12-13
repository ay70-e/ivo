import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // ← add this

  function handleLogin() {
    // you can add real validation here
    if (email.trim() === "" || password.trim() === "") {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    // after successful login → go to dashboard
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#1056ab]">
          تسجيل الدخول
        </h1>

        <div className="flex flex-col gap-4 text-right">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border mt-1 focus:outline-none focus:ring-2 focus:ring-[#1056ab]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
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

          {/* Login Button */}
          <button
            onClick={handleLogin}   // ← redirection happens here
            className="w-full mt-4 py-3 bg-[#ef6b23] hover:bg-[#e3611f] text-white rounded-xl text-lg font-semibold"
          >
            دخول
          </button>

        </div>
      </div>
    </div>
  );
}
