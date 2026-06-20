import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Package, Clock, Globe, TrendingUp } from "lucide-react";
import { c } from "../constants/palette";
import { SectionLabel, RevealText, DividerLine, FadeUp, StaggerGrid, itemVariant } from "../shared/animations";
import { useConfig } from "../../hooks/useConfig";

// ── Datos de cobertura ────────────────────────────────────────────────────────
const LOCATIONS = [
  {
    city: "Bogotá",
    region: "Cundinamarca",
    country: "Colombia",
    tag: "Sede principal",
    desc: "Centro de operaciones y distribución. Presencia en los principales CC y ferias de la capital.",
    metrics: ["24h entrega", "+500 clientes", "3 puntos de venta"],
    color: c.sage,
    glow: "rgba(109,138,114,0.35)",
    mapX: 66, mapY: 38,
    flag: "🏙️",
  },
  {
    city: "Ibagué",
    region: "Tolima",
    country: "Colombia",
    tag: "Ciudad corazón",
    desc: "Ciudad natal de Aromaticcol. Distribución en Multicentro, Titán Plaza, Hayuelos y Mallplaza.",
    metrics: ["24h entrega", "4 puntos CC", "Feria semanal"],
    color: c.goldLight,
    glow: "rgba(212,184,138,0.35)",
    mapX: 52, mapY: 50,
    flag: "🎵",
  },
  {
    city: "Cali",
    region: "Valle del Cauca",
    country: "Colombia",
    tag: "Pacífico",
    desc: "Expansión en el eje cafetero y el corredor del Pacífico colombiano.",
    metrics: ["48h entrega", "Zona sur", "En crecimiento"],
    color: c.clay,
    glow: "rgba(201,138,110,0.35)",
    mapX: 33, mapY: 56,
    flag: "🌺",
  },
  {
    city: "Ecuador",
    region: "Internacional",
    country: "Ecuador",
    tag: "Exportación",
    desc: "Primer destino internacional. Envíos regulares con distribuidores socios en Quito y Guayaquil.",
    metrics: ["7-10 días", "Distribuidor oficial", "Exportación"],
    color: c.terracotta,
    glow: "rgba(181,107,69,0.35)",
    mapX: 44, mapY: 80,
    flag: "🌍",
  },
] as const;

