/* ═══════════════════════════════════════════════════════
   engine3d.js — vanilla 3D canvas engine (no libraries)
   · Hero3D          : draggable wireframe icosahedron +
   ·                   orbiting tech-label rings + particles
   · ParticleNetwork : global background network
   · MatrixRain      : footer binary rain
   ═══════════════════════════════════════════════════════ */

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── small 3D helpers ─────────────────────────────── */
function rotX(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
}
function rotY(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
}
function rotZ(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
}

/* ═══════════ HERO 3D — tech core ═══════════ */
class Hero3D {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.rx = -0.42;
    this.ry = 0.5;
    this.autoV = REDUCE_MOTION ? 0.0006 : 0.0042;
    this.dragVX = 0; this.dragVY = 0;
    this.dragging = false;
    this.px = 0; this.py = 0;
    this.parX = 0; this.parY = 0;      // mouse parallax targets
    this.persp = 4.4;

    this.build();
    this.resize();
    this.bind();

    this.visible = true;
    this.running = true;
    this.last = performance.now();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { this.visible = es[0].isIntersecting; },
        { threshold: 0 }).observe(canvas);
    }
    const loop = now => {
      if (this.running) this.frame(now);
      requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
    });
    requestAnimationFrame(loop);
  }

  build() {
    /* icosahedron vertices (golden ratio, normalized) */
    const g = (1 + Math.sqrt(5)) / 2;
    const raw = [
      [-1, g, 0], [1, g, 0], [-1, -g, 0], [1, -g, 0],
      [0, -1, g], [0, 1, g], [0, -1, -g], [0, 1, -g],
      [g, 0, -1], [g, 0, 1], [-g, 0, -1], [-g, 0, 1]
    ].map(v => {
      const l = Math.hypot(v[0], v[1], v[2]);
      return [v[0] / l, v[1] / l, v[2] / l];
    });
    this.verts = raw;
    const edgeLen = 2 / Math.hypot(1, g);
    this.edges = [];
    for (let i = 0; i < raw.length; i++)
      for (let j = i + 1; j < raw.length; j++) {
        const d = Math.hypot(
          raw[i][0] - raw[j][0], raw[i][1] - raw[j][1], raw[i][2] - raw[j][2]);
        if (Math.abs(d - edgeLen) < 0.06) this.edges.push([i, j]);
      }

    /* orbit rings — each: radius, tilt (rad), speed, labels */
    this.rings = [
      { r: 1.5,  tx: 0.5,  ty: 0.15, tz: 0.2,  speed: 0.5,  color: '#00e5ff', labels: ['Python', 'FastAPI'] },
      { r: 1.85, tx: -0.55, ty: 0.35, tz: -0.2, speed: -0.34, color: '#a78bfa', labels: ['.NET', 'Node.js', 'Docker'] },
      { r: 2.2,  tx: 0.25, ty: -0.5, tz: 0.45, speed: 0.22,  color: '#f472b6', labels: ['React', 'ML', 'n8n'] }
    ];

    /* inner floating particles */
    this.dust = Array.from({ length: 30 }, () => ({
      p: [(Math.random() - .5) * 2.3, (Math.random() - .5) * 2.3, (Math.random() - .5) * 2.3],
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 0.8
    }));

    this.t = 0;
  }

  resize() {
    const r = this.c.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.c.width = r.width * this.dpr;
    this.c.height = r.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  bind() {
    const c = this.c;
    window.addEventListener('resize', () => this.resize());

    c.addEventListener('pointerdown', e => {
      this.dragging = true;
      this.px = e.clientX; this.py = e.clientY;
      c.setPointerCapture(e.pointerId);
    });
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      this.parX = ((e.clientX - r.left) / r.width - 0.5) * 0.24;
      this.parY = ((e.clientY - r.top) / r.height - 0.5) * 0.2;
      if (!this.dragging) return;
      const dx = e.clientX - this.px, dy = e.clientY - this.py;
      this.px = e.clientX; this.py = e.clientY;
      const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
      this.ry += dx * 0.006 * dir;
      this.rx += dy * 0.006;
      this.dragVX = dx * 0.006 * dir;
      this.dragVY = dy * 0.006;
    });
    const end = () => { this.dragging = false; };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('pointerleave', () => { if (!this.dragging) { this.parX = 0; this.parY = 0; } });
  }

  project(p) {
    const pf = this.persp / (this.persp - p[2]);
    return [this.w / 2 + p[0] * pf * this.unit,
            this.h / 2 + p[1] * pf * this.unit, pf, p[2]];
  }

  frame(now) {
    if (!this.visible) { this.last = now; return; }
    const dt = Math.min(now - this.last, 50);
    this.last = now;
    this.t += dt * 0.001;

    if (!this.dragging) {
      this.ry += this.autoV * dt * 0.06 + this.dragVX;
      this.rx += this.dragVY;
      this.dragVX *= 0.94; this.dragVY *= 0.94;
    }
    this.rx = Math.max(-1.45, Math.min(1.45, this.rx));

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    this.unit = Math.min(this.w, this.h) * 0.155;

    const rxA = this.rx + this.parY, ryA = this.ry + this.parX;
    const R = p => rotY(rotX(p, rxA), ryA);

    /* ── dust particles ── */
    for (const d of this.dust) {
      const q = [d.p[0], d.p[1] + Math.sin(this.t * d.sp + d.ph) * 0.12, d.p[2]];
      const s = this.project(R(q));
      const a = 0.14 + (s[2] - 0.7) * 0.5;
      ctx.fillStyle = `rgba(147,197,253,${Math.max(0.05, Math.min(a, 0.6))})`;
      ctx.beginPath();
      ctx.arc(s[0], s[1], 1.1 + s[2] * 0.8, 0, 7);
      ctx.fill();
    }

    /* ── orbit rings ── */
    for (const ring of this.rings) {
      const pts = [];
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.09) {
        const local = [Math.cos(a) * ring.r, 0, Math.sin(a) * ring.r];
        pts.push(this.project(R(rotZ(rotY(rotX(local, ring.tx), ring.ty), ring.tz))));
      }
      for (let i = 1; i < pts.length; i++) {
        const z = (pts[i - 1][3] + pts[i][3]) / 2;
        const alpha = 0.1 + (z / ring.r + 1) * 0.13;
        ctx.strokeStyle = this.hexA(ring.color, Math.min(alpha, 0.42));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pts[i - 1][0], pts[i - 1][1]);
        ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      }
      /* labels riding the ring */
      ring.labels.forEach((label, i) => {
        const ang = this.t * ring.speed + (i * Math.PI * 2) / ring.labels.length;
        const local = [Math.cos(ang) * ring.r, 0, Math.sin(ang) * ring.r];
        const s = this.project(R(rotZ(rotY(rotX(local, ring.tx), ring.ty), ring.tz)));
        const zN = (s[3] / ring.r + 1) / 2;              // 0 back → 1 front
        const size = Math.max(9, 10 + zN * 4);
        ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = zN > 0.6 ? 10 : 0;
        ctx.fillStyle = this.hexA(ring.color, 0.25 + zN * 0.75);
        ctx.fillText(label, s[0], s[1]);
        ctx.shadowBlur = 0;
        ctx.fillStyle = this.hexA(ring.color, 0.3 + zN * 0.7);
        ctx.beginPath();
        ctx.arc(s[0], s[1] + size * 0.95, 1.8, 0, 7);
        ctx.fill();
      });
    }

    /* ── icosahedron ── */
    const pv = this.verts.map(v => this.project(R(v)));
    const sorted = this.edges
      .map(e => ({ e, z: (pv[e[0]][3] + pv[e[1]][3]) / 2 }))
      .sort((a, b) => a.z - b.z);
    for (const { e, z } of sorted) {
      const zN = (z + 1) / 2;
      const grad = ctx.createLinearGradient(pv[e[0]][0], pv[e[0]][1], pv[e[1]][0], pv[e[1]][1]);
      grad.addColorStop(0, `rgba(0,229,255,${0.12 + zN * 0.55})`);
      grad.addColorStop(1, `rgba(139,92,246,${0.12 + zN * 0.55})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1 + zN * 0.9;
      ctx.beginPath();
      ctx.moveTo(pv[e[0]][0], pv[e[0]][1]);
      ctx.lineTo(pv[e[1]][0], pv[e[1]][1]);
      ctx.stroke();
    }
    /* vertices glow */
    for (const s of pv) {
      const zN = (s[3] + 1) / 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = zN * 14;
      ctx.fillStyle = `rgba(180,250,255,${0.3 + zN * 0.7})`;
      ctx.beginPath();
      ctx.arc(s[0], s[1], 1.6 + zN * 1.7, 0, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* ── core pulse ── */
    const core = this.project([0, 0, 0]);
    const pr = 5 + Math.sin(this.t * 2.4) * 1.6;
    const cg = ctx.createRadialGradient(core[0], core[1], 0, core[0], core[1], pr * 4);
    cg.addColorStop(0, 'rgba(0,229,255,.85)');
    cg.addColorStop(0.35, 'rgba(139,92,246,.35)');
    cg.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(core[0], core[1], pr * 4, 0, 7);
    ctx.fill();
  }

  hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(a, 1))})`;
  }
}

