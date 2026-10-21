# Especificaciones Vivas (Living Specs) - 3 en Raya Personalizable

Este directorio contiene la **documentación viva y exhaustiva** del sistema. A diferencia del archivo histórico de iteraciones (`specs/archive/`), estos documentos reflejan el **estado actual, las capacidades y el comportamiento en tiempo real** de la aplicación.

## Índice de Especificaciones Vivas

1. **[Motor Central y Reglas de Juego (`core-game.md`)](./core-game.md)**
   - Dimensiones dinámicas del tablero ($3 \times 3$ hasta $100 \times 100$).
   - Algoritmo de evaluación codiciosa (greedy) de líneas y cruces.
   - Puntuación por movimientos, líneas consecutivas y combos simultáneos.
   - Gestión de turnos y condiciones de victoria ($N$ marcas consecutivas, $K$ líneas objetivo).

2. **[Modo Arcade y Personalidades de IA (`arcade-mode.md`)](./arcade-mode.md)**
   - Secuencia de progresión de combate (Boss X, Boss O, Boss △, Boss @, Boss #).
   - Heurísticas tácticas, pesos de decisión y niveles de dificultad (Minimax vs. aleatorio).
   - Utilidades compartidas del motor de IA (`ArcadeAiUtils`).
   - Gestión de fichas y temas de los jefes.

3. **[Diseño UI/UX y Sistema Responsive (`ui-ux-design.md`)](./ui-ux-design.md)**
   - Navegación por pasos en el asistente de configuración.
   - Adaptabilidad para smartphones y tablets (`dvh`, celdas mínimas de 36px, scrolling bidireccional).
   - Síntesis de efectos de sonido procedurales mediante Web Audio API.
   - Efectos visuales interactivos: líneas de victoria animadas, sacudidas de pantalla y estados de avatar.

4. **[Aseguramiento de Calidad y Pruebas E2E (`e2e-testing.md`)](./e2e-testing.md)**
   - Arquitectura de pruebas end-to-end con Playwright.
   - Matriz de casos de prueba (navegación, jugabilidad 2P, escenarios responsive, combate IA).
   - Comandos de ejecución y criterios de aceptación (Quality Gates).

---

## Archivo Histórico

Los planes iniciales, especificaciones de funcionalidades pasadas y listas de tareas por iteración se conservan organizados cronológicamente en:
- **[`specs/archive/`](./archive/)**
