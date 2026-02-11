/**
 * Premium Portfolio - Main JavaScript
 * Handles all interactive features, animations, and functionality
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

  // Loading screen
  handleLoading() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 800);
    });
  }

  // Theme toggle with localStorage
  handleThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    html.setAttribute('data-theme', savedTheme);
    
    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update icon
      const icon = toggle.querySelector('i');
      icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  }

  // Mobile menu toggle
  handleMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  }

  // Navbar scroll effects
  handleScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    this.updateActiveNav();
    this.handleBackToTop();
  }

  // Active navigation link
  updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
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

  // Smooth scroll for navigation links
  smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Scroll reveal animations
  handleScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  // Back to top button
  handleBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  // Skill progress bars
  handleSkillBars() {
    const animateSkillBars = () => {
      const skillBars = document.querySelectorAll('.skill-progress');
      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (bar.getBoundingClientRect().top < window.innerHeight * 0.8) {
          bar.style.width = width + '%';
        }
      });
    };
    
    window.addEventListener('scroll', this.throttle(animateSkillBars, 16));
    animateSkillBars(); // Initial call
  }

  // Star rating system
  handleStarRating() {
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.getAttribute('data-rating');
        ratingInput.value = rating;
        
        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
      
      star.addEventListener('mouseover', () => {
        const rating = star.getAttribute('data-rating');
        stars.forEach((s, index) => {
          if (index < rating) {
            s.style.color = '#fbbf24';
          } else {
            s.style.color = '#d1d5db';
          }
        });
      });
      
      star.addEventListener('mouseout', () => {
        stars.forEach(star => {
          if (star.classList.contains('active')) {
            star.style.color = '#fbbf24';
          } else {
            star.style.color = '#d1d5db';
          }
        });
      });
    });
  }

  // Form handling with validation
  handleForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateForm(contactForm)) {
        // Simulate form submission
        alert('Thank you! Your message has been sent successfully. 🚀');
        contactForm.reset();
      }
    });
    
    // Feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateForm(feedbackForm)) {
        alert('Thank you for your feedback! ⭐');
        feedbackForm.reset();
        document.getElementById('ratingValue').value = '0';
        document.querySelectorAll('#starRating i').forEach(star => {
          star.classList.remove('active');
          star.style.color = '#d1d5db';
        });
      }
    });
  }

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = 'var(--border-color)';
      }
    });
    
    return isValid;
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleResize() {
    // Handle responsive layout changes
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    document.querySelector(target)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
