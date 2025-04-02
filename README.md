# Incident API

API REST para reportar y gestionar incidentes técnicos de equipos.

## Requisitos

- Node.js
- SQLite

## Instalación

```bash
npm install
node db/init.js
npm start
```

## Endpoints

| Método | Endpoint         | Descripción                     |
|--------|------------------|----------------------------------|
| POST   | /incidents       | Crear un nuevo incidente        |
| GET    | /incidents       | Listar todos los incidentes     |
| GET    | /incidents/:id   | Consultar un incidente específico |
| PUT    | /incidents/:id   | Actualizar el estado del incidente |
| DELETE | /incidents/:id   | Eliminar un incidente           |

## Ejemplo de POST
```json
{
  "reporter": "Juan Pérez",
  "description": "La impresora no imprime desde ayer."
}
```
