import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const InputField = memo(({ icon: Icon, ...props }) => (
  <div className="relative group mb-4">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
    <input
      {...props}
      className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-600"
    />
  </div>
));

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => 
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value })), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const loadId = toast.loading("Verifying identity...");

    try {
      const res = await axiosInstance.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Access Granted", { id: loadId });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Access Denied", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col">
      <Toaster position="top-center" />
      <InputField name="email" type="email" placeholder="Email Address" icon={FaUserAlt} value={form.email} onChange={handleChange} required />
      <InputField name="password" type="password" placeholder="Password" icon={FaLock} value={form.password} onChange={handleChange} required />
      
      <button
        disabled={loading}
        className="mt-2 w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
      >
        {loading ? "Verifying..." : ""}
      </button>
    </form>
  );
}