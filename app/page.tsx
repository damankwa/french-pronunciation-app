// app/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import type { Lesson } from '@/lib/supabase';

export default async function Home() {
  // Fetch lessons from Supabase (runs on server)
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order_number', { ascending: true });

  if (error) {
    console.error('Error fetching lessons:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Error loading lessons. Check console.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            🇫🇷 Learn French Pronunciation
          </h1>
          <p className="text-xl text-gray-600">
            Master French speaking with interactive audio lessons
          </p>
        </header>

        {/* Lessons grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {lessons?.map((lesson: Lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border-2 border-transparent hover:border-blue-500 h-full">
                {/* Top section */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    {lesson.level}
                  </span>
                  {lesson.duration_minutes && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration_minutes} min
                    </div>
                  )}
                </div>

                {/* Title and description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {lesson.title}
                </h3>

                {lesson.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {lesson.description}
                  </p>
                )}

                {/* CTA */}
                <div className="flex items-center text-blue-600 font-medium mt-auto">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Lesson →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {lessons?.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No lessons yet. Add some in your Supabase database!
          </div>
        )}
      </div>
    </main>
  );
}
