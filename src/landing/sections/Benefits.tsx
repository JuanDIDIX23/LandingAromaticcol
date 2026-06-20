import { motion } from "framer-motion";
import { Wind, Sparkles, Leaf, Heart } from "lucide-react";
import { c } from "../constants/palette";
import { BENEFITS } from "../constants/data";
import { SectionLabel, RevealText, DividerLine, TiltCard, itemVariant, StaggerGrid, FloatingOrb } from "../shared/animations";

const ICONS = { Wind, Sparkles, Leaf, Heart } as const;

export function Benefits() {
  return (
    <section id="beneficios" style={{ padding: "100px 0", background: "linear-gradient(160deg, #E8D4BE 0%, #E3CDB4 50%, #DCC2A4 100%)", position: "relative", overflow: "hidden" }}>
      <FloatingOrb size={360} x="78%" y="10%" delay={1} color="rgba(201,139,92,0.09)" />
      <FloatingOrb size={240} x="5%"  y="60%" delay={4} color="rgba(138,175,135,0.07)" />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel text="Por qué Aromaticcol" color={c.mint} />
          <DividerLine color={c.goldLight} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)", fontWeight: 600, lineHeight: 1.15, color: c.ivory, overflow: "hidden" }}>
            <RevealText delay={0.15}>Tu espacio influye en</RevealText>
            <RevealText delay={0.28}><span style={{ color: c.goldLight }}>cómo te sientes</span></RevealText>
          </h2>
        </div>

        <StaggerGrid stagger={0.12} delay={0.1} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 22 }}>
          {BENEFITS.map(b => {
            const Icon = ICONS[b.icon as keyof typeof ICONS];
            return (
              <motion.div key={b.title} variants={itemVariant}>
                <TiltCard style={{ borderRadius: 26, padding: 30, height: "100%", cursor: "default", background: "rgba(255,255,255,0.60)", border: "1px solid rgba(201,139,92,0.18)", backdropFilter: "blur(6px)", boxShadow: "0 8px 24px rgba(191,160,122,0.10)" }}>
                  <motion.div style={{ width: 50, height: 50, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, background: b.bg }}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
                    <Icon size={22} style={{ color: b.color }} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, marginBottom: 10, color: c.ivory }}>{b.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: c.stone, fontWeight: 300 }}>{b.desc}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </StaggerGrid>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #DDE8DB)", pointerEvents: "none", zIndex: 5 }} />
    </section>
  );
}
