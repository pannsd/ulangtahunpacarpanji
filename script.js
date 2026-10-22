const entryModal = document.querySelector('#entryModal');
const entryButton = document.querySelector('#entryButton');
const entryCount = document.querySelector('#entryCount');
const flowerLayer = document.querySelector('#flowerLayer');
const ENTRY_CLICKS_REQUIRED = 3;
let entryClicks = 0;

function spawnFlowers() {
  const flowers = ['🌸', '🌷', '💮', '🌺', '🌹'];
  const burstCount = 14;
  for (let index = 0; index < burstCount; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'flower-particle';
    particle.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    particle.style.left = `${44 + (Math.random() - 0.5) * 66}%`;
    particle.style.top = `${46 + (Math.random() - 0.5) * 38}%`;
    particle.style.setProperty('--fx', `${(Math.random() - 0.5) * 170}px`);
    particle.style.setProperty('--fy', `${-(55 + Math.random() * 95)}px`);
    particle.style.setProperty('--fr', `${(Math.random() - 0.5) * 100}deg`);
    particle.style.animationDelay = `${Math.random() * 0.18}s`;
    flowerLayer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }
}

function updateEntryLabel() {
  const remaining = ENTRY_CLICKS_REQUIRED - entryClicks;
  entryCount.textContent = entryClicks > 0 && remaining > 0 ? `(${remaining} lagi)` : '';
}

function closeEntryModal() {
  entryModal.classList.add('is-closing');
  document.body.classList.remove('entry-locked');
  setTimeout(() => entryModal.remove(), 520);
}

if (entryModal && entryButton) {
  entryButton.addEventListener('click', () => {
    entryClicks += 1;
    spawnFlowers();
    entryButton.classList.remove('pulse');
    void entryButton.offsetWidth;
    entryButton.classList.add('pulse');

    if (entryClicks >= ENTRY_CLICKS_REQUIRED) {
      entryButton.disabled = true;
      entryCount.textContent = '';
      const musik = document.getElementById('musikKejutan');
      if (musik) {
        musik.play();
      }
      setTimeout(closeEntryModal, 500);
    } else {
      updateEntryLabel();
    }
  });
}

function setupPhotoModal(modalEl, triggerEl) {
  if (!modalEl || !triggerEl) return;

  function open() {
    modalEl.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modalEl.querySelector('.close-button');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    modalEl.hidden = true;
    document.body.style.overflow = '';
    triggerEl.focus();
  }

  triggerEl.addEventListener('click', open);
  triggerEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
  modalEl.querySelectorAll('[data-close-photo]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalEl.hidden) close();
  });
}

setupPhotoModal(document.querySelector('#littleMomentsModal'), document.querySelector('#littleMomentsTrigger'));
setupPhotoModal(document.querySelector('#favoriteViewModal'), document.querySelector('#favoriteViewTrigger'));

const wishButton = document.querySelector('#wishButton');
const wishModal = document.querySelector('#wishModal');
const confettiLayer = document.querySelector('#confettiLayer');
const closeButtons = document.querySelectorAll('[data-close-modal]');

function setModal(open) {
  wishModal.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    createConfetti();
    wishModal.querySelector('.close-button').focus();
  } else {
    wishButton.focus();
  }
}

function createConfetti() {
  const colors = ['#e35f83', '#f4a5b8', '#e29a5e', '#ffd6c5', '#bd3f64'];
  confettiLayer.innerHTML = '';
  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
    piece.style.animationDelay = `${Math.random() * 0.55}s`;
    piece.style.transform = `rotate(${Math.random() * 90}deg)`;
    confettiLayer.appendChild(piece);
  }
}

wishButton.addEventListener('click', () => setModal(true));
closeButtons.forEach((button) => button.addEventListener('click', () => setModal(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !wishModal.hidden) setModal(false);
});

document.querySelectorAll('.photo-input').forEach((input) => {
  input.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const card = event.target.closest('.photo-card');
    const image = card.querySelector('.uploaded-photo');
    image.src = URL.createObjectURL(file);
    card.classList.add('has-photo');
  });
});

function getNextBirthday() {
  const birthday = new Date(2026, 9, 23);
  birthday.setHours(0, 0, 0, 0);
  return birthday;
}

function updateCountdown() {
  const distance = Math.max(0, getNextBirthday() - new Date());
  const seconds = Math.floor(distance / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainderSeconds = seconds % 60;

  document.querySelector('#days').textContent = String(days).padStart(2, '0');
  document.querySelector('#hours').textContent = String(hours).padStart(2, '0');
  document.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
  document.querySelector('#seconds').textContent = String(remainderSeconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);