// ── Mapa estilizado ───────────────────────────────────────────────────────────
function StylizedMap() {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1.1", maxWidth: 440, margin: "0 auto" }}>
      {/* Fondo con grid de puntos – tono madera oscura */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 28,
        background: "#E8F0E8",
        border: `1px solid rgba(109,138,114,0.22)`,
        backgroundImage: `radial-gradient(circle at 50% 40%, rgba(109,138,114,0.12) 0%, transparent 65%), radial-gradient(rgba(109,138,114,0.08) 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 22px 22px",
        overflow: "hidden",
      }} />

      {/* Colombia silhouette SVG */}
      <svg viewBox="0 0 200 240" style={{ position: "absolute", inset: "8%", width: "84%", height: "84%", opacity: 0.18 }} fill="none">
        {/* Contorno simplificado de Colombia */}
        <path d="M 78,18 C 88,10 108,8 128,14 C 148,20 164,32 174,48 C 184,64 186,82 180,98 C 174,114 162,124 154,138 C 144,154 138,168 130,182 C 120,198 106,210 90,216 C 74,222 58,218 46,208 C 34,198 28,184 28,168 C 28,152 36,140 40,126 C 44,112 40,98 38,84 C 36,70 42,54 56,40 C 66,28 70,22 78,18 Z"
          stroke={c.sage} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Ecuador debajo */}
        <path d="M 56,220 C 62,218 70,217 78,218 C 90,220 100,224 108,228 C 114,232 118,238 112,240 C 100,242 80,240 64,236 C 52,232 48,224 56,220 Z"
          stroke={c.terracotta} strokeWidth="1" strokeLinejoin="round" opacity="0.7" />
      </svg>

      {/* Líneas de conexión entre ciudades */}
      <svg viewBox="0 0 100 110" style={{ position: "absolute", inset: "8%", width: "84%", height: "84%", overflow: "visible" }}>
        {LOCATIONS.map((a, ai) =>
          LOCATIONS.slice(ai + 1).map((b, _bi) => (
            <motion.line key={`${ai}-${_bi}`}
              x1={a.mapX} y1={a.mapY} x2={b.mapX} y2={b.mapY}
              stroke={c.sage} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.30"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.8 + _bi * 0.2, ease: "easeInOut" }} />
          ))
        )}
      </svg>

      {/* Pins de ciudad */}
      {LOCATIONS.map((loc, i) => (
        <CityPin key={loc.city} loc={loc} delay={0.4 + i * 0.18} />
      ))}

      {/* Label "Colombia" en el mapa */}
      <div style={{ position: "absolute", top: "42%", left: "52%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", color: "rgba(92,75,58,0.35)", textTransform: "uppercase" }}>COLOMBIA</p>
      </div>
      <div style={{ position: "absolute", top: "82%", left: "44%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
        <p style={{ fontSize: 7, fontWeight: 600, letterSpacing: "0.18em", color: "rgba(201,139,92,0.55)", textTransform: "uppercase" }}>ECUADOR</p>
      </div>
    </div>
  );
}

function CityPin({ loc, delay }: { loc: typeof LOCATIONS[number]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      style={{ position: "absolute", left: `${loc.mapX}%`, top: `${loc.mapY}%`, transform: "translate(-50%,-50%)", zIndex: 10 }}
      initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 320, damping: 22, delay }}>
      {/* Pulse ring */}
      <motion.div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `1.5px solid ${loc.color}`, opacity: 0 }}
        animate={{ scale: [0.7, 1.8], opacity: [0.7, 0] }}
        transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeOut" }} />
      <motion.div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `1px solid ${loc.color}`, opacity: 0 }}
        animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 2.2, delay: delay + 0.4, repeat: Infinity, ease: "easeOut" }} />
      {/* Dot */}
      <motion.div
        style={{ width: 10, height: 10, borderRadius: "50%", background: loc.color, boxShadow: `0 0 14px ${loc.glow}, 0 0 4px ${loc.color}`, position: "relative", zIndex: 2, cursor: "default" }}
        whileHover={{ scale: 1.5 }} transition={{ type: "spring", stiffness: 400 }} />
      {/* Tooltip */}
      <motion.div initial={{ opacity: 0, y: -4 }} whileHover={{ opacity: 1, y: -8 }} transition={{ duration: 0.2 }}
        style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: `rgba(20,31,26,0.92)`, backdropFilter: "blur(10px)", border: `1px solid ${loc.color}40`, borderRadius: 8, padding: "5px 10px", pointerEvents: "none" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: loc.color }}>{loc.city}</p>
        <p style={{ fontSize: 9, color: c.stone }}>{loc.region}</p>
      </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function Cobertura() {
  const { config } = useConfig();

  const LOGISTICS = [
    { icon: Clock,      label: "Tiempo promedio",   value: config.cob_stat_tiempo      || "24 – 48h",   sub: "entregas nacionales"   },
    { icon: Package,    label: "Pedidos entregados", value: config.cob_stat_pedidos     || "+3,500",      sub: "y contando"            },
    { icon: Globe,      label: "Cobertura",          value: config.cob_stat_ciudades    || "4 ciudades",  sub: "Colombia + Ecuador"    },
    { icon: TrendingUp, label: "Crecimiento anual",  value: config.cob_stat_crecimiento || "x2.4",       sub: "en distribución"       },
  ];

  return (
    <section id="cobertura" style={{ padding: "100px 0", background: "linear-gradient(160deg, #DCE7DF 0%, #E5EEE7 50%, #DCE7DF 100%)", position: "relative", overflow: "hidden" }}>
      {/* Warm wood ambient glows */}
      <div style={{ position: "absolute", top: "15%", right: "6%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${c.sage}14 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", left: "4%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${c.goldLight}0a 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="wrap" style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionLabel text="Dónde llegamos" color={c.mint} />
          <DividerLine color={c.goldLight} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.4rem)", fontWeight: 600, lineHeight: 1.1, color: c.ivory, overflow: "hidden" }}>
            <RevealText delay={0.15}>Nuestra cobertura</RevealText>
            <RevealText delay={0.28}><span style={{ color: c.goldLight }}>llega lejos</span></RevealText>
          </h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.42 }}
            style={{ fontSize: 15, color: c.stone, marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
            Desde el corazón del Tolima, llevamos bienestar a cada rincón de Colombia y más allá.
          </motion.p>
        </div>

        {/* Main grid: map + logistics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 5vw, 64px)", alignItems: "center", marginBottom: 64 }}>
          {/* Map */}
          <FadeUp delay={0.1}>
            <StylizedMap />
          </FadeUp>

          {/* Logistics indicators */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {LOGISTICS.map((l, i) => (
              <FadeUp key={l.label} delay={0.2 + i * 0.1}>
                <motion.div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 24px", borderRadius: 18, background: "rgba(255,255,255,0.60)", border: "1px solid rgba(138,175,135,0.22)", backdropFilter: "blur(6px)", boxShadow: "0 6px 20px rgba(191,160,122,0.08)" }}
                  whileHover={{ background: "rgba(255,255,255,0.85)", x: 4 }} transition={{ duration: 0.25 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "linear-gradient(135deg, rgba(109,138,114,0.22), rgba(212,184,138,0.12))", border: "1px solid rgba(109,138,114,0.28)" }}>
                    <l.icon size={20} style={{ color: c.terracotta }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: c.stone, letterSpacing: "0.06em", marginBottom: 3 }}>{l.label}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: c.goldLight, lineHeight: 1 }}>{l.value}</p>
                    <p style={{ fontSize: 11, color: `${c.stone}88`, marginTop: 2 }}>{l.sub}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* City cards */}
        <StaggerGrid stagger={0.11} delay={0.1} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
          {LOCATIONS.map(loc => (
            <motion.div key={loc.city} variants={itemVariant}>
              <motion.div style={{ borderRadius: 22, overflow: "hidden", background: "rgba(255,255,255,0.60)", border: "1px solid rgba(138,175,135,0.25)", height: "100%", boxShadow: "0 6px 20px rgba(191,160,122,0.08)" }}
                whileHover={{ background: "rgba(255,255,255,0.88)", y: -4, boxShadow: `0 20px 48px ${loc.glow}` }} transition={{ duration: 0.3 }}>
                {/* Top accent bar */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${loc.color}, transparent)` }} />
                <div style={{ padding: "22px 22px 24px" }}>
                  {/* City header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: loc.color, boxShadow: `0 0 8px ${loc.color}` }}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.4, repeat: Infinity }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: loc.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>Activo</span>
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: c.ivory, lineHeight: 1 }}>{loc.city}</h3>
                      <p style={{ fontSize: 11, color: c.stone, marginTop: 2 }}>{loc.region} · {loc.country}</p>
                    </div>
                    <span style={{ fontSize: 22 }}>{loc.flag}</span>
                  </div>

                  {/* Tag */}
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, marginBottom: 12, background: `${loc.color}18`, color: loc.color, border: `1px solid ${loc.color}30`, letterSpacing: "0.05em" }}>
                    {loc.tag}
                  </span>

                  <p style={{ fontSize: 12, lineHeight: 1.65, color: c.stone, marginBottom: 16, fontWeight: 300 }}>{loc.desc}</p>

                  {/* Micro-metrics */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {loc.metrics.map(m => (
                      <div key={m} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 3, height: 3, borderRadius: "50%", background: loc.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: `${c.stone}cc` }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </StaggerGrid>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #EEF2EA)", pointerEvents: "none", zIndex: 5 }} />
    </section>
  );
}
