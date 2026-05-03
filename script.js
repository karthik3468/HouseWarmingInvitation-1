const body = document.body;
const intro = document.getElementById("intro");
const openInvitation = document.getElementById("openInvitation");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const header = document.querySelector(".site-header");
const confettiCanvas = document.getElementById("confettiCanvas");
const countdownStatus = document.getElementById("countdownStatus");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const parallaxTarget = document.querySelector("[data-parallax]");
const copyLocation = document.getElementById("copyLocation");
const saveDate = document.getElementById("saveDate");
const locationUrl = "https://maps.app.goo.gl/LdvfGQ3KJbN5LLx17";
const musicSources = [
  "assets/inkem.mp3"
];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle?.addEventListener("click", () => {
  navToggle.classList.toggle("is-open");
  navLinks.classList.toggle("is-open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function openIntro() {
  intro.classList.add("is-hidden");
  body.classList.remove("is-locked");
  document.querySelectorAll(".hero .reveal").forEach((element) => element.classList.add("is-visible"));
  launchConfetti();
  startMusic();

  if (!prefersReducedMotion && window.gsap) {
    gsap.from(".hero .eyebrow", { y: 18, opacity: 0, duration: 0.7, ease: "power3.out" });
    gsap.from(".hero h1 span", { y: 34, opacity: 0, duration: 0.9, delay: 0.08, ease: "power3.out" });
    gsap.from(".hero h1 strong", { y: 40, opacity: 0, duration: 0.95, delay: 0.18, ease: "power3.out" });
    gsap.from(".host-line", { y: 22, opacity: 0, duration: 0.75, delay: 0.34, ease: "power3.out" });
  }
}

openInvitation?.addEventListener("click", openIntro);

window.addEventListener("load", () => {
  if (prefersReducedMotion) openIntro();
});

const countdownTarget = new Date("2026-05-08T19:30:00+05:30").getTime();
const countdownValues = {
  days: document.querySelector('[data-value="days"]'),
  hours: document.querySelector('[data-value="hours"]'),
  minutes: document.querySelector('[data-value="minutes"]'),
  seconds: document.querySelector('[data-value="seconds"]')
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = countdownTarget - Date.now();

  if (distance <= 0) {
    countdownValues.days.textContent = "00";
    countdownValues.hours.textContent = "00";
    countdownValues.minutes.textContent = "00";
    countdownValues.seconds.textContent = "00";
    countdownStatus.textContent = "The House Warming ceremony time has arrived.";
    return;
  }

  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  const seconds = Math.floor((distance % 60_000) / 1_000);

  countdownValues.days.textContent = pad(days);
  countdownValues.hours.textContent = pad(hours);
  countdownValues.minutes.textContent = pad(minutes);
  countdownValues.seconds.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  confettiCanvas.width = window.innerWidth * ratio;
  confettiCanvas.height = window.innerHeight * ratio;
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
  return ratio;
}

let confettiRatio = sizeCanvas();
window.addEventListener("resize", () => {
  confettiRatio = sizeCanvas();
});

function launchConfetti() {
  if (prefersReducedMotion) return;

  const ctx = confettiCanvas.getContext("2d");
  const colors = ["#ffe49b", "#d9aa49", "#fff6df", "#aa6532", "#6e1f32", "#1d5c45"];
  const pieces = Array.from({ length: 170 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -Math.random() * confettiCanvas.height * 0.38,
    w: (Math.random() * 8 + 4) * confettiRatio,
    h: (Math.random() * 5 + 3) * confettiRatio,
    speed: (Math.random() * 2.8 + 1.8) * confettiRatio,
    drift: (Math.random() - 0.5) * 2.7 * confettiRatio,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.25,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach((piece) => {
      piece.x += piece.drift;
      piece.y += piece.speed;
      piece.rotation += piece.spin;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 230);
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    });
    frame += 1;

    if (frame < 230) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  draw();
}

window.addEventListener(
  "scroll",
  () => {
    if (!parallaxTarget || prefersReducedMotion) return;
    parallaxTarget.style.setProperty("--parallax-y", `${Math.min(window.scrollY * 0.16, 86)}px`);
  },
  { passive: true }
);

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion || window.innerWidth < 900) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 7;
    const rotateX = (y / rect.height - 0.5) * -7;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.addEventListener("click", (event) => {
  if (prefersReducedMotion) return;
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 650);
});

copyLocation?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(locationUrl);
    copyLocation.textContent = "Location Copied";
    window.setTimeout(() => {
      copyLocation.textContent = "Copy Location Link";
    }, 1600);
  } catch {
    window.open(locationUrl, "_blank", "noopener,noreferrer");
  }
});

