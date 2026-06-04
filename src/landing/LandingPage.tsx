import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Wind, Leaf, Sparkles, Heart, MapPin, Camera,
  MessageCircle, Menu, X, ArrowRight, Music2, Droplets, Star,
} from "lucide-react";
import { ContactForm } from "./ContactForm";
import { useFerias } from "../hooks/useFerias";
import { useProductos } from "../hooks/useProductos";
import { useGaleria }   from "../hooks/useGaleria";
import type { Feria } from "../types";

// ─── Palette ──────────────────────────────────────────────────────────────────
const c = {
  charcoal:   "#1e1d1b",
  forest:     "#263d29",
  olive:      "#4a5e40",
  moss:       "#6b7c5e",
  walnut:     "#5a3e2b",
  taupe:      "#9e8e7e",
  sand:       "#c8bba8",
  linen:      "#e8e2d9",
  parchment:  "#f2ede6",
  terracotta: "#b5614a",
  clay:       "#c98a6e",
  gold:       "#b8976a",
  goldLight:  "#d4b88a",
};

// ─── Hardcoded fallbacks (mientras no hay datos en Supabase) ──
const FERIAS_DEFAULT = [
  { id: "1", nombre: "Multicentro", ciudad: "Bogotá", dias_horario: "Jue – Dom", activa: true, centro_comercial: "Multicentro", created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 0 },
  { id: "2", nombre: "Titán Plaza", ciudad: "Bogotá", dias_horario: "Vie – Dom", activa: true, centro_comercial: "Titán Plaza", created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 1 },
  { id: "3", nombre: "Hayuelos",    ciudad: "Bogotá", dias_horario: "Sáb – Dom", activa: true, centro_comercial: "Hayuelos",    created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 2 },
  { id: "4", nombre: "Mallplaza",   ciudad: "Bogotá", dias_horario: "Vie – Dom", activa: true, centro_comercial: "Mallplaza",   created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 3 },
] as Feria[];

const STATS = [
  { value: 1200, suffix: "+", label: "Clientes felices"   },
  { value: 8,    suffix: "",  label: "Ciudades"           },
  { value: 3500, suffix: "+", label: "Productos vendidos" },
];

const BENEFITS = [
  { icon: Wind,     title: "Relajación",        desc: "Crea un ambiente de calma y tranquilidad en cualquier espacio de tu hogar.",       color: c.moss,       bg: "rgba(107,124,94,0.12)"  },
  { icon: Sparkles, title: "Ambiente aesthetic", desc: "Diseños elegantes que se integran perfectamente a tu decoración interior.",         color: c.gold,       bg: "rgba(184,151,106,0.12)" },
  { icon: Leaf,     title: "Aromaterapia",       desc: "Esencias 100% naturales que estimulan tus sentidos y elevan tu ánimo.",             color: c.olive,      bg: "rgba(74,94,64,0.12)"    },
  { icon: Heart,    title: "Bienestar diario",   desc: "Un ritual de bienestar que transforma tu rutina en una experiencia de lujo.",       color: c.terracotta, bg: "rgba(181,97,74,0.10)"   },
];

