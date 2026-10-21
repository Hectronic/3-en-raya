# Archivo Histórico de Especificaciones (Spec Archive)

Este directorio almacena el registro cronológico e inmutable de los ciclos de especificación, planificación e implementación del proyecto mediante Spec-Driven Development (SDD).

## Estructura de Iteraciones Archivadas

Cada subdirectorio representa un incremento de funcionalidad completado:

1. **`001-core-game/`**: 
   - **Objetivo**: Núcleo del juego 3 en raya con reglas personalizables (tableros dinámicos, cálculo codicioso de líneas, condiciones de victoria K y N).
   - **Artefactos**: `spec.md`, `plan.md`, `tasks.md`.

2. **`002-arcade-ai/`**:
   - **Objetivo**: Modo de juego individual tipo Arcade, sistema de progresión contra jefes y personalidades de IA (`boss-x`, `boss-o`, `boss-a`, `boss-at`, `boss-hash`).
   - **Artefactos**: `spec.md`, `plan.md`, `tasks.md`.

3. **`003-mobile-responsive/`**:
   - **Objetivo**: Adaptación completa a dispositivos móviles y tablets (uso de `dvh`, tamaño mínimo de celdas a 36px, contenedores de scroll para tableros gigantes y diseño compacto de presets).
   - **Artefactos**: `spec.md`, `plan.md`, `tasks.md`.

4. **`004-playwright-e2e/`**:
   - **Objetivo**: Suite de pruebas End-to-End con Playwright para verificar navegación de configuración, partidas multijugador locales, responsividad móvil y combate Arcade.
   - **Artefactos**: `spec.md`, `plan.md`, `tasks.md`.

---
*Para consultar el comportamiento y las reglas actuales del sistema en producción, consulte las **especificaciones vivas** situadas directamente en el directorio raíz `specs/`.*
