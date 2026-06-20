import { motion } from "framer-motion";
import { c } from "../constants/palette";
import { SectionLabel, RevealText, DividerLine, FadeUp, FloatingOrb } from "../shared/animations";
import { useGaleria } from "../../hooks/useGaleria";

const GRID_SIZES = [
  { col: 2, row: 2 }, { col: 1, row: 2 }, { col: 1, row: 1 },
  { col: 2, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 1 },
  { col: 1, row: 2 }, { col: 1, row: 1 }, { col: 2, row: 1 },
  { col: 1, row: 1 }, { col: 1, row: 2 }, { col: 1, row: 1 },
] as const;

export function GaleriaSection() {
  const { items, loading } = useGaleria();
  if (!loading && items.length === 0) return null;

  return (
    <section style={{ padding: "100px 0", background: "linear-gradient(180deg, #EEF2EA 0%, #E4EBE2 100%)", position: "relative", overflow: "hidden" }}>
      <FloatingOrb size={400} x="25%" y="8%"  delay={0} color="rgba(201,139,92,0.07)" />
      <FloatingOrb size={260} x="72%" y="58%" delay={4} color="rgba(138,175,135,0.06)" />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionLabel text="Momentos" color={c.mint} />
          <DividerLine color={c.goldLight} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)", fontWeight: 600, color: c.ivory, overflow: "hidden" }}>
            <RevealText delay={0.15}>Nuestra <span style={{ color: c.goldLight }}>galería</span></RevealText>
          </h2>
        </div>

        {loading ? (
          <div className="gallery-dynamic-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ borderRadius: 16, background: "rgba(109,138,114,0.06)", animation: "galPulse 1.5s infinite" }} />)}
          </div>
        ) : (
          <div className="gallery-dynamic-grid">
            {items.map((img, i) => {
              const { col, row } = GRID_SIZES[i % GRID_SIZES.length];
              return (
                <FadeUp key={img.id} delay={Math.min(i * 0.04, 0.36)} style={{ gridColumn: `span ${col}`, gridRow: `span ${row}`, minHeight: 0 }}>
                  <motion.div style={{ borderRadius: 18, overflow: "hidden", height: "100%", border: "1px solid rgba(138,175,135,0.20)", position: "relative", cursor: "zoom-in", boxShadow: "0 4px 16px rgba(191,160,122,0.09)" }}
                    whileHover={{ scale: 1.02, boxShadow: `0 24px 64px rgba(0,0,0,0.55)` }} transition={{ duration: 0.35 }}>
                    <img src={img.url} alt={img.nombre ?? ""} loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <motion.div style={{ position: "absolute", inset: 0, background: "rgba(201,139,92,0.58)", opacity: 0 }}
                      whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                    {img.nombre && (
                      <motion.p style={{ position: "absolute", bottom: 14, left: 14, right: 14, fontSize: 13, fontWeight: 500, color: c.ivory, opacity: 0 }}
                        whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }}>{img.nombre}</motion.p>
                    )}
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #F2E7D9)", pointerEvents: "none", zIndex: 5 }} />
      <style>{`@keyframes galPulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
    </section>
  );
}
