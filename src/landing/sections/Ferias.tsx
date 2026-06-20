import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { c } from "../constants/palette";
import { FERIAS_DEFAULT } from "../constants/data";
import { SectionLabel, RevealText, DividerLine, Carousel, FloatingOrb } from "../shared/animations";
import { useFerias } from "../../hooks/useFerias";

export function FeriasSection() {
  const { ferias: feriasSupa, loading } = useFerias(true);
  const list = feriasSupa.length > 0 ? feriasSupa : FERIAS_DEFAULT;

  return (
    <section id="ferias" style={{ padding: "100px 0", background: "linear-gradient(160deg, #F0DEC9 0%, #E6CDB2 100%)", position: "relative", overflow: "hidden" }}>
      <FloatingOrb size={340} x="8%"  y="15%" delay={1} color="rgba(201,139,92,0.10)" />
      <FloatingOrb size={220} x="78%" y="55%" delay={4} color="rgba(138,175,135,0.08)" />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel text="Encuéntranos" color={c.brownLight} />
          <DividerLine color={c.accent} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, color: c.brown, overflow: "hidden" }}>
            <RevealText delay={0.15}>Esta semana estamos</RevealText>
            <RevealText delay={0.28}><span style={{ color: c.accent }}>más cerca de ti</span></RevealText>
          </h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ fontSize: 13, color: c.stone, marginTop: 14, letterSpacing: "0.03em" }}>
            Desliza para ver todos los puntos →
          </motion.p>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 18 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ minWidth: 260, height: 200, borderRadius: 24, background: "rgba(201,139,92,0.12)", flex: "0 0 260px", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : list.length === 0 ? (
          <p style={{ textAlign: "center", color: c.stone, fontSize: 15 }}>No hay ferias activas esta semana.</p>
        ) : (
          <Carousel cardWidth={268} gap={20}>
            {list.map((f, i) => (
              <motion.div key={f.id}
                style={{ borderRadius: 24, overflow: "hidden", cursor: "default", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(201,139,92,0.20)", height: "100%", boxShadow: "0 8px 24px rgba(191,160,122,0.10)" }}
                whileHover={{ background: "rgba(255,255,255,0.85)", y: -4 }} transition={{ duration: 0.3 }}>
                {f.imagen_url && <img src={f.imagen_url} alt={f.nombre} style={{ width: "100%", height: 130, objectFit: "cover" }} />}
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: c.accent, flexShrink: 0 }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: c.brownLight, letterSpacing: "0.06em" }}>ESTA SEMANA</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(201,139,92,0.14)" }}>
                      <MapPin size={15} style={{ color: c.accent }} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 500, color: c.brown }}>{f.nombre}</h3>
                      <p style={{ fontSize: 11, color: c.stone, marginTop: 3 }}>{f.ciudad}</p>
                    </div>
                  </div>
                  {f.dias_horario && (
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 999, background: "rgba(201,139,92,0.14)", color: c.accent, border: "1px solid rgba(201,139,92,0.28)" }}>
                      {f.dias_horario}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </Carousel>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #DCE7DF)", pointerEvents: "none", zIndex: 5 }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </section>
  );
}
