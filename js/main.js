/* ===================================
   ⭐ MAIN.JS - PROYECTO SUEÑO
   JavaScript para interactividad
   =================================== */

// ============================================
// ESPERAR A QUE EL DOM ESTÉ LISTO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌙 Proyecto Sueño - Iniciado');

  // Inicializar todas las funcionalidades
  initNavbar();
  initStarInteraction();
  initScrollAnimations();
  initSmoothScroll();
  initAccessibility();

  console.log('✅ Todas las funcionalidades cargadas');
});

// ============================================
// 0. NAVBAR - BARRA DE NAVEGACIÓN
// ============================================

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarLinks = document.querySelectorAll('.navbar-link');
  const body = document.body;

  // 1. Sticky Navbar - Cambiar estilo al hacer scroll
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Agregar clase 'scrolled' cuando se hace scroll
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });

  // 2. Toggle del menú hamburger (mobile)
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', () => {
      // Toggle de las clases activas
      navbarToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
      body.classList.toggle('menu-open');

      // Actualizar aria-expanded para accesibilidad
      const isExpanded = navbarToggle.classList.contains('active');
      navbarToggle.setAttribute('aria-expanded', isExpanded);

      // Prevenir scroll del body cuando el menú está abierto
      if (isExpanded) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }

      console.log(`📱 Menú ${isExpanded ? 'abierto' : 'cerrado'}`);
    });
  }

  // 3. Cerrar menú al hacer click en un link (mobile)
  navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = '';
        navbarToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 4. Cerrar menú al hacer click fuera del navbar (mobile)
  document.addEventListener('click', (e) => {
    const isClickInsideNav = navbar.contains(e.target);
    const isMenuOpen = navbarMenu.classList.contains('active');

    if (!isClickInsideNav && isMenuOpen && window.innerWidth <= 768) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      body.classList.remove('menu-open');
      body.style.overflow = '';
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // 5. Highlight del link activo basado en la sección visible
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveLink() {
    const scrollY = window.scrollY + 100; // Offset para el navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Remover 'active' de todos los links
        navbarLinks.forEach(link => link.classList.remove('active'));

        // Agregar 'active' al link correspondiente
        const activeLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  // Ejecutar al hacer scroll
  window.addEventListener('scroll', highlightActiveLink);

  // Ejecutar al cargar la página
  highlightActiveLink();

  // 6. Ajustar al redimensionar ventana
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      // Cerrar menú mobile si se redimensiona a desktop
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      body.classList.remove('menu-open');
      body.style.overflow = '';
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  console.log('🧭 Navbar inicializado correctamente');
}

// ============================================
// 1. INTERACTIVIDAD DE ESTRELLAS
// ============================================

function initStarInteraction() {
  // Seleccionar todos los botones de estrella
  const starButtons = document.querySelectorAll('.sleep-level__star');

  starButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // Toggle del estado activo
      this.classList.toggle('active');

      // Encontrar el elemento de duración asociado
      const level = this.closest('.sleep-level');
      const duration = level.querySelector('.sleep-level__duration');

      if (duration) {
        // Toggle de la visibilidad de la duración
        duration.classList.toggle('revealed');

        // Remover el atributo hidden
        if (duration.hasAttribute('hidden')) {
          duration.removeAttribute('hidden');
        } else {
          // Si se vuelve a clickear, esperar a que termine la animación antes de ocultar
          setTimeout(() => {
            if (!duration.classList.contains('revealed')) {
              duration.setAttribute('hidden', '');
            }
          }, 500);
        }

        // Feedback sonoro (opcional - comentado por defecto)
        // playClickSound();

        // Log para debug
        const levelName = level.getAttribute('data-level');
        console.log(`⭐ Estrella ${levelName} clickeada`);
      }
    });

    // Efecto hover adicional
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.15) rotate(5deg)';
    });

    button.addEventListener('mouseleave', function () {
      if (!this.classList.contains('active')) {
        this.style.transform = '';
      }
    });
  });

  console.log(`✨ ${starButtons.length} estrellas interactivas activadas`);
}

// ============================================
// 2. ANIMACIONES AL HACER SCROLL
// ============================================

