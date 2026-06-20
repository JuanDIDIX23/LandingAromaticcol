import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { c } from "../constants/palette";

const IMAGES = [
  "/nosotros-1.png",
  "/nosotros-2.png",
  "/nosotros-3.png",
  "/nosotros-4.png",
];

const VALUES = [
  { icon: "🌿", text: "Bienestar para el hogar" },
  { icon: "🤍", text: "Cercanía y confianza" },
  { icon: "✨", text: "Experiencias que inspiran calma" },
  { icon: "🏡", text: "Productos seleccionados con dedicación" },
];

export function Nosotros() {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setCur(i => (i + 1) % IMAGES.length);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(advance, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [cur, advance]);

  const scrollToProductos = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCur(i);
  };

  return (
    <section id="nosotros" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

      {/* Fullscreen carousel — Ken Burns scale(1.05)→scale(1) in 6s */}
      <AnimatePresence>
        <motion.div key={IMAGES[cur]}
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `url('${IMAGES[cur]}')`,
            backgroundSize: "cover", backgroundPosition: "center",
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 6, ease: "linear" },
          }}
        />
      </AnimatePresence>

      {/* Top fade from Products section */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to bottom, #E7EFE5, transparent)", pointerEvents: "none", zIndex: 1 }} />

      {/* Bottom fade to Ferias section */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to bottom, transparent, #F0DEC9)", pointerEvents: "none", zIndex: 1 }} />

      {/* Content */}
      <div className="wrap" style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: 88, paddingBottom: 88 }}>
        <div className="nosotros-content"><div className="nosotros-glass">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.55 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 999, marginBottom: 24,
              fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(201,139,92,0.14)", color: c.accent,
              border: "1px solid rgba(201,139,92,0.28)",
            }}
          >
            🌿 Nuestra historia
          </motion.div>

          {/* Title — line by line reveal */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
            fontWeight: 500, lineHeight: 1.12,
            color: c.brown, marginBottom: 28,
          }}>
            {[
              { text: "Más que aromas,", accent: false },
              { text: <>creamos <span style={{ color: c.accent }}>experiencias</span></>, accent: false },
              { text: "para tu bienestar.", accent: false },
            ].map((line, i) => (
              <span key={i} style={{ display: "block", overflow: "hidden" }}>
                <motion.span
                  style={{ display: "block" }}
                  initial={{ y: "110%", opacity: 0 }}
                  whileInView={{ y: "0%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.82, delay: 0.18 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 48, height: 2, borderRadius: 999,
              background: `linear-gradient(90deg, ${c.accent}, ${c.accentHov})`,
              marginBottom: 24, transformOrigin: "left center",
            }}
          />

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.65 }}
            style={{
              fontSize: "clamp(14px, 1.8vw, 16px)",
              lineHeight: 1.78, color: c.brownMid,
              marginBottom: 36, fontWeight: 300,
            }}
          >
            En AromaticCol creemos que los pequeños momentos tienen el poder de transformar el día. Cada producto está pensado para crear rituales de calma, armonía y conexión con tu espacio.
          </motion.p>

          {/* Values */}
          <div className="nosotros-values" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
            {VALUES.map((v, i) => (
              <motion.div key={v.text}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.62 + i * 0.1, duration: 0.55 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{v.icon}</span>
                <span style={{ fontSize: 14, color: c.brown, fontWeight: 500 }}>{v.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.02, duration: 0.55 }}
          >
            <motion.button
              onClick={scrollToProductos}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 12,
                fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${c.accent}, ${c.accentHov})`,
                color: c.accentText,
                boxShadow: "0 8px 28px rgba(201,139,92,0.35)",
                letterSpacing: "0.01em",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(201,139,92,0.48)" }}
              whileTap={{ scale: 0.97 }}
            >
              Conoce nuestros productos <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div></div>
      </div>

      {/* Carousel dots */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%",
        transform: "translateX(-50%)", zIndex: 3,
        display: "flex", gap: 8,
      }}>
        {IMAGES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{
              width: i === cur ? 24 : 8, height: 8, borderRadius: 999,
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
              background: i === cur ? c.accent : "rgba(92,75,58,0.28)",
            }}
          />
        ))}
      </div>

      <style>{`
        .nosotros-content { max-width: 48%; }
        .nosotros-glass {
          background: rgba(243,230,214,0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 24px;
          padding: 44px 48px;
          border: 1px solid rgba(201,139,92,0.16);
          box-shadow: 0 12px 48px rgba(92,75,58,0.08);
        }
        @media (max-width: 767px) {
          .nosotros-content { max-width: 100%; text-align: center; }
          .nosotros-glass { padding: 28px 24px; }
          .nosotros-values { align-items: center !important; }
        }
      `}</style>
    </section>
  );
}
