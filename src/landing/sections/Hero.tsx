import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { c } from "../constants/palette";
import { useConfig } from "../../hooks/useConfig";

export function Hero() {
  const { config } = useConfig();
  const waLink = config.whatsapp_numero
    ? `https://wa.me/${config.whatsapp_numero}${config.whatsapp_mensaje ? `?text=${encodeURIComponent(config.whatsapp_mensaje)}` : ""}`
    : "https://wa.me/573001234567";

  const { scrollY } = useScroll();
  const bgY            = useTransform(scrollY, [0, 700], ["0%", "22%"]);
  const contentY       = useTransform(scrollY, [0, 500], [0, -80]);
  const contentOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  return (
    <section id="inicio" style={{ height: "100vh", minHeight: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Parallax background */}
      <motion.div style={{ position: "absolute", inset: "-18%", zIndex: 0, backgroundImage: "url('/hero-bg.png')", backgroundSize: "cover", backgroundPosition: "center", y: bgY }} />

      {/* Ambient orbs */}
      <motion.div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", left: "18%", top: "8%", background: "rgba(201,139,92,0.09)", filter: "blur(72px)", pointerEvents: "none", zIndex: 0 }}
        animate={{ x: [0, 38, -22, 0], y: [0, -46, 28, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", right: "12%", bottom: "18%", background: "rgba(138,175,135,0.09)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
        animate={{ x: [0, -28, 18, 0], y: [0, 36, -24, 0] }}
        transition={{ duration: 14, delay: 3, repeat: Infinity, ease: "easeInOut" }} />

      {/* Centered content */}
      <motion.div style={{ position: "relative", zIndex: 2, y: contentY, opacity: contentOpacity, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 clamp(20px, 5vw, 48px)", maxWidth: 800, width: "100%" }}>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 20px", borderRadius: 999, marginBottom: 36, fontSize: 13, fontWeight: 500, background: "rgba(201,139,92,0.14)", color: c.accent, border: "1px solid rgba(201,139,92,0.30)", backdropFilter: "blur(8px)", letterSpacing: "0.05em" }}>
          <Sparkles size={12} style={{ color: c.accent }} /> Aromaterapia premium
        </motion.div>

        {/* Title — reveal line by line */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(3.2rem, 9vw, 7.5rem)", fontWeight: 600, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 28, color: c.brown }}>
          {["Transforma", "tu espacio"].map((word, i) => (
            <span key={word} style={{ display: "block", overflow: "hidden" }}>
              <motion.span style={{ display: "block" }}
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.82, delay: 0.22 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}>
                {i === 1
                  ? <><span style={{ color: c.sage }}>tu </span><span>espacio</span></>
                  : word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Animated line */}
        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.58, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 60, height: 2, borderRadius: 999, background: `linear-gradient(90deg, ${c.accent}, ${c.accentHov})`, marginBottom: 28, transformOrigin: "center" }} />

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.65 }}
          style={{ fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.68, marginBottom: 44, color: "rgba(92,75,58,0.80)", fontWeight: 300, maxWidth: 520 }}>
          Humidificadores y difusores aesthetic diseñados para crear ambientes relajantes y elegantes en tu hogar.
        </motion.p>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82, duration: 0.6 }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 56 }}>
          <motion.button onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "15px 36px", borderRadius: 12, fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${c.accent}, ${c.accentHov})`, color: c.accentText, boxShadow: "0 8px 32px rgba(201,139,92,0.38)", letterSpacing: "0.01em" }}
            whileHover={{ scale: 1.05, boxShadow: "0 16px 48px rgba(201,139,92,0.52)" }} whileTap={{ scale: 0.97 }}>
            Ver productos <ArrowRight size={16} />
          </motion.button>
          <motion.a href={waLink} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "15px 36px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none", border: "2px solid rgba(92,75,58,0.30)", color: c.brown, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)", letterSpacing: "0.01em" }}
            whileHover={{ scale: 1.04, borderColor: "rgba(92,75,58,0.58)" }} whileTap={{ scale: 0.97 }}>
            <MessageCircle size={15} /> WhatsApp
          </motion.a>
        </motion.div>

        {/* Mini stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.02, duration: 0.8 }}
          style={{ display: "flex", gap: "clamp(24px, 6vw, 56px)", paddingTop: 24, borderTop: "1px solid rgba(92,75,58,0.16)" }}>
          {[{ v: "1,200+", l: "Clientes felices" }, { v: "8", l: "Ciudades" }, { v: "4.9★", l: "Calificación" }].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.12 + i * 0.1 }} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 600, color: c.accent, lineHeight: 1 }}>{s.v}</p>
              <p style={{ fontSize: 11, color: "rgba(92,75,58,0.55)", marginTop: 5, letterSpacing: "0.04em" }}>{s.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Transition to Benefits */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #E8D4BE)", pointerEvents: "none", zIndex: 2 }} />

      {/* Scroll indicator */}
      <motion.div style={{ position: "absolute", bottom: 32, left: "50%", x: "-50%", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(92,75,58,0.48)", textTransform: "uppercase", marginBottom: 4 }}>Scroll</p>
        <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom, rgba(92,75,58,0.42), transparent)" }} />
      </motion.div>
    </section>
  );
}