/* ═══════════ BACKGROUND PARTICLE NETWORK ═══════════ */
class ParticleNetwork {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.mouse = { x: -9e3, y: -9e3 };
    this.resize();
    this.seed();
    window.addEventListener('resize', () => { this.resize(); this.seed(); });
    window.addEventListener('pointermove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    this.running = !document.hidden;
    document.addEventListener('visibilitychange', () => { this.running = !document.hidden; });

    if (REDUCE_MOTION) { this.draw(); return; }
    const loop = () => {
      if (this.running) this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = this.w * this.dpr;
    this.c.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  seed() {
    const n = Math.min(85, Math.round((this.w * this.h) / 24000));
    this.nodes = Array.from({ length: n }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - .5) * 0.32,
      vy: (Math.random() - .5) * 0.32,
      c: Math.random() > 0.72 ? '139,92,246' : '0,229,255'
    }));
  }

  draw() {
    const { ctx, w, h, nodes } = this;
    ctx.clearRect(0, 0, w, h);
    const LINK = 130;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      /* gentle mouse repulsion */
      const dxm = n.x - this.mouse.x, dym = n.y - this.mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 130 && dm > 0.01) {
        n.x += (dxm / dm) * 0.55;
        n.y += (dym / dm) * 0.55;
      }
      if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(0,229,255,${(1 - d / LINK) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${n.c},.55)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4, 0, 7);
      ctx.fill();
    }
  }
}