const PRODUCTS_DEFAULT = [
  { type: "humidifier" as const, title: "Humidificadores",     tag: "Más vendido", desc: "Tecnología ultrasónica silenciosa que transforma el ambiente de cualquier habitación con una neblina suave y reconfortante." },
  { type: "diffuser"   as const, title: "Difusores de aroma",  tag: "Aesthetic",   desc: "Diseñados para dispersar tus esencias favoritas de forma uniforme, creando una atmósfera sensorial única y envolvente." },
  { type: "kit"        as const, title: "Kits de aromaterapia",tag: "Kit completo", desc: "Sets completos con difusor y esencias seleccionadas para comenzar tu experiencia de bienestar desde el primer día." },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "", style }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }} className={className} style={style}>
      {children}
    </motion.div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setN(target); clearInterval(t); }
      else setN(cur);
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Vapor({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div className="absolute bottom-8 rounded-full pointer-events-none"
      style={{ left: `${x}%`, width: size, height: size * 2.5, background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)", filter: "blur(7px)" }}
      animate={{ y: [-10, -130], opacity: [0, 0.7, 0], scale: [0.6, 1.4, 0.8] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

// ─── Hero Device ──────────────────────────────────────────────────────────────
function HeroDevice() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 480, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(74,94,64,0.20) 0%, transparent 70%)" }} />
      <motion.div style={{ position: "relative", zIndex: 10 }} animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        {[{ delay: 0, x: 44, size: 15 }, { delay: 0.8, x: 50, size: 22 }, { delay: 1.7, x: 56, size: 13 }].map((v, i) => <Vapor key={i} {...v} />)}
        <div style={{ position: "relative", width: 172, height: 232, margin: "0 auto" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 52, background: "linear-gradient(160deg, #3d5240 0%, #263d29 40%, #1e2d20 100%)", boxShadow: "0 32px 64px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.20), inset 0 2px 4px rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", width: 136, height: 26, borderRadius: 999, background: "linear-gradient(180deg, #7a5a3a 0%, #5a3e2b 100%)", boxShadow: "0 4px 12px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", width: 78, height: 38, borderRadius: 999, background: "linear-gradient(160deg, #4a5e40 0%, #263d29 100%)", boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 3px rgba(255,255,255,0.08)" }} />
          <motion.div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", width: 116, height: 8, borderRadius: 999, background: "radial-gradient(ellipse, rgba(184,151,106,0.6) 0%, transparent 70%)", filter: "blur(4px)" }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
          />
          <div style={{ position: "absolute", top: 86, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", justifyContent: "center", width: 100 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.18em", fontWeight: 600, color: "rgba(232,226,217,0.35)" }}>AROMATICCOL</span>
          </div>
        </div>
      </motion.div>
      <motion.div style={{ position: "absolute", top: 32, left: 0, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 16, background: "rgba(30,29,27,0.82)", backdropFilter: "blur(16px)", border: "1px solid rgba(200,187,168,0.18)", boxShadow: "0 8px 32px rgba(0,0,0,0.28)" }}
        animate={{ y: [0, -8, 0] }} transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(74,94,64,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Leaf size={13} style={{ color: c.goldLight }} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: c.linen }}>Aromaterapia</p>
          <p style={{ fontSize: 10, color: c.taupe }}>100% natural</p>
        </div>
      </motion.div>
      <motion.div style={{ position: "absolute", bottom: 48, right: 0, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 16, background: "rgba(30,29,27,0.82)", backdropFilter: "blur(16px)", border: "1px solid rgba(200,187,168,0.18)", boxShadow: "0 8px 32px rgba(0,0,0,0.28)" }}
        animate={{ y: [0, -10, 0] }} transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(184,151,106,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Droplets size={13} style={{ color: c.gold }} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: c.linen }}>Humedad ideal</p>
          <p style={{ fontSize: 10, color: c.taupe }}>Ultrasónico</p>
        </div>
      </motion.div>
      <motion.div style={{ position: "absolute", top: "44%", right: 4, display: "flex", alignItems: "center", gap: 5, padding: "7px 11px", borderRadius: 12, background: "rgba(184,151,106,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(184,151,106,0.30)" }}
        animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, delay: 2, repeat: Infinity, ease: "easeInOut" }}>
        <Star size={11} style={{ color: c.gold }} fill={c.gold} />
        <span style={{ fontSize: 10, fontWeight: 600, color: c.goldLight }}>Premium</span>
      </motion.div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const goto = (id: string) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const links = ["Inicio", "Productos", "Ferias", "Contacto"];

  return (
    <>
      <motion.nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? "rgba(30,29,27,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(200,187,168,0.12)" : "none", boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.28)" : "none", transition: "all 0.4s ease" }}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="wrap" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.olive}, ${c.moss})` }}>
              <Leaf size={15} color="#e8e2d9" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: c.linen }}>Aromaticcol</span>
          </a>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
            {links.map(l => (
              <button key={l} onClick={() => goto(l)} style={{ fontSize: 14, fontWeight: 500, color: "rgba(232,226,217,0.75)", background: "none", border: "none", cursor: "pointer", opacity: 1 }}
                onMouseEnter={e => (e.currentTarget.style.color = c.linen)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,226,217,0.75)")}
              >{l}</button>
            ))}
          </div>
          <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
            style={{ display: "none", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", color: c.linen, background: `linear-gradient(135deg, ${c.terracotta}, #c07060)`, boxShadow: "0 4px 16px rgba(181,97,74,0.35)" }}
            className="hidden md:flex">
            <MessageCircle size={15} /> Escríbenos
          </a>
          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: c.linen, padding: 6 }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", flexDirection: "column", padding: "80px 24px 32px", background: "rgba(30,29,27,0.97)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
              {links.map((l, i) => (
                <motion.button key={l} onClick={() => goto(l)}
                  style={{ textAlign: "left", fontSize: 24, fontWeight: 600, padding: "16px 0", color: c.linen, background: "none", border: "none", borderBottom: "1px solid rgba(200,187,168,0.15)", cursor: "pointer" }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                >{l}</motion.button>
              ))}
            </div>
            <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
              style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 24px", borderRadius: 16, fontSize: 15, fontWeight: 600, textDecoration: "none", color: c.linen, background: `linear-gradient(135deg, ${c.terracotta}, #c07060)` }}>
              <MessageCircle size={18} /> Escríbenos por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero Slideshow ───────────────────────────────────────────────────────────
function HeroSlideshow({ images }: { images: { id: string; url: string; nombre: string | null }[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div style={{ position: "relative", width: "100%", height: 520, borderRadius: 32, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.3)" }}>
      <AnimatePresence mode="sync">
        <motion.img key={current} src={images[current].url} alt={images[current].nombre ?? ""}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          initial={{ opacity: 0, scale: 1.07 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </AnimatePresence>

      {/* Gradient overlays for depth */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,46,28,0.75) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,46,28,0.25) 0%, transparent 40%)", pointerEvents: "none" }} />

      {/* Floating stat badge */}
      <motion.div style={{ position: "absolute", top: 22, left: 22, display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderRadius: 18, background: "rgba(30,29,27,0.78)", backdropFilter: "blur(18px)", border: "1px solid rgba(200,187,168,0.18)", boxShadow: "0 8px 32px rgba(0,0,0,0.28)" }}
        animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(184,151,106,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Star size={13} style={{ color: c.gold }} fill={c.gold} />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: c.linen }}>4.9 · Muy bien calificado</p>
          <p style={{ fontSize: 11, color: c.taupe }}>+1,200 hogares transformados</p>
        </div>
      </motion.div>

      {/* Aroma badge */}
      <motion.div style={{ position: "absolute", top: 22, right: 22, display: "flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 999, background: "rgba(184,151,106,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(184,151,106,0.35)" }}
        animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}>
        <Leaf size={12} style={{ color: c.goldLight }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: c.goldLight }}>100% Natural</span>
      </motion.div>

      {/* Dots */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ height: 5, borderRadius: 99, border: "none", cursor: "pointer", padding: 0, transition: "width 0.4s, opacity 0.4s", width: i === current ? 28 : 6, background: "rgba(232,226,217,0.9)", opacity: i === current ? 1 : 0.4 }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { items: galeriaItems } = useGaleria();
  const heroImages = galeriaItems.slice(0, 8);
  const hasImages  = heroImages.length > 0;

  return (
    <section id="inicio" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #1a2e1c 0%, #263d29 45%, #1e2d20 100%)" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 560, height: 560, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(74,94,64,0.25) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 380, height: 380, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(181,97,74,0.12) 0%, transparent 70%)", transform: "translate(-30%,30%)" }} />

      <div className="wrap" style={{ paddingTop: 96, paddingBottom: 64, display: "grid", gap: 56, alignItems: "center", width: "100%", gridTemplateColumns: "1fr" }}>
        {/* ── Texto ── */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: 540 }} className="hero-left">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, marginBottom: 28, fontSize: 13, fontWeight: 600, background: "rgba(107,124,94,0.18)", color: c.goldLight, border: "1px solid rgba(184,151,106,0.30)" }}>
            <Sparkles size={13} /> Aromaterapia de calidad premium
          </motion.div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.8rem, 6vw, 5.2rem)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, color: c.linen }}>
            Transforma<br />tu espacio<br />
            <span style={{ color: c.goldLight }}>con aroma</span>
            <span style={{ color: c.terracotta }}>terapia ✨</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 40, color: "rgba(232,226,217,0.68)", fontWeight: 300, maxWidth: 440 }}>
            Humidificadores y difusores aesthetic diseñados para crear ambientes relajantes y elegantes en tu hogar.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <button onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 30px", borderRadius: 12, fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${c.terracotta}, #a85542)`, color: c.linen, boxShadow: "0 8px 28px rgba(181,97,74,0.40)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(181,97,74,0.50)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(181,97,74,0.40)"; }}>
              Ver productos <ArrowRight size={16} />
            </button>
            <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 30px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none", border: "2px solid rgba(200,187,168,0.30)", color: c.linen, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", transition: "border-color 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,187,168,0.60)"; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,187,168,0.30)"; e.currentTarget.style.transform = "scale(1)"; }}>
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>

          {/* Mini stats row */}
          <div style={{ display: "flex", gap: 28, paddingTop: 28, borderTop: "1px solid rgba(200,187,168,0.12)" }}>
            {[{ v: "1,200+", l: "Clientes" }, { v: "8", l: "Ciudades" }, { v: "4.9★", l: "Calificación" }].map(s => (
              <div key={s.l}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: c.goldLight, lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: 11, color: "rgba(232,226,217,0.45)", marginTop: 4 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Visual (slideshow o device) ── */}
        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="hero-right">
          {hasImages ? <HeroSlideshow images={heroImages} /> : <HeroDevice />}
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hero-left { max-width: 100% !important; }
          div.wrap > .hero-left, div.wrap > .hero-right { grid-column: auto; }
          div.wrap { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────
function Benefits() {
  return (
    <section id="beneficios" style={{ padding: "96px 0", background: c.parchment }}>
      <div className="wrap">
        <FadeUp className="text-center" style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.olive, marginBottom: 10 }}>Por qué Aromaticcol</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#2a2822" }}>
            Tu espacio influye en<br /><span style={{ color: c.olive }}>cómo te sientes</span>
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {BENEFITS.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.1}>
              <motion.div style={{ borderRadius: 24, padding: 28, height: "100%", cursor: "default", background: "rgba(200,187,168,0.22)", border: "1px solid rgba(200,187,168,0.45)" }}
                whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(42,40,34,0.10)" }} transition={{ duration: 0.3 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, background: b.bg }}>
                  <b.icon size={21} style={{ color: b.color }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, marginBottom: 8, color: "#2a2822" }}>{b.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: c.walnut, fontWeight: 300 }}>{b.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Visual ───────────────────────────────────────────────────────────
function ProductVisual({ type }: { type: string }) {
  const grads: Record<string, string> = {
    humidifier: "linear-gradient(145deg, #ddd6ca 0%, #c4b8a8 100%)",
    diffuser:   "linear-gradient(145deg, #d4cfc6 0%, #b8a898 100%)",
    kit:        "linear-gradient(145deg, #c8d0c4 0%, #a8b8a4 100%)",
    custom:     "linear-gradient(145deg, #d4cfc6 0%, #c4b8a8 100%)",
  };
  const grad = grads[type] ?? grads.custom;
  return (
    <div style={{ position: "relative", width: "100%", height: 200, borderRadius: 16, overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 20, background: grad }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
      {type === "humidifier" && (
        <motion.div style={{ position: "relative" }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          {[{ delay: 0, x: 43, size: 12 }, { delay: 1, x: 53, size: 18 }].map((v, i) => <Vapor key={i} {...v} />)}
          <div style={{ width: 76, height: 112, borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #f0e8dc 0%, #c9b89e 100%)", boxShadow: "0 14px 28px rgba(92,68,51,0.22), inset 0 2px 4px rgba(255,255,255,0.5)" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(92,68,51,0.5)" }}>H₂O</span>
          </div>
          <div style={{ marginTop: 4, marginLeft: "auto", marginRight: "auto", width: 58, height: 14, borderRadius: 999, background: "linear-gradient(180deg, #a07850, #7a5c38)" }} />
        </motion.div>
      )}
      {type === "diffuser" && (
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(145deg, #e8ddd0 0%, #c9b89e 100%)", boxShadow: "0 10px 24px rgba(92,68,51,0.2), inset 0 2px 4px rgba(255,255,255,0.5)" }} />
          <div style={{ marginTop: 4, marginLeft: "auto", marginRight: "auto", width: 46, height: 12, borderRadius: 999, background: "linear-gradient(180deg, #a07850, #7a5c38)", opacity: 0.7 }} />
        </motion.div>
      )}
      {(type === "kit" || type === "custom") && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          {[{ h: 58, alt: true }, { h: 78, alt: false }, { h: 58, alt: true }].map((s, i) => (
            <motion.div key={i} style={{ width: 38, height: s.h, borderRadius: 14, background: s.alt ? "linear-gradient(160deg, #c9b89e, #a07850)" : "linear-gradient(160deg, #e8ddd0, #b8ceb4)", boxShadow: "0 8px 18px rgba(92,68,51,0.18)" }}
              animate={{ y: [0, s.alt ? -5 : -9, 0] }} transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
function Products() {
  const { productos: productosDB } = useProductos(true);

  const items = productosDB.length > 0
    ? productosDB.map(p => ({
        key:     p.id,
        titulo:  p.titulo,
        tag:     p.tag,
        desc:    p.descripcion,
        tipo:    p.tipo ?? "custom",
        img:     p.imagen_url,
        waTexto: p.whatsapp_texto,
      }))
    : PRODUCTS_DEFAULT.map((p, i) => ({
        key:     String(i),
        titulo:  p.title,
        tag:     p.tag,
        desc:    p.desc,
        tipo:    p.type,
        img:     null as string | null,
        waTexto: null as string | null,
      }));

  return (
    <section id="productos" style={{ padding: "96px 0", background: `linear-gradient(180deg, ${c.linen} 0%, ${c.parchment} 100%)` }}>
      <div className="wrap">
        <FadeUp className="text-center" style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.olive, marginBottom: 10 }}>Colección</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 600, letterSpacing: "-0.01em", color: "#2a2822" }}>Nuestros productos</h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {items.map((prod, i) => (
            <FadeUp key={prod.key} delay={i * 0.12}>
              <motion.div style={{ borderRadius: 24, overflow: "hidden", background: c.linen, border: "1px solid rgba(200,187,168,0.5)", boxShadow: "0 4px 24px rgba(42,40,34,0.06)" }}
                whileHover={{ y: -8, boxShadow: "0 24px 56px rgba(42,40,34,0.13)" }} transition={{ duration: 0.35 }}>
                <div style={{ padding: prod.img ? 0 : 14 }}>
                  {prod.img
                    ? <img src={prod.img} alt={prod.titulo} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                    : <ProductVisual type={prod.tipo} />
                  }
                </div>
                <div style={{ padding: "0 22px 24px", paddingTop: prod.img ? 16 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 600, color: "#2a2822" }}>{prod.titulo}</h3>
                    {prod.tag && <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999, background: "rgba(74,94,64,0.10)", color: c.olive, flexShrink: 0, marginLeft: 8 }}>{prod.tag}</span>}
                  </div>
                  {prod.desc && <p style={{ fontSize: 13, lineHeight: 1.65, color: c.walnut, fontWeight: 300, marginBottom: 18 }}>{prod.desc}</p>}
                  <a href={`https://wa.me/573001234567${prod.waTexto ? `?text=${encodeURIComponent(prod.waTexto)}` : ""}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: c.olive, textDecoration: "none", transition: "gap 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
                    onMouseLeave={e => (e.currentTarget.style.gap = "6px")}>
                    Consultar por WhatsApp <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Ferias (datos dinámicos desde Supabase) ──────────────────────────────────
function FeriasSection() {
  const { ferias: feriasSupa, loading } = useFerias(true);
  const feriasList = feriasSupa.length > 0 ? feriasSupa : FERIAS_DEFAULT;

  return (
    <section id="ferias" style={{ padding: "96px 0", background: `linear-gradient(180deg, ${c.forest} 0%, #1e2d20 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 680, height: 320, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(74,94,64,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="wrap" style={{ position: "relative" }}>
        <FadeUp className="text-center" style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.goldLight, marginBottom: 10 }}>Encuéntranos</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em", color: c.linen, marginBottom: 12 }}>
            Esta semana estamos<br /><span style={{ color: c.goldLight }}>más cerca de ti</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(232,226,217,0.65)" }}>Visítanos en nuestros puntos de venta y vive la experiencia en persona.</p>
        </FadeUp>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 140, borderRadius: 24, background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : feriasList.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgba(232,226,217,0.5)", fontSize: 15 }}>No hay ferias activas esta semana.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {feriasList.map((f, i) => (
              <FadeUp key={f.id} delay={i * 0.1}>
                <motion.div style={{ borderRadius: 24, overflow: "hidden", cursor: "default", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,187,168,0.12)" }}
                  whileHover={{ y: -5, background: "rgba(255,255,255,0.09)" }} transition={{ duration: 0.3 }}>
                  {f.imagen_url && (
                    <img src={f.imagen_url} alt={f.nombre} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                  )}
                  <div style={{ padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                      <motion.div style={{ width: 9, height: 9, borderRadius: "50%", background: c.goldLight, flexShrink: 0 }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: c.goldLight }}>Esta semana</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(184,151,106,0.15)" }}>
                        <MapPin size={15} style={{ color: c.goldLight }} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 500, color: c.linen }}>{f.nombre}</h3>
                        <p style={{ fontSize: 11, color: c.taupe, marginTop: 2 }}>{f.ciudad}</p>
                      </div>
                    </div>
                    {f.dias_horario && <span style={{ fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 999, background: "rgba(184,151,106,0.12)", color: c.goldLight }}>{f.dias_horario}</span>}
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section style={{ padding: "88px 0", background: `linear-gradient(135deg, ${c.charcoal} 0%, #141412 50%, #1a1816 100%)` }}>
      <div className="wrap-sm">
        <FadeUp className="text-center" style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(212,184,138,0.55)", marginBottom: 10 }}>Nuestra comunidad</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontWeight: 500, lineHeight: 1.2, color: c.linen }}>
            Miles de personas ya<br /><span style={{ color: c.goldLight }}>respiran bienestar</span>
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {STATS.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.15} className="text-center">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, letterSpacing: "-0.01em", color: c.goldLight, marginBottom: 6 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <p style={{ fontSize: 14, color: "rgba(232,226,217,0.55)", fontWeight: 300 }}>{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Galería ──────────────────────────────────────────────────────────────────
function GaleriaSection() {
  const { items, loading } = useGaleria();
  if (!loading && items.length === 0) return null;

  return (
    <section style={{ padding: "96px 0", background: c.parchment }}>
      <div className="wrap">
        <FadeUp className="text-center" style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.olive, marginBottom: 10 }}>Momentos</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 600, letterSpacing: "-0.01em", color: "#2a2822" }}>
            Nuestra <span style={{ color: c.olive }}>galería</span>
          </h2>
        </FadeUp>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ borderRadius: 16, background: "rgba(200,187,168,0.22)", aspectRatio: "4/3", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : (
          <div style={{ columns: "3 220px", gap: 14 }}>
            {items.map((img, i) => (
              <FadeUp key={img.id} delay={i * 0.05} style={{ breakInside: "avoid", marginBottom: 14, display: "block" }}>
                <motion.div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(200,187,168,0.4)" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(42,40,34,0.14)" }} transition={{ duration: 0.3 }}>
                  <img src={img.url} alt={img.nombre ?? ""} loading="lazy"
                    style={{ width: "100%", display: "block", objectFit: "cover" }} />
                </motion.div>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Contacto (formulario + CTA) ──────────────────────────────────────────────
function Contacto() {
  return (
    <section id="contacto" style={{ padding: "100px 0", position: "relative", overflow: "hidden", background: `linear-gradient(160deg, #1a2e1c 0%, ${c.forest} 60%, #2a2822 100%)` }}>
      <motion.div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(184,151,106,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 7, repeat: Infinity }} />
      <div className="wrap-sm" style={{ position: "relative" }}>
        <FadeUp className="text-center" style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, marginBottom: 20, fontSize: 13, fontWeight: 600, background: "rgba(184,151,106,0.12)", color: c.goldLight, border: "1px solid rgba(184,151,106,0.25)" }}>
            <Music2 size={13} /> Empieza tu experiencia hoy
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.4rem)", fontWeight: 500, lineHeight: 1.12, color: c.linen, marginBottom: 12 }}>
            ¿Quieres transformar<br />tu espacio?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(232,226,217,0.65)", fontWeight: 300 }}>
            Déjanos tus datos y te asesoramos para encontrar el producto ideal.
          </p>
        </FadeUp>

        {/* Formulario */}
        <FadeUp delay={0.15}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,187,168,0.12)", borderRadius: 24, padding: "32px", backdropFilter: "blur(8px)", marginBottom: 40 }}>
            <ContactForm />
          </div>
        </FadeUp>

        {/* Alternativa redes */}
        <FadeUp delay={0.25} className="text-center">
          <p style={{ fontSize: 13, color: "rgba(232,226,217,0.40)", marginBottom: 18 }}>o contáctanos directamente</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none", color: c.linen, background: `linear-gradient(135deg, ${c.terracotta}, #a85542)`, boxShadow: "0 8px 24px rgba(181,97,74,0.30)" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <MessageCircle size={16} /> WhatsApp
            </motion.a>
            <motion.a href="https://instagram.com/aromaticcol" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none", color: c.linen, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(200,187,168,0.25)", backdropFilter: "blur(8px)" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Camera size={16} /> Instagram
            </motion.a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const nav    = ["Inicio", "Productos", "Ferias", "Contacto"];
  const social = [
    { label: "Instagram", icon: Camera,        href: "https://instagram.com/aromaticcol" },
    { label: "WhatsApp",  icon: MessageCircle, href: "https://wa.me/573001234567"        },
  ];
  return (
    <footer style={{ padding: "48px 0", background: c.charcoal, borderTop: "1px solid rgba(200,187,168,0.08)" }}>
      <div className="wrap">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.olive}, ${c.moss})` }}>
              <Leaf size={15} color="#e8e2d9" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, color: c.linen }}>Aromaticcol</span>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {nav.map(l => (
              <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontSize: 13, color: c.linen, opacity: 0.45, background: "none", border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.45")}
              >{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {social.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: c.linen, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,187,168,0.12)", transition: "transform 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              ><s.icon size={15} /></a>
            ))}
            <a href="https://tiktok.com/@aromaticcol" target="_blank" rel="noreferrer" aria-label="TikTok"
              style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: c.linen, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,187,168,0.12)", fontSize: 11, fontWeight: 700, transition: "transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >TK</a>
          </div>
        </div>
        <div style={{ paddingTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, fontSize: 12, color: c.linen, opacity: 0.32, borderTop: "1px solid rgba(242,237,230,0.06)" }}>
          <p>© {new Date().getFullYear()} Aromaticcol. Todos los derechos reservados.</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <p>Hecho con amor para tu bienestar ✨</p>
            <a href="/admin/login"
              style={{ fontSize: 11, color: "rgba(200,187,168,0.30)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,187,168,0.65)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,187,168,0.30)")}
            >Administración</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div style={{ background: c.parchment, minHeight: "100vh", width: "100%" }}>
      <Navbar />
      <Hero />
      <Benefits />
      <Products />
      <FeriasSection />
      <Stats />
      <GaleriaSection />
      <Contacto />
      <Footer />
    </div>
  );
}
