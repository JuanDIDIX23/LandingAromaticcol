import { motion } from "framer-motion";
import { MessageCircle, Camera, Music2 } from "lucide-react";
import { c } from "../constants/palette";
import { useConfig } from "../../hooks/useConfig";
import { SectionLabel, RevealText, DividerLine, FadeUp } from "../shared/animations";
import { ContactForm } from "../ContactForm";

export function Contacto() {
  const { config } = useConfig();
  const waLink = config.whatsapp_numero
    ? `https://wa.me/${config.whatsapp_numero}${config.whatsapp_mensaje ? `?text=${encodeURIComponent(config.whatsapp_mensaje)}` : ""}`
    : "https://wa.me/573001234567";
  const igLink = config.instagram_url || "https://instagram.com/aromaticcol";

  return (
    <section id="contacto" style={{ padding: "100px 0", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #F2E7D9 0%, #EADCCB 60%, #F2E7D9 100%)" }}>
      <motion.div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,139,92,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 7, repeat: Infinity }} />

      <div className="wrap-sm" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <motion.div initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 999, marginBottom: 20, fontSize: 13, fontWeight: 500, background: "rgba(181,107,69,0.16)", color: c.terracotta, border: "1px solid rgba(181,107,69,0.28)" }}>
            <Music2 size={13} /> Empieza tu experiencia hoy
          </motion.div>
          <SectionLabel text="Contáctanos" color={c.mint} />
          <DividerLine color={c.goldLight} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.4rem)", fontWeight: 500, lineHeight: 1.12, color: c.ivory, overflow: "hidden" }}>
            <RevealText delay={0.15}>¿Quieres transformar</RevealText>
            <RevealText delay={0.28}>tu espacio?</RevealText>
          </h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ fontSize: 15, color: c.stone, fontWeight: 300, marginTop: 14 }}>
            Déjanos tus datos y te asesoramos para encontrar el producto ideal.
          </motion.p>
        </div>

        <FadeUp delay={0.15}>
          <div style={{ background: "rgba(255,255,255,0.60)", border: "1px solid rgba(201,139,92,0.20)", borderRadius: 24, padding: "32px", backdropFilter: "blur(8px)", marginBottom: 40 }}>
            <ContactForm />
          </div>
        </FadeUp>

        <FadeUp delay={0.28} className="text-center">
          <p style={{ fontSize: 13, color: `${c.stone}88`, marginBottom: 18 }}>o contáctanos directamente</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={waLink} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none", color: c.accentText, background: `linear-gradient(135deg, ${c.accent}, ${c.accentHov})`, boxShadow: "0 8px 24px rgba(201,139,92,0.28)" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <MessageCircle size={16} /> WhatsApp
            </motion.a>
            <motion.a href={igLink} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none", color: c.brown, background: "rgba(255,255,255,0.55)", border: "2px solid rgba(138,175,135,0.30)", backdropFilter: "blur(8px)" }}
              whileHover={{ scale: 1.04, borderColor: "rgba(138,175,135,0.65)" }} whileTap={{ scale: 0.97 }}>
              <Camera size={16} /> Instagram
            </motion.a>
          </div>
        </FadeUp>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #D9C5AE)", pointerEvents: "none", zIndex: 5 }} />
    </section>
  );
}
