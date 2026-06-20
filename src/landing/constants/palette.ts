// ── Paleta Aromaticcol — luz natural, calma y bienestar premium ─────────────
// Inspiración: madera clara, plantas, luz de ventana, lino, aromaterapia
export const c = {
  // ── Fondos de sección (cálidos → frescos, conectados) ───────────────────
  heroBg:      "#F3E6D6",   // Hero – crema cálida
  benefitsBg:  "#E8D4BE",   // Beneficios – tostado suave
  productsBg:  "#DDE8DB",   // Productos – verde salvia muy claro
  feriasBg:    "#F0DEC9",   // Ferias – lino suave
  coberturaBg: "#DCE7DF",   // Cobertura – verde nebuloso
  galleryBg:   "#EEF2EA",   // Galería – blanco verdoso
  contactBg:   "#F2E7D9",   // Contacto – crema caliente
  footerBg:    "#D9C5AE",   // Footer – arena tostada

  // ── Texto ────────────────────────────────────────────────────────────────
  brown:       "#5C4B3A",   // principal
  brownMid:    "#7A6A59",   // secundario
  brownLight:  "#9B8A79",   // tenue / etiquetas

  // ── Acento ───────────────────────────────────────────────────────────────
  accent:      "#C98B5C",   // ámbar cálido
  accentHov:   "#B97A4E",   // hover
  accentAct:   "#A96942",   // active
  accentText:  "#FFF8F1",   // texto sobre botón

  // ── Alias de compatibilidad (texto: antes claro, ahora oscuro) ───────────
  ivory:       "#5C4B3A",
  stone:       "#7A6A59",
  mint:        "#9B8A79",

  // ── Verdes decorativos para iconos ───────────────────────────────────────
  sage:        "#8AAF87",
  fern:        "#A8C5A4",

  // ── Acentos cálidos unificados ────────────────────────────────────────────
  cedar:       "#C98B5C",
  terracotta:  "#C98B5C",
  clay:        "#B97A4E",
  gold:        "#C98B5C",
  goldLight:   "#C98B5C",

  // ── Fondos (alias para código heredado) ───────────────────────────────────
  night:       "#D9C5AE",   // footer
  forestDeep:  "#DCE7DF",   // cobertura
  mossDark:    "#DDE8DB",   // productos

  // ── Misceláneos ───────────────────────────────────────────────────────────
  sageBb:      "#DDE8DB",
  fernBg:      "#EEF2EA",
  walnut:      "#C98B5C",
  darkForest:  "#F2E7D9",
  cardGreen:   "#CFE0CD",
  warmIvory:   "#F0DEC9",
  sand:        "#DCC6A8",
} as const;

export type Palette = typeof c;
