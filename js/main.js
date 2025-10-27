/* ===================================
   ⭐ MAIN.JS - PROYECTO SUEÑO
   JavaScript para interactividad
   =================================== */

// ============================================
// 1. INTERACTIVIDAD DE ESTRELLAS
// ============================================

function initStarInteraction() {
  const starButtons = document.querySelectorAll('.sleep-level__star');

  starButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const level = button.closest('.sleep-level');
      const duration = level.querySelector('.sleep-level__duration');

      if (duration) {
        button.classList.toggle('active');
        duration.classList.toggle('revealed');

        if (duration.hasAttribute('hidden')) {
          duration.removeAttribute('hidden');
        } else {
          setTimeout(() => {
            if (!duration.classList.contains('revealed')) {
              duration.setAttribute('hidden', '');
            }
          }, 500);
        }

        console.log(`⭐ Estrella ${level.getAttribute('data-level')} clickeada`);
      }
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.15) rotate(5deg)';
    });

    button.addEventListener('mouseleave', () => {
      if (!button.classList.contains('active')) {
        button.style.transform = '';
      }
    });
  });
}

// ============================================
// 2. ANIMACIONES AL HACER SCROLL
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const elementsToAnimate = document.querySelectorAll(`
    .hero-section,
    .sleep-types-section,
    .sleep-levels-section,
    .sleep-cycle-section,
    .night-evolution-section,
    .sleep-type,
    .sleep-level
  `);

  elementsToAnimate.forEach((element) => {
    element.classList.add('fade-in-on-scroll');
    observer.observe(element);
  });

  const remSection = document.querySelector('.sleep-type--rem');
  const nremSection = document.querySelector('.sleep-type--nrem');

  if (remSection) {
    remSection.classList.add('slide-from-left');
    observer.observe(remSection);
  }

  if (nremSection) {
    nremSection.classList.add('slide-from-right');
    observer.observe(nremSection);
  }
}

// ============================================
// 3. SMOOTH SCROLL PARA NAVEGACIÓN
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ============================================
// 4. MEJORAS DE ACCESIBILIDAD
// ============================================

function initAccessibility() {
  const starButtons = document.querySelectorAll('.sleep-level__star');

  starButtons.forEach((button) => {
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  const durationElements = document.querySelectorAll('.sleep-level__duration');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const duration = mutation.target;
        const isRevealed = duration.classList.contains('revealed');
        duration.setAttribute('aria-hidden', !isRevealed);
        if (isRevealed) {
          announceToScreenReader(duration.textContent);
        }
      }
    });
  });

  durationElements.forEach((duration) => {
    observer.observe(duration, { attributes: true });
  });
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 2000);
}

// ============================================
// 5. NAVEGACIÓN MÓVIL
// ============================================

function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('mainNav');
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isExpanded);
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================
// 6. INTERACTIVIDAD DEL OJO CON ESTRELLA DUAL
// ============================================

function initEyeIllustration() {
  const starButton = document.getElementById('starButton');
  const elements = {
    eyeOpen: document.getElementById('eyeOpen'),
    eyeClosed: document.getElementById('eyeClosed'),
    starAwake: document.getElementById('starAwake'),
    starSleeping: document.getElementById('starSleeping'),
    sunIcon: document.getElementById('sunIcon'),
    moonIcon: document.getElementById('moonIcon'),
    wrapper: document.querySelector('.eye-illustration-wrapper'),
  };

  const missingElements = Object.entries(elements)
    .filter(([_, el]) => !el)
    .map(([name]) => name);

  if (missingElements.length > 0) {
    console.warn('⚠️ Elementos faltantes:', missingElements.join(', '));
    return;
  }

  // Cambiar a mouseenter en lugar de click
  starButton.addEventListener('mouseenter', () => {
    elements.wrapper.classList.add('transitioning');
    setTimeout(() => elements.wrapper.classList.remove('transitioning'), 600);

    // Activar estado dormido
    elements.eyeClosed.classList.add('active');
    elements.starSleeping.classList.add('active');
    elements.moonIcon.classList.add('active');
    
    elements.eyeOpen.classList.remove('active');
    elements.starAwake.classList.remove('active');
    elements.sunIcon.classList.remove('active');

    console.log('🌙 Estado: Dormido');
  });

  // Volver al estado despierto al sacar el mouse
  starButton.addEventListener('mouseleave', () => {
    elements.wrapper.classList.add('transitioning');
    setTimeout(() => elements.wrapper.classList.remove('transitioning'), 600);

    // Activar estado despierto
    elements.eyeOpen.classList.add('active');
    elements.starAwake.classList.add('active');
    elements.sunIcon.classList.add('active');
    
    elements.eyeClosed.classList.remove('active');
    elements.starSleeping.classList.remove('active');
    elements.moonIcon.classList.remove('active');

    console.log('☀️ Estado: Despierto');
  });
}

