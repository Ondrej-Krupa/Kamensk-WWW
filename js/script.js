document.addEventListener('DOMContentLoaded', () => {
  // Enhanced functionality with smooth animations
  
  // Header scroll effect
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.content').forEach(el => {
    observer.observe(el);
  });

  // Enhanced lightbox gallery
  const images = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentIndex = 0;

  // Create image array for navigation
  const imageArray = Array.from(images);

  function showLightbox(index) {
    currentIndex = index;
    const img = imageArray[currentIndex];
    
    // Add loading state
    lightboxImage.classList.add('loading');
    
    // Preload image
    const tempImg = new Image();
    tempImg.onload = () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxImage.classList.remove('loading');
    };
    tempImg.src = img.src;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
    showLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageArray.length;
    showLightbox(currentIndex);
  }

  // Event listeners for gallery
  images.forEach((img, index) => {
    img.addEventListener('click', () => showLightbox(index));
    
    // Add hover effect
    img.parentElement.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
    });
    
    img.parentElement.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Lightbox controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  });

  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Parallax effect for hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      hero.style.transform = `translateY(${parallax}px)`;
    });
  }

  // Add active state to navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function setActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
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

  window.addEventListener('scroll', setActiveLink);

  // Preload images for better performance
  function preloadImages() {
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
      const tempImg = new Image();
      tempImg.src = img.src;
    });
  }

  // Initialize
  preloadImages();
  
  // Add loading class removal
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Mobile menu toggle (if needed)
  const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
      const nav = document.querySelector('nav ul');
      if (nav && !nav.classList.contains('mobile-ready')) {
        nav.classList.add('mobile-ready');
      }
    }
  };

  window.addEventListener('resize', createMobileMenu);
  createMobileMenu();
});

// Utility functions
const utils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
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
};

// Add performance optimization
window.addEventListener('scroll', utils.throttle(() => {
  // Throttled scroll events
}, 16));

// Add intersection observer for fade-in animations
const fadeElements = document.querySelectorAll('.content, .gallery-item');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});
