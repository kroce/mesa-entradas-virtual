
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

INSERT OR IGNORE INTO ciudades (codigo, nombre) VALUES
  ('NQ', 'Neuquén'),
  ('ZA', 'Zapala'),
  ('JU', 'Junín de los Andes');

INSERT OR IGNORE INTO fueros (codigo, nombre) VALUES
  ('EJ', 'Ejecutivos'),
  ('CI', 'Civil'),
  ('LA', 'Laboral'),
  ('FA', 'Familia');