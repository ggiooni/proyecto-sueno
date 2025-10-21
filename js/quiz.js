/* ===================================
   🎮 QUIZ.JS - PROYECTO ONÍRICO
   Funcionalidad para Quiz y Formulario
   =================================== */

// ============================================
// 1. QUIZ INTERACTIVO
// ============================================

function initQuiz() {
  const quizOptions = document.querySelectorAll('.quiz-option');
  
  quizOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Verificar si ya fue respondida
      if (this.disabled) return;
      
      const question = this.closest('.quiz-question');
      const allOptions = question.querySelectorAll('.quiz-option');
      const isCorrect = this.getAttribute('data-correct') === 'true';
      
      // Desactivar todas las opciones de esta pregunta
      allOptions.forEach(opt => {
        opt.disabled = true;
        opt.style.pointerEvents = 'none';
      });
      
      // Marcar la selección
      if (isCorrect) {
        this.classList.add('correct');
        
        // Feedback visual y sonoro
        createConfetti(this);
        console.log('✅ ¡Respuesta correcta!');
        
        // Mensaje de éxito
        showFeedback(question, '¡Correcto! ⭐', 'success');
        
      } else {
        this.classList.add('incorrect');
        
        // Mostrar la respuesta correcta
        allOptions.forEach(opt => {
          if (opt.getAttribute('data-correct') === 'true') {
            opt.classList.add('correct');
          }
        });
        
        console.log('❌ Respuesta incorrecta');
        
        // Mensaje de error
        showFeedback(question, 'Ups, esa no era 😴', 'error');
      }
      
      // Verificar si completó todas las preguntas
      checkQuizCompletion();
    });
  });
  
  console.log(`🎮 Quiz interactivo activado (${quizOptions.length / 4} preguntas)`);
}

// Mostrar feedback visual
function showFeedback(questionElement, message, type) {
  // Crear elemento de feedback
  const feedback = document.createElement('div');
  feedback.className = `quiz-feedback quiz-feedback--${type}`;
  feedback.textContent = message;
  
  // Estilos inline
  feedback.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: var(--font-accent);
    font-size: 14px;
    font-weight: bold;
    animation: slideInRight 0.3s ease-out;
    ${type === 'success' ? 
      'background: rgba(169, 142, 233, 0.9); color: white;' : 
      'background: rgba(255, 107, 107, 0.9); color: white;'}
  `;
  
  questionElement.style.position = 'relative';
  questionElement.appendChild(feedback);
  
  // Remover después de 2 segundos
  setTimeout(() => {
    feedback.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => feedback.remove(), 300);
  }, 2000);
}

// Efecto confetti para respuestas correctas
function createConfetti(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#a98ee9', '#dbd4b9', '#ffffff'];
  
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${0.5 + Math.random() * 0.5}s ease-out forwards;
      transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg);
      opacity: 1;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 1000);
  }
}

// Verificar si completó el quiz
function checkQuizCompletion() {
  const questions = document.querySelectorAll('.quiz-question');
  const answeredQuestions = Array.from(questions).filter(q => 
    q.querySelector('.quiz-option.correct, .quiz-option.incorrect')
  );
  
  if (answeredQuestions.length === questions.length) {
    // Contar respuestas correctas
    const correctAnswers = Array.from(questions).filter(q => 
      Array.from(q.querySelectorAll('.quiz-option.correct')).some(opt => 
        !opt.classList.contains('incorrect')
      )
    ).length;
    
    setTimeout(() => {
      showQuizResults(correctAnswers, questions.length);
    }, 1000);
  }
}

// Mostrar resultados del quiz
function showQuizResults(correct, total) {
  const percentage = (correct / total) * 100;
  let message = '';
  let emoji = '';
  
  if (percentage === 100) {
    message = '¡Perfecto! Sos un experto del sueño';
    emoji = '🌟';
  } else if (percentage >= 75) {
    message = '¡Muy bien! Conocés bastante sobre el sueño';
    emoji = '✨';
  } else if (percentage >= 50) {
    message = 'No está mal, pero podés aprender más';
    emoji = '💤';
  } else {
    message = 'Parece que necesitás dormir más para recordar';
    emoji = '😴';
  }
  
  // Crear modal de resultados
  const modal = document.createElement('div');
  modal.className = 'quiz-results-modal';
  modal.innerHTML = `
    <div class="quiz-results-content">
      <div class="quiz-results-emoji">${emoji}</div>
      <h3 class="quiz-results-title">Resultados del Quiz</h3>
      <p class="quiz-results-score">${correct} de ${total} correctas</p>
      <p class="quiz-results-message">${message}</p>
      <button class="quiz-results-close">Cerrar</button>
    </div>
  `;
  
  // Estilos inline del modal
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 46, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
  `;
  
  document.body.appendChild(modal);
  
  // Cerrar modal
  modal.querySelector('.quiz-results-close').addEventListener('click', () => {
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => modal.remove(), 300);
  });
  
  console.log(`🎉 Quiz completado: ${correct}/${total} (${percentage.toFixed(0)}%)`);
}

// ============================================
// 2. FORMULARIO DEL DIARIO
// ============================================

