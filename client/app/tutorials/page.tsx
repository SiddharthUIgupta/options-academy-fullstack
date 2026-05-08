"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning Path: Options Trading</h1>
      <div className="grid gap-6">
        {modules.map((m) => (
          <div key={m.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold">{m.title}</h2>
            <p className="text-gray-600 mt-2">{m.lessonCount} Lessons</p>
            <Link href={`/tutorials/${m.id}`} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded inline-block font-semibold hover:bg-blue-700 transition">
              Start Module
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
