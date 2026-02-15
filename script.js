/**
 * Portfolio - Main JavaScript
 */

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleThemeToggle();
    this.handleMobileMenu();
    this.handleScrollAnimations();
    this.handleBackToTop();
    this.handleSkillBars();
    this.handleStarRating();
    this.handleForms();
    this.handleLoading();
    this.updateActiveNav();
  }

  bindEvents() {
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
  }

  handleLoading() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 800);
    });
  }

  handleThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const html = document.documentElement;

    const savedTheme =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    html.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
  }

  handleMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  }

  handleScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    this.updateActiveNav();
    this.handleBackToTop();
  }

  updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  handleScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  handleBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  handleSkillBars() {
    const animateSkillBars = () => {
      document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (bar.getBoundingClientRect().top < window.innerHeight * 0.8) {
          bar.style.width = width + '%';
        }
      });
    };

    window.addEventListener('scroll', this.throttle(animateSkillBars, 16));
    animateSkillBars();
  }

  handleStarRating() {
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('ratingValue');

    if (!stars.length || !ratingInput) return;

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.getAttribute('data-rating');
        ratingInput.value = rating;

        stars.forEach((s, index) => {
          s.classList.toggle('active', index < rating);
        });
      });
    });
  }

  handleForms() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = form.querySelector("button");
      btn.innerText = "Sending...";
      btn.disabled = true;

      const formData = {
        name: document.getElementById("contactName").value,
        email: document.getElementById("contactEmail").value,
        message: document.getElementById("contactMessage").value
      };

      try {
        const response = await fetch("http://localhost:5000/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          alert("Message Sent Successfully ✅");
          form.reset();
        } else {
          alert("Message Failed ❌");
        }

      } catch (error) {
        alert("Server Error ❌");
        console.error(error);
      }

      btn.innerText = "Send Message";
      btn.disabled = false;
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  handleResize() {
    // optional
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
