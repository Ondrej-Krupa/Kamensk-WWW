document.addEventListener("DOMContentLoaded", () => {
  // Výběr elementů
  const galleryImages = document.querySelectorAll(".gallery-item img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const closeBtn = document.querySelector(".lightbox .close");
  const prevBtn = document.querySelector(".lightbox .prev");
  const nextBtn = document.querySelector(".lightbox .next");

  let currentIndex = 0;

  // Otevření lightboxu
  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = galleryImages[currentIndex].src;
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden"; // zákaz scrollování na pozadí
  }

  // Zavření lightboxu
  function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImage.src = "";
    document.body.style.overflow = ""; // vrácení scrollování
  }

  // Další obrázek
  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentIndex].src;
  }

  // Předchozí obrázek
  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentIndex].src;
  }

  // Kliknutí na obrázky v galerii → otevření
  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  // Ovládací tlačítka
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", nextImage);
  prevBtn.addEventListener("click", prevImage);

  // Zavření kliknutím mimo obrázek
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Ovládání klávesnicí
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
  });
});
