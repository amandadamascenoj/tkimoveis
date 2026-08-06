/* ==========================================================================
   TK IMÓVEIS - LANDING PAGE INTERACTIVE CONTROLLER
   Header blur, Mobile Menu Drawer, FAQ Accordion, Swiper Testimonials,
   Property Filter, Instagram Lazy Load & AOS/GSAP Scroll Observer.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header Scroll State (Transparência -> Glass Solid com Throttling via rAF)
  const header = document.querySelector('header');
  let isHeaderScrolling = false;

  const handleHeaderScroll = () => {
    if (!isHeaderScrolling) {
      requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        isHeaderScrolling = false;
      });
      isHeaderScrolling = true;
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Executar na inicialização

  // 2. Menu Hamburguer Mobile Drawer
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    // Cria o overlay dinamicamente
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const closeMenu = () => {
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    };

    const openMenu = () => {
      navMenu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    };

    hamburger.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Overlay cuida do "clicar fora" de forma única pelo evento de click
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // 4. Accordion FAQ Inteligente
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Fechar outros itens abertos para manter visual limpo
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Alternar item atual
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 5. Carrossel de Depoimentos Swiper.js
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      }
    });
  }

  // 6. Integração do Instagram via IntersectionObserver (Sem evento de scroll)
  const instaSection = document.querySelector('#instagram-section') || document.querySelector('#imoveis');
  if (instaSection) {
    const instaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const script = document.createElement('script');
          script.src = "https://www.instagram.com/embed.js";
          script.async = true;
          document.body.appendChild(script);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "300px 0px"
    });
    instaObserver.observe(instaSection);
  }

  // 7. Reveal Observer de Elementos (AOS / Scroll Observer)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 8. Animação Suave para Âncoras do Menu
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 9. Contador Animado para Estatísticas (Hero Stats Counter)
  const statsContainer = document.querySelector('.hero-stats-card');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsContainer && statNumbers.length > 0) {
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateStats = () => {
      const duration = 1800; // ms

      statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let startTime = null;

        const updateCounter = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easedProgress = easeOutQuart(progress);
          const currentVal = Math.floor(easedProgress * target);

          if (progress < 1) {
            el.textContent = `${prefix}${currentVal}${suffix}`;
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        };

        requestAnimationFrame(updateCounter);
      });
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4
    });

    statsObserver.observe(statsContainer);
  }

  // 10. Envio AJAX do Formulário de Contato com Feedback via SweetAlert2
  const contactForm = document.querySelector('.form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-paper-plane"></i> Enviar Mensagem';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/mandadj123@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: new FormData(contactForm)
        });

        if (response.ok) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'success',
              title: 'Mensagem enviada!',
              text: 'Obrigado pelo contato! Nossa equipe da TK Imóveis vai entrar em contato em breve.',
              confirmButtonText: 'Fechar',
              confirmButtonColor: '#d6b56a',
              customClass: {
                popup: 'swal-tk-popup',
                confirmButton: 'swal-tk-button'
              }
            }).then(() => {
              contactForm.reset();
            });
          } else {
            alert('Mensagem enviada com sucesso! Nossa equipe da TK Imóveis vai entrar em contato em breve.');
            contactForm.reset();
          }
        } else {
          throw new Error('Falha no envio do formulário');
        }
      } catch (error) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Ops, algo deu errado',
            text: 'Não conseguimos enviar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.',
            confirmButtonText: 'Entendi',
            confirmButtonColor: '#d6b56a',
            customClass: {
              popup: 'swal-tk-popup',
              confirmButton: 'swal-tk-button'
            }
          });
        } else {
          alert('Não conseguimos enviar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

});