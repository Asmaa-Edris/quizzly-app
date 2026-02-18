// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Nav from "../components/Navbar";
import { FaPlay, FaTrophy, FaArrowRight, FaRocket, FaDiceD6 } from "react-icons/fa";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState(() => {
    const cached = sessionStorage.getItem("quizzes");
    return cached ? JSON.parse(cached) : [];
  });

  const [user, setUser] = useState(() => {
    const cachedUser = sessionStorage.getItem("user");
    return cachedUser ? JSON.parse(cachedUser) : { name: "", score: 0 };
  });

  const [loading, setLoading] = useState(!quizzes.length);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, quizRes] = await Promise.all([
          axiosInstance.get("/api/auth/me"),
          axiosInstance.get("/api/quiz"),
        ]);
        const userData = userRes.data.user || { name: "Guest", score: 0 };
        const quizData = quizRes.data || [];
        setUser(userData);
        setQuizzes(quizData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("quizzes", JSON.stringify(quizData));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans relative overflow-x-hidden">
      <Nav user={user} />

      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[120px] -z-10" />

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-20 transition-all duration-700 ease-in-out">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white border border-slate-100 p-2 px-5 inline-flex items-center space-x-3 rounded-full shadow-sm">
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg shadow-indigo-200">
                <FaRocket />
              </div>
              <span className="font-bold text-slate-700 text-xs tracking-[0.2em] uppercase">Quizzly Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Welcome, <br />
              <span className="text-indigo-600">{user?.name?.split(" ")[0] || "Explorer"}</span>.
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              Choose your next challenge and boost your global ranking today.
            </p>
          </div>

          <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-12 border border-white text-center min-w-[320px] hover:scale-[1.02] transition-transform duration-500">
             <div className="w-20 h-20 bg-amber-50 rounded-[24px] flex items-center justify-center text-amber-500 text-3xl mx-auto mb-6 shadow-inner">
                <FaTrophy />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Total Reputation</p>
             <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{user?.score || 0}</h2>
             <div className="mt-4 h-1 w-12 bg-indigo-100 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div 
                key={quiz._id} 
                className="group bg-white rounded-[48px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-15px_rgba(79,70,229,0.12)] border border-transparent hover:border-indigo-50 transition-all duration-500 hover:-translate-y-4 flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-full -mr-12 -mt-12 transition-transform duration-700 ]" />

                <div className="relative z-10 flex-1">
                  <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500 mb-8">
                    <FaDiceD6 className="text-xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-10 text-lg line-clamp-3">
                    {quiz.description || "Challenge yourself with our curated assessment to unlock new levels of expertise."}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                  className="relative z-10 w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-[24px] transition-all flex items-center justify-center space-x-3 group/btn shadow-xl shadow-slate-100 hover:shadow-indigo-200"
                >
                  <span className="text-lg">Start Quiz</span>
                  <FaArrowRight className="text-xs group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40">
              <p className="text-slate-400 text-xl font-bold tracking-widest">NO QUIZZES DISCOVERED YET</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] p-12">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col lg:flex-row justify-between gap-12 animate-pulse">
            <div className="space-y-6 w-full lg:w-1/2">
                <div className="h-20 bg-slate-100 rounded-[32px] w-3/4"></div>
                <div className="h-20 bg-slate-100 rounded-[32px] w-1/2"></div>
            </div>
            <div className="h-64 bg-slate-100 rounded-[48px] w-full lg:w-80"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1,2,3].map(i => (
            <div key={i} className="h-[450px] bg-slate-50 rounded-[48px] animate-pulse border border-slate-100"></div>
          ))}
        </div>
      </div>
    </div>
  );
}