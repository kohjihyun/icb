(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Zone 스크롤 진행도 0→1 ── */
  function getZoneProgress(zoneId, sectionId) {
    const zone = document.getElementById(zoneId);
    const section = document.getElementById(sectionId);
    if (!zone || !section) return 0;
    const zoneTop = zone.getBoundingClientRect().top + window.scrollY;
    const scrollRoom = zone.offsetHeight - section.offsetHeight;
    if (scrollRoom <= 0) return 0;
    const scrolled = window.scrollY - zoneTop;
    return Math.min(1, Math.max(0, scrolled / scrollRoom));
  }

  /* ── Section 1: 프레임 밑에서 순차 등장 ──────────────────────
     zone 진행도 0.08 도달 시 4개 라인 동시에 is-set 추가.
     CSS transition-delay(0 / 0.14 / 0.28 / 0.42s)로 시간차 구현.
     section1-intro의 overflow:hidden이 시작 위치(700px 아래)를 클립. */
  function setupSection1Intro() {
    const section = document.getElementById('section1-company-intro');
    if (!section) return;
    const lines = section.querySelectorAll('.intro-line');
    if (!lines.length) return;

    if (prefersReducedMotion) {
      lines.forEach(l => l.classList.add('is-set'));
      return;
    }

    const THRESHOLD = 0.08;

    const onScroll = () => {
      const p = getZoneProgress('zone-section1', 'section1-company-intro');
      if (p >= THRESHOLD) {
        lines.forEach(l => l.classList.add('is-set'));
      } else {
        lines.forEach(l => l.classList.remove('is-set'));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ── Section 2 타이틀: 섹션 진입 즉시 트리거 ── */
  function setupBusinessTitle() {
    const title = document.querySelector('.biz-title-reveal');
    if (!title) return;
    const titleLines = title.querySelectorAll('.biz-title-line');

    if (prefersReducedMotion) {
      titleLines.forEach(l => l.classList.add('is-visible'));
      return;
    }

    let animTimers = [];

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        animTimers.forEach(clearTimeout);
        animTimers = [];
        if (entry.isIntersecting) {
          titleLines.forEach((line, i) => {
            animTimers.push(setTimeout(() => line.classList.add('is-visible'), i * 160));
          });
        } else {
          titleLines.forEach(l => l.classList.remove('is-visible'));
        }
      });
    }, { threshold: 0.01, rootMargin: '0px' });

    observer.observe(title);
  }

  /* ── Section 2 카드: zone 스크롤 연동 순차 등장 ── */
  function setupSection2Cards() {
    const section = document.getElementById('section2-business-services');
    if (!section) return;
    const cards = section.querySelectorAll('.biz-card');
    if (!cards.length) return;

    if (prefersReducedMotion) {
      cards.forEach(c => c.classList.add('is-set'));
      return;
    }

    const thresholds = [0.20, 0.38, 0.56, 0.74];

    const onScroll = () => {
      const p = getZoneProgress('zone-section2', 'section2-business-services');
      cards.forEach((card, i) => {
        const t = thresholds[i] ?? ((i + 0.5) / cards.length);
        if (p >= t) card.classList.add('is-set');
        else card.classList.remove('is-set');
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ── Section 3: zone 스크롤 순차 등장 ── */
  function setupSection3Count() {
    const section = document.getElementById('section3-count');
    if (!section) return;
    const items = section.querySelectorAll('.count-reveal');
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach(item => item.classList.add('is-set'));
      return;
    }

    const thresholds = [0.02, 0.14, 0.28, 0.43, 0.58, 0.73];

    const onScroll = () => {
      const p = getZoneProgress('zone-section3', 'section3-count');
      items.forEach((item, i) => {
        const t = thresholds[i] ?? ((i + 0.5) / items.length);
        if (p >= t) item.classList.add('is-set');
        else item.classList.remove('is-set');
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ── Section 5: zone 스크롤 연동 텍스트 등장 ── */
  function setupSection5Remit() {
    const section = document.getElementById('section5-remittance');
    if (!section) return;
    const items = section.querySelectorAll('.remit-reveal');
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach(item => item.classList.add('is-set'));
      return;
    }

    const thresholds = [0.08, 0.22, 0.36, 0.50, 0.64];

    const onScroll = () => {
      const p = getZoneProgress('zone-section5', 'section5-remittance');
      items.forEach((item, i) => {
        const t = thresholds[i] ?? ((i + 0.5) / items.length);
        if (p >= t) item.classList.add('is-set');
        else item.classList.remove('is-set');
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ── Hero 타이틀: 스크롤 시 살짝 위로 (translate-x 유지) ── */
  function setupHeroTitleMotion() {
    const hero = document.getElementById('hero');
    const block = hero?.querySelector('[data-name="Hero Title EN"]');
    if (!hero || !block || prefersReducedMotion) return;

    const tick = () => {
      const r = hero.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, 1 - r.bottom / (r.height + 120)));
      block.style.transform = `translate(-50%, ${(1 - t) * 36}px)`;
    };

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    tick();
  }

  /* ── debunk-video: intersection 등장 ── */
  function setupReveal(selector, options = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const visibleClass = options.visibleClass || 'is-visible';

    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add(visibleClass));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add(visibleClass);
        else entry.target.classList.remove(visibleClass);
      });
    }, {
      threshold: options.threshold ?? 0.06,
      rootMargin: options.rootMargin ?? '0px 0px 18% 0px',
    });

    els.forEach(el => observer.observe(el));
  }

  /* ── 3D 카드 캐러셀 ─────────────────────────────────────────
     두 섹션 공통. opts: { hostEl, cards, cardW, cardH }        */
  function initCarousel(opts) {
    const { hostEl, cards, cardW, cardH } = opts;
    const sceneEl = hostEl.querySelector('.carousel-scene');
    if (!sceneEl) return;

    let active = 0;
    let isAnimating = false;

    function getRelativePos(index) {
      const total = cards.length;
      let diff = index - active;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    }

    function getCardStyle(position) {
      const abs = Math.abs(position);
      if (position === 0) {
        return {
          transform: 'translateX(0px) scale(1.12) rotateY(0deg)',
          zIndex: 100,
          opacity: 1,
          filter: 'brightness(1)',
        };
      }
      const dir = position > 0 ? 1 : -1;
      return {
        transform: `translate3d(${dir * (220 + (abs - 1) * 150)}px,0,${-abs * 120}px) scale(${1 - abs * 0.12}) rotateY(${dir * -32}deg)`,
        zIndex: 100 - abs,
        opacity: 1,
        filter: 'brightness(0.65)',
      };
    }

    function renderCards() {
      cards.forEach((card, index) => {
        const position = getRelativePos(index);
        const style = getCardStyle(position);

        let el = sceneEl.querySelector(`[data-cid="${card.id}"]`);
        if (!el) {
          el = document.createElement('div');
          el.className = 'carousel-card';
          el.setAttribute('data-cid', card.id);
          el.style.width = cardW + 'px';
          el.style.height = cardH + 'px';
          Object.assign(el.style, style);
          el.innerHTML = `
            <div style="background-color:${card.color};width:100%;height:100%;position:relative;">
              <img src="${card.icon}" class="carousel-card-icon" alt="" />
              <div class="carousel-overlay">
                <div class="carousel-num">0${card.id}</div>
                <div class="carousel-title">${card.title}</div>
              </div>
              <div class="carousel-reflection"></div>
            </div>`;
          sceneEl.appendChild(el);
        }
        requestAnimationFrame(() => Object.assign(el.style, style));
      });
    }

    renderCards();

    function onWheel(e) {
      const atEnd = active === cards.length - 1;
      const atStart = active === 0;
      const down = e.deltaY > 0;
      if ((atEnd && down) || (atStart && !down)) return;
      e.preventDefault();
      if (isAnimating) return;
      isAnimating = true;
      active = down ? (active + 1) % cards.length : (active - 1 + cards.length) % cards.length;
      renderCards();
      setTimeout(() => { isAnimating = false; }, 1150);
    }

    hostEl.addEventListener('pointerenter', () => { hostEl._carouselWheel = onWheel; });
    hostEl.addEventListener('pointerleave', () => { hostEl._carouselWheel = null; });
  }

  function setupCarousels() {
    /* 캐러셀 1: Electronic Financial Licenses (6장, 250×400) */
    const host1 = document.getElementById('carousel1-host');
    if (host1) {
      initCarousel({
        hostEl: host1,
        cardW: 250,
        cardH: 400,
        cards: [
          { id: 1, title: 'Electronic Payment Gateway (PG)',         color: '#EA4109', icon: 'assets/certificate.png' },
          { id: 2, title: 'Prepaid Electronic Payment Instrument',   color: '#E52006', icon: 'assets/certificate.png' },
          { id: 3, title: 'Foreign Exchange Business',               color: '#BC1313', icon: 'assets/certificate.png' },
          { id: 4, title: 'Currency Exchange',                       color: '#EA4109', icon: 'assets/certificate.png' },
          { id: 5, title: 'Small-Amount Overseas Remittance',        color: '#E52006', icon: 'assets/certificate.png' },
          { id: 6, title: 'Escrow Service',                          color: '#BC1313', icon: 'assets/certificate.png' },
        ],
      });
    }

    /* 캐러셀 2: Intellectual Property & Patents (4장, 320×360) */
    const host2 = document.getElementById('carousel2-host');
    if (host2) {
      initCarousel({
        hostEl: host2,
        cardW: 320,
        cardH: 360,
        cards: [
          { id: 1, title: 'Financial Transaction Brokerage',          color: '#EA4109', icon: 'assets/certificate.png' },
          { id: 2, title: 'Duty-Free Purchase Settlement',            color: '#E52006', icon: 'assets/certificate.png' },
          { id: 3, title: 'Mobile Augmented Space Acceleration',      color: '#BC1313', icon: 'assets/certificate.png' },
          { id: 4, title: 'Ultrasonic Payment Technology',            color: '#EA4109', icon: 'assets/certificate.png' },
        ],
      });
    }

    /* 전역 wheel 라우터 */
    window.addEventListener('wheel', (e) => {
      const hosts = document.querySelectorAll('.carousel-host');
      hosts.forEach(h => { if (h._carouselWheel) h._carouselWheel(e); });
    }, { passive: false });
  }

  /* ── Init ── */
  setupSection1Intro();
  setupBusinessTitle();
  setupSection2Cards();
  setupSection3Count();
  setupSection5Remit();
  setupHeroTitleMotion();
  setupReveal('.debunk-video-wrap', { threshold: 0.1 });
  setupCarousels();
})();
