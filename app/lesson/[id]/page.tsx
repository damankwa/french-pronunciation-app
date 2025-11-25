// app/lesson/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import LessonPlayer from '@/components/LessonPlayer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LessonPageProps {
  params: Promise<{
    // ← Changed: params is now a Promise
    id: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  // ✨ NEW: Await params before using it
  const { id: lessonId } = await params;

  // Now use lessonId as before
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  const { data: phrases, error: phrasesError } = await supabase
    .from('phrases')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_number', { ascending: true });

  if (lessonError || phrasesError || !lesson || !phrases) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to lessons
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                {lesson.level}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {phrases.length} phrases
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-lg text-gray-600">{lesson.description}</p>
            )}
          </header>

          <LessonPlayer lesson={lesson} phrases={phrases} />
        </div>
      </div>
    </main>
  );
}
