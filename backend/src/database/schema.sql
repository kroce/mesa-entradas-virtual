
CREATE TABLE IF NOT EXISTS organismos (
  codigo TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  caratula TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  fuero TEXT NOT NULL,

  CHECK (ciudad IN ('Neuquén', 'Zapala', 'Junín de los Andes')),
  CHECK (fuero IN ('Ejecutivos', 'Civil', 'Laboral', 'Familia'))
);