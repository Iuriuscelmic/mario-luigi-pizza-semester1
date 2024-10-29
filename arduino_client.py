import serial
import requests
import time

# Configure the serial connection to the Arduino on COM7
ser = serial.Serial(port='COM7', baudrate=9600, timeout=1)
flask_url = 'http://localhost:5000/get_beep_signal'  # Local Flask server URL

def listen_for_beep():
    while True:
        try:
            # Poll Flask server for beep signal
            response = requests.get(flask_url)
            if response.status_code == 200:
                data = response.json()
                if data.get("beep"):
                    print("Beep signal received! Triggering Arduino...")
                    ser.write(b'B')  # Send 'B' to Arduino to beep
            time.sleep(1)  # Poll every second
        except requests.RequestException as e:
            print("Error connecting to Flask server:", e)
            time.sleep(5)  # Wait before retrying
        except Exception as e:
            print("Unexpected error:", e)
            time.sleep(5)

if __name__ == "__main__":
    listen_for_beep()
