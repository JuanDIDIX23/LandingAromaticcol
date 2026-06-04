-- ============================================================
-- AromaticCol — Schema Supabase
-- Ejecuta este script en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Prospectos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prospectos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT now(),
  nombre           TEXT NOT NULL,
  email            TEXT,
  telefono         TEXT NOT NULL,
  mensaje          TEXT,
  producto_interes TEXT,
  feria_origen     TEXT,
  estado           TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'convertido'))
);

CREATE INDEX IF NOT EXISTS idx_prospectos_created_at ON prospectos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prospectos_estado ON prospectos(estado);

-- ── Ferias ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ferias (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT now(),
  nombre           TEXT NOT NULL,
  centro_comercial TEXT NOT NULL,
  ciudad           TEXT NOT NULL DEFAULT 'Bogotá',
  fecha_inicio     DATE NOT NULL,
  fecha_fin        DATE NOT NULL,
  descripcion      TEXT,
  imagen_url       TEXT,
  activa           BOOLEAN DEFAULT true,
  dias_horario     TEXT,
  orden            INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ferias_activa ON ferias(activa);

-- ── Productos ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT now(),
  titulo          TEXT NOT NULL,
  tag             TEXT,
  descripcion     TEXT,
  tipo            TEXT DEFAULT 'humidifier',
  activo          BOOLEAN DEFAULT true,
  imagen_url      TEXT,
  whatsapp_texto  TEXT,
  orden           INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- ── Contenido (CMS) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contenido (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion  TEXT NOT NULL,
  clave    TEXT NOT NULL,
  valor    TEXT,
  tipo     TEXT DEFAULT 'text' CHECK (tipo IN ('text', 'image_url', 'html')),
  UNIQUE(seccion, clave)
);

INSERT INTO contenido (seccion, clave, valor, tipo) VALUES
  ('hero', 'titulo',          'Transforma tu espacio con aromaterapia', 'text'),
  ('hero', 'subtitulo',       'Humidificadores y difusores aesthetic diseñados para crear ambientes relajantes y elegantes en tu hogar.', 'text'),
  ('hero', 'boton_principal', 'Ver productos', 'text'),
  ('hero', 'badge',           'Aromaterapia de calidad premium', 'text'),
  ('cta',  'titulo',          'Convierte cualquier espacio en un lugar más relajante', 'text'),
  ('cta',  'subtitulo',       'Contáctanos y descubre la colección de aromaterapia que transformará tu hogar.', 'text')
ON CONFLICT (seccion, clave) DO NOTHING;

-- ── Galería ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS galeria (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT now(),
  url          TEXT NOT NULL,
  storage_path TEXT,
  categoria    TEXT DEFAULT 'general',
  nombre       TEXT,
  orden        INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_galeria_categoria ON galeria(categoria);

-- ── Configuración general ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS config_general (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT NOT NULL UNIQUE,
  valor TEXT,
  tipo  TEXT DEFAULT 'text'
);

INSERT INTO config_general (clave, valor, tipo) VALUES
  ('whatsapp_numero',   '573001234567',                                     'text'),
  ('whatsapp_mensaje',  'Hola, me interesa conocer más sobre sus productos', 'text'),
  ('instagram_url',     'https://instagram.com/aromaticcol',                 'url'),
  ('tiktok_url',        'https://tiktok.com/@aromaticcol',                   'url'),
  ('email_contacto',    'contacto@aromaticcol.com',                          'text'),
  ('direccion',         'Bogotá, Colombia',                                  'text'),
  ('horario_atencion',  'Lun – Dom 9am – 8pm',                               'text')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE prospectos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferias        ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenido     ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria       ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_general ENABLE ROW LEVEL SECURITY;

-- Prospectos: cualquiera puede insertar (formulario landing), solo auth puede leer/editar
CREATE POLICY "anon_insert_prospectos"      ON prospectos FOR INSERT TO anon            WITH CHECK (true);
CREATE POLICY "auth_manage_prospectos"      ON prospectos FOR ALL   TO authenticated    USING (true);

-- Ferias: cualquiera puede leer, solo auth puede modificar
CREATE POLICY "public_read_ferias"          ON ferias     FOR SELECT TO anon            USING (true);
CREATE POLICY "auth_manage_ferias"          ON ferias     FOR ALL   TO authenticated    USING (true);

-- Productos: cualquiera puede leer activos, solo auth puede modificar
CREATE POLICY "public_read_productos"       ON productos  FOR SELECT TO anon            USING (true);
CREATE POLICY "auth_manage_productos"       ON productos  FOR ALL   TO authenticated    USING (true);

-- Contenido: cualquiera puede leer, solo auth puede modificar
CREATE POLICY "public_read_contenido"       ON contenido  FOR SELECT TO anon            USING (true);
CREATE POLICY "auth_manage_contenido"       ON contenido  FOR ALL   TO authenticated    USING (true);

-- Galería: cualquiera puede leer, solo auth puede modificar
CREATE POLICY "public_read_galeria"         ON galeria    FOR SELECT TO anon            USING (true);
CREATE POLICY "auth_manage_galeria"         ON galeria    FOR ALL   TO authenticated    USING (true);

-- Config: cualquiera puede leer, solo auth puede modificar
CREATE POLICY "public_read_config"          ON config_general FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_manage_config"          ON config_general FOR ALL   TO authenticated USING (true);

-- ============================================================
-- Storage buckets (crear manualmente en Supabase Dashboard →
-- Storage → New bucket, marcar como "Public")
-- Buckets necesarios: ferias, productos, galeria
-- ============================================================
