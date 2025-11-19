// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for our data
export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  order_number: number;
  duration_minutes: number | null;
  created_at: string;
};

export type Phrase = {
  id: string;
  lesson_id: string;
  french_text: string;
  english_translation: string;
  phonetic_guide: string | null;
  order_number: number;
  audio_url: string | null;
  created_at: string;
};