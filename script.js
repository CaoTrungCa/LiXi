const prizesConfig = [
  { value: 10000, weight: 25 },
  { value: 20000, weight: 50 },
  { value: 50000, weight: 10 },
  { value: 100000, weight: 1.8 },
  { value: 200000, weight: 1.5 },
  { value: 500000, weight: 0.5 },
];

const prizeImages = {
  10000: "assets/images/10k.png",
  20000: "assets/images/20k.png",
  50000: "assets/images/50k.png",
  100000: "assets/images/100k.png",
  200000: "assets/images/200k.png",
  500000: "assets/images/500k.png",
};

const wishes = [
  "Chúc Mừng Năm Mới!",
  "Vạn Sự Như Ý",
  "An Khang Thịnh Vượng",
  "Phát Tài Phát Lộc",
  "Tiền Vô Như Nước",
  "Sức Khỏe Dồi Dào",
  "Tấn Tài Tấn Lộc",
  "Năm Mới Bình An",
  "Cung Hỷ Phát Tài",
  "Mã Đáo Thành Công",
];

const envelopeCover = "assets/images/bao-li-xi.png";

const bgMusic = new Audio("assets/sounds/nhac-tet.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.6;
const openSound = new Audio("assets/sounds/ting-ting.mp3");
const shakeSound = new Audio("assets/sounds/lac.mp3");

function autoPlayMusic() {
  bgMusic
    .play()
    .then(() => {
      document.removeEventListener("click", autoPlayMusic);
      document.removeEventListener("touchstart", autoPlayMusic);
      document.removeEventListener("keydown", autoPlayMusic);
    })
    .catch(() => {});
}

document.addEventListener("click", autoPlayMusic);
document.addEventListener("touchstart", autoPlayMusic);
document.addEventListener("keydown", autoPlayMusic);

const totalEnvelopes = 12;
const grid = document.getElementById("envelopeGrid");
const modal = document.getElementById("resultModal");
let isShaking = false;

function getWeightedRandomPrize() {
  let totalWeight = prizesConfig.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (let item of prizesConfig) {
    if (random < item.weight) {
      return item.value;
    }
    random -= item.weight;
  }
  return prizesConfig[0].value;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function openEnvelope(element) {
  if (element.classList.contains("opened")) return;

  openSound.loop = true;
  openSound.currentTime = 0;
  openSound.play();

  const prize = getWeightedRandomPrize();

  const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
  document.getElementById("wishDisplay").textContent = randomWish;

  element.classList.add("opening-animation");

  let prizeImg = document.getElementById("prize-img");
  if (!prizeImg) {
    prizeImg = document.createElement("img");
    prizeImg.id = "prize-img";
    prizeImg.style.maxWidth = "100%";
    prizeImg.style.marginTop = "15px";
    const closeBtn = document.querySelector(".close-btn");
    closeBtn.parentNode.insertBefore(prizeImg, closeBtn);
  }
  prizeImg.src = prizeImages[prize];

  setTimeout(() => {
    element.classList.remove("opening-animation");
    element.classList.add("opened");

    modal.style.display = "flex";
    triggerFireworks();
  }, 500);
}

function triggerFireworks() {
  var duration = 3 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

function closeModal() {
  modal.style.display = "none";
  openSound.pause();
  openSound.currentTime = 0;
  openSound.loop = false;
}

function shakeEnvelopes() {
  if (isShaking) return;

  shakeSound.currentTime = 0;
  shakeSound.play();

  isShaking = true;

  const wrappers = Array.from(document.querySelectorAll(".envelope-wrapper"));

  wrappers.forEach((wrapper) => {
    wrapper.style.transition = "transform 0.4s ease-in";
    wrapper.style.transform = "rotate(0deg)";

    const env = wrapper.querySelector(".envelope");
    env.classList.remove("opened");
    env.classList.add("shake");
  });

  setTimeout(() => {
    wrappers.sort(() => Math.random() - 0.5);

    const centerIndex = (totalEnvelopes - 1) / 2;

    const angleStep = window.innerWidth < 768 ? 6 : 10;

    wrappers.forEach((wrapper, index) => {
      grid.appendChild(wrapper);

      const angle = (index - centerIndex) * angleStep;

      wrapper.style.transition = `transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2) ${
        index * 0.05
      }s`;
      wrapper.style.transform = `rotate(${angle}deg)`;

      wrapper.querySelector(".envelope").classList.remove("shake");
    });

    setTimeout(() => {
      isShaking = false;
      shakeSound.pause();
      shakeSound.currentTime = 0;
    }, 1000);
  }, 800);
}

function initGame() {
  grid.innerHTML = "";
  const centerIndex = (totalEnvelopes - 1) / 2;

  const angleStep = window.innerWidth < 768 ? 6 : 10;

  for (let i = 0; i < totalEnvelopes; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "envelope-wrapper";

    const angle = (i - centerIndex) * angleStep;
    wrapper.style.transform = `rotate(${angle}deg)`;

    const envelope = document.createElement("div");
    envelope.className = "envelope";

    envelope.style.backgroundImage = `url('${envelopeCover}')`;

    envelope.onclick = function () {
      openEnvelope(this);
    };

    wrapper.appendChild(envelope);
    grid.appendChild(wrapper);
  }
}

initGame();
