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
        this.playBell();
      }
      return this.enabled;
    }

    updateToggleButton() {
      const btn = document.getElementById('soundToggleBtn');
      if (!btn) return;
      const icon = btn.querySelector('.sound-icon');
      const text = btn.querySelector('.sound-text');
      if (this.enabled) {
        if (icon) icon.textContent = '🔔';
        btn.setAttribute('aria-label', 'ధ్వని ఆఫ్ చేయండి / Mute temple chime');
        btn.classList.remove('is-muted');
      } else {
        if (icon) icon.textContent = '🔕';
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

        // Hero Entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        heroTl
          .from('.hero-badge', { opacity: 0, y: -15, duration: 0.7 })
          .from('.hero-title', { opacity: 0, y: 25, duration: 0.8 }, '-=0.4')
          .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
          .from('.hero-trust-box', { opacity: 0, scale: 0.95, duration: 0.8 }, '-=0.4')
          .from('.hero-actions', { opacity: 0, y: 15, duration: 0.6 }, '-=0.4');

        // Hero Parallax SVG
        gsap.to('#heroSun', {
          y: -45,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to('.parallax-paddy-rows', {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        // Pinned Story Section
        const storyCard = document.querySelector('.story-sticky-card');
        if (storyCard) {
          gsap.from('.story-pillar-item', {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.7,
            scrollTrigger: {
              trigger: '#our-story',
              start: 'top 75%'
            }
          });
        }

        // How to Order Steps Stagger
        gsap.from('.step-card', {
          opacity: 0,
          y: 25,
          stagger: 0.12,
          duration: 0.6,
          scrollTrigger: {
            trigger: '#how-to-order',
            start: 'top 80%'
          }
        });
      } catch (err) {
        console.warn('GSAP animations notice:', err);
      }
    }
  }

  // Ensure DOM is ready before starting animations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothMotion);
  } else {
    initSmoothMotion();
  }
})();
