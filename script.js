/**
 * 空中美語秀朗分校 (福格兒語文短期補習班) 官網腳本
 * Interactive Features & Dynamic UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCourseFilter();
  initQuiz();
  initFaqAccordion();
  initModal();
  initContactForms();
  initFloatingDock();
  initStatsCounter();
});

/* -------------------------------------------------------------------------
   1. Navbar & Mobile Menu
   ------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll spy for active navigation
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  });
}

/* -------------------------------------------------------------------------
   2. Course Category Filter
   ------------------------------------------------------------------------- */
function initCourseFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (!filterBtns.length || !courseCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   3. Interactive Course Placement Quiz (適合孩子的推薦課程測驗)
   ------------------------------------------------------------------------- */
function initQuiz() {
  const quizForm = document.getElementById('placementQuizForm');
  const resultBox = document.getElementById('quizResultBox');
  const resultTitle = document.getElementById('quizResultTitle');
  const resultDesc = document.getElementById('quizResultDesc');
  const applyCourseBtn = document.getElementById('quizApplyCourseBtn');

  if (!quizForm || !resultBox) return;

  const radioInputs = quizForm.querySelectorAll('input[type="radio"]');

  function calculateRecommendation() {
    const ageVal = (quizForm.querySelector('input[name="q_age"]:checked') || {}).value;
    const expVal = (quizForm.querySelector('input[name="q_exp"]:checked') || {}).value;
    const goalVal = (quizForm.querySelector('input[name="q_goal"]:checked') || {}).value;

    if (!ageVal || !expVal || !goalVal) return;

    let recommendation = {
      title: '兒童菁英美語系列 (AMC Primary English)',
      desc: '為孩子量身打造自然發音與全美語情境，配合生動讀本與 AI 口說發音訓練，迅速奠定扎實語感與開口自信心！',
      courseName: '兒童菁英美語班'
    };

    if (ageVal === 'preschool' || ageVal === 'elem_low') {
      if (goalVal === 'afterschool') {
        recommendation = {
          title: '國小全方位安親課輔 + 兒童美語專班',
          desc: '安心兼顧學校課業、每日作業細心訂正，並結合空中美語活潑聽說課程，下課充實又有滿滿收穫！',
          courseName: '國小安親美語雙效班'
        };
      } else {
        recommendation = {
          title: '兒童自然發音啟蒙班 (Phonics & Storybook)',
          desc: '透過生動情境美語教材、圖像記憶與歌謠韻律，讓小朋友愛上學英文，輕鬆掌握見字讀音、聽音拼字技巧！',
          courseName: '兒童自然發音啟蒙班'
        };
      }
    } else if (ageVal === 'elem_high') {
      if (goalVal === 'exam') {
        recommendation = {
          title: '國小高年級進階升學美語 + 劍橋英檢班',
          desc: '針對秀朗、秀山學區銜接國中資優班規劃，強化文法結構與長篇閱讀，提早通過全民英檢初級／劍橋英檢！',
          courseName: '高年級英檢進階班'
        };
      } else {
        recommendation = {
          title: '國小課後安親才藝 + 兒童實用美語',
          desc: '專業輔導校內功課，同時深化英語聽說讀寫，配合 AI 智能發音練習，學習成效看得見！',
          courseName: '國小安親旗艦班'
        };
      }
    } else if (ageVal === 'junior_high' || ageVal === 'high_school') {
      recommendation = {
        title: '國高中資優會考 / 學測滿級分衝刺班',
        desc: '由資深中外師聯合授課，掌握會考／學測關鍵題型、素養長文判讀與核心字彙，打造無懈可擊的升學英文實力！',
        courseName: '國高中資優升學班'
      };
    }

    resultTitle.textContent = '🎯 為您推薦：' + recommendation.title;
    resultDesc.textContent = recommendation.desc;
    resultBox.style.display = 'block';

    if (applyCourseBtn) {
      applyCourseBtn.onclick = () => {
        openBookingModal(recommendation.courseName);
      };
    }
  }

  radioInputs.forEach(input => {
    input.addEventListener('change', calculateRecommendation);
  });
}

/* -------------------------------------------------------------------------
   4. FAQ Accordion
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------
   5. Booking Modal (預約試聽彈窗)
   ------------------------------------------------------------------------- */
function initModal() {
  const backdrop = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('[data-open-modal]');

  if (!backdrop) return;

  window.openBookingModal = function(prefillCourse = '') {
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (prefillCourse) {
      const courseSelect = document.getElementById('modalCourseSelect');
      if (courseSelect) {
        courseSelect.value = prefillCourse;
      }
    }
  };

  window.closeBookingModal = function() {
    backdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const course = btn.getAttribute('data-course') || btn.getAttribute('data-open-modal') || '';
      window.openBookingModal(course);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeBookingModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      window.closeBookingModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      window.closeBookingModal();
    }
  });
}

/* -------------------------------------------------------------------------
   6. Contact & Trial Forms Submission
   ------------------------------------------------------------------------- */
function initContactForms() {
  const forms = [
    document.getElementById('mainContactForm'),
    document.getElementById('modalBookingForm')
  ];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const grade = form.querySelector('[name="grade"]')?.value || '未填寫';
      const course = form.querySelector('[name="course"]')?.value || '未指定';

      if (!name || !phone) {
        alert('請填寫家長姓名與聯絡電話，以便我們儘速為您安排！');
        return;
      }

      // Show friendly confirmation
      alert(`🎉 感謝 ${name} 家長的預約！\n\n我們已收到您為孩子（${grade}）預約的【${course}】免費試聽與程度評估需求。\n空中美語秀朗分校（梁主任團隊）將於 24 小時內以電話 (${phone}) 與您聯繫確認時間！\n\n諮詢專線：(02) 8942-4029`);

      form.reset();

      if (window.closeBookingModal) {
        window.closeBookingModal();
      }
    });
  });
}

/* -------------------------------------------------------------------------
   7. Floating Action Dock & Back-To-Top
   ------------------------------------------------------------------------- */
function initFloatingDock() {
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* -------------------------------------------------------------------------
   8. Stats Counter Animation on Scroll
   ------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.trust-number[data-count]');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(item => {
          const target = +item.getAttribute('data-count');
          const duration = 1600;
          const step = Math.max(1, Math.floor(target / 40));
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            item.firstChild.textContent = current;
          }, duration / (target / step));
        });
      }
    });
  }, { threshold: 0.5 });

  const trustBar = document.querySelector('.hero-trust-bar');
  if (trustBar) {
    observer.observe(trustBar);
  }
}
