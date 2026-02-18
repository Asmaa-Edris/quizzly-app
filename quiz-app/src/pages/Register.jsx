import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaIdBadge, FaEye, FaEyeSlash } from "react-icons/fa"; // أضفت أيقونات العين
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (name.trim().length < 3) return toast.error("Name must be at least 3 characters");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email address");

    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      return toast.error("Password must contain at least one uppercase letter (A-Z)");
    }

    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success(res.data.message || "Welcome to Quizzly!", { id: loadingToast });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-3xl font-black mb-4 shadow-lg shadow-indigo-200">
            Q
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-400 font-medium mt-2">Join Quizzly today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div className="relative group">
            <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700"
              value={name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Address */}
          <div className="relative group">
            <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700"
              value={password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2
              ${loading 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-slate-900 shadow-indigo-100 hover:shadow-slate-200 active:scale-95"}
            `}
          >
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}