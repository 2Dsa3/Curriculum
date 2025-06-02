const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let points = [];
  const POINT_COUNT = 50;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  class Point {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = 2 + Math.random() * 2;
    }
    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      // Color adapts to mode
      const isLight = document.body.classList.contains('light-mode');
      ctx.fillStyle = isLight ? 'rgba(25, 118, 210, 0.7)' : 'rgba(30,144,255,0.7)';
      ctx.fill();
    }
  }

  function connectPoints() {
    for (let i = 0; i < POINT_COUNT; i++) {
      for (let j = i + 1; j < POINT_COUNT; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const isLight = document.body.classList.contains('light-mode');
          ctx.strokeStyle = isLight
            ? `rgba(25,118,210,${1 - dist / 120})`
            : `rgba(30,144,255,${1 - dist / 120})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    points.forEach((p) => {
      p.move();
      p.draw();
    });
    connectPoints();
    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    points = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push(new Point());
    }
    animate();
  }

  window.addEventListener('resize', init);
  init();

  // Dark/Light mode toggle
  const btn = document.getElementById('toggle-mode-btn');
  function setMode(mode) {
    if (mode === 'light') {
      document.body.classList.add('light-mode');
      btn.textContent = '🌞';
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      btn.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
  }
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setMode(isLight ? 'dark' : 'light');
  });
  // On load, set mode from localStorage or prefers-color-scheme
  (function () {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setMode(saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setMode('light');
    }
  })();