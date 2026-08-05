/* ==========================================================================
   LÓGICA INTERACTIVA JAVASCRIPT - ESTRATEGIAS PEDAGÓGICAS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initCategoryFilters();
  initKeyboardEvents();
});

/* --------------------------------------------------------------------------
   1. MODO CLARO / OSCURO (THEME SWITCHER)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

/* --------------------------------------------------------------------------
   2. BUSCADOR EN TIEMPO REAL
   -------------------------------------------------------------------------- */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.info-card');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const keywords = card.getAttribute('data-keywords') || '';
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';

      if (keywords.includes(query) || title.includes(query) || desc.includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (query.length > 2 && visibleCount === 0) {
      showToast('No se encontraron infografías para la búsqueda');
    }
  });
}

/* --------------------------------------------------------------------------
   3. FILTRADO POR CATEGORÍA
   -------------------------------------------------------------------------- */
function initCategoryFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.info-card');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. VISOR LIGHTBOX (MODAL FULLSCREEN DE IMÁGENES)
   -------------------------------------------------------------------------- */
function openLightbox(imgSrc, captionText) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  img.src = imgSrc;
  caption.textContent = captionText;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close-btn') && !event.target.parentElement.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function initKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   5. SÍNTESIS DE VOZ (TEXT-TO-SPEECH AUDIO READER)
   -------------------------------------------------------------------------- */
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Tu navegador no soporta lectura por voz');
    return;
  }

  window.speechSynthesis.cancel(); // Detener lecturas previas

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 1.0;

  showToast('🔊 Reproduciendo resumen por voz...');
  window.speechSynthesis.speak(utterance);
}

/* --------------------------------------------------------------------------
   6. CAMBIO DE PESTAÑAS (TABS SWAPPER)
   -------------------------------------------------------------------------- */
function switchTab(tabId) {
  const allTabs = document.querySelectorAll('.tab-content');
  const allBtns = document.querySelectorAll('.tab-btn');

  allTabs.forEach(tab => tab.classList.remove('active'));
  allBtns.forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Activar botón correspondiente
  const targetBtn = Array.from(allBtns).find(btn => btn.getAttribute('onclick')?.includes(tabId));
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   7. CUESTIONARIO INTERACTIVO (QUIZ ENGINE)
   -------------------------------------------------------------------------- */
let quizScore = 0;
let answeredQuestions = 0;
const totalQuestions = 4;

function checkAnswer(button, isCorrect) {
  const parentOptions = button.closest('.quiz-options');
  const buttons = parentOptions.querySelectorAll('.quiz-option-btn');

  // Deshabilitar todos los botones de esta pregunta
  buttons.forEach(btn => btn.style.pointerEvents = 'none');

  if (isCorrect) {
    button.classList.add('correct');
    button.innerHTML += ' <i class="fa-solid fa-circle-check"></i>';
    quizScore++;
  } else {
    button.classList.add('wrong');
    button.innerHTML += ' <i class="fa-solid fa-circle-xmark"></i>';
  }

  answeredQuestions++;

  // Si se completaron todas las preguntas
  if (answeredQuestions === totalQuestions) {
    showQuizResult();
  }
}

function showQuizResult() {
  const resultCard = document.getElementById('quizResult');
  const scoreText = document.getElementById('quizScoreText');
  const scoreDetail = document.getElementById('quizScoreDetail');

  if (quizScore === 4) {
    scoreText.textContent = '🎉 ¡Puntaje Perfecto! (4/4)';
    scoreDetail.textContent = '¡Felicidades! Has comprendido perfectamente todas las estrategias didácticas y pedagógicas UNEG.';
  } else if (quizScore === 3) {
    scoreText.textContent = '👍 ¡Excelente Resultado! (3/4)';
    scoreDetail.textContent = 'Tienes un excelente dominio de los conceptos pedagógicos y entornos virtuales.';
  } else if (quizScore === 2) {
    scoreText.textContent = '📖 Buen Resultado (2/4)';
    scoreDetail.textContent = 'Demuestras una buena base en estrategias didácticas, aunque puedes reforzar algunos conceptos.';
  } else {
    scoreText.textContent = '📚 Repaso Recomendado (1/4 o 0/4)';
    scoreDetail.textContent = 'Te sugerimos explorar nuevamente el desglose conceptual y las infografías para afianzar saberes.';
  }

  resultCard.classList.add('show');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetQuiz() {
  quizScore = 0;
  answeredQuestions = 0;

  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(btn => {
    btn.classList.remove('correct', 'wrong');
    btn.style.pointerEvents = 'auto';
    const icon = btn.querySelector('i');
    if (icon) icon.remove();
  });

  const resultCard = document.getElementById('quizResult');
  resultCard.classList.remove('show');
}

/* --------------------------------------------------------------------------
   8. SISTEMA DE TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ==========================================================================
   EMAIL POPUP
   -------------------------------------------------------------------------- */
function toggleEmailPopup(btn) {
  const wrapper = btn.closest('.email-popup-wrapper');
  const popup = wrapper.querySelector('.email-popup');
  const isOpen = popup.classList.contains('active');

  // Close all other open popups
  document.querySelectorAll('.email-popup.active').forEach(p => p.classList.remove('active'));

  if (!isOpen) {
    popup.classList.add('active');
  }
}

function copyEmail(email, btn) {
  navigator.clipboard.writeText(email).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// Close email popups when clicking outside
document.addEventListener('click', function (e) {
  if (!e.target.closest('.email-popup-wrapper')) {
    document.querySelectorAll('.email-popup.active').forEach(p => p.classList.remove('active'));
  }
});
