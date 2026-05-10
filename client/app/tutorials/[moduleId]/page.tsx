"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';

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

  useEffect(() => {
    // In this simple setup, we'll fetch all and filter or add an endpoint
    axios.get('http://localhost:3002/api/tutorials/modules')
      .then(res => {
        const found = res.data.find((m: any) => m.id === moduleId);
        // This is a bit of a hack since the modules endpoint only returns counts
        // Better to have a getModuleById endpoint
        setModule(found);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <div className="p-8">Loading module...</div>;
  if (!module) return <div className="p-8">Module not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/tutorials" className="text-blue-600 hover:underline mb-4 block">← Back to All Modules</Link>
      <h1 className="text-3xl font-bold mb-8">{module.title}</h1>
      
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b bg-gray-50 flex items-center gap-3">
          <BookOpen className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900 text-lg">Curriculum</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {/* Mock lessons since modules endpoint only gives count */}
          {/* I'll use placeholders for now or fix the backend */}
          {['lesson-1', 'lesson-2'].map((id, index) => (
            <Link 
              key={id} 
              href={`/tutorials/${moduleId}/${id}`}
              className="p-6 flex justify-between items-center hover:bg-blue-50 transition group"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">
                  {id === 'lesson-1' ? 'What is an Option?' : 'Calls vs. Puts'}
                </span>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-600" size={20} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
