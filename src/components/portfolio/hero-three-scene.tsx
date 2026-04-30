"use client";

import { useEffect, useRef } from "react";
import type { HeroThreeSceneProps } from "@/types/hero-three.types";

/* ══════════════════════════════════════════════════════════════════
   RL PARTICLE SWARM — each dot is a tiny neural-net agent
   7 → 8 → 2  network, REINFORCE policy-gradient, 60 fps canvas
══════════════════════════════════════════════════════════════════ */

const IN  = 7;
const H   = 8;
const OUT = 2;
const W1_LEN   = IN * H;
const TOTAL_W  = W1_LEN + H * OUT + H + OUT;

const COUNT          = 110;
const ATTRACT_RADIUS = 480;
const CONNECT_DIST   = 110;
const MAX_SPEED      = 3.8;
const DAMPING        = 0.91;
const LR             = 0.04;
const UPDATE_EVERY   = 16;
const SIGMA          = 0.24;

/* Professional blue-cyan palette */
const PALETTE: [number, number, number][] = [
  [34,  211, 238],   // cyan-400
  [56,  189, 248],   // sky-400
  [125, 211, 252],   // sky-300
  [186, 230, 253],   // sky-200
  [255, 255, 255],   // white
  [99,  179, 237],   // blue-300
];

/* Firework spark palette — brighter, more saturated */
const SPARK_PALETTE: [number, number, number][] = [
  [255, 255, 255],   // white core
  [34,  211, 238],   // cyan
  [56,  189, 248],   // sky
  [125, 211, 252],   // sky-light
  [147, 197, 253],   // blue-300
  [165, 243, 252],   // cyan-200
  [224, 242, 254],   // sky-100
  [186, 230, 253],   // sky-200
];

function th(x: number) { return Math.tanh(x); }

function fwd(w: Float32Array, s: Float32Array, hid: Float32Array, out: Float32Array) {
  for (let j = 0; j < H; j++) {
    let v = w[W1_LEN + j];
    for (let i = 0; i < IN; i++) v += s[i] * w[i * H + j];
    hid[j] = th(v);
  }
  for (let k = 0; k < OUT; k++) {
    let v = w[W1_LEN + H + k];
    for (let j = 0; j < H; j++) v += hid[j] * w[W1_LEN + H + OUT + j * OUT + k];
    out[k] = th(v);
  }
}

function updW(w: Float32Array, s: Float32Array, a: Float32Array, mu: Float32Array, r: number) {
  if (r === 0) return;
  const d0 = (a[0] - mu[0]) / (SIGMA * SIGMA);
  const d1 = (a[1] - mu[1]) / (SIGMA * SIGMA);
  const g  = r * LR;
  for (let j = 0; j < H; j++) {
    w[W1_LEN + H + OUT + j * OUT    ] += g * d0 * s[j];
    w[W1_LEN + H + OUT + j * OUT + 1] += g * d1 * s[j];
  }
  for (let i = 0; i < IN; i++)
    for (let j = 0; j < H; j++) {
      const dh = (d0 * w[W1_LEN + H + OUT + j * OUT] + d1 * w[W1_LEN + H + OUT + j * OUT + 1]) * 0.3;
      w[i * H + j] += g * dh * s[i];
    }
  for (let k = 0; k < w.length; k++) {
    if (w[k] >  4) w[k] =  4;
    if (w[k] < -4) w[k] = -4;
  }
}

interface P {
  x: number; y: number; vx: number; vy: number;
  r: number; g: number; b: number;
  sz: number;
  pers: number;
  na: number; ns: number;
  w: Float32Array;
  st: Float32Array; hid: Float32Array; mu: Float32Array; ac: Float32Array;
  pd: number; rew: number; ex: number;
  bv: number;           // blast velocity cap (decays to 0)
  trail: { x: number; y: number; a: number }[];
}

