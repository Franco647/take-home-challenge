# Deployment Strategy – Dev Challenge TEKNE

Este documento describe cómo desplegaría esta solución en un entorno productivo en **Azure**, siguiendo buenas prácticas de seguridad, escalabilidad y observabilidad.

El despliegue propuesto es **conceptual / high-level**, tal como solicita el challenge.

---

## Arquitectura Propuesta (Azure)

### Backend (API)

**Opción recomendada:**  
👉 **Azure App Service (Node.js)**

Alternativa válida:  
• Azure Functions (HTTP-triggered), separando endpoints

**Motivos de App Service:**
- Simplicidad para APIs REST tradicionales
- Buen soporte para Node.js + Express
- Fácil integración con CI/CD
- Escalado automático horizontal

---

### Base de Datos

**Azure Database for PostgreSQL – Flexible Server**

- PostgreSQL managed
- Backups automáticos
- Escalado vertical
- Conexión privada (VNet) opcional

---

### Frontend

**Azure Static Web Apps** o **Azure Blob Storage + CDN**

- Build generado por Vite
- Archivos estáticos
- Muy bajo costo
- Integración directa con GitHub Actions

---

## Manejo de Secrets

**Azure Key Vault**

Variables sensibles almacenadas como secretos:
- `DATABASE_URL`
- Credenciales de PostgreSQL
- Cualquier API Key futura (IA, etc.)

El backend las consume vía:
- Managed Identity
- App Service Configuration

---

## Observabilidad y Logs

**Azure Application Insights**

- Logs estructurados del backend
- Métricas de performance
- Errores por endpoint
- Búsqueda por `correlation_id`

Ejemplo de campos observados:
- correlation_id
- operation_id
- endpoint
- duration_ms
- rows_inserted / rows_rejected

---

## CI / CD (High-Level)

**GitHub Actions**

Pipeline sugerido:

### Backend
1. Install dependencies
2. Run tests (si existieran)
3. Build TypeScript
4. Prisma generate
5. Deploy a Azure App Service

### Frontend
1. Install dependencies
2. Build Vite
3. Deploy a Static Web App

Deploy automático al hacer merge a `main`.

---

## Escalabilidad

- Backend: escalado horizontal vía App Service Plan
- DB: escalado vertical y read replicas
- Stateless API (compatible con load balancing)
- Idempotencia en uploads CSV evita duplicados en reintentos

---

## Resumen

Esta arquitectura:
- Cumple con los requisitos del challenge
- Es simple pero productiva
- Escala correctamente
- Mantiene seguridad y observabilidad

Está pensada para crecer sin reescrituras significativas.
