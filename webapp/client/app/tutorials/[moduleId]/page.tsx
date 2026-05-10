"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, BookOpen, ChevronLeft } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function ModuleOverview() {
  const { moduleId } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:3002/api/tutorials/modules/${moduleId}`)
      .then(res => setModule(res.data))
      .catch(err => {
        console.error('Module fetch error:', err);
        setError('The curriculum for this module is currently undergoing maintenance.');
      })
      .finally(() => setLoading(false));
  }, [moduleId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
      <div className="w-12 h-12 bg-blue-100 rounded-full mb-4" />
      <div className="text-[#86868b] font-medium text-lg tracking-tight">Accessing Course Module...</div>
    </div>
  );

  if (error || !module) return (
    <div className="p-8 max-w-3xl mx-auto text-center py-20">
      <div className="bg-red-50 text-red-600 p-10 rounded-[40px] border border-red-100">
        <h2 className="text-[24px] font-bold mb-3 tracking-tight text-[#1d1d1f]">Module Unavailable</h2>
        <p className="mb-10 text-[17px] text-[#86868b] leading-relaxed">
          {error || 'This learning module could not be loaded at this time.'}
        </p>
        <Link href="/tutorials" className="bg-[#007aff] text-white px-8 py-4 rounded-full font-bold hover:bg-[#0071e3] transition shadow-lg shadow-[#007aff]/20 inline-block">
          Back to All Modules
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/tutorials" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all mb-8">
        <ChevronLeft size={20} /> Back to All Modules
      </Link>

      <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-10 text-white mb-12 shadow-xl">
        <h1 className="text-4xl font-black mb-4">{module.title}</h1>
        <p className="text-gray-300 text-lg max-w-2xl">
          Complete all lessons in this module to earn progress toward your Options Certification.
        </p>
      </div>
      
      <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600" size={28} />
            <h2 className="font-bold text-gray-900 text-xl">Module Curriculum</h2>
          </div>
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            {module.lessons.length} Lessons
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {module.lessons.map((lesson, index) => (
            <Link 
              key={lesson.id} 
              href={`/tutorials/${moduleId}/${lesson.id}`}
              className="p-8 flex justify-between items-center hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center gap-6">
                <span className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Lesson Content Available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Start Lesson</span>
                <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={24} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
