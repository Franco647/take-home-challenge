Cambios clave:
- aclarar migraciones automáticas
- mejorar Docker section
- pequeños detalles de wording

# Backend – Insurance Policies API

Este proyecto implementa el **backend** del Take Home Challenge (TEKNE). Expone una API REST para la gestión de pólizas de seguros, carga masiva vía CSV, métricas agregadas y generación de *insights* mediante un módulo de análisis.

---

## Stack Tecnológico

- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **csv-parse**
- **Docker / Docker Compose**

---

## Estructura del Proyecto

src/
├─ modules/
│ ├─ policies/ # Dominio principal (pólizas)
│ │ ├─ domain/ # Reglas de negocio
│ │ │ └─ rules/
│ │ ├─ policies.controller.ts
│ │ ├─ policies.service.ts
│ │ ├─ policies.repository.ts
│ │ └─ policies.routes.ts
│ ├─ ai/ # Módulo de análisis / insights
│ │ ├─ ai.controller.ts
│ │ ├─ ai.service.ts
│ │ └─ ai.routes.ts
│ └─ operations/ # Tracking de operaciones
│ └─ operations.repository.ts
├─ shared/
│ ├─ prisma/ # Cliente Prisma
│ └─ middleware/ # Logger y error handler
└─ server.ts # Bootstrap del servidor

prisma/
└─ schema.prisma # Esquema de base de datos

---

## Arquitectura

- **Controller**: Manejo de HTTP
- **Service**: Lógica de negocio
- **Repository**: Acceso a datos (Prisma)
- **Domain Rules**: Validaciones desacopladas mediante Rule Engine

Este enfoque facilita testeo, mantenimiento y extensión del dominio.

---

## Correlation ID y Observabilidad

- Cada request utiliza `x-correlation-id`
- Si no se recibe, se genera automáticamente
- Se propaga en logs y respuestas

Middleware:
- `logger.middleware.ts`
- `error.middleware.ts`

---

## Modelo de Datos

### Policy
- `policy_number` es **único**
- Cargas CSV idempotentes (`createMany + skipDuplicates`)

### Operation
Registra el ciclo de vida de cargas CSV:
- RECEIVED
- COMPLETED
- FAILED

Incluye métricas de duración e inserciones.

---

## Endpoints

### POST /api/policies/upload
Carga masiva vía CSV.

```json
{
  "data": {
    "operation_id": "uuid",
    "correlation_id": "uuid",
    "inserted_count": 3,
    "rejected_count": 0,
    "errors": []
  }
}


GET /api/policies

Listado paginado y filtrable.

{
  "data": {
    "items": [],
    "pagination": {
      "limit": 25,
      "offset": 0,
      "total": 120
    }
  }
}

GET /api/policies/summary
Métricas agregadas.


POST /api/ai/insights
Generación de insights automáticos.


Reglas de Negocio
Property: insured_value_usd ≥ 5000
Auto: insured_value_usd ≥ 10000
Fechas válidas
Estados permitidos


Ejecución Local
npm install
npm run dev


Docker
docker compose up --build


---

# README GENERAL (ROOT) — ESTE ES EL MÁS IMPORTANTE

Este es el que ve primero el evaluador.

```md
# Dev Challenge – TEKNE

Implementación completa del **Take Home Challenge TEKNE**, compuesta por un **backend API**, un **frontend dashboard** y una **base de datos PostgreSQL**, todo orquestado mediante Docker.

---

## Arquitectura General

.
├─ backend/ # API REST (Node.js + Prisma)
├─ frontend/ # Dashboard (React + Vite)
└─ docker-compose.yml

---

## Stack Principal

- Node.js + Express
- React + TypeScript
- PostgreSQL
- Prisma ORM
- Docker / Docker Compose

---

## Ejecución del Proyecto

### Requisitos
- Docker + Docker Compose

### Levantar todo el stack

```bash
docker compose up --build
