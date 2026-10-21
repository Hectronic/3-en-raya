# Especificación Viva: Aseguramiento de Calidad y Pruebas E2E (Playwright)

**Estado**: Vivo / Vigente en Producción  
**Área**: Testing Automatizado, Validación End-to-End y Regresiones  
**Archivos fuente principales**: `tests/game.spec.js`, `playwright.config.js`, `package.json`

---

## 1. Visión General del Entorno de Pruebas

El proyecto implementa una suite integral de pruebas End-to-End (E2E) sin dependencias de backend, utilizando **Playwright** con el motor Chromium en modo headless. Las pruebas garantizan que ninguna modificación en la lógica del motor o en la hoja de estilos introduzca regresiones en la interfaz, en el cómputo de reglas o en la compatibilidad móvil.

---

## 2. Matriz de Casos de Prueba

La suite en `tests/game.spec.js` cubre 10 pruebas automatizadas clasificadas por área de impacto:

| ID | Área / Escenario | Descripción del Test | Criterio de Aceptación |
| :---: | :--- | :--- | :--- |
| **T-01** | Navegación Stepper | Transición completa adelante y atrás entre pasos 1, 2 y 3. | Visibilidad correcta de `#step-mode`, `#step-players` y `#step-boards` sin pérdida de estado. |
| **T-02** | Configuración Jugadores | Incremento y decremento del carrusel de número de jugadores (2 a 4). | El contador visual `#num-players-display` se actualiza y se restringe al intervalo $[2, 4]$. |
| **T-03** | Simulación Partida 2P | Partida local 1 vs 1 completa en tablero clásico 3x3. | Alternancia estricta de turnos (X $\to$ O), colocación de marcas, clases CSS `.cell.x` / `.cell.o` y protección de celdas ocupadas. |
| **T-04** | Reinicio de Partida | Uso del botón "Reiniciar Partida" a mitad o final de juego. | El tablero se vacía completamente (`board = null`), los marcadores se restablecen y el turno vuelve a X. |
| **T-05** | Retorno a Configuración | Regreso al panel de configuración desde el juego activo mediante "Volver a Configuración". | `#game-area` se oculta y `#config-panel` vuelve a ser visible en el paso inicial. |
| **T-06** | Presets de Tablero | Selección de tableros predefinidos (ej. 4x4, 5x5). | El tablero generado en `#game-board` tiene exactamente `rows * cols` celdas y la configuración refleja las reglas del preset. |
| **T-07** | Validación Custom | Configuración libre con valores extremos (ej. 10x10, N=4, K=2). | Se renderizan 100 celdas, las líneas se contabilizan al alcanzar 4 marcas y la victoria exige 2 líneas. |
| **T-08** | Adaptabilidad Móvil | Emulación de viewport estrecho de smartphone (375x667). | Las celdas respetan el tamaño mínimo de $36\text{px}$ y `.board-wrapper` activa scroll sin romper el diseño de la página. |
| **T-09** | Combate Arcade AI | Inicio de partida en modo Arcade contra Boss X. | El combate arranca, se muestra el avatar del jefe, el jugador realiza su primer movimiento y la IA responde automáticamente. |
| **T-10** | Detección de Victoria | Formación de una línea de victoria de longitud $N$. | Se genera la línea visual `strike-line`, se incrementa el marcador y se abre el modal `#game-over-modal`. |

---

## 3. Comandos de Ejecución

Para ejecutar las pruebas en local o en tuberías de CI:

```bash
# Ejecutar la suite completa en modo headless
npm test

# Ejecutar con interfaz gráfica para depuración visual
npx playwright test --headed

# Abrir el informe interactivo HTML de Playwright tras la ejecución
npx playwright show-report
```

---

## 4. Criterios de Aceptación (Quality Gates)

1. **100% de Pruebas Verdes**: Ningún Pull Request o cambio en ramas protegidas puede fusionarse si existe un solo fallo en `tests/game.spec.js`.
2. **Sin Errores en Consola del Navegador**: Las pruebas escuchan los eventos `console.error` de la página para asegurar que no se produzcan excepciones no controladas de JavaScript ni advertencias de Web Audio API suspendido.
3. **Determinismo**: No se admiten tiempos de espera arbitrarios (`page.waitForTimeout`); todas las aserciones deben emplear localizadores con auto-espera (`expect(locator).toBeVisible()`, etc.).
