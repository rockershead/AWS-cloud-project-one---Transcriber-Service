import requests
import os


def transcribe_voice_file(api_key, audio_file_path):
    # Define the OpenAI audio transcription endpoint URL
    url = "https://api.openai.com/v1/audio/transcriptions"

    # Read the audio file as binary data
    # audio_file = open(audio_file_path, "rb")
    files = {
        'file': open(audio_file_path, 'rb')
    }

    # Set the request headers, including the API key
    headers = {
        "Authorization": f"Bearer {api_key}",

    }
    data = {
        "model": "whisper-1",

        "response_format": "text",
        "language": "en"
    }

    # Make the POST request to the OpenAI API
    response = requests.post(url, headers=headers, files=files, data=data)

    # Check if the request was successful
    if response.status_code == 200:
        # Get the transcription result from the response
        transcription_result = response.text
        return transcription_result
    else:
        # Print the error message if the request failed
        print(f"Error: {response}")
        return None


api_key = "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"

audio_file_path = "./voice_files/voice_001.mp3"

transcription_result = transcribe_voice_file(api_key, audio_file_path)
if transcription_result:

    print(transcription_result)
else:
    print("Transcription failed.")
