(function () {
  const track = document.getElementById('track');
  const slides = track.children;
  const controls = document.getElementById('controls');
  const pauseBtn = document.getElementById('pause');
  const carousel = document.querySelector('.carousel');
  const AUTOPLAY_MS = 4000;

  let index = 0;
  let timer = null;
  let userPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build the dots
  const dots = [...slides].map((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    b.addEventListener('click', () => goTo(i));
    controls.insertBefore(b, pauseBtn);
    return b;
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * index) + '%)';
    dots.forEach((d, n) => d.setAttribute('aria-current', n === index ? 'true' : 'false'));
  }

  function start() { stop(); if (!userPaused) timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS); }
  function stop()  { clearInterval(timer); timer = null; }

  document.getElementById('next').addEventListener('click', () => { goTo(index + 1); start(); });
  document.getElementById('prev').addEventListener('click', () => { goTo(index - 1); start(); });

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    start();
  });

  // Pause while hovering or focused inside the carousel
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  // Keyboard arrows
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { goTo(index + 1); }
    if (e.key === 'ArrowLeft')  { goTo(index - 1); }
  });

  // Swipe on touch screens
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
  pauseBtn.setAttribute('aria-pressed', String(userPaused));
  goTo(0);
  start();
})();