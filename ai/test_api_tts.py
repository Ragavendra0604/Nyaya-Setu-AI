import requests
import json
import base64

url = "http://localhost:5001/tts"
payload = {
    "text": "Hello, this is a test of the NyayaSetu text to speech system.",
    "language": "English"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    if data.get("ok"):
        print("Success! Received audio data.")
        print(f"Audio data length: {len(data['audio_data'])}")
        # Optionally save to file to verify
        # with open("test_out.mp3", "wb") as f:
        #     f.write(base64.b64decode(data['audio_data']))
    else:
        print(f"Error: {data.get('error')}")
except Exception as e:
    print(f"Failed to connect: {e}")
