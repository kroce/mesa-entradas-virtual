# Mesa de Entradas Virtual

Aplicación web para registrar expedientes en una Mesa de Entradas Virtual.

El proyecto utiliza una arquitectura cliente-servidor, con backend en Node.js/Express y frontend en React.

## Stack

### Backend

- Node.js
- TypeScript
- Express
- SQLite

### Frontend

- Vite
- React
- TypeScript
- Ant Design

## Estructura del proyecto

```txt
mesa-entradas-virtual/
  backend/
  frontend/
  README.md
```

## Funcionalidades requeridas

El sistema debe permitir:

- Registrar expedientes con una persona principal con vínculo ACTOR.
- Asociar varias personas a un expediente con vínculos DEMANDADO, CONDENADO o VICTIMA.
- Administrar y listar los expedientes asociados a una persona.
- Administrar y listar las personas asociadas a un expediente.
- Administrar y listar organismos.
- Mostrar estadísticas de expedientes registrados por año, ciudad y fuero.

## Decisiones de diseño

- Se utiliza una arquitectura cliente-servidor.
- El frontend y el backend viven en el mismo repositorio para simplificar la entrega y la puesta en marcha.
- El backend se organiza en capas simples:
  - `routes`: definición de endpoints.
  - `controllers`: manejo de request/response.
  - `services`: reglas de negocio y coordinación de casos de uso.
  - `repositories`: acceso a datos.
  - `domain`: tipos principales del modelo.

- Se utiliza SQLite por practicidad y porque el dominio requiere relaciones entre entidades.
- Las ciudades, fueros y tipos de vínculo se modelan como catálogos para evitar valores hardcodeados en la lógica de negocio.
- La relación entre expedientes y personas se modela como una relación muchos a muchos mediante la tabla `expediente_personas`.
- La regla de un único ACTOR principal por expediente se refuerza desde la lógica de negocio y desde la base de datos.

## Estado de implementación

Implementado en backend:

- Alta y listado de personas.
- Alta y listado de organismos.
- Alta y listado de expedientes.
- Asociación de personas a expedientes mediante tipos de vínculo.
- Consulta de personas asociadas a un expediente.
- Consulta de expedientes asociados a una persona, incluyendo el vínculo correspondiente.
- Estadísticas de expedientes agrupadas por año, ciudad y fuero.

Pendiente / en desarrollo:

- Interfaz frontend para operar los flujos principales.
- Visualización de estadísticas en tablas.

## Posibles mejoras

- Permitir agregar, modificar o quitar personas asociadas a un expediente luego de su creación.

## Puesta en marcha

### Backend

Desde la carpeta `backend`, instalar dependencias:

```bash
npm install
```

Levantar el servidor en modo desarrollo:

```bash
npm run dev
```

Por defecto, el backend queda disponible en:

```txt
http://localhost:3000
```

El puerto puede modificarse usando la variable de entorno `PORT`. Por ejemplo:

```bash
PORT=3001 npm run dev
```

Endpoint de verificación:

```txt
GET http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

### Comandos útiles

Verificar compilación de TypeScript:

```bash
npm run build
```

Ejecutar linter:

```bash
npm run lint
```

Formatear el código:

```bash
npm run format
```
