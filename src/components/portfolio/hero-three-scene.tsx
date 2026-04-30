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

const COUNT          = 120;
const ATTRACT_RADIUS = 420;
const CONNECT_DIST   = 130;
const MAX_SPEED      = 3.6;
const DAMPING        = 0.91;
const LR             = 0.04;
const UPDATE_EVERY   = 16;
const SIGMA          = 0.24;

const PALETTE: [number, number, number][] = [
  [34,  211, 238],   // cyan-400
  [52,  211, 153],   // emerald-400
  [167, 139, 250],   // violet-400
  [250, 204,  21],   // amber-400
  [251, 113, 133],   // rose-400
  [255, 255, 255],   // white
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
  sz: number;           // base radius (px, logical)
  pers: number;
  na: number; ns: number;
  w: Float32Array;
  st: Float32Array; hid: Float32Array; mu: Float32Array; ac: Float32Array;
  pd: number; rew: number; ex: number;
  trail: { x: number; y: number; a: number }[];
}

function mkP(W: number, Hc: number, idx: number): P {
  const col  = PALETTE[idx % PALETTE.length];
  const pers = Math.random();
  return {
    x: Math.random() * W, y: Math.random() * Hc,
    vx: (Math.random() - 0.5) * 1.8,
    vy: (Math.random() - 0.5) * 1.8,
    r: col[0], g: col[1], b: col[2],
    sz: 2.5 + Math.random() * 3,      // 2.5 – 5.5 px logical radius
    pers,
    na: Math.random() * Math.PI * 2,
    ns: 0.006 + pers * 0.014,
    w:   new Float32Array(TOTAL_W).map(() => (Math.random() - 0.5) * 0.8),
    st:  new Float32Array(IN),
    hid: new Float32Array(H),
    mu:  new Float32Array(OUT),
    ac:  new Float32Array(OUT),
    pd: 9999, rew: 0, ex: 0,
    trail: [],
  };
}

