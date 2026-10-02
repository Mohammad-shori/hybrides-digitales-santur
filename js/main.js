// Konfiguration der Stahlsaiten (Weiße Saiten / Linke Stege)
const whiteData = [
    { midi: 64, name: "E4", solfege: "Mi", y: 52, ledgers: [], topPercent: 85, leftPercent: 14.5, widthPercent: 35, sound: "audio/w1.mp3" },
    { midi: 65, name: "F4", solfege: "Fa", y: 48, ledgers: [], topPercent: 76, leftPercent: 16, widthPercent: 33, sound: "audio/w2.mp3" },
    { midi: 67, name: "G4", solfege: "Sol", y: 44, ledgers: [], topPercent: 65, leftPercent: 18, widthPercent: 31, sound: "audio/w3.mp3" },
    { midi: 69, name: "A4", solfege: "La", y: 40, ledgers: [], topPercent: 56, leftPercent: 20, widthPercent: 29, sound: "audio/w4.mp3" },
    { midi: 71, name: "B4", solfege: "Si", y: 36, ledgers: [], topPercent: 46, leftPercent: 22, widthPercent: 27, sound: "audio/w5.mp3" },
    { midi: 72, name: "C5", solfege: "Do", y: 32, ledgers: [], topPercent: 37, leftPercent: 23, widthPercent: 26, sound: "audio/w6.mp3" },
    { midi: 74, name: "D5", solfege: "Re", y: 28, ledgers: [], topPercent: 27, leftPercent: 24.5, widthPercent: 25, sound: "audio/w7.mp3" },
    { midi: 76, name: "E5", solfege: "Mi", y: 24, ledgers: [], topPercent: 17, leftPercent: 27, widthPercent: 22, sound: "audio/w8.mp3" },
    { midi: 77, name: "F5", solfege: "Fa", y: 20, ledgers: [], topPercent: 7, leftPercent: 29, widthPercent: 20, sound: "audio/w9.mp3" }
];

// Konfiguration der Messingsaiten (Gelbe Saiten / Rechte Stege)
const yellowData = [
    { midi: 52, name: "E3", solfege: "Mi", y: 84, ledgers: [1, 2, 3, 4], topPercent: 90, leftPercent: 50, widthPercent: 37, sound: "audio/y1.mp3" },
    { midi: 53, name: "F3", solfege: "Fa", y: 80, ledgers: [1, 2, 3], topPercent: 80, leftPercent: 50, widthPercent: 35, sound: "audio/y2.mp3" },
    { midi: 55, name: "G3", solfege: "Sol", y: 76, ledgers: [1, 2, 3], topPercent: 71, leftPercent: 50, widthPercent: 33, sound: "audio/y3.mp3" },
    { midi: 57, name: "A3", solfege: "La", y: 72, ledgers: [1, 2], topPercent: 61, leftPercent: 50, widthPercent: 31, sound: "audio/y4.mp3" },
    { midi: 59, name: "B3", solfege: "Si", y: 68, ledgers: [1, 2], topPercent: 51, leftPercent: 50, widthPercent: 29, sound: "audio/y5.mp3" },
    { midi: 60, name: "C4", solfege: "Do", y: 64, ledgers: [1], topPercent: 41, leftPercent: 50, widthPercent: 27, sound: "audio/y6.mp3" },
    { midi: 62, name: "D4", solfege: "Re", y: 60, ledgers: [1], topPercent: 32, leftPercent: 50, widthPercent: 25, sound: "audio/y7.mp3" },
    { midi: 64, name: "E4", solfege: "Mi", y: 52, ledgers: [], topPercent: 22, leftPercent: 50, widthPercent: 23, sound: "audio/y8.mp3" },
    { midi: 65, name: "F4", solfege: "Fa", y: 48, ledgers: [], topPercent: 12, leftPercent: 50, widthPercent: 21, sound: "audio/y9.mp3" }
];

const board = document.getElementById('santur-board');

