
import requests
import math
from pydub import AudioSegment
from dotenv import load_dotenv
import os
import boto3
import time
import json

load_dotenv()


API_KEY = os.getenv("API_KEY")
OPENAI_URL = os.getenv("OPENAI_URL")
BUCKET_NAME = os.getenv("BUCKET_NAME")
TRANSCRIPT_FILE_PATH = os.getenv("TRANSCRIPT_FILE_PATH")

os.environ["PATH"] += os.pathsep + './ffmpge/'


def upload_file_to_s3(file_path, bucket_name, object_name):
    """
    Uploads a file to an S3 bucket.

    :param file_path: The local path of the file to upload.
    :param bucket_name: The name of the S3 bucket.
    :param object_name: The key (name) of the object in the bucket.
    :return: True if file was uploaded successfully, else False.
    """

    s3_client = boto3.client('s3')

    try:

        response = s3_client.upload_file(file_path, bucket_name, object_name)
        print(
            f"File uploaded successfully to S3 bucket '{bucket_name}' with key '{object_name}'")
        return True
    except Exception as e:
        print(f"Error uploading file to S3 bucket: {e}")
        return False


def split_audio(input_file, output_folder, duration):
    print("start segment")
    audio = AudioSegment.from_mp3(input_file, parameters=['-nostdin'])
    total_length = len(audio)
    num_parts = math.ceil(total_length / (duration * 1000))
    print(num_parts)

    for i in range(num_parts):
        start = i * duration * 1000
        end = (i + 1) * duration * 1000
        split_audio = audio[start:end]
        output_path = os.path.join(output_folder, f"part_{i+1}.mp3")
        split_audio.export(output_path, format="mp3")
        print(f"Exported {output_path}")


def sort_key(filename):
    # Extract the numeric part from the filename using splitting and indexing
    return int(filename.split('_')[1].split('.')[0])


def transcribe_voice_file(audio_file_path):

    files = {
        'file': open(audio_file_path, 'rb')
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",

    }
    data = {
        "model": "whisper-1",
        "response_format": "text",
        "language": "en"
    }

    response = requests.post(
        OPENAI_URL, headers=headers, files=files, data=data)

    if response.status_code == 200:

        transcription_result = response.text
        return transcription_result
    else:

        print(f"Error: {response}")
        return None


def transcriber(folder_name, user_uuid, combined_filename):
    filenames = []

    print(f"Processing folder: {folder_name}")

    # Initialize an empty string to store combined transcript
    combined_transcript = ""

    # Get the full path of the folder
    full_folder_path = os.path.abspath(folder_name)
    # print(full_folder_path)
    for audio_filename in os.listdir(full_folder_path):
        filenames.append(audio_filename)

    # Sort the filenames using the custom sorting key
    sorted_filenames = sorted(filenames, key=sort_key)
    # Loop through each file in the specified folder
    for audio_filename in sorted_filenames:
        if audio_filename.endswith(".mp3"):
            # Construct the full path for the audio file
            full_audio_path = os.path.join(full_folder_path, audio_filename)
            print(f"Transcribing file: {full_audio_path}")

            transcript = transcribe_voice_file(full_audio_path)
            individual_transcript = transcript
            print(f"Transcription for {audio_filename} completed.")

            # Save individual transcript to a separate file
            individual_filename = os.path.splitext(audio_filename)[
                0] + ".txt"
            individual_file_path = os.path.join(
                full_folder_path, individual_filename)
            with open(individual_file_path, "w") as individual_file:
                individual_file.write(individual_transcript)
                print(f"Individual transcript saved: {individual_filename}")

                # Append transcript to the combined transcript
            combined_transcript += individual_transcript + "\n\n"

    # Write the combined transcript to a file in /tmp

    combined_file_path = f"{folder_name}/combined.txt"
    with open(combined_file_path, "w") as combined_file:
        combined_file.write(combined_transcript)

    s3_folder_save = f"{TRANSCRIPT_FILE_PATH}/{user_uuid}/{combined_filename}"

    upload_file_to_s3(combined_file_path, BUCKET_NAME, s3_folder_save)


def main(event, context):
    # each invocation set it as 1 file onlycurrentunixtimestamp
    # process the event
    print(event)
    currentunixtimestamp = int(time.time())
    body = json.loads(event['Records'][0]['body'])
    bucket_name = body['Records'][0]["s3"]["bucket"]["name"]
    # eg.'voice_files/{user_uuid}-{filename}'  take note uuid got dashes.so on client app side must remove dashes.
    object_key = body['Records'][0]["s3"]["object"]["key"]

    full_filename = object_key.split('/')[1]
    user_uuid = full_filename.split('-')[0]
    filename = full_filename.split('-')[1]

    filename_without_mp3 = filename.split('.')[0]
    # define the variables based on event
    s3_client = boto3.client('s3')

    # create the impt directories in /tmp first
    os.makedirs(f"/tmp/{user_uuid+str(currentunixtimestamp)}", exist_ok=True)
    os.makedirs(
        f"/tmp/{user_uuid+str(currentunixtimestamp)}/input_files", exist_ok=True)
    os.makedirs(
        f"/tmp/{user_uuid+str(currentunixtimestamp)}/output_files", exist_ok=True)

    input_file_path = f"/tmp/{user_uuid+str(currentunixtimestamp)}/input_files/{filename}"
    output_folder = f"/tmp/{user_uuid+str(currentunixtimestamp)}/output_files/"
    combined_filename = f"{filename_without_mp3}.txt"
    s3_client.download_file(bucket_name, object_key, input_file_path)
    duration = 300

    # after processing,the combined.txt file must be saved in s3 bucket.
    print("start split audio")
    split_audio(input_file_path, output_folder, duration)
    print("start transcibe")
    transcriber(output_folder, user_uuid, combined_filename)
    print("Successful Execution")
