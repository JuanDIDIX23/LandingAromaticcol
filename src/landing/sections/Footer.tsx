import { Leaf, Camera, MessageCircle } from "lucide-react";
import { c } from "../constants/palette";
import { NAV_LINKS } from "../constants/data";
import { useConfig } from "../../hooks/useConfig";

export function Footer() {
  const { config } = useConfig();
  const waNum = config.whatsapp_numero || "573001234567";
  const waMsg = config.whatsapp_mensaje || "";
  const waLink = `https://wa.me/${waNum}${waMsg ? `?text=${encodeURIComponent(waMsg)}` : ""}`;
  const igLink = config.instagram_url || "https://instagram.com/aromaticcol";
  const ttLink = config.tiktok_url || "https://tiktok.com/@aromaticcol";

  const social = [
    { label: "Instagram", icon: Camera,        href: igLink  },
    { label: "WhatsApp",  icon: MessageCircle, href: waLink  },
  ];
  const goto = (id: string) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer style={{ padding: "48px 0", background: c.night, borderTop: "1px solid rgba(201,139,92,0.16)" }}>
      <div className="wrap">
        <div className="footer-main">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.sage}, ${c.fern})` }}>
              <Leaf size={15} color="#FFF8F1" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, color: c.ivory }}>Aromaticcol</span>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => goto(l)}
                style={{ fontSize: 13, color: c.ivory, opacity: 0.38, background: "none", border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.90")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.38")}>{l}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {social.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: c.ivory, background: "rgba(138,175,135,0.15)", border: "1px solid rgba(138,175,135,0.25)", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(138,175,135,0.28)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(138,175,135,0.15)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                <s.icon size={15} />
              </a>
            ))}
            <a href={ttLink} target="_blank" rel="noreferrer" aria-label="TikTok"
              style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: c.ivory, background: "rgba(138,175,135,0.15)", border: "1px solid rgba(138,175,135,0.25)", fontSize: 11, fontWeight: 700, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              TK
            </a>
          </div>
        </div>

        <div className="footer-bottom" style={{ color: c.stone, opacity: 0.45 }}>
          <p>© {new Date().getFullYear()} Aromaticcol. Todos los derechos reservados.</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <p>Hecho con amor para tu bienestar</p>
            <a href="/admin/login"
              style={{ fontSize: 11, color: `${c.sage}50`, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = `${c.sage}cc`)}
              onMouseLeave={e => (e.currentTarget.style.color = `${c.sage}50`)}
            >Administración</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
