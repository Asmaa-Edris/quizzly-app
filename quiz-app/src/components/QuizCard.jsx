import { Link } from "react-router-dom";
import React from "react";
import { FaPlay, FaClock, FaListUl, FaChevronRight } from "react-icons/fa";

function QuizCard({ quiz }) {
  return (
    <div className="group bg-white rounded-[32px] p-6 border border-slate-100 hover:border-indigo-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(99,102,241,0.1)] transition-all duration-500 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-500">
          <FaListUl className="text-lg" />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
          {quiz.title}
        </h2>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {quiz.questions?.length || 0} Questions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-slate-300 text-xs" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {Math.floor(quiz.duration / 60)} Min
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <Link
          to={`/quiz/${quiz._id}`}
          className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-200 active:scale-95 group"
        >
          <FaPlay className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
          Start Quiz
        </Link>
        
        <div className="text-slate-300 group-hover:text-indigo-200 transition-colors">
          <FaChevronRight />
        </div>
      </div>

      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </div>
  );
}

export default React.memo(QuizCard);