export function HeroThreeScene({ className }: HeroThreeSceneProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef({ x: -9999, y: -9999, active: false });
  const rafId      = useRef<number>(0);
  const pts        = useRef<P[]>([]);
  const frame      = useRef(0);

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

    /* Delay first resize so layout is settled */
    const t0 = setTimeout(resize, 60);
    const ro  = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    document.addEventListener("mousemove", onMove, { passive: true });

    function tick() {
      if (!ctx || W === 0) { rafId.current = requestAnimationFrame(tick); return; }

      ctx.clearRect(0, 0, W, Hc);
      const f  = ++frame.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const doUpd = (f % UPDATE_EVERY) === 0;
      const ps = pts.current;

      /* ── physics + NN ─────────────────────────────── */
      for (const p of ps) {
        /* Hard reset if position went non-finite (NN weight explosion) */
        if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.vx) || !isFinite(p.vy)) {
          p.x = Math.random() * W; p.y = Math.random() * Hc;
          p.vx = 0; p.vy = 0; p.ex = 0; p.trail = [];
          p.w.fill(0); // reset weights to avoid repeated explosion
          continue;
        }

        const dx    = mx - p.x, dy = my - p.y;
        const dist  = Math.sqrt(dx * dx + dy * dy);
        const inRange = isFinite(dist) && dist < ATTRACT_RADIUS && mouse.current.active;

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

        /* Clamp NN output so it can never produce non-finite acceleration */
        const mu0 = isFinite(p.mu[0]) ? Math.max(-1, Math.min(1, p.mu[0])) : 0;
        const mu1 = isFinite(p.mu[1]) ? Math.max(-1, Math.min(1, p.mu[1])) : 0;
        const ns  = inRange ? SIGMA * 0.3 : SIGMA;
        p.ac[0] = mu0 + (Math.random() - 0.5) * 2 * ns;
        p.ac[1] = mu1 + (Math.random() - 0.5) * 2 * ns;

        p.na += p.ns * (1 + p.pers * 0.5);

        const asc = inRange ? 3.0 : 1.2;
        p.vx = (p.vx + p.ac[0] * asc) * DAMPING;
        p.vy = (p.vy + p.ac[1] * asc) * DAMPING;

        /* Hard clamp velocity before sqrt to avoid NaN */
        p.vx = Math.max(-MAX_SPEED * 2, Math.min(MAX_SPEED * 2, p.vx));
        p.vy = Math.max(-MAX_SPEED * 2, Math.min(MAX_SPEED * 2, p.vy));

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const ms  = inRange ? MAX_SPEED * 1.5 : MAX_SPEED;
        if (spd > ms && spd > 0) { p.vx *= ms / spd; p.vy *= ms / spd; }

        const mg = 30;
        if (p.x < mg)      p.vx += (mg - p.x)       * 0.09;
        if (p.x > W - mg)  p.vx -= (p.x - W + mg)   * 0.09;
        if (p.y < mg)      p.vy += (mg - p.y)        * 0.09;
        if (p.y > Hc - mg) p.vy -= (p.y - Hc + mg)  * 0.09;

        p.x += p.vx; p.y += p.vy;

        /* reward */
        if (inRange) {
          p.rew = ((p.pd - dist) / ATTRACT_RADIUS) * 3.5 + (dist < 60 ? 0.8 : 0);
          p.ex  = Math.min(1, p.ex + 0.09);
        } else {
          p.rew = Math.min(spd / MAX_SPEED, 1) * 0.35;
          p.ex  = Math.max(0, p.ex - 0.025);
        }
        p.pd = isFinite(dist) ? dist : 9999;

        if (doUpd) updW(p.w, p.st, p.ac, p.mu, p.rew);

        /* trail */
        if (p.ex > 0.2) {
          p.trail.push({ x: p.x, y: p.y, a: p.ex });
          if (p.trail.length > 9) p.trail.shift();
        } else if (p.trail.length) p.trail.shift();
      }

      /* ── draw trails ───────────────────────────────── */
      for (const p of ps) {
        if (p.trail.length < 2) continue;
        for (let i = 1; i < p.trail.length; i++) {
          const t = p.trail[i];
          ctx.beginPath();
          ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${(i / p.trail.length) * t.a * 0.4})`;
          ctx.lineWidth = p.sz * 0.55;
          ctx.stroke();
        }
      }

      /* ── draw connections ──────────────────────────── */
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > CONNECT_DIST * CONNECT_DIST) continue;
          const t   = 1 - Math.sqrt(d2) / CONNECT_DIST;
          const ex  = (a.ex + b.ex) * 0.5;
          const alpha = t * (0.22 + ex * 0.35);   // more visible lines
          const mr  = (a.r + b.r) >> 1, mg2 = (a.g + b.g) >> 1, mb = (a.b + b.b) >> 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${mr},${mg2},${mb},${alpha})`;
          ctx.lineWidth = t * (1 + ex);
          ctx.stroke();
        }
      }

      /* ── draw particles ────────────────────────────── */
      for (const p of ps) {
        /* Skip any particle whose position is still bad */
        if (!isFinite(p.x) || !isFinite(p.y)) continue;

        const ex   = Math.max(0, Math.min(1, p.ex));
        const size = Math.max(0.5, p.sz * (1 + ex * 1.2));
        const op   = 0.65 + ex * 0.35;
        const glR  = Math.max(1, size * (3.5 + ex * 5.5));

        /* outer glow */
        try {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glR);
          grd.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${op * 0.55})`);
          grd.addColorStop(0.45, `rgba(${p.r},${p.g},${p.b},${op * 0.18})`);
          grd.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        } catch { /* ignore degenerate gradient */ }

        /* core */
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${op})`;
        ctx.fill();

        /* hot centre when excited */
        if (ex > 0.45) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${Math.min(1, (ex - 0.45) * 1.1)})`;
          ctx.fill();
        }
      }

      /* ── cursor aura ───────────────────────────────── */
      if (mouse.current.active && isFinite(mx) && isFinite(my) && mx > 0 && mx < W && my > 0 && my < Hc) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, 110);
        aura.addColorStop(0,   "rgba(34,211,238,0.10)");
        aura.addColorStop(0.5, "rgba(34,211,238,0.04)");
        aura.addColorStop(1,   "rgba(34,211,238,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 110, 0, Math.PI * 2);
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
