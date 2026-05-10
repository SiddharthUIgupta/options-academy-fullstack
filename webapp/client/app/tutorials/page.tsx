"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { BookOpen, ChevronRight, PlayCircle } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  lessonCount: number;
}

export default function TutorialsPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3002/api/tutorials/modules')
      .then(res => setModules(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading modules...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Learning Path: Options Trading</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          From basics to advanced strategies, follow our guided curriculum to master the world of derivatives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((m) => (
          <div key={m.id} className="group bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{m.title}</h2>
            <div className="flex items-center gap-2 text-gray-500 font-medium mb-8">
              <PlayCircle size={18} className="text-blue-500" />
              {m.lessonCount} Lessons in this module
            </div>
            
            <Link 
              href={`/tutorials/${m.id}`} 
              className="flex items-center justify-between w-full bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all group/btn"
            >
              View Curriculum
              <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <p className="text-gray-400 font-medium italic">No tutorial modules found in the database.</p>
        </div>
      )}
    </div>
  );
}
