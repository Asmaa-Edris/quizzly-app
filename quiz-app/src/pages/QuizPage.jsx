import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import socket from "../socket";
import Timer from "../components/Timer";
import Nav from "../components/Navbar";
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaRocket, FaFlagCheckered } from "react-icons/fa";

import toast, { Toaster } from 'react-hot-toast';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const cachedQuiz = sessionStorage.getItem(`quiz_${id}`);
    const cachedUser = sessionStorage.getItem("user");

    if (cachedQuiz) setQuiz(JSON.parse(cachedQuiz));
    if (cachedUser) setUser(JSON.parse(cachedUser));

    const fetchAll = async () => {
      try {
        const [userRes, quizRes] = await Promise.all([
          token ? axiosInstance.get("/api/auth/me") : Promise.resolve({ data: { user: { name: "Guest" } } }),
          axiosInstance.get(`/api/quiz/${id}`),
        ]);

        setUser(userRes.data.user);
        setQuiz(quizRes.data);

        sessionStorage.setItem("user", JSON.stringify(userRes.data.user));
        sessionStorage.setItem(`quiz_${id}`, JSON.stringify(quizRes.data));
      } catch (err) {
        console.error("Quiz fetch failed:", err);
        setUser({ name: "Guest" });
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchAll();
  }, [id, token]);

  const currentQuestion = useMemo(() => quiz?.questions?.[currentQuestionIndex], [quiz, currentQuestionIndex]);

  const handleAnswer = useCallback((qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!token) {
      toast.error("Please login to submit your quiz!");
      return;
    }

    const totalQuestions = quiz?.questions.length || 0;
    const answeredCount = Object.keys(answers).length;



    const submissionPromise = axiosInstance.post(`/api/quiz/${id}/submit`, { answers });

    toast.promise(submissionPromise, {
      loading: 'Submitting your answers...',
      success: 'Quiz Submitted Successfully! ',
      error: 'Failed to submit quiz. Please try again.',
    }, {
      style: { minWidth: '250px', borderRadius: '20px', fontWeight: 'bold' },
    });

    try {
      const res = await submissionPromise;
      
      if (socket?.connected) {
        socket.emit("quizSubmitted", { quizId: id, subject: quiz.subject || "General" });
      }

      setTimeout(() => {
        navigate(`/result/${id}`, { state: { result: res.data, quiz } });
      }, 2000);

    } catch (err) {
      console.error("Submission failed:", err);
    }
  }, [id, quiz, answers, token, navigate]);

  if (loading) return <QuizLoader />;

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans relative overflow-x-hidden">
      <Nav user={user} />
      
      <Toaster position="top-center" reverseOrder={false} />

      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-50/60 rounded-full blur-[120px] -z-10" />

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="space-y-8">
          
          <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-transform hover:rotate-12">
                <FaRocket className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{quiz?.title}</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Step {currentQuestionIndex + 1} / {quiz?.questions.length}
                </p>
              </div>
            </div>
            <Timer duration={quiz?.duration} onTimeUp={handleSubmit} />
          </div>

          <div className="bg-white rounded-[56px] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-500">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
              <div 
                className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out"
                style={{ width: `${((currentQuestionIndex + 1) / quiz?.questions.length) * 100}%` }}
              />
            </div>

            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.3] tracking-tight">
                {currentQuestion?.text}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion?.options.map((opt, i) => {
                const isSelected = answers[currentQuestion._id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQuestion._id, opt)}
                    className={`group flex items-center justify-between p-7 rounded-[32px] border-2 transition-all duration-300 text-left ${
                      isSelected 
                      ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]" 
                      : "bg-[#F8FAFF] border-transparent hover:bg-white hover:border-indigo-100 hover:scale-[1.01]"
                    }`}
                  >
                    <span className="text-xl font-bold tracking-tight">{opt}</span>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "bg-indigo-500 border-indigo-500 scale-110" : "border-slate-200 group-hover:border-indigo-300"
                    }`}>
                      {isSelected && <FaCheckCircle className="text-white text-lg" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(p => p - 1)}
                className="flex items-center gap-3 font-black text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-0 uppercase tracking-widest text-xs"
              >
                <FaChevronLeft /> Prev
              </button>

              <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">
                {currentQuestionIndex < quiz?.questions.length - 1 && (
                  <button
                    onClick={() => setCurrentQuestionIndex(p => p + 1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black px-10 py-5 rounded-[24px] transition-all flex items-center justify-center gap-3"
                  >
                    <span>Next</span>
                    <FaChevronRight className="text-xs" />
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-emerald-500 text-white font-black px-12 py-5 rounded-[24px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 hover:-translate-y-1"
                >
                  <span>Submit Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuizLoader() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center space-y-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-[8px] border-indigo-50 rounded-full shadow-inner"></div>
        <div className="absolute inset-0 border-[8px] border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-3xl animate-bounce"></div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Setting Things Up</h2>
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.4em] mt-2 animate-pulse">GENERATING QUIZ ASSETS</p>
      </div>
    </div>
  );
}