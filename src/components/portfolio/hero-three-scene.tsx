"use client";

import { useEffect, useRef } from "react";
import type { HeroThreeSceneProps } from "@/types/hero-three.types";

/* ── counts ──────────────────────────────────────────────────────── */
const COUNT_DESKTOP = 155;
const COUNT_MOBILE  = 68;
const ANCHOR_COUNT  = 6;

/* ── physics ─────────────────────────────────────────────────────── */
const CONNECT_DIST = 118;
const MAX_SPEED    = 12.0;
const DAMPING      = 0.940;
const ORBIT_SPRING = 0.18;   // radial spring force toward orbital radius
const ORBIT_TANG   = 1.2;    // tangential force (CCW orbital velocity)

/* ── burst ───────────────────────────────────────────────────────── */
const BURST_COOLDOWN = 90;   // frames (~1.5 s) — short so orbits resume fast

/* ── scan sweep ──────────────────────────────────────────────────── */
const SCAN_INTERVAL = 680;
const SCAN_SPEED    = 4.2;

/* ── palette ─────────────────────────────────────────────────────── */
const NODE_PALETTE: [number, number, number][] = [
  [34,  211, 238],
  [56,  189, 248],
  [96,  165, 250],
  [125, 211, 252],
  [255, 255, 255],
  [147, 197, 253],
  [103, 232, 249],
];

/* ── types ───────────────────────────────────────────────────────── */
interface P {
  x: number; y: number;
  vx: number; vy: number;
  r: number; g: number; b: number;
  sz: number;
  isAnchor: boolean;
  na: number;      // noise angle
  ns: number;      // noise speed
  ex: number;      // excitation 0→1
  bv: number;      // blast velocity
  phase: number;   // orbit arc phase offset
  pingT: number;   // -1 = idle, 0→1 = expanding ping ring
  orbitR: number;  // target orbital radius around cursor
}

