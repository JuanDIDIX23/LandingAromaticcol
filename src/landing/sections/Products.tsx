import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { c } from "../constants/palette";
import { PRODUCTS_DEFAULT } from "../constants/data";
import { SectionLabel, RevealText, DividerLine, TiltCard, Carousel } from "../shared/animations";
import { useProductos } from "../../hooks/useProductos";
import { useConfig } from "../../hooks/useConfig";

function Vapor({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div className="absolute bottom-8 rounded-full pointer-events-none"
      style={{ left: `${x}%`, width: size, height: size * 2.5, background: "radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 70%)", filter: "blur(7px)" }}
      animate={{ y: [-10, -130], opacity: [0, 0.65, 0], scale: [0.6, 1.4, 0.8] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeOut" }} />
  );
}

function ProductVisual({ type }: { type: string }) {
  const grads: Record<string, string> = {
    humidifier: `linear-gradient(145deg, ${c.mossDark} 0%, ${c.forestDeep} 100%)`,
    diffuser:   `linear-gradient(145deg, #2a4538 0%, ${c.forestDeep} 100%)`,
    kit:        `linear-gradient(145deg, #304a3c 0%, #243630 100%)`,
    custom:     `linear-gradient(145deg, ${c.mossDark} 0%, ${c.forestDeep} 100%)`,
  };
  return (
    <div style={{ position: "relative", width: "100%", height: 210, borderRadius: "16px 16px 0 0", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 20, background: grads[type] ?? grads.custom }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 30%, rgba(109,138,114,0.22) 0%, transparent 70%)`, pointerEvents: "none" }} />
      {type === "humidifier" && (
        <motion.div style={{ position: "relative" }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          {[{ delay: 0, x: 43, size: 12 }, { delay: 1, x: 53, size: 18 }].map((v, i) => <Vapor key={i} {...v} />)}
          <div style={{ width: 72, height: 108, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${c.sage}50 0%, ${c.forestDeep} 100%)`, boxShadow: `0 14px 28px rgba(0,0,0,0.40), inset 0 1px 3px rgba(255,255,255,0.10)` }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: `${c.mint}90` }}>H₂O</span>
          </div>
          <div style={{ marginTop: 4, marginLeft: "auto", marginRight: "auto", width: 54, height: 13, borderRadius: 999, background: `linear-gradient(180deg, ${c.cedar}, ${c.walnut ?? "#3d2a1c"})` }} />
        </motion.div>
      )}
      {type === "diffuser" && (
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(145deg, ${c.sage}60 0%, ${c.mossDark} 100%)`, boxShadow: `0 10px 24px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.08)` }} />
          <div style={{ marginTop: 4, marginLeft: "auto", marginRight: "auto", width: 46, height: 12, borderRadius: 999, background: `linear-gradient(180deg, ${c.cedar}, ${c.cedar}80)` }} />
        </motion.div>
      )}
      {(type === "kit" || type === "custom") && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          {[{ h: 58, alt: true }, { h: 78, alt: false }, { h: 58, alt: true }].map((s, i) => (
            <motion.div key={i} style={{ width: 38, height: s.h, borderRadius: 14, background: s.alt ? `linear-gradient(160deg, ${c.cedar}80, ${c.sage}60)` : `linear-gradient(160deg, ${c.sage}50, ${c.mossDark})`, boxShadow: "0 8px 18px rgba(0,0,0,0.30)" }}
              animate={{ y: [0, s.alt ? -5 : -9, 0] }} transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Products() {
  const { productos: productosDB } = useProductos(true);
  const { config } = useConfig();
  const waNum = config.whatsapp_numero || "573001234567";

  const items = productosDB.length > 0
    ? productosDB.map(p => ({ key: p.id, titulo: p.titulo, tag: p.tag, desc: p.descripcion, tipo: p.tipo ?? "custom", img: p.imagen_url, waTexto: p.whatsapp_texto }))
    : PRODUCTS_DEFAULT.map((p, i) => ({ key: String(i), titulo: p.title, tag: p.tag, desc: p.desc, tipo: p.type, img: null as string | null, waTexto: null as string | null }));

  return (
    <section id="productos" style={{ padding: "100px 0", background: "linear-gradient(180deg, #DDE8DB 0%, #CFE0CD 50%, #E7EFE5 100%)", position: "relative", overflow: "hidden" }}>
      {/* Green ambient glows */}
      <div style={{ position: "absolute", top: "10%", right: "8%", width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${c.sage}14 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${c.goldLight}0a 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel text="Colección" color={c.mint} />
          <DividerLine color={c.goldLight} delay={0.1} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)", fontWeight: 600, color: c.ivory, overflow: "hidden" }}>
            <RevealText delay={0.15}>Nuestros productos</RevealText>
          </h2>
          <p style={{ fontSize: 13, color: c.stone, marginTop: 12, letterSpacing: "0.03em" }}>Desliza para explorar →</p>
        </div>

        <Carousel cardWidth={300} gap={24}>
          {items.map(prod => (
            <TiltCard key={prod.key} style={{ borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.62)", border: "1px solid rgba(138,175,135,0.28)", height: "100%" }}>
              {prod.img
                ? <img src={prod.img} alt={prod.titulo} style={{ width: "100%", height: 210, objectFit: "cover" }} />
                : <ProductVisual type={prod.tipo} />}
              <div style={{ padding: "18px 22px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 600, color: c.ivory }}>{prod.titulo}</h3>
                  {prod.tag && <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999, background: "rgba(181,107,69,0.16)", color: c.terracotta, flexShrink: 0, marginLeft: 8, border: "1px solid rgba(181,107,69,0.30)" }}>{prod.tag}</span>}
                </div>
                {prod.desc && <p style={{ fontSize: 13, lineHeight: 1.65, color: c.stone, fontWeight: 300, marginBottom: 18 }}>{prod.desc}</p>}
                <a href={`https://wa.me/${waNum}${prod.waTexto ? `?text=${encodeURIComponent(prod.waTexto)}` : ""}`}
                  target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: c.clay, textDecoration: "none", transition: "gap 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
                  onMouseLeave={e => (e.currentTarget.style.gap = "6px")}>
                  Consultar por WhatsApp <ArrowRight size={14} />
                </a>
              </div>
            </TiltCard>
          ))}
        </Carousel>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #E7EFE5)", pointerEvents: "none", zIndex: 5 }} />
    </section>
  );
}