saveDate?.addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kotha Family Invitation//EN",
    "BEGIN:VEVENT",
    "UID:kotha-housewarming-20260508@example.com",
    "DTSTAMP:20260503T000000Z",
    "DTSTART:20260508T140000Z",
    "DTEND:20260508T163000Z",
    "SUMMARY:House Warming - Kotha Family",
    "DESCRIPTION:House Warming hosted by Kotha Purna Chandra Rao and Kotha Sita Lakshmi.",
    "LOCATION:Ramulavari Gudilo",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kotha-housewarming-08-may-2026.ics";
  link.click();
  URL.revokeObjectURL(url);
});

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".gallery-item img").forEach((image) => {
    gsap.fromTo(
      image,
      { y: -24 },
      {
        y: 24,
        ease: "none",
        scrollTrigger: {
          trigger: image.closest(".gallery-item"),
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });
}

const audioState = {
  context: null,
  master: null,
  timers: [],
  playing: false
};

const melody = [
  [392, 0, 0.42],
  [440, 0.45, 0.34],
  [493.88, 0.82, 0.48],
  [587.33, 1.35, 0.42],
  [523.25, 1.82, 0.44],
  [493.88, 2.28, 0.34],
  [440, 2.66, 0.48],
  [392, 3.2, 0.7]
];

function makeAudioContext() {
  return audioState.context || new (window.AudioContext || window.webkitAudioContext)();
}

function playMelodyNote(frequency, start, duration) {
  const ctx = audioState.context;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const vibrato = ctx.createOscillator();
  const vibratoGain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(frequency, start);
  vibrato.type = "sine";
  vibrato.frequency.setValueAtTime(5.5, start);
  vibratoGain.gain.setValueAtTime(4, start);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1250, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.035, start + 0.06);
  gain.gain.setTargetAtTime(0.012, start + duration * 0.48, 0.16);
  gain.gain.linearRampToValueAtTime(0, start + duration + 0.1);

  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);
  osc.connect(filter);
  filter.connect(gain);
  osc.start(start);
  vibrato.start(start);
  osc.stop(start + duration + 0.12);
  vibrato.stop(start + duration + 0.12);
}

function playBell(start) {
  const ctx = audioState.context;
  [880, 1320].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(index ? 0.018 : 0.028, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);
    osc.connect(gain);
    gain.connect(audioState.master);
    osc.start(start);
    osc.stop(start + 1.18);
  });
}