// ============================================
// 7. ANIMACIÓN DEL GRÁFICO CIRCULAR
// ============================================

function initCircleDiagramAnimation() {
  const cycleDiagram = document.querySelector('.cycle-diagram');
  const cycleImage = document.querySelector('.cycle-diagram__image');
  if (!cycleDiagram || !cycleImage) return;

  let isAnimating = true;

  cycleDiagram.addEventListener('click', () => {
    isAnimating = !isAnimating;
    cycleImage.style.animationPlayState = isAnimating ? 'running' : 'paused';
    console.log(isAnimating ? '▶️ Animación del ciclo reanudada' : '⏸️ Animación del ciclo pausada');
  });
}

// ============================================
// 8. CONTADOR DE CICLOS INTERACTIVO
// ============================================

function createSleepCycleCounter() {
  const cycleInfo = document.querySelector('.cycle-info');
  if (!cycleInfo) return;

  const counterHTML = `
    <div class="sleep-calculator">
      <p class="sleep-calculator__label">Calcula tus ciclos de sueño:</p>
      <div class="sleep-calculator__input-group">
        <label for="sleep-hours">Horas de sueño:</label>
        <input type="number" id="sleep-hours" min="1" max="12" value="8">
        <span>= <span id="cycle-result">~5-6</span> ciclos</span>
      </div>
    </div>
  `;

  cycleInfo.insertAdjacentHTML('afterend', counterHTML);

  const sleepInput = document.getElementById('sleep-hours');
  const cycleResult = document.getElementById('cycle-result');

  if (sleepInput && cycleResult) {
    sleepInput.addEventListener('input', () => {
      const hours = parseFloat(sleepInput.value);
      const cycles = Math.floor((hours * 60) / 90);
      const extraMinutes = (hours * 60) % 90;
      let result = `~${cycles}`;
      if (extraMinutes >= 45) result += `-${cycles + 1}`;
      result += ` ciclo${cycles !== 1 ? 's' : ''}`;
      cycleResult.textContent = result;
    });
  }
}

// ============================================
// 9. EASTER EGG
// ============================================

function initEasterEgg() {
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiCode = [];

  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > 10) konamiCode.shift();

    if (konamiCode.join(',') === konamiSequence.join(',')) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes rainbow {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      document.body.style.animation = 'rainbow 2s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
      }, 2000);
      console.log('🎉 ¡Easter Egg activado!');
      konamiCode = [];
    }
  });
}


// ============================================
// 10. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initStarInteraction();
  initScrollAnimations();
  initSmoothScroll();
  initAccessibility();
  initMobileNav();
  initEyeIllustration();
  initCircleDiagramAnimation();
  createSleepCycleCounter();
  initEasterEgg();
});

// ============================================
// 11. MANEJO DE ERRORES
// ============================================

window.addEventListener('error', (event) => {
  console.error(`❌ Error en ${event.filename}:${event.lineno}: ${event.message}`);
});

window.addEventListener('load', () => {
  console.log(`⚡ Página cargada en ${performance.now().toFixed(2)}ms`);
});