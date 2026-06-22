
CREATE TABLE IF NOT EXISTS ciudades (
  codigo TEXT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fueros (
  codigo TEXT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS organismos (
  codigo TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  caratula TEXT NOT NULL,
  ciudad_codigo TEXT NOT NULL,
  fuero_codigo TEXT NOT NULL,

  FOREIGN KEY (ciudad_codigo) REFERENCES ciudades(codigo),
  FOREIGN KEY (fuero_codigo) REFERENCES fueros(codigo)
);

CREATE TABLE IF NOT EXISTS personas (
  dni TEXT PRIMARY KEY,
  apellido TEXT NOT NULL,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tipos_vinculo (
  id INTEGER PRIMARY KEY,
  descripcion TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS expedientes (
  clave TEXT PRIMARY KEY,
  organismo_codigo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  numero INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  caratula TEXT NOT NULL,
  ciudad_codigo TEXT NOT NULL,

  FOREIGN KEY (organismo_codigo) REFERENCES organismos(codigo),
  FOREIGN KEY (ciudad_codigo) REFERENCES ciudades(codigo),

  UNIQUE (organismo_codigo, tipo, numero, anio)
);

CREATE TABLE IF NOT EXISTS expediente_personas (
  expediente_clave TEXT NOT NULL,
  persona_dni TEXT NOT NULL,
  tipo_vinculo_id INTEGER NOT NULL,

  PRIMARY KEY (expediente_clave, persona_dni),

  FOREIGN KEY (expediente_clave) REFERENCES expedientes(clave),
  FOREIGN KEY (persona_dni) REFERENCES personas(dni),
  FOREIGN KEY (tipo_vinculo_id) REFERENCES tipos_vinculo(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_expediente_unico_actor
ON expediente_personas (expediente_clave)
WHERE tipo_vinculo_id = 1;

INSERT OR IGNORE INTO tipos_vinculo (id, descripcion) VALUES
  (1, 'ACTOR'),
  (2, 'DEMANDADO'),
  (3, 'CONDENADO'),
  (4, 'VICTIMA');

INSERT OR IGNORE INTO ciudades (codigo, nombre) VALUES
  ('NQ', 'Neuquén'),
  ('ZA', 'Zapala'),
  ('JU', 'Junín de los Andes');

INSERT OR IGNORE INTO fueros (codigo, nombre) VALUES
  ('EJ', 'Ejecutivos'),
  ('CI', 'Civil'),
  ('LA', 'Laboral'),
  ('FA', 'Familia');