/* ── factory ─────────────────────────────────────────────────────── */
function mkP(W: number, Hc: number, idx: number, isAnchor: boolean): P {
  const col  = NODE_PALETTE[idx % NODE_PALETTE.length];
  const pers = Math.random();
  return {
    x: Math.random() * W,
    y: Math.random() * Hc,
    vx: (Math.random() - 0.5) * 1.0,
    vy: (Math.random() - 0.5) * 1.0,
    r: col[0], g: col[1], b: col[2],
    sz: isAnchor ? 1.7 + Math.random() * 0.6 : 0.65 + Math.random() * 0.85,
    isAnchor,
    na: Math.random() * Math.PI * 2,
    ns: isAnchor ? 0.002 + pers * 0.003 : 0.005 + pers * 0.011,
    ex: 0, bv: 0,
    phase: Math.random() * Math.PI * 2,
    pingT: -1,
    /* anchors orbit closer; regular particles spread across a wide ring band */
    orbitR: isAnchor ? 60 + Math.random() * 130 : 70 + Math.random() * 400,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════ */
export function HeroThreeScene({ className }: HeroThreeSceneProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef({ x: -9999, y: -9999, active: false });
  const rafId      = useRef<number>(0);
  const pts        = useRef<P[]>([]);
  const frameN     = useRef(0);
  const blastCD    = useRef(0);
  const scanY      = useRef(-60);
  const scanActive = useRef(false);
  const scanTimer  = useRef(280);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches
                  || window.innerWidth < 768;
    const COUNT = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;

    let W = 0, Hc = 0, dpr = 1;

    function resize() {
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio ?? 1, 2);
      const pw = canvas!.offsetWidth  || window.innerWidth;
      const ph = canvas!.offsetHeight || window.innerHeight;
      W = pw; Hc = ph;
      canvas!.width  = pw * dpr;
      canvas!.height = ph * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts.current = Array.from({ length: COUNT }, (_, i) =>
        mkP(W, Hc, i, i < ANCHOR_COUNT),
      );
    }

    const t0 = setTimeout(resize, 60);
    const ro  = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── event listeners ─────────────────────────────────────── */
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

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      explode(e.clientX - rect.left, e.clientY - rect.top);
    }
    function onTap(e: TouchEvent) {
      if (!e.changedTouches[0]) return;
      const rect = canvas!.getBoundingClientRect();
      explode(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
    }

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("click",      onClick, { passive: true });
    document.addEventListener("touchmove",  onTouch, { passive: true });
    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("touchend",   onLeave, { passive: true });
    document.addEventListener("touchend",   onTap,   { passive: true });

    /* ── repulsion burst ─────────────────────────────────────── */
    function explode(cx: number, cy: number) {
      blastCD.current = BURST_COOLDOWN;
      for (const p of pts.current) {
        const dx   = p.x - cx;
        const dy   = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx   = dist > 0.5 ? dx / dist : Math.cos((pts.current.indexOf(p) / pts.current.length) * Math.PI * 2);
        const ny   = dist > 0.5 ? dy / dist : Math.sin((pts.current.indexOf(p) / pts.current.length) * Math.PI * 2);
        const prox = Math.max(0, 1 - dist / Math.sqrt(W * W + Hc * Hc));
        const force = 9 + prox * 55;
        p.vx    = nx * force;
        p.vy    = ny * force;
        p.bv    = force * 1.1;
        p.ex    = Math.min(1, 0.3 + prox * 0.7);
        p.pingT = -1;
      }
    }

    /* ── main loop ───────────────────────────────────────────── */
    function tick() {
      if (!ctx || W === 0) { rafId.current = requestAnimationFrame(tick); return; }

      ctx.clearRect(0, 0, W, Hc);
      const f  = ++frameN.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const ps = pts.current;

      if (blastCD.current > 0) blastCD.current--;
      const pulling = blastCD.current === 0;

      const bootAlpha = Math.min(1, f / 90);

      /* scan sweep timer */
      if (!isMobile) {
        scanTimer.current++;
        if (!scanActive.current && scanTimer.current >= SCAN_INTERVAL) {
          scanActive.current = true;
          scanY.current      = -35;
          scanTimer.current  = 0;
        }
        if (scanActive.current) {
          scanY.current += SCAN_SPEED;
          if (scanY.current > Hc + 35) scanActive.current = false;
        }
      }

      /* ── physics ─────────────────────────────────────── */
      for (const p of ps) {
        if (!isFinite(p.x) || !isFinite(p.y)) {
          p.x = Math.random() * W; p.y = Math.random() * Hc;
          p.vx = 0; p.vy = 0; p.ex = 0; p.bv = 0; p.pingT = -1;
          continue;
        }

        /* noise drift */
        p.na += p.ns;
        const nf = p.isAnchor ? 0.022 : 0.055;
        p.vx  += Math.cos(p.na) * nf;
        p.vy  += Math.sin(p.na) * nf;
        p.vx  *= DAMPING;
        p.vy  *= DAMPING;

        /* orbital mechanics — each particle orbits cursor at its own radius */
        const dx   = mx - p.x, dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const cursorOn = pulling && isFinite(dist) && mouse.current.active && dist > 0;

        if (cursorOn) {
          const scale    = p.isAnchor ? 0.50 : 1.0;
          const radErr   = dist - p.orbitR;            // +: too far, −: too close
          const springK  = ORBIT_SPRING * scale;
          const tangK    = ORBIT_TANG   * scale;

          /* radial spring: pulls toward orbital shell */
          p.vx += (dx / dist) * springK * radErr;
          p.vy += (dy / dist) * springK * radErr;

          /* tangential: keeps particle orbiting CCW around cursor */
          p.vx += (-dy / dist) * tangK;
          p.vy += (dx  / dist) * tangK;

          p.ex = Math.min(1, p.ex + 0.07);
        } else {
          p.ex = Math.max(0, p.ex - (p.bv > 2 ? 0.007 : 0.022));
        }

        p.bv = Math.max(0, p.bv * 0.93);

        const cap = Math.max(MAX_SPEED * 2.0, p.bv);
        p.vx = Math.max(-cap, Math.min(cap, p.vx));
        p.vy = Math.max(-cap, Math.min(cap, p.vy));
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const ms  = Math.max(MAX_SPEED, p.bv * 0.55);
        if (spd > ms && spd > 0) { p.vx *= ms / spd; p.vy *= ms / spd; }

        /* soft walls */
        const mg = 28;
        if (p.x < mg)      p.vx += (mg - p.x) * 0.25;
        if (p.x > W - mg)  p.vx -= (p.x - W + mg) * 0.25;
        if (p.y < mg)      p.vy += (mg - p.y) * 0.25;
        if (p.y > Hc - mg) p.vy -= (p.y - Hc + mg) * 0.25;

        p.x += p.vx;
        p.y += p.vy;

        /* ambient ping */
        if (p.pingT < 0 && Math.random() < 0.00035) p.pingT = 0;
        if (p.pingT >= 0) {
          p.pingT += 0.026;
          if (p.pingT > 1) p.pingT = -1;
        }
      }

      /* ═══════════════════════════════════════════════
         DRAW
      ═══════════════════════════════════════════════ */
      ctx.save();
      ctx.globalAlpha = bootAlpha;

      /* ── scan sweep ────────────────────────────── */
      if (!isMobile && scanActive.current) {
        const sy = scanY.current;
        const sg = ctx.createLinearGradient(0, sy - 28, 0, sy + 14);
        sg.addColorStop(0,    "rgba(34,211,238,0)");
        sg.addColorStop(0.55, "rgba(34,211,238,0.048)");
        sg.addColorStop(1,    "rgba(34,211,238,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy - 28, W, 42);
        ctx.beginPath();
        ctx.moveTo(0, sy); ctx.lineTo(W, sy);
        ctx.strokeStyle = "rgba(34,211,238,0.10)";
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }

      /* ── connection edges — solid averaged color (no gradient alloc) ── */
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const ddx = a.x - b.x, ddy = a.y - b.y;
          const d2  = ddx * ddx + ddy * ddy;
          if (d2 > CONNECT_DIST * CONNECT_DIST) continue;

          const d      = Math.sqrt(d2);
          const t      = 1 - d / CONNECT_DIST;
          const ex     = (a.ex + b.ex) * 0.5;
          const hubMul = (a.isAnchor || b.isAnchor) ? 1.6 : 1.0;
          const alpha  = t * (0.09 + ex * 0.24) * hubMul;
          const mr     = (a.r + b.r) >> 1;
          const mg2    = (a.g + b.g) >> 1;
          const mb     = (a.b + b.b) >> 1;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${mr},${mg2},${mb},${alpha.toFixed(3)})`;
          ctx.lineWidth   = t * (0.55 + ex * 0.65);
          ctx.stroke();
        }
      }

      /* ── particle pings ──────────────────────────── */
      for (const p of ps) {
        if (p.pingT < 0) continue;
        const pingR = p.sz * (4 + p.pingT * 22);
        const pingA = (1 - p.pingT) * (p.isAnchor ? 0.38 : 0.22);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pingR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${pingA.toFixed(3)})`;
        ctx.lineWidth   = 0.55;
        ctx.stroke();
      }

      /* ── particles — two-circle glow (no radial gradient alloc) ─── */
      for (const p of ps) {
        if (!isFinite(p.x) || !isFinite(p.y)) continue;

        const ex   = Math.max(0, Math.min(1, p.ex));
        const size = Math.max(0.5, p.sz * (1 + ex * (p.isAnchor ? 0.45 : 0.85)));
        const op   = (p.isAnchor ? 0.78 : 0.58) + ex * 0.32;
        const glR  = Math.max(2, size * (p.isAnchor ? 3.8 : 2.6) + ex * 4.5);

        /* outer soft glow — simple filled circle, no gradient object */
        ctx.beginPath();
        ctx.arc(p.x, p.y, glR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(op * (p.isAnchor ? 0.10 : 0.07)).toFixed(3)})`;
        ctx.fill();

        /* mid glow */
        ctx.beginPath();
        ctx.arc(p.x, p.y, glR * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(op * (p.isAnchor ? 0.22 : 0.15)).toFixed(3)})`;
        ctx.fill();

        /* core */
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${op.toFixed(3)})`;
        ctx.fill();

        /* white-hot centre */
        if (ex > 0.35 || p.isAnchor) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${Math.min(0.88, (p.isAnchor ? 0.55 : ex) * 0.75).toFixed(3)})`;
          ctx.fill();
        }

        /* anchor: dual counter-rotating orbit arcs */
        if (p.isAnchor && !isMobile) {
          const ph1  = p.phase + f * 0.0085;
          const ph2  = p.phase - f * 0.0055;
          const arcA1 = 0.20 + ex * 0.14;
          const arcA2 = 0.12 + ex * 0.08;

          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 3.9, ph1, ph1 + Math.PI * 1.25);
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${arcA1.toFixed(3)})`;
          ctx.lineWidth   = 0.75;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 5.4, ph2, ph2 + Math.PI * 0.75);
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${arcA2.toFixed(3)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }

      ctx.restore();

      rafId.current = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      clearTimeout(t0);
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("click",      onClick);
      document.removeEventListener("touchmove",  onTouch);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("touchend",   onLeave);
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