/**
 * Verknüpft Klick- und Touch-Events mit minimaler Latenz
 */
function addTouchAndClick(element, action) {
    const handleTrigger = (e) => {
        e.preventDefault();
        triggerHit(action);
    };
    element.addEventListener('touchstart', handleTrigger, { passive: false });
    element.addEventListener('mousedown', handleTrigger);
}

// Erzeugung der visuellen Linien und Touch-Zonen für Stahlsaiten
whiteData.forEach((data, index) => {
    const line = document.createElement('div');
    line.id = `w-string-${index + 1}`;
    line.className = 'string-line';
    line.style.top = `${data.topPercent}%`;
    line.style.left = `${data.leftPercent}%`;
    line.style.width = `${data.widthPercent}%`;
    board.appendChild(line);

    const zone = document.createElement('div');
    zone.className = 'touch-zone';
    zone.style.top = `${data.topPercent - 1}%`;
    zone.style.left = `${data.leftPercent}%`;
    zone.style.width = `${data.widthPercent}%`;
    board.appendChild(zone);

    addTouchAndClick(zone, { type: 'white', num: index + 1, data: data });
});

// Erzeugung der visuellen Linien und Touch-Zonen für Messingsaiten
yellowData.forEach((data, index) => {
    const line = document.createElement('div');
    line.id = `y-string-${index + 1}`;
    line.className = 'string-line';
    line.style.top = `${data.topPercent}%`;
    line.style.left = `${data.leftPercent}%`;
    line.style.width = `${data.widthPercent}%`;
    board.appendChild(line);

    const zone = document.createElement('div');
    zone.className = 'touch-zone';
    zone.style.top = `${data.topPercent - 1}%`;
    zone.style.left = `${data.leftPercent}%`;
    zone.style.width = `${data.widthPercent}%`;
    board.appendChild(zone);

    addTouchAndClick(zone, { type: 'yellow', num: index + 1, data: data });
});

// Zuordnung der Computertastatur
const keyMap = {
    'KeyO': { type: 'white', num: 1, data: whiteData[0] },
    'KeyI': { type: 'white', num: 2, data: whiteData[1] },
    'KeyU': { type: 'white', num: 3, data: whiteData[2] },
    'KeyY': { type: 'white', num: 4, data: whiteData[3] },
    'KeyT': { type: 'white', num: 5, data: whiteData[4] },
    'KeyR': { type: 'white', num: 6, data: whiteData[5] },
    'KeyE': { type: 'white', num: 7, data: whiteData[6] },
    'KeyW': { type: 'white', num: 8, data: whiteData[7] },
    'KeyQ': { type: 'white', num: 9, data: whiteData[8] },

    'Period': { type: 'yellow', num: 1, data: yellowData[0] },
    'Comma': { type: 'yellow', num: 2, data: yellowData[1] },
    'KeyM': { type: 'yellow', num: 3, data: yellowData[2] },
    'KeyN': { type: 'yellow', num: 4, data: yellowData[3] },
    'KeyB': { type: 'yellow', num: 5, data: yellowData[4] },
    'KeyV': { type: 'yellow', num: 6, data: yellowData[5] },
    'KeyC': { type: 'yellow', num: 7, data: yellowData[6] },
    'KeyX': { type: 'yellow', num: 8, data: yellowData[7] },
    'KeyZ': { type: 'yellow', num: 9, data: yellowData[8] }
};

const activeCodes = new Set();
let audioUnlocked = false;

/**
 * Spielt die Audiodatei der entsprechenden Note ab
 */
function playAudioFile(soundPath) {
    if (!soundPath) return;
    const audio = new Audio(soundPath);
    audio.currentTime = 0;
    audio.play().catch(err => {
        console.warn("Fehler beim Abspielen der Audiodatei:", soundPath, err);
    });
}

/**
 * Aktualisiert die grafische Notendarstellung im SVG-Fünfliniensystem
 */
