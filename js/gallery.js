// Enhanced Gallery JavaScript with lighting effects

class GalleryManager {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.filteredImages = [];
    this.isLoading = true;
    
    this.init();
  }

  init() {
    this.loadImages();
    this.setupEventListeners();
    this.setupScrollReveal();
  }

  loadImages() {
    const galleryContainer = document.getElementById('gallery');
    const loadingSpinner = document.getElementById('loading');
    
    // Generate image data for 32 certificates
    this.images = Array.from({ length: 32 }, (_, i) => ({
      src: `../src/osvedceni/${i + 1}.jpg`,
      alt: `Certifikát ${i + 1}`,
      title: `Certifikát ${i + 1}`,
      category: i % 2 === 0 ? 'cert' : 'osv',
      description: `Profesionální ${i % 2 === 0 ? 'certifikát' : 'osvědčení'} ${i + 1}`
    }));

    this.filteredImages = [...this.images];
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      this.renderGallery();
      loadingSpinner.style.display = 'none';
      this.isLoading = false;
    }, 1000);
  }

  renderGallery() {
    const galleryContainer = document.getElementById('gallery');
    galleryContainer.innerHTML = '';

    this.filteredImages.forEach((image, index) => {
      const item = this.createGalleryItem(image, index);
      galleryContainer.appendChild(item);
    });

    // Trigger scroll reveal
    this.revealOnScroll();
  }

  createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', image.category);
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Zobrazit ${image.title}`);

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    
    // Add loading class
    item.classList.add('loading');
    
    img.onload = () => {
      item.classList.remove('loading');
      img.classList.add('loaded');
    };

    img.onerror = () => {
      item.classList.remove('loading');
      item.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
          <div style="text-align: center;">
            <span style="font-size: 2rem;">📄</span>
            <p style="margin-top: 10px;">${image.title}</p>
          </div>
        </div>
      `;
    };

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
      <div class="gallery-title-overlay">${image.title}</div>
    `;

    item.appendChild(img);
    item.appendChild(overlay);
    
    // Add click event
    item.addEventListener('click', () => this.openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openLightbox(index);
      }
    });

    return item;
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        this.filterGallery(filter);
        
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Lightbox controls
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    closeBtn.addEventListener('click', () => this.closeLightbox());
    prevBtn.addEventListener('click', () => this.prevImage());
    nextBtn.addEventListener('click', () => this.nextImage());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.style.display || lightbox.style.display === 'none') return;
      
      switch(e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    this.handleSwipe = () => {
      if (touchEndX < touchStartX - 50) this.nextImage();
      if (touchEndX > touchStartX + 50) this.prevImage();
    };
  }

  filterGallery(filter) {
    if (filter === 'all') {
      this.filteredImages = [...this.images];
    } else {
      this.filteredImages = this.images.filter(img => img.category === filter);
    }
    
    this.renderGallery();
  }

  openLightbox(index) {
    this.currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    const currentImage = this.filteredImages[index];
    
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    lightboxCaption.textContent = currentImage.description;
    lightboxCounter.textContent = `${index + 1} / ${this.filteredImages.length}`;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus management
    lightbox.setAttribute('tabindex', '-1');
    lightbox.focus();
  }

  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredImages.length;
    this.updateLightboxImage();
  }

  prevImage() {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.filteredImages.length - 1 
      : this.currentImageIndex - 1;
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    const currentImage = this.filteredImages[this.currentImageIndex];
    
    // Fade transition
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
      lightboxImg.src = currentImage.src;
      lightboxImg.alt = currentImage.alt;
      lightboxCaption.textContent = currentImage.description;
      lightboxCounter.textContent = `${this.currentImageIndex + 1} / ${this.filteredImages.length}`;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  setupScrollReveal() {
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

    // Observe gallery items
    setTimeout(() => {
      const items = document.querySelectorAll('.gallery-item');
      items.forEach(item => observer.observe(item));
    }, 100);
  }

  revealOnScroll() {
    // Trigger scroll reveal after rendering
    setTimeout(() => {
      this.setupScrollReveal();
    }, 100);
  }
}

// Enhanced image preloading
class ImagePreloader {
  constructor() {
    this.loadedImages = new Set();
  }

  preloadImage(src) {
    if (this.loadedImages.has(src)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.add(src);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  preloadImages(images) {
    const promises = images.map(img => this.preloadImage(img.src));
    return Promise.all(promises);
  }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new GalleryManager();
  const preloader = new ImagePreloader();
  
  // Preload images for smoother experience
  setTimeout(() => {
    preloader.preloadImages(gallery.images);
  }, 2000);
});

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation to images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.gallery-item img');
  
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.style.animation = 'fadeIn 0.5s ease';
    });
  });
});

// Performance optimization: Lazy loading with Intersection Observer
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery-item img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  });
}
