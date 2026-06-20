import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, MessageCircle, Menu, X } from "lucide-react";
import { c } from "../constants/palette";
import { NAV_LINKS } from "../constants/data";

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goto = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? "rgba(243,230,214,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(22px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,139,92,0.18)" : "none",
          transition: "all 0.45s ease",
        }}
        initial={{ y: -80 }} animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="wrap" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.sage}, ${c.fern})` }}>
              <Leaf size={15} color={c.accentText} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: c.brown }}>Aromaticcol</span>
          </a>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => goto(l)}
                style={{ fontSize: 14, fontWeight: 500, color: "rgba(92,75,58,0.68)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = c.brown)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(92,75,58,0.68)")}
              >{l}</button>
            ))}
          </div>

          {/* CTA */}
          <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
            style={{ display: "none", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", color: c.accentText, background: `linear-gradient(135deg, ${c.accent}, ${c.accentHov})`, boxShadow: "0 4px 16px rgba(201,139,92,0.28)" }}
            className="hidden md:flex">
            <MessageCircle size={15} /> Escríbenos
          </a>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", color: c.brown, padding: 6 }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", flexDirection: "column", padding: "80px 24px 32px", background: "rgba(243,230,214,0.97)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
              {NAV_LINKS.map((l, i) => (
                <motion.button key={l} onClick={() => goto(l)}
                  style={{ textAlign: "left", fontSize: 24, fontWeight: 600, padding: "16px 0", color: c.brown, background: "none", border: "none", borderBottom: "1px solid rgba(201,139,92,0.18)", cursor: "pointer" }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  {l}
                </motion.button>
              ))}
            </div>
            <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
              style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 24px", borderRadius: 16, fontSize: 15, fontWeight: 600, textDecoration: "none", color: c.accentText, background: `linear-gradient(135deg, ${c.accent}, ${c.accentHov})` }}>
              <MessageCircle size={18} /> Escríbenos por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
