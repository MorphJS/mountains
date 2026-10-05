var header = document.querySelector('header');
var bar = document.getElementById('progress');

window.addEventListener('scroll', function () {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (window.scrollY / max) * 100 + '%';
  header.classList.toggle('scrolled', window.scrollY > 60);
});

document.querySelectorAll('[data-count]').forEach(function (el) {
  var target = Number(el.dataset.count);
  var current = 0;
  var timer = setInterval(function () {
    current = current + target / 60;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current);
  }, 30);
});
