import { c } from "../constants/palette";
import { STATS } from "../constants/data";
import { SectionLabel, RevealText, DividerLine, Counter, FadeUp } from "../shared/animations";

export function Stats() {
  return (
    <section style={{ padding: "96px 0", background: `linear-gradient(135deg, #111a13 0%, #0e1610 50%, #131e15 100%)` }}>
      <div className="wrap-sm">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel text="Nuestra comunidad" color={c.fern} />
          <DividerLine color={c.goldLight} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.7rem, 3vw, 2.8rem)", fontWeight: 500, lineHeight: 1.2, color: "#e8e2d9", overflow: "hidden" }}>
            <RevealText delay={0.15}>Miles de personas ya</RevealText>
            <RevealText delay={0.28}><span style={{ color: c.goldLight }}>respiran bienestar</span></RevealText>
          </h2>
        </div>

        <div className="stats-grid">
          {STATS.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.15} className="text-center">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 600, color: c.goldLight, marginBottom: 8 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <p style={{ fontSize: 13, color: "rgba(170,212,148,0.55)", fontWeight: 300, letterSpacing: "0.03em" }}>{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