/* Visual-only firework spark — no RL, just physics + gravity */
interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  r: number; g: number; b: number;
  life: number;       // 1 → 0
  decay: number;      // subtracted per frame
  sz: number;
  gravity: number;
  trail: { x: number; y: number }[];
}

function mkP(W: number, Hc: number, idx: number): P {
  const col  = PALETTE[idx % PALETTE.length];
  const pers = Math.random();
  return {
    x: Math.random() * W, y: Math.random() * Hc,
    vx: (Math.random() - 0.5) * 1.8,
    vy: (Math.random() - 0.5) * 1.8,
    r: col[0], g: col[1], b: col[2],
    sz: 0.7 + Math.random() * 1.1,
    pers,
    na: Math.random() * Math.PI * 2,
    ns: 0.006 + pers * 0.014,
    w:   new Float32Array(TOTAL_W).map(() => (Math.random() - 0.5) * 0.8),
    st:  new Float32Array(IN),
    hid: new Float32Array(H),
    mu:  new Float32Array(OUT),
    ac:  new Float32Array(OUT),
    pd: 9999, rew: 0, ex: 0, bv: 0,
    trail: [],
  };
}

export function HeroThreeScene({ className }: HeroThreeSceneProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef({ x: -9999, y: -9999, active: false });
  const rafId      = useRef<number>(0);
  const pts        = useRef<P[]>([]);
  const frame      = useRef(0);
  const sparks     = useRef<Spark[]>([]);
  const blastCD    = useRef(0);  // cursor-pull suppression countdown

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, Hc = 0, dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const el = canvas!;
      const pw = el.offsetWidth  || window.innerWidth;
      const ph = el.offsetHeight || window.innerHeight;
      W  = pw;
      Hc = ph;
      el.width  = pw * dpr;
      el.height = ph * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts.current = Array.from({ length: COUNT }, (_, i) => mkP(W, Hc, i));
    }

    const t0 = setTimeout(resize, 60);
    const ro  = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    function onTouch(e: TouchEvent) {
      if (!e.touches[0]) return;
      const rect = canvas!.getBoundingClientRect();
      mouse.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      };
    }
    function onLeave() { mouse.current = { ...mouse.current, active: false }; }

    /* ── firework explosion ─────────────────────────── */
    function explode(cx: number, cy: number) {
      const diag = Math.sqrt(W * W + Hc * Hc);

      /* suppress cursor pull so particles can fly freely */
      blastCD.current = 90;

      /* ── scatter ALL RL particles across the full screen ── */
      for (const p of pts.current) {
        const dx   = p.x - cx;
        const dy   = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dn   = Math.max(0, 1 - dist / diag);  // 1 at center, ~0 at far corner
        /* Quadratic at center, linear floor everywhere else so even distant particles scatter */
        const force = 18 + dn * dn * 80;
        const nx    = dist > 0.5 ? dx / dist : Math.cos(Math.random() * Math.PI * 2);
        const ny    = dist > 0.5 ? dy / dist : Math.sin(Math.random() * Math.PI * 2);
        /* Override velocity (set, don't add) for a clean radial burst */
        p.vx = nx * force * (0.7 + Math.random() * 0.6);
        p.vy = ny * force * (0.7 + Math.random() * 0.6);
        p.bv = force * 1.6;    // raise this particle's personal speed cap
        p.ex = Math.min(1, 0.4 + dn * 0.8);
      }

      /* ── primary burst sparks (evenly spaced angles) ── */
      const PRIMARY = 52;
      for (let i = 0; i < PRIMARY; i++) {
        const angle  = (i / PRIMARY) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const spd    = 14 + Math.random() * 22;
        const col    = SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)];
        const life   = 55 + Math.random() * 35;
        sparks.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          r: col[0], g: col[1], b: col[2],
          life: 1,
          decay: 1 / life,
          sz: 1.4 + Math.random() * 2.0,
          gravity: 0.08 + Math.random() * 0.10,
          trail: [],
        });
      }

      /* ── secondary short-range burst (inner corona) ── */
      const SECONDARY = 30;
      for (let i = 0; i < SECONDARY; i++) {
        const angle  = Math.random() * Math.PI * 2;
        const spd    = 5 + Math.random() * 12;
        const col    = SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)];
        const life   = 30 + Math.random() * 25;
        sparks.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          r: col[0], g: col[1], b: col[2],
          life: 1,
          decay: 1 / life,
          sz: 0.9 + Math.random() * 1.4,
          gravity: 0.05 + Math.random() * 0.08,
          trail: [],
        });
      }

      /* ── whisker streaks (long thin diagonal jets) ── */
      const WHISKERS = 14;
      for (let i = 0; i < WHISKERS; i++) {
        const angle  = (i / WHISKERS) * Math.PI * 2;
        const spd    = 22 + Math.random() * 16;
        const col: [number,number,number] = [255, 255, 255];  // white jets
        sparks.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          r: col[0], g: col[1], b: col[2],
          life: 1,
          decay: 1 / (22 + Math.random() * 12),
          sz: 0.7,
          gravity: 0.04,
          trail: [],
        });
      }

      /* limit total sparks to avoid perf hit on repeated clicks */
      if (sparks.current.length > 600) sparks.current.splice(0, sparks.current.length - 600);
    }

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      explode(e.clientX - rect.left, e.clientY - rect.top);
    }
    function onTap(e: TouchEvent) {
      if (!e.changedTouches[0]) return;
      const rect = canvas!.getBoundingClientRect();
      explode(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    }

    document.addEventListener("mousemove", onMove,  { passive: true });
    document.addEventListener("touchmove",  onTouch, { passive: true });
    document.addEventListener("touchend",   onLeave, { passive: true });
    document.addEventListener("click",      onClick, { passive: true });
    document.addEventListener("touchend",   onTap,   { passive: true });

    function tick() {
      if (!ctx || W === 0) { rafId.current = requestAnimationFrame(tick); return; }

      ctx.clearRect(0, 0, W, Hc);
      const f  = ++frame.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const doUpd = (f % UPDATE_EVERY) === 0;
      const ps = pts.current;

      if (blastCD.current > 0) blastCD.current--;
      const pulling = blastCD.current === 0;

      /* ── physics + NN ─────────────────────────────── */
      for (const p of ps) {
        if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.vx) || !isFinite(p.vy)) {
          p.x = Math.random() * W; p.y = Math.random() * Hc;
          p.vx = 0; p.vy = 0; p.ex = 0; p.bv = 0; p.trail = [];
          p.w.fill(0);
          continue;
        }

        const dx     = mx - p.x, dy = my - p.y;
        const dist   = Math.sqrt(dx * dx + dy * dy);
        const inRange = pulling && isFinite(dist) && dist < ATTRACT_RADIUS && mouse.current.active;

        const dn   = inRange ? dist / ATTRACT_RADIUS : 1;
        const ang  = inRange ? Math.atan2(dy, dx) : p.na;
        p.st[0] = Math.sin(ang);
        p.st[1] = Math.cos(ang);
        p.st[2] = inRange ? 1 - dn : 0;
        p.st[3] = Math.max(-1, Math.min(1, p.vx / MAX_SPEED));
        p.st[4] = Math.max(-1, Math.min(1, p.vy / MAX_SPEED));
        p.st[5] = p.x < 80 ? -1 : (p.x > W - 80 ? 1 : 0);
        p.st[6] = p.y < 80 ? -1 : (p.y > Hc - 80 ? 1 : 0);

        fwd(p.w, p.st, p.hid, p.mu);

        const mu0 = isFinite(p.mu[0]) ? Math.max(-1, Math.min(1, p.mu[0])) : 0;
        const mu1 = isFinite(p.mu[1]) ? Math.max(-1, Math.min(1, p.mu[1])) : 0;
        const ns  = inRange ? SIGMA * 0.3 : SIGMA;
        p.ac[0] = mu0 + (Math.random() - 0.5) * 2 * ns;
        p.ac[1] = mu1 + (Math.random() - 0.5) * 2 * ns;

        p.na += p.ns * (1 + p.pers * 0.5);

        /* RL wandering — scale down when blasted so explosion dominates */
        const asc = inRange ? 1.8 : (p.bv > 4 ? 0.2 : 1.2);
        p.vx = (p.vx + p.ac[0] * asc) * DAMPING;
        p.vy = (p.vy + p.ac[1] * asc) * DAMPING;

        /* cursor gravity — suppressed during blast cooldown */
        if (inRange && dist > 0) {
          const dn2  = dist / ATTRACT_RADIUS;
          const pull = (1 - dn2) * (1 - dn2) * 2.4;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
        }

        /* bv decays slower than before — particles stay fast for ~1.5s */
        p.bv = Math.max(0, p.bv * 0.93);

        /* velocity cap — raised while blast active */
        const hardCap = Math.max(MAX_SPEED * 2, p.bv);
        p.vx = Math.max(-hardCap, Math.min(hardCap, p.vx));
        p.vy = Math.max(-hardCap, Math.min(hardCap, p.vy));

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const ms  = Math.max(inRange ? MAX_SPEED * 1.8 : MAX_SPEED, p.bv);
        if (spd > ms && spd > 0) { p.vx *= ms / spd; p.vy *= ms / spd; }

        /* soft boundary walls */
        const mg = 30;
        if (p.x < mg)      p.vx += (mg - p.x)       * 0.09;
        if (p.x > W - mg)  p.vx -= (p.x - W + mg)   * 0.09;
        if (p.y < mg)      p.vy += (mg - p.y)        * 0.09;
        if (p.y > Hc - mg) p.vy -= (p.y - Hc + mg)  * 0.09;

        p.x += p.vx; p.y += p.vy;

        if (inRange) {
          p.rew = ((p.pd - dist) / ATTRACT_RADIUS) * 3.5 + (dist < 50 ? 1.0 : 0);
          p.ex  = Math.min(1, p.ex + 0.12);
        } else {
          p.rew = Math.min(spd / MAX_SPEED, 1) * 0.35;
          /* excited from blast: decay slower */
          p.ex  = Math.max(0, p.ex - (p.bv > 2 ? 0.008 : 0.03));
        }
        p.pd = isFinite(dist) ? dist : 9999;

        if (doUpd) updW(p.w, p.st, p.ac, p.mu, p.rew);

        /* longer trails during blast */
        const trailMax = p.bv > 4 ? 12 : 5;
        if (p.ex > 0.25) {
          p.trail.push({ x: p.x, y: p.y, a: p.ex });
          if (p.trail.length > trailMax) p.trail.shift();
        } else if (p.trail.length) p.trail.shift();
      }

      /* ── update & draw firework sparks ────────────── */
      const ss = sparks.current;
      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i];

        /* physics */
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 10) s.trail.shift();

        s.vx *= 0.95;   // spark air resistance
        s.vy *= 0.95;
        s.vy += s.gravity;  // gravity arc
        s.x  += s.vx;
        s.y  += s.vy;
        s.life -= s.decay;

        if (s.life <= 0) { ss.splice(i, 1); continue; }

        const l = Math.max(0, s.life);

        /* draw trail */
        if (s.trail.length > 1) {
          for (let t = 1; t < s.trail.length; t++) {
            const frac = t / s.trail.length;
            const ta   = frac * l * 0.65;
            const lw   = s.sz * frac * l * 0.9;
            if (lw < 0.05 || ta < 0.02) continue;
            ctx.beginPath();
            ctx.moveTo(s.trail[t - 1].x, s.trail[t - 1].y);
            ctx.lineTo(s.trail[t].x, s.trail[t].y);
            ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},${ta})`;
            ctx.lineWidth   = lw;
            ctx.stroke();
          }
        }

        /* glow halo around spark head */
        const haloR = s.sz * 3.5 * l;
        if (haloR > 0.5) {
          try {
            const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR);
            hg.addColorStop(0,   `rgba(${s.r},${s.g},${s.b},${l * 0.55})`);
            hg.addColorStop(0.5, `rgba(${s.r},${s.g},${s.b},${l * 0.15})`);
            hg.addColorStop(1,   `rgba(${s.r},${s.g},${s.b},0)`);
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloR, 0, Math.PI * 2);
            ctx.fillStyle = hg;
            ctx.fill();
          } catch { /* degenerate */ }
        }

        /* bright core dot */
        const coreR = Math.max(0.3, s.sz * l);
        ctx.beginPath();
        ctx.arc(s.x, s.y, coreR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${Math.min(1, l * 1.1)})`;
        ctx.fill();

        /* white hot centre on bright sparks */
        if (l > 0.55 && s.sz > 1.0) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, coreR * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(l - 0.55) * 1.8})`;
          ctx.fill();
        }
      }

      /* ── draw RL particle trails ───────────────────── */
      for (const p of ps) {
        if (p.trail.length < 2) continue;
        for (let i = 1; i < p.trail.length; i++) {
          const t = p.trail[i];
          ctx.beginPath();
          ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${(i / p.trail.length) * t.a * 0.22})`;
          ctx.lineWidth = p.sz * 0.45;
          ctx.stroke();
        }
      }

      /* ── draw connections ──────────────────────────── */
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const ddx = a.x - b.x, ddy = a.y - b.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 > CONNECT_DIST * CONNECT_DIST) continue;
          const t   = 1 - Math.sqrt(d2) / CONNECT_DIST;
          const ex  = (a.ex + b.ex) * 0.5;
          const alpha = t * (0.12 + ex * 0.18);
          const mr  = (a.r + b.r) >> 1, mg2 = (a.g + b.g) >> 1, mb = (a.b + b.b) >> 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${mr},${mg2},${mb},${alpha})`;
          ctx.lineWidth = t * (0.5 + ex * 0.5);
          ctx.stroke();
        }
      }

      /* ── draw RL particles ─────────────────────────── */
      for (const p of ps) {
        if (!isFinite(p.x) || !isFinite(p.y)) continue;

        const ex   = Math.max(0, Math.min(1, p.ex));
        const size = Math.max(0.4, p.sz * (1 + ex * 0.8));
        const op   = 0.55 + ex * 0.35;
        const glR  = Math.max(1, size * (2.2 + ex * 3.5));

        try {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glR);
          grd.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${op * 0.38})`);
          grd.addColorStop(0.45, `rgba(${p.r},${p.g},${p.b},${op * 0.10})`);
          grd.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        } catch { /* ignore */ }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${op})`;
        ctx.fill();

        if (ex > 0.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${Math.min(0.7, (ex - 0.6) * 0.9)})`;
          ctx.fill();
        }
      }

      /* ── cursor aura ───────────────────────────────── */
      if (pulling && mouse.current.active && isFinite(mx) && isFinite(my) && mx > 0 && mx < W && my > 0 && my < Hc) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, 90);
        aura.addColorStop(0,   "rgba(34,211,238,0.07)");
        aura.addColorStop(0.5, "rgba(34,211,238,0.02)");
        aura.addColorStop(1,   "rgba(34,211,238,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 90, 0, Math.PI * 2);
        ctx.fillStyle = aura;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      clearTimeout(t0);
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove",  onTouch);
      document.removeEventListener("touchend",   onLeave);
      document.removeEventListener("click",      onClick);
      document.removeEventListener("touchend",   onTap);
    };
  }, []);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