function initDreamDiaryForm() {
  const form = document.getElementById('dreamForm');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      respuesta: document.getElementById('respuesta').value,
      fecha: new Date().toISOString()
    };
    
    console.log('📝 Formulario enviado:', formData);
    
    // Validación adicional
    if (!validateEmail(formData.email)) {
      showFormError('Por favor, ingresá un email válido');
      return;
    }
    
    // Animación de envío
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (aquí podrías hacer un fetch a tu backend)
    setTimeout(() => {
      // Éxito
      submitBtn.textContent = '✓ Enviado';
      submitBtn.style.background = 'var(--color-primary)';
      submitBtn.style.color = 'var(--color-background)';
      
      // Mostrar mensaje de éxito
      showFormSuccess(`¡Gracias ${formData.nombre}! Tu sueño ha sido registrado en el diario. 🌙`);
      
      // Limpiar formulario
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 2000);
      
      // Opcional: Guardar en localStorage
      saveDreamToLocal(formData);
      
    }, 1500);
  });
  
  // Validación en tiempo real
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = '#ff6b6b';
      } else {
        this.style.borderColor = '';
      }
    });
  }
  
  console.log('📝 Formulario del diario activado');
}

// Validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Mostrar error en formulario
function showFormError(message) {
  const form = document.getElementById('dreamForm');
  const error = document.createElement('div');
  error.className = 'form-error';
  error.textContent = message;
  error.style.cssText = `
    color: #ff6b6b;
    text-align: center;
    margin-top: 10px;
    font-family: var(--font-accent);
    animation: shake 0.5s ease-out;
  `;
  
  // Remover error anterior si existe
  const existingError = form.querySelector('.form-error');
  if (existingError) existingError.remove();
  
  form.appendChild(error);
  
  setTimeout(() => {
    error.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => error.remove(), 300);
  }, 3000);
}

// Mostrar éxito en formulario
function showFormSuccess(message) {
  const form = document.getElementById('dreamForm');
  const success = document.createElement('div');
  success.className = 'form-success';
  success.textContent = message;
  success.style.cssText = `
    color: var(--color-primary);
    text-align: center;
    margin-top: 20px;
    font-family: var(--font-accent);
    font-size: 18px;
    animation: slideInUp 0.5s ease-out;
  `;
  
  form.appendChild(success);
  
  setTimeout(() => {
    success.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => success.remove(), 300);
  }, 3000);
}

// Guardar sueño en localStorage
function saveDreamToLocal(dreamData) {
  try {
    // Obtener sueños guardados
    let dreams = JSON.parse(localStorage.getItem('onirico_dreams') || '[]');
    
    // Agregar nuevo sueño
    dreams.push(dreamData);
    
    // Guardar de vuelta
    localStorage.setItem('onirico_dreams', JSON.stringify(dreams));
    
    console.log('💾 Sueño guardado en localStorage');
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

// Ver todos los sueños guardados
function getAllDreams() {
  try {
    return JSON.parse(localStorage.getItem('onirico_dreams') || '[]');
  } catch (error) {
    console.error('Error al leer localStorage:', error);
    return [];
  }
}

// ============================================
// 3. ANIMACIONES CSS ADICIONALES
// ============================================

// Agregar estilos de animación al documento
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    
    @keyframes confettiFall {
      to {
        transform: translateY(300px);
        opacity: 0;
      }
    }
    
    .quiz-results-content {
      background: var(--color-background);
      border: 2px solid var(--color-primary);
      border-radius: 20px;
      padding: 60px 40px;
      text-align: center;
      max-width: 500px;
      animation: slideInUp 0.5s ease-out;
    }
    
    .quiz-results-emoji {
      font-size: 80px;
      margin-bottom: 20px;
    }
    
    .quiz-results-title {
      font-family: var(--font-primary);
      font-size: 36px;
      font-style: italic;
      color: var(--color-primary);
      margin-bottom: 20px;
    }
    
    .quiz-results-score {
      font-family: var(--font-accent);
      font-size: 28px;
      color: var(--color-secondary);
      margin-bottom: 15px;
    }
    
    .quiz-results-message {
      font-family: var(--font-secondary);
      font-size: 18px;
      color: var(--color-secondary);
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .quiz-results-close {
      font-family: var(--font-primary);
      font-style: italic;
      font-size: 20px;
      padding: 12px 40px;
      background: var(--color-primary);
      color: var(--color-background);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .quiz-results-close:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(169, 142, 233, 0.4);
    }
  `;
  
  document.head.appendChild(style);
}

// ============================================
// 4. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌙 Inicializando funcionalidades de ONÍRICO...');
  
  // Agregar estilos de animación
  addAnimationStyles();
  
  // Inicializar quiz
  initQuiz();
  
  // Inicializar formulario
  initDreamDiaryForm();
  
  console.log('✅ Todas las funcionalidades cargadas correctamente');
});

// ============================================
// 5. FUNCIONES AUXILIARES PÚBLICAS
// ============================================

// Exportar funciones útiles para la consola
window.onirico = {
  getAllDreams,
  resetQuiz: () => location.reload(),
  version: '1.0.0'
};

console.log('💜 ONÍRICO - Los Misterios del Dormir');
console.log('Diseño: Abi | Desarrollo: Nico');
console.log('Usa window.onirico para ver funciones disponibles');