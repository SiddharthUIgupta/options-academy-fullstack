"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: Quiz;
}

export default function LessonView() {
  const { moduleId, lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3002/api/tutorials/lessons/${lessonId}`)
      .then(res => setLesson(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    
    if (selectedOption === lesson?.quiz?.correctAnswer) {
      // Mark as complete in backend
      axios.post('http://localhost:3002/api/tutorials/complete', {
        userId: 'local-user',
        moduleId,
        lessonId
      }).catch(err => console.error('Progress update error:', err));
    }
  };

  if (loading) return <div className="p-8">Loading lesson...</div>;
  if (!lesson) return <div className="p-8">Lesson not found</div>;

  const isCorrect = selectedOption === lesson.quiz?.correctAnswer;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href={`/tutorials/${moduleId}`} className="text-blue-600 hover:underline mb-6 flex items-center gap-1">
        <ChevronLeft size={16} /> Back to Module
      </Link>
      
      <h1 className="text-4xl font-extrabold mb-8 text-slate-900">{lesson.title}</h1>
      
      <div className="prose prose-slate max-w-none mb-12">
        <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
          {lesson.content}
        </p>
      </div>

      {lesson.quiz && (
        <div className="bg-slate-50 border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" size={24} />
            Quick Knowledge Check
          </h2>
          <p className="text-lg font-medium text-slate-800 mb-6">{lesson.quiz.question}</p>
          <div className="space-y-3">
            {lesson.quiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedOption(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showResult 
                    ? index === lesson.quiz?.correctAnswer 
                      ? 'bg-green-50 border-green-500 text-green-900' 
                      : index === selectedOption 
                        ? 'bg-red-50 border-red-500 text-red-900' 
                        : 'bg-white border-slate-100 opacity-50'
                    : selectedOption === index
                      ? 'bg-blue-50 border-blue-600 text-blue-900'
                      : 'bg-white border-slate-100 hover:border-blue-300 text-slate-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {!showResult ? (
            <button
              onClick={handleQuizSubmit}
              disabled={selectedOption === null}
              className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-slate-300"
            >
              Submit Answer
            </button>
          ) : (
            <div className="mt-8 flex flex-col items-center">
              <p className={`text-lg font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Correct! Lesson completed.' : 'Not quite. Try reviewing the content.'}
              </p>
              <button
                onClick={() => {
                  setShowResult(false);
                  setSelectedOption(null);
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
