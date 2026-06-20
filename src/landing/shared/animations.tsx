import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { c } from "../constants/palette";

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 200,
      background: "linear-gradient(90deg, #C98B5C, #D4A570, #E8CCA0)",
      scaleX, transformOrigin: "0%" }} />
  );
}

// ─── Floating Ambient Orb ─────────────────────────────────────────────────────
export function FloatingOrb({ size, x, y, delay, color }: { size: number; x: string; y: string; delay: number; color: string }) {
  return (
    <motion.div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", left: x, top: y, background: color, filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }}
      animate={{ x: [0, 38, -22, 0], y: [0, -46, 28, 0], scale: [1, 1.22, 0.88, 1], opacity: [0.18, 0.32, 0.18] }}
      transition={{ duration: 14 + delay * 4, delay, repeat: Infinity, ease: "easeInOut" }} />
  );
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────
export function FadeUp({ children, delay = 0, className = "", style }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }} className={className} style={style}>
      {children}
    </motion.div>
  );
}

// ─── RevealText — texto que sube desde detrás del borde (clip reveal) ─────────
export function RevealText({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <span ref={ref} style={{ display: "block", overflow: "hidden", ...style }}>
      <motion.span style={{ display: "block" }}
        initial={{ y: "108%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}

// ─── StaggerGrid — envuelve hijos con stagger automático ──────────────────────
export const itemVariant = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function StaggerGrid({ children, stagger = 0.1, delay = 0, className = "", style }: {
  children: React.ReactNode; stagger?: number; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {children}
    </motion.div>
  );
}

// ─── SlideIn ──────────────────────────────────────────────────────────────────
export function SlideIn({ children, from = "left", delay = 0, style }: {
  children: React.ReactNode; from?: "left" | "right"; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
export function TiltCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: y * -12, y: x * 12, shine: { x: (x + 0.5) * 100, y: (y + 0.5) * 100 } });
  };
  const reset = () => setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  return (
    <motion.div ref={ref} style={{ ...style, transformStyle: "preserve-3d", position: "relative", overflow: "hidden" }} className={className}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
      onMouseMove={handleMove} onMouseLeave={reset} whileHover={{ scale: 1.022 }}>
      {children}
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: `radial-gradient(circle at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(255,255,255,0.09) 0%, transparent 58%)`,
        transition: "background 0.15s" }} />
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
export function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => { cur += step; if (cur >= target) { setN(target); clearInterval(t); } else setN(cur); }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// ─── Divider Line ─────────────────────────────────────────────────────────────
export function DividerLine({ color = c.gold, delay = 0 }: { color?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", display: "flex", justifyContent: "center", marginBottom: 28 }}>
      <motion.div style={{ height: 2, borderRadius: 999, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, width: 80 }}
        initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
export function SectionLabel({ text, color, delay = 0 }: { text: string; color: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", marginBottom: 12 }}>
      <motion.p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color }}
        initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
        {text}
      </motion.p>
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
export function Carousel({ children, cardWidth = 300, gap = 24 }: {
  children: React.ReactNode[]; cardWidth?: number; gap?: number;
}) {
  const [idx, setIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = wrapRef.current?.offsetWidth ?? 900;
      setVisible(Math.max(1, Math.floor((w + gap) / (cardWidth + gap))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cardWidth, gap]);

  const maxIdx = Math.max(0, children.length - visible);
  const cur    = Math.min(idx, maxIdx);
  const offset = cur * (cardWidth + gap);
  const prev   = () => setIdx(i => Math.max(0, i - 1));
  const next   = () => setIdx(i => Math.min(maxIdx, i + 1));

  const btnBase: React.CSSProperties = {
    position: "absolute", top: "42%", transform: "translateY(-50%)",
    width: 42, height: 42, borderRadius: "50%",
    border: "1px solid rgba(201,139,92,0.22)",
    cursor: "pointer", backdropFilter: "blur(12px)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 10, transition: "opacity 0.2s",
    background: "rgba(255,248,240,0.90)",
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", paddingBottom: maxIdx > 0 ? 52 : 0 }}>
      <div style={{ overflow: "hidden", borderRadius: 4 }}>
        <motion.div style={{ display: "flex", gap, userSelect: "none", cursor: "grab" }}
          animate={{ x: -offset }} transition={{ type: "spring", stiffness: 280, damping: 32 }}
          drag="x" dragConstraints={{ left: -(maxIdx * (cardWidth + gap)), right: 0 }} dragElastic={0.07}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80 && cur < maxIdx) next();
            else if (info.offset.x > 80 && cur > 0) prev();
          }} whileTap={{ cursor: "grabbing" }}>
          {children.map((child, i) => <div key={i} style={{ minWidth: cardWidth, flexShrink: 0 }}>{child}</div>)}
        </motion.div>
      </div>

      {maxIdx > 0 && (
        <>
          <motion.button onClick={prev} style={{ ...btnBase, left: -18, opacity: cur === 0 ? 0.28 : 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}>
            <svg width="16" height="16" fill="none" stroke={c.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </motion.button>
          <motion.button onClick={next} style={{ ...btnBase, right: -18, opacity: cur === maxIdx ? 0.28 : 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}>
            <svg width="16" height="16" fill="none" stroke={c.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </motion.button>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7 }}>
            {Array.from({ length: maxIdx + 1 }, (_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{ height: 7, borderRadius: 999, border: "none", cursor: "pointer", padding: 0, transition: "all 0.32s", width: i === cur ? 28 : 7,
                background: i === cur ? c.accent : "rgba(201,139,92,0.22)",
                opacity: i === cur ? 1 : 0.55 }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