function playSoftDrum(start) {
  const ctx = audioState.context;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(95, start);
  osc.frequency.exponentialRampToValueAtTime(48, start + 0.16);
  gain.gain.setValueAtTime(0.045, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
  osc.connect(gain);
  gain.connect(audioState.master);
  osc.start(start);
  osc.stop(start + 0.24);
}

function scheduleMusic() {
  if (!audioState.playing) return;
  const ctx = audioState.context;
  const start = ctx.currentTime + 0.08;
  melody.forEach(([frequency, offset, duration]) => playMelodyNote(frequency, start + offset, duration));
  [0, 1.6, 3.2].forEach((offset) => playBell(start + offset));
  [0, 0.8, 1.6, 2.4, 3.2].forEach((offset) => playSoftDrum(start + offset));
  audioState.timers.push(window.setTimeout(scheduleMusic, 4100));
}

function setMusicButton(isPlaying) {
  musicToggle?.classList.toggle("is-playing", isPlaying);
  musicToggle?.setAttribute("aria-label", isPlaying ? "Pause Inkem Inkem Kaavaale" : "Play Inkem Inkem Kaavaale");
  musicToggle?.setAttribute("title", isPlaying ? "Pause music" : "Play music");
}

function startSynthMusic() {
  if (audioState.playing || prefersReducedMotion) return;
  try {
    audioState.context = makeAudioContext();
    audioState.context.resume?.();
    audioState.master = audioState.context.createGain();
    audioState.master.gain.setValueAtTime(0.34, audioState.context.currentTime);
    audioState.master.connect(audioState.context.destination);

    const drone = audioState.context.createOscillator();
    const droneGain = audioState.context.createGain();
    drone.type = "triangle";
    drone.frequency.setValueAtTime(146.83, audioState.context.currentTime);
    droneGain.gain.setValueAtTime(0.08, audioState.context.currentTime);
    drone.connect(droneGain);
    droneGain.connect(audioState.master);
    drone.start();
    audioState.drone = drone;

    audioState.playing = true;
    setMusicButton(true);
    scheduleMusic();
  } catch {
    audioState.playing = false;
    setMusicButton(false);
  }
}

async function playAudioSource(index = 0) {
  if (!bgMusic || index >= musicSources.length) return false;

  bgMusic.src = musicSources[index];
  bgMusic.volume = 0.86;
  bgMusic.load();

  const started = await new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      bgMusic.removeEventListener("error", fail);
      bgMusic.removeEventListener("canplay", success);
      bgMusic.removeEventListener("playing", playing);
      window.clearTimeout(timeout);
    };
    const finish = (result) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };
    const fail = () => {
      console.log("Audio failed to load");
      finish(false);
    };
    const success = () => {
      console.log("Audio ready to play");
      finish(true);
    };
    const playing = () => {
      console.log("Audio started playing");
      finish(true);
    };
    const timeout = window.setTimeout(() => {
      console.log("Audio load timeout");
      finish(false);
    }, 5000);

    bgMusic.addEventListener("error", fail, { once: true });
    bgMusic.addEventListener("canplay", success, { once: true });
    bgMusic.addEventListener("playing", playing, { once: true });
    bgMusic.play().then(() => finish(true)).catch(() => finish(false));
  });

  if (started) return true;
  bgMusic.pause();
  bgMusic.removeAttribute("src");
  bgMusic.load();
  return false;
}

async function startMusic() {
  if (audioState.playing || prefersReducedMotion) return;

  if (bgMusic) {
    const started = await playAudioSource();
    if (started) {
      audioState.playing = true;
      audioState.usingAudioElement = true;
      setMusicButton(true);
      return;
    }
    audioState.usingAudioElement = false;
  }

  // Fallback to synthesized music when MP3 is unavailable or fails
  startSynthMusic();
}

function stopSynthMusic() {
  if (!audioState.playing) return;
  audioState.timers.forEach((timer) => window.clearTimeout(timer));
  audioState.timers = [];
  const droneToStop = audioState.drone;
  audioState.drone = null;
  if (audioState.master) {
    audioState.master.gain.setTargetAtTime(0, audioState.context.currentTime, 0.04);
  }
  if (droneToStop) {
    window.setTimeout(() => droneToStop.stop(), 180);
  }
}

function stopMusic() {
  if (!audioState.playing) return;

  if (audioState.usingAudioElement && bgMusic) {
    bgMusic.pause();
  } else {
    stopSynthMusic();
  }

  audioState.playing = false;
  audioState.usingAudioElement = false;
  setMusicButton(false);
}

musicToggle?.addEventListener("click", async () => {
  if (audioState.playing) {
    stopMusic();
  } else {
    await startMusic();
  }
});