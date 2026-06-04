export interface Prospecto {
  id: string;
  created_at: string;
  nombre: string;
  email: string | null;
  telefono: string;
  mensaje: string | null;
  producto_interes: string | null;
  feria_origen: string | null;
  estado: 'nuevo' | 'contactado' | 'convertido';
}

export interface Feria {
  id: string;
  created_at: string;
  nombre: string;
  centro_comercial: string;
  ciudad: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string | null;
  imagen_url: string | null;
  activa: boolean;
  dias_horario: string | null;
  orden: number;
}

export interface Producto {
  id: string;
  created_at: string;
  titulo: string;
  tag: string | null;
  descripcion: string | null;
  tipo: string | null;
  activo: boolean;
  imagen_url: string | null;
  whatsapp_texto: string | null;
  orden: number;
}

export interface ContenidoItem {
  id: string;
  seccion: string;
  clave: string;
  valor: string | null;
  tipo: 'text' | 'image_url' | 'html';
}

export interface GaleriaItem {
  id: string;
  created_at: string;
  url: string;
  storage_path: string | null;
  categoria: string;
  nombre: string | null;
  orden: number;
}

export interface ConfigItem {
  id: string;
  clave: string;
  valor: string | null;
  tipo: string;
}

export interface ProspectoFormData {
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  producto_interes?: string;
  feria_origen?: string;
}

export type EstadoProspecto = 'nuevo' | 'contactado' | 'convertido';
