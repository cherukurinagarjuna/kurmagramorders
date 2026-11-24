/**
 * KURMAGRAM VEDIC VILLAGE — MOTION & AUDIO ENGINE
 * Integrates Lenis smooth scroll, GSAP ScrollTrigger, and WebAudio synthesized temple-bell chimes.
 * Full graceful degradation for prefers-reduced-motion and non-JS / missing vendor libraries.
 */

(function () {
  'use strict';

  // --- 1. WebAudio Synthesized Temple-Bell Chimes ---
  class SoundManager {
    constructor() {
      this.STORAGE_KEY = 'kg_sound_v1';
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.enabled = stored !== null ? stored === 'true' : true;
      this.ctx = null;
      this.initHeaderToggle();
    }

    getAudioContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem(this.STORAGE_KEY, this.enabled);
      this.updateToggleButton();
      if (this.enabled) {
        this.playBell('add');
      }
      return this.enabled;
    }

    updateToggleButton() {
      const btn = document.getElementById('soundToggleBtn');
      if (!btn) return;
      const bellActive = btn.querySelector('.sound-bell-active');
      const bellMuted = btn.querySelector('.sound-bell-muted');

      if (this.enabled) {
        if (bellActive) bellActive.style.display = 'inline-block';
        if (bellMuted) bellMuted.style.display = 'none';
        btn.setAttribute('aria-label', 'ధ్వని ఆఫ్ చేయండి / Mute temple chime');
        btn.classList.remove('is-muted');
      } else {
        if (bellActive) bellActive.style.display = 'none';
        if (bellMuted) bellMuted.style.display = 'inline-block';
        btn.setAttribute('aria-label', 'ధ్వని ఆన్ చేయండి / Enable temple chime');
        btn.classList.add('is-muted');
      }
    }

    initHeaderToggle() {
      document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('soundToggleBtn');
        if (btn) {
          btn.addEventListener('click', () => this.toggle());
        }
        this.updateToggleButton();
      });
    }

    // Synthesized temple-bell chime using multi-harmonic sine waves with metallic bell decay
    playBell(type = 'add') {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        if (type === 'add') {
          // Temple bell chime (A5 + harmonics)
          const freqs = [880, 1320, 1760, 2640];
          const gains = [0.22, 0.12, 0.08, 0.03];

          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Realistic acoustic exponential bell decay
            gainNode.gain.setValueAtTime(gains[idx], now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.25);
          });
        } else if (type === 'order') {
          // Celebratory four-tone Vedic temple sanctum chime (C5 -> E5 -> G5 -> C6)
          const melody = [523.25, 659.25, 783.99, 1046.50];
          melody.forEach((freq, i) => {
            const noteTime = now + i * 0.12;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.2, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(noteTime);
            osc.stop(noteTime + 1.7);
          });
        }
      } catch (e) {
        console.warn('Audio synthesis notice:', e);
      }
    }
  }

  window.soundManager = new SoundManager();

  // --- 2. Lenis Smooth Scroll & GSAP ScrollTrigger Integration ---
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenisInstance = null;

  window.motionController = {
    lenis: null,
    lockScroll() {
      if (this.lenis) this.lenis.stop();
      document.body.classList.add('scroll-locked');
    },
    unlockScroll() {
      if (this.lenis) this.lenis.start();
      document.body.classList.remove('scroll-locked');
    },
    scrollTo(target, options = {}) {
      if (this.lenis && !prefersReduced) {
        this.lenis.scrollTo(target, options);
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  };

  function initSmoothMotion() {
    // If user prefers reduced motion, disable Lenis and GSAP scrubs
    if (prefersReduced) {
      document.documentElement.classList.add('reduced-motion');
      return;
    }

    // Initialize Lenis if available
    if (typeof window.Lenis !== 'undefined') {
      try {
        lenisInstance = new window.Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 1.5
        });
        window.motionController.lenis = lenisInstance;

        // Synchronize Lenis with GSAP ScrollTrigger if GSAP is available
        if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
          window.gsap.registerPlugin(window.ScrollTrigger);

          lenisInstance.on('scroll', window.ScrollTrigger.update);

          window.gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        } else {
          // Lenis standalone RAF loop
          function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
          }
          requestAnimationFrame(raf);
        }
      } catch (err) {
        console.warn('Lenis initialization notice:', err);
      }
    }

    // Initialize GSAP Animations if available
    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      try {
        const gsap = window.gsap;

        // Kalamkari Vine Scroll Reveal
        gsap.from('.kalamkari-vine-svg', {
          opacity: 0.4,
          scaleX: 0.95,
          duration: 1,
          scrollTrigger: {
            trigger: '.kalamkari-divider-wrap',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        // Scroll-Craft: Pinned Story Section & Dynamic Photo Swap
        const storySteps = document.querySelectorAll('.story-step-item');
        const dynamicImg = document.getElementById('storyDynamicImg');
        const dynamicSource = document.querySelector('#storyDynamicPicture source');

        storySteps.forEach((step) => {
          window.ScrollTrigger.create({
            trigger: step,
            start: 'top 60%',
            end: 'bottom 60%',
            onEnter: () => {
              storySteps.forEach(s => s.classList.remove('is-active'));
              step.classList.add('is-active');
              const newPhoto = step.dataset.photo;
              if (dynamicImg && newPhoto) {
                dynamicImg.src = newPhoto;
                if (dynamicSource) dynamicSource.srcset = newPhoto;
              }
            },
            onEnterBack: () => {
              storySteps.forEach(s => s.classList.remove('is-active'));
              step.classList.add('is-active');
              const newPhoto = step.dataset.photo;
              if (dynamicImg && newPhoto) {
                dynamicImg.src = newPhoto;
                if (dynamicSource) dynamicSource.srcset = newPhoto;
              }
            }
          });
        });

        // Ensure step cards are always immediately visible
        const stepCards = document.querySelectorAll('.step-card');
        stepCards.forEach(c => {
          c.style.opacity = '1';
          c.style.visibility = 'visible';
        });
      } catch (err) {
        console.warn('GSAP animations notice:', err);
      }
    }
  }

  // --- 3. High-End Fluid Typing Engine (21st.dev & ReactDrops Interaction) ---
  class FluidTypingController {
    constructor() {
      this.container = document.getElementById('heroFluidHeadline');
      if (!this.container) return;

      this.contentEl = this.container.querySelector('.fluid-typing-content') || this.container;
      this.cursorEl = this.container.querySelector('.fluid-typing-cursor');
      this.currentText = this.contentEl.getAttribute('data-target-text') || this.contentEl.textContent.trim();
      this.speed = 65; // base typing speed in ms
      this.timer = null;

      this.init();
    }

    getGraphemes(text, lang = 'te') {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
          const segmenter = new Intl.Segmenter(lang, { granularity: 'grapheme' });
          return Array.from(segmenter.segment(text), s => s.segment);
        } catch (e) {
          // fallback
        }
      }
      return Array.from(text);
    }

    init() {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        this.contentEl.textContent = this.currentText;
        if (this.cursorEl) this.cursorEl.style.display = 'none';
        return;
      }

      // Start typing after initial smooth page stabilization
      setTimeout(() => {
        this.typeText(this.currentText, document.documentElement.lang || 'te');
      }, 350);
    }

    typeText(targetText, lang = 'te') {
      if (this.timer) clearTimeout(this.timer);
      this.currentText = targetText;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        this.contentEl.textContent = targetText;
        return;
      }

      const clusters = this.getGraphemes(targetText, lang);
      this.contentEl.textContent = '';

      if (this.cursorEl) {
        this.cursorEl.classList.remove('is-typing-paused');
        this.cursorEl.classList.add('is-typing');
      }

      let i = 0;
      const typeNext = () => {
        if (i < clusters.length) {
          const cluster = clusters[i];
          this.contentEl.textContent += cluster;
          i++;

          // Natural human typing cadence: slight variable jitter and thoughtful pause at dash/punctuation
          let delay = this.speed + (Math.random() * 20 - 10);
          if (cluster === '–' || cluster === '—' || cluster === '-' || cluster === '•') {
            delay += 280; // natural breathing pause
          } else if (cluster === ' ') {
            delay += 40;
          }

          this.timer = setTimeout(typeNext, delay);
        } else {
          // Finished typing: transition cursor to gentle breathing rhythm
          if (this.cursorEl) {
            this.cursorEl.classList.remove('is-typing');
            this.cursorEl.classList.add('is-typing-paused');
          }
        }
      };

      typeNext();
    }

    setText(newText, lang = 'te') {
      this.typeText(newText, lang);
    }
  }

  // Export fluid headline controller
  window.initFluidHeadline = function () {
    window.fluidHeadlineTyping = new FluidTypingController();
  };

  // --- 4. Bento Card 3D Tilt & Magnetic Hover Engine (21st.dev micro-interaction) ---
  class BentoTiltController {
    constructor() {
      this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isTouch = window.matchMedia('(pointer: coarse)').matches;
      this.init();
    }

    init() {
      if (this.isReduced || this.isTouch) return;
      const cards = document.querySelectorAll('.product-card');

      cards.forEach((card) => {
        if (card._hasTiltListener) return;
        card._hasTiltListener = true;

        let bounds = null;
        let isHovered = false;

        const onMouseEnter = () => {
          isHovered = true;
          bounds = card.getBoundingClientRect();
          card.style.transition = 'transform 0.1s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out';
        };

        const onMouseMove = (e) => {
          if (!isHovered) return;
          if (!bounds) bounds = card.getBoundingClientRect();

          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;
          const centerX = bounds.width / 2;
          const centerY = bounds.height / 2;

          // Subtle, luxurious tilt angles (max +/- 4.5 degrees)
          const tiltX = ((mouseY - centerY) / centerY) * -4.5;
          const tiltY = ((mouseX - centerX) / centerX) * 4.5;

          // Dynamic coordinates for antique brass magnetic spotlight
          const xPercent = (mouseX / bounds.width) * 100;
          const yPercent = (mouseY / bounds.height) * 100;
          card.style.setProperty('--mouse-x', `${xPercent.toFixed(1)}%`);
          card.style.setProperty('--mouse-y', `${yPercent.toFixed(1)}%`);

          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)`;
        };

        const onMouseLeave = () => {
          isHovered = false;
          bounds = null;
          card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
      });
    }

    refresh() {
      if (this.isReduced || this.isTouch) return;
      const cards = document.querySelectorAll('.product-card');
      cards.forEach((card) => {
        card._hasTiltListener = false;
      });
      this.init();
    }
  }

  window.initBentoTilt = function () {
    window.bentoTiltController = new BentoTiltController();
  };

  // Ensure DOM is ready before starting animations
  function bootMotion() {
    initSmoothMotion();
    window.initFluidHeadline();
    window.initBentoTilt();
  }

  function scheduleBoot() {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(bootMotion, { timeout: 800 });
    } else {
      setTimeout(bootMotion, 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoot);
  } else {
    scheduleBoot();
  }
})();
