var header = document.querySelector('header');
var bar = document.getElementById('progress');
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none';
document.body.prepend(sentinel);

new IntersectionObserver(function (entries) {
  header.classList.toggle('scrolled', !entries[0].isIntersecting);
}).observe(sentinel);

var ticking = false;
window.addEventListener('scroll', function () {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    ticking = false;
  });
}, { passive: true });

var revealTargets = document.querySelectorAll(
  '.card, .about-text > *, .about-image, section.banner h2, section.banner p, figure'
);

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach(function (el) {
    el.classList.add('in');
  });
} else {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(function (el) {
    var index = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--delay', Math.min(index, 4) * 90 + 'ms');
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

function animateCount(el) {
  var target = Number(el.dataset.count);
  if (reduceMotion) {
    el.textContent = target;
    return;
  }

  var duration = 1600;
  var start = performance.now();

  function frame(now) {
    var t = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window) {
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) {
    countObserver.observe(el);
  });
}
