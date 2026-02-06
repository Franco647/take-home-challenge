# Frontend – Insurance Policies Dashboard

Frontend del **Dev Challenge TEKNE**, desarrollado para consumir la API de pólizas y presentar métricas, carga de CSV y visualización operativa del sistema.

---

## Stack Tecnológico

- **React 18**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **React Router**
- **Axios**
- **Lucide Icons**
- **Sonner (toasts)**

---

## Estructura del Proyecto

src/
├─ components/ # Layout y componentes compartidos
├─ features/
│ ├─ dashboard/ # Dashboard y métricas
│ └─ policies/ # Listado y carga de pólizas
├─ services/ # Cliente HTTP (Axios)
├─ types/ # Tipos TypeScript alineados al API
├─ App.tsx # Ruteo principal
└─ main.tsx # Entry point


Arquitectura **feature-based**, orientada a escalabilidad y separación clara de responsabilidades.

---

## Requisitos

- Node.js **>= 18** (solo para ejecución local sin Docker)
- Backend operativo

---

## Ejecución Local (sin Docker)

```bash
npm install
npm run dev

---
---

La aplicación estará disponible en: http://localhost:5173


El frontend está dockerizado usando Nginx para servir los archivos estáticos.

docker compose up --build


Integración con Backend

Todas las requests incluyen automáticamente un x-correlation-id mediante un interceptor de Axios.

Los contratos de datos están alineados con el documento del challenge.

Endpoints Consumidos

GET /policies
GET /policies/summary
POST /policies/upload
POST /ai/insights

---

---

Funcionalidades

Dashboard
Métricas globales de pólizas
Primas totales
Distribución por estado y tipo

Gestión de Pólizas
Listado paginado
Búsqueda por texto
Estados visuales

Upload CSV
Carga de pólizas vía archivo CSV
Validaciones visuales
Trazabilidad por operación
Detalle de errores por fila

AI Insights
Análisis contextual de pólizas
Resumen de riesgos y recomendaciones

---