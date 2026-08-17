/* ==========================================================================
   INVITACIÓN DE BODA — script.js
   Vanilla JS puro. Sin librerías externas.
   ========================================================================== */

/* --------------------------------------------------------------------
   0. CONFIGURACIÓN — edita solo esto para adaptar la invitación
   -------------------------------------------------------------------- */
const CONFIG = {
  // Fecha y hora exacta del evento (usada por el contador regresivo)
  eventDate: "2027-03-14T16:00:00",

  // Número de WhatsApp del anfitrión/organizador, CON código de país,
  // sin '+', sin espacios ni guiones. Ejemplo Colombia: 57 300 123 4567
  whatsappNumber: "573001234567",
};

/* --------------------------------------------------------------------
   1. CONTADOR REGRESIVO EN TIEMPO REAL
   -------------------------------------------------------------------- */
function initCountdown() {
  const targetDate = new Date(CONFIG.eventDate).getTime();

  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
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

  tick(); // primera pintura inmediata, sin esperar 1s
  const timer = setInterval(tick, 1000);
}

/* --------------------------------------------------------------------
   2. ANIMACIONES DE SCROLL (IntersectionObserver nativo)
   -------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal], .divider, .hero__floral");

  // Si el navegador no soporta IntersectionObserver, muestra todo directo.
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target); // se anima una sola vez
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------
   3. BOTÓN DE MÚSICA
   -------------------------------------------------------------------- */
function initMusicToggle() {
  const audio = document.getElementById("bg-audio");
  const button = document.getElementById("music-toggle");
  if (!audio || !button) return;

  let isPlaying = false;

  function setState(playing) {
    isPlaying = playing;
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
  }

  button.addEventListener("click", async () => {
    try {
      if (isPlaying) {
        audio.pause();
        setState(false);
      } else {
        await audio.play();
        setState(true);
      }
    } catch (err) {
      // Los navegadores móviles bloquean el autoplay sin interacción;
      // como esto ocurre dentro de un click, normalmente funciona.
      console.warn("No se pudo reproducir el audio:", err);
    }
  });
}

/* --------------------------------------------------------------------
   4. FORMULARIO RSVP -> ENVÍO POR WHATSAPP
   -------------------------------------------------------------------- */
function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#guest-name").value.trim();
    const attendanceInput = form.querySelector('input[name="attendance"]:checked');
    const song = form.querySelector("#guest-song").value.trim();

    if (!name || !attendanceInput) {
      form.reportValidity();
      return;
    }

    const attendance = attendanceInput.value;

    // Construcción del mensaje predeterminado para WhatsApp
    const lines = [
      "¡Hola! Confirmo mi asistencia a la boda de Camila & Andrés 💍",
      "",
      `Nombre: ${name}`,
      `Asistencia: ${attendance}`,
    ];

    if (song) {
      lines.push(`Petición musical / mensaje: ${song}`);
    }

    const message = lines.join("\n");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener");
  });
}

/* --------------------------------------------------------------------
   5. INICIALIZACIÓN
   -------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initScrollReveal();
  initMusicToggle();
  initRsvpForm();
});
