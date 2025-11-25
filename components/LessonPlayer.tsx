// components/LessonPlayer.tsx
'use client';

import { useState } from 'react';
import type { Lesson, Phrase } from '@/lib/supabase';
import { Play, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface LessonPlayerProps {
  lesson: Lesson;
  phrases: Phrase[];
}

export default function LessonPlayer({ lesson, phrases }: LessonPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPhrase = phrases[currentIndex];

  const goToNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progressPercent = ((currentIndex + 1) / phrases.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-100 px-6 py-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Progress</span>
          <span>
            {currentIndex + 1} of {phrases.length}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-8 py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {currentPhrase.french_text}
          </div>

          <div className="text-2xl text-gray-600 mb-3">
            {currentPhrase.english_translation}
          </div>

          {currentPhrase.phonetic_guide && (
            <div className="text-lg text-gray-500 italic font-mono">
              [{currentPhrase.phonetic_guide}]
            </div>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <button
            className="group bg-blue-600 hover:bg-blue-700 text-white rounded-full p-8 shadow-lg transition-all hover:shadow-xl active:scale-95"
            onClick={() => alert('Audio feature coming in next phase! 🎵')}
          >
            <Play className="w-10 h-10 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
            <Volume2 className="w-4 h-4" />
            Click play to hear the pronunciation (coming soon!)
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex === phrases.length - 1}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {currentIndex === phrases.length - 1 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
              🎉 You've completed this lesson! Great job!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
