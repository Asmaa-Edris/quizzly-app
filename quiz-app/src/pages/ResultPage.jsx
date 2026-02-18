import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { 
  FaHome, FaCheck, FaTimes, FaMinus, 
  FaArrowRight, FaTrophy, FaRedo 
} from "react-icons/fa";

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;
  const [user] = useState(() => {
    const cached = sessionStorage.getItem("user");
    return cached ? JSON.parse(cached) : { name: "Guest", username: "Guest" };
  });

  if (!result) return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center font-black text-slate-300 p-6 text-center">
      <h1 className="text-4xl mb-4">OPPS!</h1>
      <p>NO RESULT DATA FOUND</p>
      <Link to="/dashboard" className="mt-6 text-indigo-600 underline">Back to Dashboard</Link>
    </div>
  );

  const accuracy = Math.round((result.correct / (result.total || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans relative pb-12">
      <Navbar user={user} />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-100 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-purple-100 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 relative z-10">
        
        <div className="flex flex-col gap-8">
          
          <div className="bg-slate-900 rounded-[40px] sm:rounded-[60px] p-8 sm:p-12 text-center text-white shadow-2xl shadow-indigo-200 overflow-hidden relative">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                <FaTrophy className="text-amber-400" /> Quiz Completed
              </div>
              
              <h2 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">Your Final Score</h2>
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-7xl sm:text-9xl font-black tracking-tighter leading-none">
                  {result.score}
                </span>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xl sm:text-2xl font-black text-indigo-400">PTS</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Earned</span>
                </div>
              </div>

              <div className="max-w-md mx-auto w-full">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy Level</span>
                  <span className="text-sm font-black text-indigo-400">{accuracy}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full p-0.5 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <StatCard 
              icon={<FaCheck />} 
              label="Correct" 
              value={result.correct} 
              sub="Right answers"
              borderColor="border-emerald-100"
              iconBg="bg-emerald-50 text-emerald-600"
            />
            <StatCard 
              icon={<FaTimes />} 
              label="Wrong" 
              value={result.wrong} 
              sub="Incorrect"
              borderColor="border-rose-100"
              iconBg="bg-rose-50 text-rose-600"
            />
            <StatCard 
              icon={<FaMinus />} 
              label="Skipped" 
              value={result.notAttempted || 0} 
              sub="Unanswered"
              borderColor="border-slate-100"
              iconBg="bg-slate-50 text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-900 font-black py-5 rounded-[28px] hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
            >
              <FaHome /> Back to Dashboard
            </Link>
            <Link
              to={`/quiz/${result.quizId}`}
              className="flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-5 rounded-[28px] hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-indigo-100 group"
            >
              <FaRedo className="group-hover:rotate-180 transition-transform duration-500" /> 
              Try Again
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub, borderColor, iconBg }) {
  return (
    <div className={`bg-white p-6 sm:p-8 rounded-[40px] border-2 ${borderColor} shadow-sm transition-transform hover:-translate-y-1`}>
      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-4">
        <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900 leading-none">{value}</h4>
            <span className="text-[10px] font-bold text-slate-300 uppercase">{sub}</span>
          </div>
        </div>
      </div>
    </div>
  );
}