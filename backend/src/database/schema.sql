
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

INSERT OR IGNORE INTO organismos (codigo, nombre, caratula, ciudad_codigo, fuero_codigo) VALUES
  ('JNQFA', 'Juzgado de Familia de Neuquén', 'Juzgado de Familia - Neuquén', 'NQ', 'FA'),
  ('JNQCI', 'Juzgado Civil de Neuquén', 'Juzgado Civil - Neuquén', 'NQ', 'CI'),
  ('JNQLA', 'Juzgado Laboral de Neuquén', 'Juzgado Laboral - Neuquén', 'NQ', 'LA'),
  ('JZACI', 'Juzgado Civil de Zapala', 'Juzgado Civil - Zapala', 'ZA', 'CI'),
  ('JZAEJ', 'Juzgado Ejecutivo de Zapala', 'Juzgado Ejecutivo - Zapala', 'ZA', 'EJ'),
  ('JZALA', 'Juzgado Laboral de Zapala', 'Juzgado Laboral - Zapala', 'ZA', 'LA'),
  ('JJUEJ', 'Juzgado Ejecutivo de Junín de los Andes', 'Juzgado Ejecutivo - Junín de los Andes', 'JU', 'EJ'),
  ('JJUFA', 'Juzgado de Familia de Junín de los Andes', 'Juzgado de Familia - Junín de los Andes', 'JU', 'FA');

INSERT OR IGNORE INTO personas (dni, apellido, nombre) VALUES
  ('28444555', 'López', 'Juan'),
  ('30111222', 'Pérez', 'Ana'),
  ('32123123', 'García', 'María'),
  ('33444555', 'Rodríguez', 'Carlos'),
  ('35666777', 'Martínez', 'Laura'),
  ('37111222', 'Fernández', 'Sofía'),
  ('38999888', 'Sánchez', 'Diego'),
  ('40123456', 'Romero', 'Valentina'),
  ('41777888', 'Torres', 'Nicolás'),
  ('42999111', 'Acosta', 'Camila'),
  ('43888777', 'Molina', 'Federico'),
  ('44777111', 'Suárez', 'Lucía');

INSERT OR IGNORE INTO expedientes (
  clave,
  organismo_codigo,
  tipo,
  numero,
  anio,
  caratula,
  ciudad_codigo
) VALUES
  ('JNQFA EXP 1/2026', 'JNQFA', 'EXP', 1, 2026, 'López Juan c/ Pérez Ana s/ alimentos', 'NQ'),
  ('JNQFA LEG 2/2025', 'JNQFA', 'LEG', 2, 2025, 'Romero Valentina c/ Fernández Sofía s/ cuidado personal', 'NQ'),
  ('JNQCI EXP 3/2026', 'JNQCI', 'EXP', 3, 2026, 'García María c/ Rodríguez Carlos s/ daños y perjuicios', 'NQ'),
  ('JNQLA EXP 4/2024', 'JNQLA', 'EXP', 4, 2024, 'Fernández Sofía c/ Martínez Laura s/ diferencias salariales', 'NQ'),
  ('JNQLA LEG 5/2023', 'JNQLA', 'LEG', 5, 2023, 'Romero Valentina c/ López Juan s/ accidente laboral', 'NQ'),

  ('JZACI EXP 6/2026', 'JZACI', 'EXP', 6, 2026, 'Pérez Ana c/ Sánchez Diego s/ cumplimiento contractual', 'ZA'),
  ('JZACI LEG 7/2024', 'JZACI', 'LEG', 7, 2024, 'López Juan c/ García María s/ reivindicación', 'ZA'),
  ('JZAEJ EXP 8/2025', 'JZAEJ', 'EXP', 8, 2025, 'Martínez Laura c/ Torres Nicolás s/ ejecución fiscal', 'ZA'),
  ('JZAEJ EXP 9/2022', 'JZAEJ', 'EXP', 9, 2022, 'Sánchez Diego c/ Acosta Camila s/ cobro ejecutivo', 'ZA'),
  ('JZALA LEG 10/2023', 'JZALA', 'LEG', 10, 2023, 'Molina Federico c/ Suárez Lucía s/ despido', 'ZA'),

  ('JJUEJ EXP 11/2026', 'JJUEJ', 'EXP', 11, 2026, 'Acosta Camila c/ Rodríguez Carlos s/ ejecución de honorarios', 'JU'),
  ('JJUEJ LEG 12/2025', 'JJUEJ', 'LEG', 12, 2025, 'Torres Nicolás c/ Pérez Ana s/ ejecutivo', 'JU'),
  ('JJUFA EXP 13/2024', 'JJUFA', 'EXP', 13, 2024, 'Suárez Lucía c/ Romero Valentina s/ violencia familiar', 'JU'),
  ('JJUFA EXP 14/2023', 'JJUFA', 'EXP', 14, 2023, 'García María c/ Molina Federico s/ régimen de comunicación', 'JU'),
  ('JNQCI LEG 15/2022', 'JNQCI', 'LEG', 15, 2022, 'Rodríguez Carlos c/ Fernández Sofía s/ sucesión', 'NQ');

INSERT OR IGNORE INTO expediente_personas (
  expediente_clave,
  persona_dni,
  tipo_vinculo_id
) VALUES
  ('JNQFA EXP 1/2026', '28444555', 1),
  ('JNQFA EXP 1/2026', '30111222', 2),
  ('JNQFA EXP 1/2026', '32123123', 4),

  ('JNQFA LEG 2/2025', '40123456', 1),
  ('JNQFA LEG 2/2025', '37111222', 2),

  ('JNQCI EXP 3/2026', '32123123', 1),
  ('JNQCI EXP 3/2026', '33444555', 2),
  ('JNQCI EXP 3/2026', '38999888', 4),

  ('JNQLA EXP 4/2024', '37111222', 1),
  ('JNQLA EXP 4/2024', '35666777', 2),

  ('JNQLA LEG 5/2023', '40123456', 1),
  ('JNQLA LEG 5/2023', '28444555', 2),
  ('JNQLA LEG 5/2023', '32123123', 4),

  ('JZACI EXP 6/2026', '30111222', 1),
  ('JZACI EXP 6/2026', '38999888', 2),
  ('JZACI EXP 6/2026', '35666777', 4),

  ('JZACI LEG 7/2024', '28444555', 1),
  ('JZACI LEG 7/2024', '32123123', 2),

  ('JZAEJ EXP 8/2025', '35666777', 1),
  ('JZAEJ EXP 8/2025', '41777888', 3),

  ('JZAEJ EXP 9/2022', '38999888', 1),
  ('JZAEJ EXP 9/2022', '42999111', 2),

  ('JZALA LEG 10/2023', '43888777', 1),
  ('JZALA LEG 10/2023', '44777111', 2),

  ('JJUEJ EXP 11/2026', '42999111', 1),
  ('JJUEJ EXP 11/2026', '33444555', 3),

  ('JJUEJ LEG 12/2025', '41777888', 1),
  ('JJUEJ LEG 12/2025', '30111222', 2),

  ('JJUFA EXP 13/2024', '44777111', 1),
  ('JJUFA EXP 13/2024', '40123456', 2),
  ('JJUFA EXP 13/2024', '37111222', 4),

  ('JJUFA EXP 14/2023', '32123123', 1),
  ('JJUFA EXP 14/2023', '43888777', 2),

  ('JNQCI LEG 15/2022', '33444555', 1),
  ('JNQCI LEG 15/2022', '37111222', 2);