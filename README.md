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

## Decisiones iniciales de diseño

- Se utiliza una arquitectura cliente-servidor.
- El frontend y el backend viven en el mismo repositorio para simplificar la entrega y la puesta en marcha.
- El backend se organiza por capas: rutas, controllers, services y repositories.
- Se utiliza SQLite por practicidad y porque el dominio requiere relaciones entre entidades.
- Las ciudades y fueros se tratan como valores acotados según los requerimientos.

## Estado de implementación

Pendiente de desarrollo.

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
