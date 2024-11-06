const int BEEPER_PIN = 3;
const int BUTTON_PIN = 9;

// Define note frequencies (in Hertz)
#define NOTE_E7 2637
#define NOTE_C7 2093
#define NOTE_G7 3136
#define NOTE_G6 1568
#define NOTE_E6 1319
#define NOTE_A6 1760
#define NOTE_B6 1976
#define NOTE_AS6 1865
#define NOTE_A7 3520
#define NOTE_F7 2794
#define NOTE_D7 2349

// Define the Mario theme notes and durations
int melody[] = {
  NOTE_E7, NOTE_E7, 0, NOTE_E7,
  0, NOTE_C7, NOTE_E7, 0,
  NOTE_G7, 0, 0,  0,
  NOTE_G6, 0, 0, 0,
  NOTE_C7, 0, 0, NOTE_G6,
  0, 0, NOTE_E6, 0,
  0, NOTE_A6, 0, NOTE_B6,
  0, NOTE_AS6, NOTE_A6, 0,
  NOTE_G6, NOTE_E7, NOTE_G7,
  NOTE_A7, 0, NOTE_F7, NOTE_G7,
  0, NOTE_E7, 0, NOTE_C7,
  NOTE_D7, NOTE_B6, 0, 0,
  NOTE_C7, 0, 0, NOTE_G6,
  0, 0, NOTE_E6, 0,
  0, NOTE_A6, 0, NOTE_B6,
  0, NOTE_AS6, NOTE_A6, 0,
  NOTE_G6, NOTE_E7, NOTE_G7,
  NOTE_A7, 0, NOTE_F7, NOTE_G7,
  0, NOTE_E7, 0, NOTE_C7,
  NOTE_D7, NOTE_B6, 0, 0
};

// Define the note durations (4 = quarter note, 8 = eighth note, etc.)
int noteDurations[] = {
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8,
  8, 8, 8, 8
};

bool playSong = false;

void setup() {
  pinMode(BEEPER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // Button pin with internal pull-up
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    if (command == 'B') {  // 'B' for beep (Mario theme)
      playSong = true;
    }
  }

  if (playSong) {
    for (int thisNote = 0; thisNote < sizeof(melody) / sizeof(melody[0]); thisNote++) {
      // Check if button is pressed to stop the song
      if (digitalRead(BUTTON_PIN) == LOW) {
        playSong = false;
        noTone(BEEPER_PIN);
        while (digitalRead(BUTTON_PIN) == LOW); // Wait until button is released
        break;
      }

      int note = melody[thisNote];
      int noteDuration = 1000 / noteDurations[thisNote];

      if (note == 0) {
        // Rest note, no tone
        delay(noteDuration);
      } else {
        tone(BEEPER_PIN, note, noteDuration);
        delay(noteDuration * 1.30);  // Slight pause between notes
        noTone(BEEPER_PIN);
      }
    }
    playSong = false; // After song is played, reset playSong
  }
}
