import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    document.documentElement.classList.add('no-motion');
    document.querySelectorAll('.pipe-step').forEach((s) => s.classList.add('active'));
    return;
  }

  // Smooth scrolling, synced with ScrollTrigger
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -52 }); }
    }),
  );

  // Hero: the framed image opens to full bleed while the title scales away
  gsap.timeline({
    scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: '+=120%', scrub: true, pin: true },
  })
    .fromTo('[data-hero-media]',
      { clipPath: 'inset(22% 18% 22% 18% round 40px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
    .to('[data-hero-media] img', { scale: 1, ease: 'none' }, 0)
    .to('[data-hero-copy]', { scale: 1.6, opacity: 0, ease: 'power1.in' }, 0)
    .to('.scroll-hint, .hero-caption', { opacity: 0, duration: 0.2 }, 0);

  // Statement: words light up as you scroll
  gsap.to('[data-words] .w', {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: '[data-words]', start: 'top 80%', end: 'bottom 40%', scrub: true },
  });

  // Generic reveals
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  const mm = gsap.matchMedia();

  // Pipeline: pinned, steps advance with scroll (desktop only)
  mm.add('(min-width: 901px)', () => {
    const steps = gsap.utils.toArray('.pipe-step');
    const lines = gsap.utils.toArray('.code-card .ln');
    const activate = (i) => {
      steps.forEach((s, j) => s.classList.toggle('active', j === i));
      const on = steps[i].dataset.lines.split(',');
      lines.forEach((l) => l.classList.toggle('on', on.includes(l.dataset.ln)));
    };
    activate(0);
    const st = ScrollTrigger.create({
      trigger: '[data-pipeline]',
      start: 'top top',
      end: () => `+=${steps.length * 60}%`,
      pin: true,
      onUpdate: (self) => activate(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
    });
    return () => { st.kill(); steps.forEach((s) => s.classList.add('active')); lines.forEach((l) => l.classList.remove('on')); };
  });

  // Gallery: vertical scroll drives a horizontal track (desktop/tablet)
  mm.add('(min-width: 761px)', () => {
    const track = document.querySelector('[data-track]');
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-gallery]', start: 'top top', end: () => `+=${dist()}`,
        pin: true, scrub: 0.6, invalidateOnRefresh: true,
      },
    });
    return () => tween.kill();
  });

  // Stats count-in
  gsap.from('.stat', {
    y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.stats', start: 'top 85%' },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
