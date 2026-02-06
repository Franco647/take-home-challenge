# Architectural Decisions – Dev Challenge TEKNE

Este documento resume las principales decisiones técnicas tomadas durante el desarrollo del challenge.

---

## Diseño OOP y Rule Engine

Se implementó un **Rule Engine** con una clase abstracta `BusinessRule` y reglas concretas (`PropertyMinInsuredValueRule`, `AutoMinInsuredValueRule`).

**Motivos:**
- Aplicar herencia y polimorfismo sobre el dominio
- Evitar lógica condicional rígida
- Facilitar la extensión futura (nuevas reglas sin modificar el motor)

---

## Separación Controller / Service / Repository

Se adoptó una arquitectura en capas:

- Controller: HTTP / Express
- Service: lógica de negocio
- Repository: acceso a datos (Prisma)

Esto mejora:
- Testabilidad
- Mantenibilidad
- Claridad del dominio

---

## Paginación basada en limit / offset

Se utilizó `limit + offset` porque:
- Es simple de implementar
- Es suficiente para el volumen esperado
- Se adapta bien a UI con botones Next / Prev

Para grandes volúmenes, se podría migrar a cursor-based pagination.

---

## Idempotencia en Upload CSV

- `policy_number` es UNIQUE
- Se usa `createMany + skipDuplicates`

Esto permite:
- Reintentos seguros
- Evitar duplicados
- Soportar reenvíos del mismo archivo

---

## Correlation ID

Cada request utiliza `x-correlation-id`:
- Se genera si no viene en el header
- Se propaga a logs, DB y respuestas

Esto permite trazabilidad end-to-end y debugging efectivo.

---

## Feature de IA

La feature de IA no introduce un modelo externo:
- Reutiliza datos existentes (`policies` y `summary`)
- Genera insights determinísticos y explicables

Esto mantiene:
- Simplicidad
- Transparencia
- Bajo costo

---

## Escalabilidad

El sistema fue diseñado como stateless:
- API horizontalmente escalable
- Reglas desacopladas
- DB preparada para crecer

---

## Trade-offs

- No se incluyeron tests automatizados por límite de tiempo
- La IA es rule-based en lugar de LLM real
- El frontend prioriza usabilidad sobre diseño visual

Estas decisiones se tomaron para maximizar claridad y cumplimiento del challenge.
