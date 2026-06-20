import type { Feria } from "../../types";

export const FERIAS_DEFAULT: Feria[] = [
  { id: "1", nombre: "Multicentro", ciudad: "Bogotá", dias_horario: "Jue – Dom", activa: true, centro_comercial: "Multicentro", created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 0 },
  { id: "2", nombre: "Titán Plaza", ciudad: "Bogotá", dias_horario: "Vie – Dom", activa: true, centro_comercial: "Titán Plaza", created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 1 },
  { id: "3", nombre: "Hayuelos",    ciudad: "Bogotá", dias_horario: "Sáb – Dom", activa: true, centro_comercial: "Hayuelos",    created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 2 },
  { id: "4", nombre: "Mallplaza",   ciudad: "Bogotá", dias_horario: "Vie – Dom", activa: true, centro_comercial: "Mallplaza",   created_at: "", fecha_inicio: "", fecha_fin: "", descripcion: null, imagen_url: null, orden: 3 },
];

export const STATS = [
  { value: 1200, suffix: "+", label: "Clientes felices"   },
  { value: 8,    suffix: "",  label: "Ciudades"           },
  { value: 3500, suffix: "+", label: "Productos vendidos" },
] as const;

export const BENEFITS = [
  { icon: "Wind",     title: "Relajación",        desc: "Crea un ambiente de calma y tranquilidad en cualquier espacio de tu hogar.",     color: "#6a9860", bg: "rgba(106,152,96,0.14)"  },
  { icon: "Sparkles", title: "Ambiente aesthetic", desc: "Diseños elegantes que se integran perfectamente a tu decoración interior.",       color: "#b8976a", bg: "rgba(184,151,106,0.14)" },
  { icon: "Leaf",     title: "Aromaterapia",       desc: "Esencias 100% naturales que estimulan tus sentidos y elevan tu ánimo.",           color: "#4d7a55", bg: "rgba(77,122,85,0.14)"   },
  { icon: "Heart",    title: "Bienestar diario",   desc: "Un ritual de bienestar que transforma tu rutina en una experiencia de lujo.",     color: "#b5614a", bg: "rgba(181,97,74,0.12)"   },
] as const;

export const PRODUCTS_DEFAULT = [
  { type: "humidifier" as const, title: "Humidificadores",     tag: "Más vendido", desc: "Tecnología ultrasónica silenciosa que transforma el ambiente de cualquier habitación con una neblina suave y reconfortante." },
  { type: "diffuser"   as const, title: "Difusores de aroma",  tag: "Aesthetic",   desc: "Diseñados para dispersar tus esencias favoritas de forma uniforme, creando una atmósfera sensorial única y envolvente." },
  { type: "kit"        as const, title: "Kits de aromaterapia",tag: "Kit completo", desc: "Sets completos con difusor y esencias seleccionadas para comenzar tu experiencia de bienestar desde el primer día." },
] as const;

export const NAV_LINKS = ["Inicio", "Productos", "Ferias", "Contacto"] as const;