/* ═══════════ FOOTER MATRIX RAIN ═══════════ */
class MatrixRain {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.chars = '01{}[]<>/*;=+#$&%-'.split('');
    this.visible = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => {
        this.visible = es[0].isIntersecting;
        if (this.visible && !this.started) { this.started = true; this.run(); }
      }, { threshold: 0 }).observe(canvas);
    }
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.c.parentElement.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.c.width = this.w * this.dpr;
    this.c.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.fontSize = 14;
    this.cols = Math.ceil(this.w / this.fontSize);
    this.drops = Array.from({ length: this.cols }, () => Math.random() * -40);
  }

  run() {
    if (REDUCE_MOTION) return;
    setInterval(() => {
      if (!this.visible || document.hidden) return;
      const { ctx, w, h, fontSize, cols, drops } = this;
      ctx.fillStyle = 'rgba(4,6,15,.09)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = this.chars[(Math.random() * this.chars.length) | 0];
        const x = i * fontSize, y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.975 ? '#8ff7ff' : 'rgba(52,211,153,.8)';
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.976) drops[i] = 0;
        drops[i]++;
      }
    }, 70);
  }
}

/* ═══════════ 3D ICON CAROUSEL ═══════════ */
class IconCarousel {
  constructor(stage, ring) {
    this.stage = stage;
    this.ring = ring;
    this.rot = -18;
    this.auto = REDUCE_MOTION ? 0.02 : 0.14;   // deg / frame
    this.baseAuto = this.auto;
    this.inertia = 0;
    this.dragging = false;
    this.lastX = 0;
    this.visible = true;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { this.visible = es[0].isIntersecting; },
        { threshold: 0 }).observe(stage);
    }

    stage.addEventListener('pointerdown', e => {
      this.dragging = true; this.lastX = e.clientX;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', e => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      this.lastX = e.clientX;
      this.rot += dx * 0.28;
      this.inertia = dx * 0.28;
    });
    const end = () => { this.dragging = false; };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('mouseenter', () => { this.auto = this.baseAuto * 0.15; });
    stage.addEventListener('mouseleave', () => { this.auto = this.baseAuto; });

    const loop = () => {
      if (this.visible && !document.hidden) {
        if (!this.dragging) {
          this.rot += this.auto + this.inertia;
          this.inertia *= 0.94;
        }
        this.ring.style.transform = `rotateX(-9deg) rotateY(${this.rot.toFixed(2)}deg)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

/* ── boot ─────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const heroCanvas = document.getElementById('hero3d');
  if (heroCanvas) window.__hero3d = new Hero3D(heroCanvas);

  const bgCanvas = document.getElementById('bg-particles');
  if (bgCanvas) window.__particles = new ParticleNetwork(bgCanvas);

  const rainCanvas = document.getElementById('matrix-rain');
  if (rainCanvas) window.__rain = new MatrixRain(rainCanvas);

  const ocStage = document.getElementById('oc-stage');
  const ocRing = document.getElementById('oc-ring');
  if (ocStage && ocRing) window.__carousel = new IconCarousel(ocStage, ocRing);
});