function updateSVGNote(noteData) {
    const head = document.getElementById('note-head');
    const stem = document.getElementById('note-stem');
    const l1 = document.getElementById('ledger-1');
    const l2 = document.getElementById('ledger-2');
    const l3 = document.getElementById('ledger-3');
    const l4 = document.getElementById('ledger-4');

    const y = noteData.y;
    head.setAttribute('cy', y);
    head.setAttribute('transform', `rotate(-20 155 ${y})`);

    stem.setAttribute('y1', y);
    stem.setAttribute('y2', y - 30);
    stem.setAttribute('x1', 160);
    stem.setAttribute('x2', 160);

    l1.setAttribute('visibility', noteData.ledgers.includes(1) ? 'visible' : 'hidden');
    l2.setAttribute('visibility', noteData.ledgers.includes(2) ? 'visible' : 'hidden');
    l3.setAttribute('visibility', noteData.ledgers.includes(3) ? 'visible' : 'hidden');
    l4.setAttribute('visibility', noteData.ledgers.includes(4) ? 'visible' : 'hidden');
}

/**
 * Schaltet die Audio-Wiedergabe nach der ersten Benutzerinteraktion frei
 */
function initAudio() {
    if (!audioUnlocked) {
        audioUnlocked = true;
        const box = document.getElementById('status-box');
        box.style.background = 'rgba(40, 167, 69, 0.4)';
    }
}

window.addEventListener('touchstart', initAudio, { once: true });
window.addEventListener('click', initAudio, { once: true });

/**
 * Triggert das visuelle Feedback, aktualisiert das Info-Panel und spielt den Ton ab
 */
function triggerHit(action) {
    initAudio();

    const prefix = action.type === 'white' ? 'w-string-' : 'y-string-';
    const stringEl = document.getElementById(`${prefix}${action.num}`);

    if (stringEl) {
        const activeClass = action.type === 'white' ? 'active-white' : 'active-yellow';
        stringEl.classList.add(activeClass);
        setTimeout(() => stringEl.classList.remove('active-white', 'active-yellow'), 180);
    }

    const letterEl = document.getElementById('note-letter');
    letterEl.innerText = action.data.name;
    letterEl.style.color = action.type === 'white' ? '#ffffff' : '#ffd700';

    document.getElementById('note-solfege').innerText = action.data.solfege;
    
    // Wissenschaftliche Bezeichnung der Saitenarten auf Deutsch
    const typeDe = action.type === 'white' ? 'Weiße Saiten' : 'Gelbe Saiten';
    document.getElementById('note-details').innerText = `${typeDe} – ${action.num}. Steg`;

    updateSVGNote(action.data);
    playAudioFile(action.data.sound);
}

// Event-Listener für Tastaturdruck
window.addEventListener('keydown', (e) => {
    const action = keyMap[e.code];
    if (action) {
        e.preventDefault();
        if (!activeCodes.has(e.code)) {
            activeCodes.add(e.code);
            triggerHit(action);
        }
    }
});

window.addEventListener('keyup', (e) => {
    activeCodes.delete(e.code);
});

// Web MIDI API: Verarbeitung von MIDI-Signalen aus externer Hardware (Teensy / Piezo-Trigger)
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiAccess => {
        for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = (e) => {
                const [command, note, velocity] = e.data;
                if (command === 144 && velocity > 0) { // Note-On Befehl
                    const wMatch = whiteData.findIndex(item => item.midi === note);
                    if (wMatch !== -1) {
                        triggerHit({ type: 'white', num: wMatch + 1, data: whiteData[wMatch] });
                        return;
                    }
                    const yMatch = yellowData.findIndex(item => item.midi === note);
                    if (yMatch !== -1) {
                        triggerHit({ type: 'yellow', num: yMatch + 1, data: yellowData[yMatch] });
                    }
                }
            };
        }
    });
}

// Initiales Laden der ersten Note
updateSVGNote(whiteData[0]);