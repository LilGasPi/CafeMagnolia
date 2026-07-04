/* ---------- Menú móvil ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ---------- Animaciones al hacer scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ---------- Galería: carrusel en mobile (flechas + puntitos) ---------- */
const galleryGrid = document.getElementById('galleryGrid');
const galleryDots = document.getElementById('galleryDots');
const galPrev = document.getElementById('galPrev');
const galNext = document.getElementById('galNext');
if (galleryGrid && galleryDots) {
  const gItems = Array.from(galleryGrid.querySelectorAll('.g-item'));
  gItems.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir al elemento ${i + 1}`);
    dot.addEventListener('click', () => {
      gItems[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    galleryDots.appendChild(dot);
  });
  const gDots = Array.from(galleryDots.querySelectorAll('.dot'));

  const setActiveGalleryDot = () => {
    const gridLeft = galleryGrid.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    gItems.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - gridLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    gDots.forEach((d, i) => d.classList.toggle('active', i === closest));
  };
  galleryGrid.addEventListener('scroll', () => {
    window.requestAnimationFrame(setActiveGalleryDot);
  }, { passive: true });

  const scrollGalleryByItem = (dir) => {
    const item = gItems[0];
    const gap = 14;
    const amount = (item.getBoundingClientRect().width + gap) * dir;
    galleryGrid.scrollBy({ left: amount, behavior: 'smooth' });
  };
  if (galPrev) galPrev.addEventListener('click', () => scrollGalleryByItem(-1));
  if (galNext) galNext.addEventListener('click', () => scrollGalleryByItem(1));
}

/* ---------- Galería: video en silencio al entrar en vista, botón de sonido ---------- */
const videoItems = document.querySelectorAll('.g-video');
videoItems.forEach(itemEl => {
  const video = itemEl.querySelector('video');
  const muteBtn = itemEl.querySelector('.mute-btn');

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });
  videoObserver.observe(itemEl);

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    const iconMuted = muteBtn.querySelector('.icon-muted');
    const iconUnmuted = muteBtn.querySelector('.icon-unmuted');
    iconMuted.style.display = video.muted ? 'block' : 'none';
    iconUnmuted.style.display = video.muted ? 'none' : 'block';
  });
});