const CONFIG = {
  // Fecha ajustada: 11 de Octubre de 2026 a las 15:00 (3:00 PM)
  eventDate: "2026-10-11T15:00:00",
};

function initCountdown() {
  const targetDate = new Date(CONFIG.eventDate).getTime();
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }
  tick(); 
  const timer = setInterval(tick, 1000);
}

function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((el) => observer.observe(el));
}

function initMusicToggle() {
  const audio = document.getElementById("bg-audio");
  const button = document.getElementById("music-toggle");
  if (!audio || !button) return;

  let isPlaying = false;
  
  document.body.addEventListener('click', function initAudio() {
    if(!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        button.setAttribute("aria-pressed", "true");
      }).catch(() => {});
      document.body.removeEventListener('click', initAudio);
    }
  }, { once: true });

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play();
      isPlaying = true;
    }
    button.setAttribute("aria-pressed", String(isPlaying));
  });
}

function initCarousel() {
  const slides = document.querySelectorAll('.carousel__slide');
  if (slides.length === 0) return;
  
  const indicatorsContainer = document.getElementById('carousel-indicators');
  let currentSlide = 0;
  
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel__dot');
    if (index === 0) dot.classList.add('active');
    indicatorsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll('.carousel__dot');
  
  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  setInterval(nextSlide, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initScrollReveal();
  initMusicToggle();
  initCarousel();
});
