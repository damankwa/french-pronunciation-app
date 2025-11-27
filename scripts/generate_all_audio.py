# scripts/generate_all_audio.py
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables from .env.local
load_dotenv(dotenv_path=Path(__file__).parent.parent / '.env.local')

import boto3
from supabase import create_client, Client

# Initialize Supabase client
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize AWS Polly client
polly_client = boto3.client(
    'polly',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

def generate_audio(text, output_filename, voice_id='Lea'):
    """Generate French audio using AWS Polly Neural voice"""
    
    print(f"  Generating: {text[:50]}...")
    
    try:
        response = polly_client.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine='neural',
            LanguageCode='fr-FR'
        )
        
        output_dir = Path('audio_output')
        output_dir.mkdir(exist_ok=True)
        
        output_path = output_dir / output_filename
        
        with open(output_path, 'wb') as file:
            file.write(response['AudioStream'].read())
        
        print(f"  ✓ Saved: {output_filename}")
        return str(output_path)
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return None

def fetch_all_phrases():
    """Fetch all phrases from Supabase"""
    
    print("Fetching phrases from Supabase...")
    
    try:
        response = supabase.table('phrases').select('*').order('order_number').execute()
        phrases = response.data
        
        print(f"✓ Found {len(phrases)} phrases")
        return phrases
        
    except Exception as e:
        print(f"✗ Error fetching phrases: {e}")
        return []

def generate_audio_for_all_phrases():
    """Main function: fetch phrases and generate audio"""
    
    print("\n" + "=" * 60)
    print("AWS POLLY - BATCH AUDIO GENERATION")
    print("=" * 60 + "\n")
    
    # Fetch phrases from database
    phrases = fetch_all_phrases()
    
    if not phrases:
        print("No phrases found. Exiting.")
        return
    
    print(f"\nGenerating audio for {len(phrases)} phrases...\n")
    
    success_count = 0
    fail_count = 0
    
    for i, phrase in enumerate(phrases, 1):
        phrase_id = phrase['id']
        french_text = phrase['french_text']
        
        print(f"[{i}/{len(phrases)}] {french_text}")
        
        filename = f"phrase_{phrase_id}.mp3"
        
        result = generate_audio(french_text, filename)
        
        if result:
            success_count += 1
        else:
            fail_count += 1
        
        print()
    
    print("=" * 60)
    print(f"COMPLETE!")
    print(f"  Success: {success_count}")
    print(f"  Failed:  {fail_count}")
    print(f"  Total:   {len(phrases)}")
    print("=" * 60)
    print(f"\nAudio files saved to: audio_output/")

if __name__ == "__main__":
    generate_audio_for_all_phrases()