function initScrollAnimations() {
  // Opciones del Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1, // Activar cuando el 10% del elemento sea visible
  };

  // Callback cuando un elemento entra en el viewport
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Añadir clase 'visible' cuando el elemento entra
        entry.target.classList.add('visible');

        // Opcional: dejar de observar después de la primera animación
        // observer.unobserve(entry.target);
      }
    });
  };

  // Crear el observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Elementos a observar
  const elementsToAnimate = document.querySelectorAll(`
    .hero-section,
    .sleep-types-section,
    .sleep-levels-section,
    .sleep-cycle-section,
    .night-evolution-section,
    .sleep-type,
    .sleep-level
  `);

  // Añadir clase inicial para animación
  elementsToAnimate.forEach((element) => {
    element.classList.add('fade-in-on-scroll');
    observer.observe(element);
  });

  // Animaciones especiales para REM y NREM
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

  console.log('🎬 Animaciones de scroll activadas');
}

// ============================================
// 3. SMOOTH SCROLL PARA NAVEGACIÓN
// ============================================

function initSmoothScroll() {
  // Seleccionar todos los links internos (si los hay)
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const navbar = document.getElementById('navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;

  internalLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Calcular posición considerando la altura del navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;

        // Scroll suave al elemento
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        console.log(`🔗 Scroll a: ${targetId}`);
      }
    });
  });

  console.log('📜 Smooth scroll activado');
}

// ============================================
// 4. MEJORAS DE ACCESIBILIDAD
// ============================================

function initAccessibility() {
  // Navegación con teclado para las estrellas
  const starButtons = document.querySelectorAll('.sleep-level__star');

  starButtons.forEach((button) => {
    // Enter y Espacio activan el botón
    button.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Anunciar cambios a lectores de pantalla
  const durationElements = document.querySelectorAll('.sleep-level__duration');

  durationElements.forEach((duration) => {
    // Observar cambios en la clase 'revealed'
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isRevealed = duration.classList.contains('revealed');

          // Actualizar aria-hidden
          duration.setAttribute('aria-hidden', !isRevealed);

          // Anuncio opcional para lectores de pantalla
          if (isRevealed) {
            announceToScreenReader(duration.textContent);
          }
        }
      });
    });

    observer.observe(duration, { attributes: true });
  });

  console.log('♿ Mejoras de accesibilidad activadas');
}

// ============================================
// 5. UTILIDADES
// ============================================

// Anunciar texto a lectores de pantalla
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remover después de un momento
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ============================================
// 6. DETECCIÓN DE DISPOSITIVO
// ============================================

function detectDevice() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet =
    /(iPad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    document.body.classList.add('is-mobile');
    console.log('📱 Dispositivo móvil detectado');
  }

  if (isTablet) {
    document.body.classList.add('is-tablet');
    console.log('📱 Tablet detectada');
  }

  return { isMobile, isTablet };
}

// Ejecutar detección
const device = detectDevice();

