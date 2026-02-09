const unlockForm = document.getElementById('unlockForm');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const gateSection = document.getElementById('gateSection');
const chatSection = document.getElementById('chatSection');
const nicknameForm = document.getElementById('nicknameForm');
const nicknameInput = document.getElementById('nickname');
const chatRoom = document.getElementById('chatRoom');
const identity = document.getElementById('identity');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const fallbackBtn = document.getElementById('fallbackBtn');

const SECRET = 'dark matter';
let nickname = '';
let oscillator;
let audioContext;
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('quantum-chat') : null;

function start843HzTone() {
  if (oscillator) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext = new AudioCtx();
  oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.frequency.value = 843;
  oscillator.type = 'sine';
  gainNode.gain.value = 0.02;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
}

function addMessage(author, text, className = '') {
  const row = document.createElement('p');
  row.className = `message ${className}`.trim();
  row.innerHTML = `<span class="author">${author}:</span> ${text}`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function addSystem(text) {
  const row = document.createElement('p');
  row.className = 'message system';
  row.textContent = text;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

unlockForm.addEventListener('submit', (event) => {
  event.preventDefault();
  start843HzTone();
  const answer = answerInput.value.trim().toLowerCase();

  if (answer !== SECRET) {
    feedback.textContent = 'Niet juist. Gebruik opinion proberen.';
    answerInput.focus();
    return;
  }

  feedback.textContent = 'Portaal opent...';
  gateSection.classList.add('hidden');
  chatSection.classList.remove('hidden');
  nicknameInput.focus();
});

nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  nickname = nicknameInput.value.trim();
  if (!nickname) return;

  nicknameForm.classList.add('hidden');
  chatRoom.classList.remove('hidden');
  identity.textContent = `Je bent: ${nickname}`;
  addSystem('Portaal actief. Stuur je eerste bericht.');

  if (!channel) {
    addSystem('Geen live connectie gedetecteerd. Gebruik fallback knop voor ChatGPT.');
  } else {
    channel.postMessage({ type: 'join', nickname });
  }
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(nickname, text);
  messageInput.value = '';

  if (channel) {
    channel.postMessage({ type: 'message', nickname, text });
  } else {
    setTimeout(() => addMessage('Quantum-Echo', 'Signaal ontvangen in de matrix.'), 500);
  }
});

if (channel) {
  channel.onmessage = (event) => {
    const payload = event.data;
    if (!payload || payload.nickname === nickname) return;

    if (payload.type === 'join') {
      addSystem(`${payload.nickname} is door het portaal gekomen.`);
      return;
    }

    if (payload.type === 'message') {
      addMessage(payload.nickname, payload.text);
    }
  };
}

fallbackBtn.addEventListener('click', () => {
  window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer');
});
