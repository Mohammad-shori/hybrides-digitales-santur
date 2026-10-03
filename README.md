# hybrides-digitales-santur

**Ein Web-basiertes Santur mit MIDI-Hardware-Schnittstelle (Piezo-Sensoren + Teensy 4.1)**

Projekt im Rahmen der Lehrveranstaltung *Musikinformatik* (Master)

| | |
|---|---|
| **Autor:innen** | Mohammad Saeid Shori, Mehrnoush Allafi Marand |
| **Lehrveranstaltung** | Musikinformatik |
| **Hochschule / Semester** | Hochschule Düsseldorf · SS 2026 |

---

## Inhaltsverzeichnis

1. [Einleitung und Fragestellung](#1-einleitung-und-fragestellung)
2. [Das Instrument: Santur](#2-das-instrument-santur)
3. [Systemüberblick](#3-systemüberblick)
4. [Hardware](#4-hardware)
5. [Firmware](#5-firmware)
6. [Web-Anwendung](#6-web-anwendung)
7. [Installation und Start](#7-installation-und-start)
8. [Bedienung](#8-bedienung)
9. [Projektstruktur](#9-projektstruktur)
10. [Test und Fehlersuche](#10-test-und-fehlersuche)
11. [Diskussion](#11-diskussion)
12. [Ausblick](#12-ausblick)
13. [Verwendete Technologien](#13-verwendete-technologien)
14. [Hinweis zu Hilfsmitteln](#14-hinweis-zu-hilfsmitteln)
15. [Bildnachweise](#15-bildnachweise)

---

## 1. Einleitung und Fragestellung

Das Santur ist ein persisches Hackbrett. Es gehört zur klassischen persischen Musik, ist in digitalen Musikumgebungen aber kaum vertreten. Digitale Instrumente, die auf Tasten oder Pads beruhen, übertragen das Spielgefühl eines Saiteninstruments, das mit Klöppeln (Mezrab) angeschlagen wird, nur sehr begrenzt.

Dieses Projekt untersucht folgende Fragestellung:

> **Wie lässt sich das Spielgefühl eines Santur mit einfachen, kostengünstigen Mitteln in eine digitale Umgebung übertragen und gleichzeitig visuell und didaktisch aufbereiten (Anzeige von Ton, Steg und Notation in Echtzeit)?**

Daraus ergeben sich drei Ziele:

1. **Günstiger und nachbaubarer Aufbau** mit Standardkomponenten (Piezo-Sensoren, Mikrocontroller).
2. **Echtzeitfähigkeit:** Ein Anschlag soll unmittelbar hörbar und sichtbar sein.
3. **Visuelle Rückmeldung:** Notenname, Solfège, Stegnummer und Notation im Fünfliniensystem, damit das Instrument auch zum Lernen geeignet ist.

Das Projekt besteht aus **zwei Teilen**, die über **USB-MIDI** verbunden sind, aber auch einzeln funktionieren:

- **Teil 1: Web-Anwendung.** Ein Santur im Browser, das per Maus, Touch oder Computertastatur gespielt werden kann.
- **Teil 2: Physischer Aufbau.** Piezo-Sensoren und ein Teensy 4.1, mit denen das Instrument tatsächlich angeschlagen wird.

---

## 2. Das Instrument: Santur

Das Santur besitzt einen trapezförmigen Resonanzkörper, über den Saiten gespannt sind. Gespielt wird es mit zwei leichten Klöppeln (Mezrab).

- **Zwei Saitengruppen:** weiße Stahlsaiten und gelbe Messingsaiten.
- **Neun Stege je Gruppe:** Die Saiten laufen über bewegliche Stege. Je Gruppe sind es in diesem Projekt neun Stege, also 9 + 9 = 18 Stege in der Oberfläche.
- **Hinter dem Steg:** Auch der Saitenabschnitt hinter dem Steg lässt sich anschlagen. Er ist in der aktuellen Hardware noch nicht abgebildet (siehe [Ausblick](#12-ausblick)).

Die Oberfläche dieses Projekts bildet die beiden Stegreihen nach: links die weißen, rechts die gelben Saiten. Zu jedem Steg gehört eine Audiodatei (Sample).

---

## 3. Systemüberblick

```
 Anschlag (Mezrab / Finger)
        │
        ▼
 ┌────────────────┐  analog   ┌─────────────────┐  USB-MIDI  ┌──────────────────────────┐
 │ 11 Piezo-      │ ────────► │ Teensy 4.1      │ ─────────► │ Browser (Web MIDI API)   │
 │ Sensoren       │  A0–A5,   │ Firmware:       │ Note On/   │ ├─ Sample-Wiedergabe     │
 │ (6 weiß +      │  A10–A14  │ Schwelle +      │ Off,       │ ├─ Notenname / Solfège   │
 │  5 gelb)       │           │ Debounce        │ Kanal 1    │ ├─ Steg-Nummer           │
 └────────────────┘           └─────────────────┘            │ └─ Notation (SVG)        │
                                                             └──────────────────────────┘

 Alternative Eingaben ohne Hardware: Mausklick · Touch · Computertastatur
```

**Ablauf eines Anschlags:**

1. Ein Schlag auf einen Piezo erzeugt eine kurze Spannungsspitze.
2. Der Teensy liest die Spannung am Analogeingang. Liegt sie über der Schwelle und ist die Sperrzeit abgelaufen, gilt der Schlag als gültig.
3. Der Teensy sendet eine MIDI-Note (Note On, kurz danach Note Off) über USB.
4. Der Browser empfängt die Note über die **Web MIDI API**, spielt das passende Sample ab, zeigt Ton und Steg an und zeichnet die Note im Fünfliniensystem.

Alle Eingabewege (Maus, Touch, Tastatur, MIDI) rufen dieselbe Funktion (`triggerHit`) auf. Dadurch verhält sich die Oberfläche unabhängig von der Quelle gleich.

**Designentscheidungen:**

| Entscheidung | Begründung |
|---|---|
| Piezo-Sensoren | günstig, robust, reagieren schnell auf Körperschall |
| Teensy 4.1 | natives USB-MIDI, hohe Taktrate (600 MHz), 18 Analogeingänge |
| MIDI als Protokoll | Standard; das Instrument ist auch mit anderer Software (z. B. DAW) nutzbar |
| Web-Anwendung | keine Installation, läuft auch auf Tablet und Smartphone |

---

## 4. Hardware

### 4.1 Komponenten

| Komponente | Anzahl | Zweck |
|---|---|---|
| Teensy 4.1 | 1 | Mikrocontroller, natives USB-MIDI |
| Piezo-Scheiben | 11 | Erfassung der Anschläge |
| Widerstand 1 MΩ | 11 | Ableitwiderstand, parallel zu jedem Piezo |
| Steckbrett (Breadboard) und Jumperkabel | 1 | Verdrahtung |
| Holzplatte | 1 | Träger für die Sensoren |
| USB-Kabel | 1 | Stromversorgung und MIDI-Verbindung zum Laptop |

### 4.2 Aufbau

Die elf Piezo-Scheiben sind auf einer Holzplatte befestigt: **sechs links** (weiße Stahlsaiten) und **fünf rechts** (gelbe Messingsaiten). Das entspricht der Anordnung der beiden Stegreihen des Santur. Oben auf der Platte befindet sich das Steckbrett mit dem Teensy 4.1.

Der Aufbau ist ein **Prototyp**. Die Sensoren sind noch nicht in einen echten Santur-Korpus eingebaut; Anordnung und Elektronik wurden zunächst auf einer Platte getestet.

### 4.3 Beschaltung eines Sensors

Jeder Piezo hat zwei Anschlüsse:

- eine Ader an einen **Analogeingang** (A) des Teensy,
- die andere Ader an **GND**.

Parallel zum Sensor liegt ein **1-MΩ-Widerstand** zwischen Analogeingang und GND. Er leitet die Ladung des Piezos wieder ab, sodass das Signal nach einem Schlag schnell auf den Ruhewert zurückkehrt und der Eingang einen definierten Pegel hat.

```
   Analogeingang (A) ────┬─────────┐
                         │         │
                      [ Piezo ]  [ 1 MΩ ]
                         │         │
   GND ──────────────────┴─────────┘
```



### 4.4 Pin- und Notenbelegung

**Weiße Saiten (Stahl, linke Stege), 6 Sensoren**

| Sensor | Pin | MIDI-Note | Ton | Steg in der Oberfläche |
|---|---|---|---|---|
| 1 | A0 | 72 | C5 | 6 |
| 2 | A1 | 71 | B4 | 5 |
| 3 | A2 | 69 | A4 | 4 |
| 4 | A3 | 67 | G4 | 3 |
| 5 | A4 | 74 | D5 | 7 |
| 6 | A5 | 76 | E5 | 8 |

**Gelbe Saiten (Messing, rechte Stege), 5 Sensoren**

| Sensor | Pin | MIDI-Note | Ton | Steg in der Oberfläche |
|---|---|---|---|---|
| 1 | A10 | 53 | F3 | 2 |
| 2 | A11 | 55 | G3 | 3 |
| 3 | A12 | 57 | A3 | 4 |
| 4 | A13 | 59 | B3 | 5 |
| 5 | A14 | 60 | C4 | 6 |

Die MIDI-Nummern der Hardware entsprechen den Nummern in der Web-Anwendung. Weil die Oberfläche 9 + 9 Stege zeigt, die Hardware aber nur 6 + 5 Töne liefert, sind die übrigen Stege derzeit nur per Maus, Touch oder Tastatur spielbar.

---

## 5. Firmware

Datei: `firmware/santur_teensy/santur_teensy.ino` (Arduino-Sketch für den Teensy 4.1).

### 5.1 Funktionsweise

In der Hauptschleife werden alle elf Analogeingänge nacheinander gelesen. Zwei einfache Mechanismen sorgen für zuverlässige Anschlagserkennung:

- **Schwellenwert (`THRESHOLD = 25`):** Nur Werte über der Schwelle zählen als Anschlag. Rauschen und Körperschall, der nicht von einem Schlag stammt, werden ignoriert.
- **Debounce (`DEBOUNCE_TIME = 100 ms`):** Nach einem gültigen Anschlag wird derselbe Sensor kurz gesperrt. Das Ausschwingen der Scheibe löst so nicht mehrere Noten aus.

Bei einem gültigen Anschlag sendet die Firmware `Note On` (Kanal 1), wartet 4 ms und sendet `Note Off`.

### 5.2 Parameter

| Parameter | Wert | Bedeutung |
|---|---|---|
| `NUM_PIEZOS` | 11 | Anzahl der Sensoren |
| `THRESHOLD` | 25 | Mindestwert des ADC für einen gültigen Anschlag |
| `DEBOUNCE_TIME` | 100 ms | Sperrzeit pro Sensor |
| Velocity | 127 (fest) | Anschlagstärke der MIDI-Note |
| MIDI-Kanal | 1 | Sendekanal |

Die Werte für Schwelle und Sperrzeit sind Startwerte. Je nach Sensor, Befestigung und Untergrund müssen sie angepasst werden (siehe [Fehlersuche](#10-test-und-fehlersuche)).

### 5.3 Kernlogik

```cpp
if (sensorValue > THRESHOLD && (currentMillis - lastHitTime[i]) > DEBOUNCE_TIME) {
  int velocity = 127; // feste Velocity
  usbMIDI.sendNoteOn(MIDI_NOTES[i], velocity, 1);
  delay(4);
  usbMIDI.sendNoteOff(MIDI_NOTES[i], 0, 1);
  lastHitTime[i] = currentMillis;
}
```

Die Pins sind als `INPUT_PULLDOWN` konfiguriert, um ein stabiles Ruhesignal zu erhalten.

### 5.4 Upload

1. Arduino IDE mit *Teensyduino* installieren.
2. Sketch `firmware/santur_teensy/santur_teensy.ino` öffnen.
3. Board **Teensy 4.1** wählen.
4. *Tools → USB Type → MIDI* einstellen.
5. Hochladen.

---

## 6. Web-Anwendung

Die Anwendung besteht aus drei getrennten Dateien (`index.html`, `css/style.css`, `js/main.js`) und verwendet keine externen Bibliotheken.

### 6.1 Funktionen

- **Interaktives Santur:** Klick- bzw. Touch-Zonen liegen über den 9 weißen und 9 gelben Saiten der Grafik. Beim Anschlag leuchtet die Saite kurz auf.
- **Anzeige pro Anschlag:** Notenname (z. B. `A3`), Solfège (`La`), Saitenfarbe und Stegnummer (z. B. „Gelbe Saiten – 4. Steg“).
- **Notation:** Die Note wird als SVG im Violinschlüssel-Fünfliniensystem dargestellt, inklusive Hilfslinien für tiefe Töne.
- **Klang:** Für jede Saite wird eine Audiodatei (`audio/w1–w9.mp3` für weiße, `audio/y1–y9.mp3` für gelbe Saiten) abgespielt.
- **Eingabewege:** Maus, Touch, Computertastatur und MIDI (Web MIDI API).
- **Responsives Layout:** Skalierung über `aspect-ratio` und relative Einheiten, geeignet für Desktop, Tablet und Smartphone.

### 6.2 Aufbau des Codes

| Bestandteil | Aufgabe |
|---|---|
| `whiteData`, `yellowData` | Tabellen mit je neun Einträgen: MIDI-Nummer, Notenname, Solfège, Position im Notensystem, Hilfslinien, Position der Klickzone, Audiodatei |
| `triggerHit(action)` | zentrale Funktion: lässt die Saite aufleuchten, aktualisiert die Anzeige, zeichnet die Note und spielt das Sample |
| `updateSVGNote(noteData)` | verschiebt Notenkopf, Hals und Hilfslinien im SVG-Notensystem |
| `playAudioFile(path)` | spielt die Audiodatei einer Saite ab |
| `keyMap` | Zuordnung der Computertasten zu den Stegen |
| `navigator.requestMIDIAccess` | Empfang der MIDI-Nachrichten vom Teensy (`Note On`, Status 144, Velocity > 0) |

### 6.3 Nachrichtenfluss bei MIDI

1. Der Browser empfängt `Note On` (Status 144, Velocity > 0).
2. Die Note wird zuerst in der Tabelle der weißen, dann der gelben Saiten gesucht.
3. Bei einem Treffer wird dieselbe Funktion `triggerHit` wie bei Klick oder Tastatur ausgeführt.

### 6.4 Tastaturbelegung (Test ohne Hardware)

| Gruppe | Tasten für Steg 1 bis 9 |
|---|---|
| Weiße Saiten | `O`, `I`, `U`, `Y`, `T`, `R`, `E`, `W`, `Q` |
| Gelbe Saiten | `.`, `,`, `M`, `N`, `B`, `V`, `C`, `X`, `Z` |

### 6.5 Browser-Kompatibilität

Die Web MIDI API wird von Chromium-basierten Browsern unterstützt (**Google Chrome, Microsoft Edge**). In Safari funktionieren Maus, Touch und Tastatur, aber kein MIDI-Empfang.

---

## 7. Installation und Start

### Nur Software (ohne Hardware)

1. Repository klonen:

   git clone [https://github.com/Mohammad-shori/hybrides-digitales-santur.git](https://github.com/Mohammad-shori/hybrides-digitales-santur.git)
   cd hybrides-digitales-santur

2. Direkt im Browser ausführen (GitHub Pages):

   [https://mohammad-shori.github.io/hybrides-digitales-santur/](https://mohammad-shori.github.io/hybrides-digitales-santur/)
   *(Hinweis: Einmal auf die Seite klicken, da Browser Audio erst nach einer Nutzerinteraktion freigeben. Danach auf die Saiten klicken oder Tasten drücken).*

### Mit Hardware

1. Firmware auf den Teensy 4.1 laden (siehe [5.4](#54-upload)), USB-Typ **MIDI**.
2. Teensy per USB mit dem Computer verbinden.
3. Die Web-Anwendung in **Chrome oder Edge** öffnen und die MIDI-Berechtigung erlauben.
4. Auf die Piezo-Sensoren schlagen.

---

## 8. Bedienung

| Eingabe | Aktion |
|---|---|
| Mausklick / Touch | auf eine Saite klicken bzw. tippen |
| Computertastatur | Tasten laut Tabelle in 6.4 |
| Piezo-Sensor | mit Finger oder Mezrab auf die Scheibe schlagen |

Nach jedem Anschlag zeigt die Oberfläche Notenname, Solfège, Saitenfarbe, Stegnummer und die Note im Notensystem.

---

## 9. Projektstruktur

```
.
├── README.md
├── index.html              # Struktur der Web-Anwendung
├── css/
│   └── style.css           # Layout und Gestaltung
├── js/
│   └── main.js             # Logik, Eingaben, Notation, MIDI-Empfang
├── img/
│   ├── santur.png          # Grafik des Instruments
│   └── background.jpg      # Hintergrundbild
├── audio/
│   ├── w1.mp3 … w9.mp3     # 9 Samples der weißen Saiten
│   └── y1.mp3 … y9.mp3     # 9 Samples der gelben Saiten
└── firmware/
    └── santur_teensy/
        └── santur_teensy.ino   # Teensy-4.1-Firmware (Arduino-Sketch)
```

---

## 10. Test und Fehlersuche

### 10.1 Testablauf

1. **Ohne Hardware:** Klick und Tastatur testen. Alle 18 Stege sollten Sound, Anzeige und Notation auslösen.
2. **Firmware:** Teensy anschließen. Im Betriebssystem bzw. in der MIDI-Konsole des Browsers erscheint ein neues MIDI-Gerät.
3. **Sensoren:** Jeden der 11 Piezos einzeln anschlagen und prüfen, ob die richtige Note und der richtige Steg erscheinen (Tabelle in 4.4).
4. **Zusammenspiel:** Mehrere Sensoren nacheinander und kurz hintereinander anschlagen.

### 10.2 Häufige Probleme

| Problem | Mögliche Ursache und Lösung |
|---|---|
| Kein Ton | Einmal auf die Seite klicken (Audio-Freigabe). Lautstärke und Dateinamen in `audio/` prüfen (Groß-/Kleinschreibung). |
| Kein Bild / kein Hintergrund | Pfade der Bilder in `css/style.css` prüfen (relativ zur CSS-Datei, z. B. `../img/santur.png`). |
| Kein MIDI-Gerät | Chrome oder Edge verwenden, MIDI-Berechtigung erlauben, USB-Typ des Teensy auf *MIDI* stellen. Seite nach dem Anschließen neu laden. |
| Eine Note wird doppelt ausgelöst | `DEBOUNCE_TIME` erhöhen. |
| Sensor reagiert auf Schläge neben ihm (Übersprechen) | `THRESHOLD` erhöhen, Sensoren mechanisch besser entkoppeln. |
| Sensor reagiert nicht auf leichte Schläge | `THRESHOLD` senken, Befestigung und Verkabelung prüfen. |

---

## 11. Diskussion

**Was funktioniert gut**

- Der Signalweg vom Anschlag bis zur Anzeige ist durchgängig und ohne Zusatzsoftware (kein DAW) nutzbar.
- Die Kombination aus Klang, Stegnummer und Notation macht das Instrument auch **didaktisch** interessant.
- Mit einem Teensy und Standard-Piezos ist der Aufbau **günstig** und leicht nachbaubar.
- Die Web-Anwendung läuft ohne Installation und ist auch ohne Hardware nutzbar.

**Grenzen des aktuellen Stands**

- **Unvollständige Sensorabdeckung:** Aufgebaut sind 11 von 27 Sensoren (6 weiße + 5 gelbe). Ein vollständiges Santur benötigt 18 Sensoren für die 9 weißen und 9 gelben Stege sowie 9 weitere für die Saiten hinter dem Steg. Die übrigen Töne der Oberfläche sind derzeit nur per Maus, Touch oder Tastatur spielbar.
- **Feste Velocity (127):** Der Piezo liefert prinzipiell Amplitudeninformation, die noch nicht genutzt wird. Leise und kräftige Schläge klingen deshalb gleich; es fehlt das dynamische Spielgefühl.
- **Übersprechen (Crosstalk):** Körperschall kann Nachbarsensoren mitanregen. Schwellenwert und Debounce mildern das, lösen es aber nicht vollständig.
- **Sample-Wiedergabe:** Die Audiodateien werden per `Audio`-Objekt abgespielt. Für sehr geringe Latenz und mehrstimmiges Spiel wäre die Web Audio API mit vorgeladenen Buffern besser geeignet.
- **Stimmung:** Die Zuordnung folgt der westlichen Notation (gleichstufige MIDI-Noten). Mikrotonale Eigenheiten der persischen Musik (z. B. Koron und Sori) werden nicht abgebildet.

---

## 12. Ausblick

1. **Sensorik verbessern (nächster Schritt):** Der Sensor soll sowohl auf sehr leise als auch auf kräftige Schläge zuverlässig reagieren. Dazu soll die Velocity aus der Peak-Amplitude des Piezosignals berechnet und die Schwelle pro Sensor kalibriert werden.
2. **Ausbau auf 27 Sensoren:** 18 Sensoren für die weißen und gelben Stege und 9 für die Saiten hinter dem Steg. Da der Teensy 4.1 nur 18 Analogeingänge besitzt, ist dafür ein Analog-Multiplexer nötig.
3. **Vollständiges Instrument:** Einbau der Sensoren in einen echten Santur-Korpus.
4. **Mikrotonalität:** Unterstützung persischer Dastgahs mit Koron- und Sori-Vorzeichen, auch in der Notation.
5. **Web Audio API:** Vorgeladene `AudioBuffer`, Polyphonie und geringere Latenz.
6. **Lern- und Aufnahmemodus:** Melodien aufnehmen, als MIDI exportieren und als Übungsstücke einblenden; MIDI-Geräte auch nach dem Laden der Seite erkennen (`onstatechange`).

---

## 13. Verwendete Technologien

- Teensy 4.1, Teensyduino / Arduino IDE (C++)
- Piezoelektrische Sensoren
- USB-MIDI
- HTML5, CSS3, JavaScript, SVG
- Web MIDI API

---

## 14. Hinweis zu Hilfsmitteln

Bei der Entwicklung wurden KI-Assistenzsysteme (Gemini, Claude) als Unterstützung für Code und Dokumentation verwendet. Konzept, Aufbau der Hardware, Test und Bewertung der Ergebnisse stammen von den Autor:innen.

---

## 15. Bildnachweise

- Hintergrundbild: Pinterest Pin von **TAHA** ([Link zur Quelle](https://de.pinterest.com/pin/785807834969737808/))
- Audio-Samples (`audio/w1–w9.mp3`, `audio/y1–y9.mp3`):** Eigene Aufnahmen der Autor:innen.