// ============================================
// 7. LAZY LOADING DE IMÁGENES (Opcional)
// ============================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('skeleton');
          img.classList.add('loaded');
          observer.unobserve(img);

          console.log(`🖼️ Imagen cargada: ${img.alt || img.src}`);
        }
      });
    });

    images.forEach((img) => {
      img.classList.add('skeleton');
      imageObserver.observe(img);
    });

    console.log(`🖼️ Lazy loading activado para ${images.length} imágenes`);
  } else {
    // Fallback: cargar todas las imágenes inmediatamente
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

// Inicializar lazy loading si hay imágenes con data-src
if (document.querySelectorAll('img[data-src]').length > 0) {
  initLazyLoading();
}

// ============================================
// 8. ANIMACIÓN DEL GRÁFICO CIRCULAR (Pausar/Reanudar)
// ============================================

function initCircleDiagramAnimation() {
  const cycleDiagram = document.querySelector('.cycle-diagram');
  const cycleImage = document.querySelector('.cycle-diagram__image');

  if (cycleDiagram && cycleImage) {
    let isAnimating = true;

    cycleDiagram.addEventListener('click', () => {
      isAnimating = !isAnimating;

      if (isAnimating) {
        cycleImage.style.animationPlayState = 'running';
        console.log('▶️ Animación del ciclo reanudada');
      } else {
        cycleImage.style.animationPlayState = 'paused';
        console.log('⏸️ Animación del ciclo pausada');
      }
    });

    console.log('🔄 Control de animación del ciclo activado');
  }
}

// Inicializar si existe el gráfico
if (document.querySelector('.cycle-diagram')) {
  initCircleDiagramAnimation();
}

// ============================================
// 9. CONTADOR DE CICLOS INTERACTIVO (Extra)
// ============================================

function createSleepCycleCounter() {
  const cycleInfo = document.querySelector('.cycle-info');

  if (!cycleInfo) return;

  // Crear contador interactivo de horas de sueño
  const counterHTML = `
    <div class="sleep-calculator" style="margin-top: var(--spacing-xl); text-align: center;">
      <p style="margin-bottom: var(--spacing-md); color: var(--color-secondary);">
        Calcula tus ciclos de sueño:
      </p>
      <div style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-md);">
        <label for="sleep-hours" style="color: var(--color-secondary);">Horas de sueño:</label>
        <input 
          type="number" 
          id="sleep-hours" 
          min="1" 
          max="12" 
          value="8" 
          style="
            padding: 8px 12px; 
            border: 2px solid var(--color-primary); 
            background: var(--color-background); 
            color: var(--color-secondary);
            border-radius: 8px;
            font-size: 18px;
            width: 80px;
            text-align: center;
          "
        >
        <span style="color: var(--color-primary); font-weight: bold; font-size: 20px;">
          = <span id="cycle-result">~5-6</span> ciclos
        </span>
      </div>
    </div>
  `;

  // Insertar después del cycle-info
  cycleInfo.insertAdjacentHTML('afterend', counterHTML);

  // Funcionalidad del contador
  const sleepInput = document.getElementById('sleep-hours');
  const cycleResult = document.getElementById('cycle-result');

  if (sleepInput && cycleResult) {
    sleepInput.addEventListener('input', function () {
      const hours = parseFloat(this.value);
      const minutes = hours * 60;
      const cycles = Math.floor(minutes / 90);
      const extraMinutes = minutes % 90;

      let result = `~${cycles}`;
      if (extraMinutes >= 45) {
        result += `-${cycles + 1}`;
      }
      result += ` ciclo${cycles !== 1 ? 's' : ''}`;

      cycleResult.textContent = result;

      console.log(`💤 ${hours}h = ${cycles} ciclos completos`);
    });

    console.log('🧮 Calculadora de ciclos activada');
  }
}

// Crear calculadora (opcional - comentar si no quieres)
createSleepCycleCounter();

// ============================================
// 10. MANEJO DE ERRORES Y LOGS
// ============================================

// Capturar errores de JavaScript
window.addEventListener('error', (event) => {
  console.error('❌ Error detectado:', event.error);
});

// Log de performance (opcional)
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`⚡ Página cargada en ${loadTime.toFixed(2)}ms`);
});

// ============================================
// 11. EASTER EGG (Opcional - Sorpresa divertida)
// ============================================

function initEasterEgg() {
  let konamiCode = [];
  const konamiSequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);

    // Mantener solo los últimos 10 inputs
    if (konamiCode.length > 10) {
      konamiCode.shift();
    }

    // Verificar si coincide con el código Konami
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      activateEasterEgg();
      konamiCode = [];
    }
  });
}

function activateEasterEgg() {
  console.log('🎉 ¡Easter Egg activado!');

  // Efecto visual divertido
  document.body.style.animation = 'rainbow 2s ease-in-out';

  // Crear estilo de animación rainbow
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0%, 100% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Mensaje divertido
  alert('🌙✨ ¡Descubriste el secreto del sueño! Diseño de Abi, código de Nico 💜');

  // Remover después de 2 segundos
  setTimeout(() => {
    document.body.style.animation = '';
  }, 2000);
}

// Activar easter egg (opcional - comentar si no quieres)
initEasterEgg();

// ============================================
// 12. EXPORTAR FUNCIONES (si usas módulos)
// ============================================

// Si más adelante quieres usar módulos ES6:
/*
export {
  initStarInteraction,
  initScrollAnimations,
  initSmoothScroll,
  initAccessibility
};
*/

// ============================================
// FIN DEL SCRIPT
// ============================================

console.log('🌟 main.js cargado completamente');
console.log('💜 Diseño: Abi | Desarrollo: Nico');