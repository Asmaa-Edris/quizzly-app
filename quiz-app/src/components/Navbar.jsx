import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import React from "react";

function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // إغلاق القائمة عند الضغط في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  const avatarUrl = useMemo(
    () => `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Guest"}&backgroundColor=6366f1,a855f7,ec4899`,
    [user?.name]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform ">
            <span className="text-white font-black text-xl">Q</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Quizzly<span className="text-indigo-600">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
            Home
          </Link>

          {user && user.name !== "Guest" ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onMouseEnter={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 hover:border-indigo-200 transition-all"
              >
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full shadow-sm" />
                <span className="text-sm font-black text-slate-700">{user.name.split(' ')[0]}</span>
              </button>

              {/* Dropdown using Tailwind Transitions */}
              <div className={`
                absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[24px] shadow-2xl shadow-indigo-100 p-3 overflow-hidden transition-all duration-200 origin-top-right
                ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
              `}>
                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{user.email || user.username}</p>
                </div>
                
                <DropdownLink to="/dashboard" icon={<LayoutDashboard size={16} />} text="Dashboard" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm mt-1"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600 transition-colors hover:bg-slate-50 rounded-lg">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu using Tailwind Transitions */}
      <div className={`
        md:hidden bg-white border-t border-slate-50 overflow-hidden transition-all duration-300 ease-in-out
        ${menuOpen ? "max-height-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
      style={{ maxHeight: menuOpen ? "400px" : "0px" }}>
        <div className="p-6 space-y-4">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block p-4 bg-slate-50 rounded-2xl font-black text-slate-700 hover:bg-indigo-50 transition-colors">Home</Link>
          {user && user.name !== "Guest" ? (
            <>
              <button onClick={handleLogout} className="w-full text-left p-4 bg-rose-50 text-rose-500 rounded-2xl font-black active:bg-rose-100 transition-colors">Logout</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link to="/login" className="p-4 text-center font-black text-slate-600 border border-slate-100 rounded-2xl active:bg-slate-50 transition-colors">Login</Link>
              <Link to="/register" className="p-4 text-center font-black bg-indigo-600 text-white rounded-2xl active:bg-indigo-700 transition-colors">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropdownLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all font-bold text-sm"
    >
      {icon} {text}
    </Link>
  );
}

export default React.memo(Navbar);