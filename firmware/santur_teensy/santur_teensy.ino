// --- Santur ---
const int NUM_PIEZOS = 11;             // Anzahl der Piezosensoren (11 Stück)
const int THRESHOLD = 25;              // Schwellenwert zur Rauschunterdrückung
const int DEBOUNCE_TIME = 100;         // Entprellzeit zwischen Anschlägen in Millisekunden

// Array der analogen Pins des Teensy
const int PIEZO_PINS[NUM_PIEZOS] = {
  A0, A1, A2, A3, A4, A5,              // Piezos für die weißen Saiten
  A10, A11, A12, A13, A14              // Piezos für die gelben Saiten
};

// Entsprechende MIDI-Noten für Santur (Sol-Stimmung / Sol-Kuk)
const int MIDI_NOTES[NUM_PIEZOS] = {
  72, 71, 69, 67, 74, 76,              // Weiße Saiten
  53, 55, 57, 59, 60                   // Gelbe Saiten
};

// Speicherung des Zeitpunkts des letzten Anschlags für jeden Piezo
unsigned long lastHitTime[NUM_PIEZOS] = {0};

void setup() {
  for (int i = 0; i < NUM_PIEZOS; i++) {
    // Aktivierung des internen Pulldown-Widerstands zur Signalstabilisierung
    pinMode(PIEZO_PINS[i], INPUT_PULLDOWN);
  }
}

void loop() {
  unsigned long currentMillis = millis();

  for (int i = 0; i < NUM_PIEZOS; i++) {
    int sensorValue = analogRead(PIEZO_PINS[i]);

    if (sensorValue > THRESHOLD && (currentMillis - lastHitTime[i]) > DEBOUNCE_TIME) {
      int velocity = 127; // Feste Anschlagstärke (100%)

      // Senden des MIDI Note-On Befehls (Kanal 1)
      usbMIDI.sendNoteOn(MIDI_NOTES[i], velocity, 1);
      delay(4);
      usbMIDI.sendNoteOff(MIDI_NOTES[i], 0, 1);

      lastHitTime[i] = currentMillis;
    }
  }

  delay(2);
}