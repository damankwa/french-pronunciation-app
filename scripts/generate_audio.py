# scripts/generate_audio.py
import boto3
import os
from pathlib import Path

# Initialize AWS Polly client
polly_client = boto3.client(
    'polly',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

def generate_audio(text, output_filename, voice_id='Lea'):
    """
    Generate French audio using AWS Polly Neural voice
    
    Args:
        text: French text to convert to speech
        output_filename: Name of output MP3 file
        voice_id: Polly voice to use (default: Lea - French female)
    """
    
    print(f"Generating audio for: {text}")
    
    try:
        # Call AWS Polly to synthesize speech
        response = polly_client.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine='neural',  # Use neural engine for better quality
            LanguageCode='fr-FR'
        )
        
        # Create output directory if it doesn't exist
        output_dir = Path('audio_output')
        output_dir.mkdir(exist_ok=True)
        
        # Save the audio file
        output_path = output_dir / output_filename
        
        with open(output_path, 'wb') as file:
            file.write(response['AudioStream'].read())
        
        print(f"✓ Audio saved to: {output_path}")
        return str(output_path)
        
    except Exception as e:
        print(f"✗ Error generating audio: {e}")
        return None

def generate_phrase_audio(phrase_data):
    """
    Generate audio for a single phrase
    
    Args:
        phrase_data: Dict with 'id', 'french_text'
    """
    phrase_id = phrase_data['id']
    french_text = phrase_data['french_text']
    
    # Create filename from phrase ID
    filename = f"phrase_{phrase_id}.mp3"
    
    # Generate the audio
    audio_path = generate_audio(french_text, filename)
    
    return audio_path

# Test with sample phrases
if __name__ == "__main__":
    print("AWS Polly Audio Generator")
    print("-" * 40)
    
    # Sample phrases to test
    test_phrases = [
        {
            'id': 'test_1',
            'french_text': 'Bonjour'
        },
        {
            'id': 'test_2',
            'french_text': 'Comment allez-vous?'
        },
        {
            'id': 'test_3',
            'french_text': 'Merci beaucoup'
        }
    ]
    
    print(f"\nGenerating audio for {len(test_phrases)} test phrases...\n")
    
    for phrase in test_phrases:
        generate_phrase_audio(phrase)
    
    print("\n" + "=" * 40)
    print("✓ Test complete! Check the 'audio_output' folder")