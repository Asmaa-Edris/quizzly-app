import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaRocket, FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // حالة لإظهار/إخفاء كلمة السر
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- التحقق من البيانات (Validation) ---
    if (!isLogin) {
      if (formData.name.trim().length < 3) return toast.error("Name is too short");
      
      // ✅ التحقق من وجود حرف كبير (Capital Letter)
      const hasUpperCase = /[A-Z]/.test(formData.password);
      if (formData.password.length < 6) return toast.error("Password must be 6+ characters");
      if (!hasUpperCase) return toast.error("Password must contain at least one uppercase letter (A-Z)");
    }

    setLoading(true);
    const toastId = toast.loading(isLogin ? "Signing in..." : "Registering...");
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await axiosInstance.post(endpoint, formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Identity Verified", { id: toastId });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Auth Error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 lg:p-12 font-sans relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        
        {/* Left Side: Hero Section */}
        <div className="hidden lg:flex w-1/2 flex-col space-y-8">
          <div className="bg-white p-4 inline-flex items-center space-x-3 rounded-2xl shadow-sm w-fit mb-4 border border-slate-50">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform hover:rotate-12">
                <FaRocket />
             </div>
             <span className="font-bold text-slate-700 tracking-tight">Quizzly Platform</span>
          </div>
          
          <h2 className="text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            Build Your <br />
            <span className="text-indigo-600">Future</span> with <br />
            Confidence.
          </h2>
          
          <p className="text-xl text-slate-500 max-w-md leading-relaxed font-medium">
            The most advanced platform for interactive learning and professional assessments.
          </p>

          <div className="relative w-full max-w-md aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
             <img 
               src="./login-hero.avif" 
               alt="Hero"
               className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
             />
             <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply" />
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-[550px]">
          <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 md:p-14 lg:p-16 border border-white">
            <div className="mb-12">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                {isLogin ? "Sign In" : "Register"}
              </h1>
              <p className="text-slate-400 font-medium tracking-tight">Please enter your details below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative group">
                    <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white text-slate-900 pl-14 pr-8 py-5 rounded-[24px] outline-none transition-all text-lg font-bold"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white text-slate-900 pl-14 pr-8 py-5 rounded-[24px] outline-none transition-all text-lg font-bold"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
                <div className="relative group">
                  <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white text-slate-900 pl-14 pr-16 py-5 rounded-[24px] outline-none transition-all text-lg font-bold"
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full mt-6 bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center space-x-3 text-xl group"
              >
                <span>{loading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}</span>
                {!loading && <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-400 font-bold">
                {isLogin ? "New member?" : "Already joined?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 font-black hover:text-indigo-800 transition-colors underline-offset-4 hover:underline"
                >
                  {isLogin ? "Sign up" : "Log in now"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}