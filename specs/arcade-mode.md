# Especificación Viva: Modo Arcade y Personalidades de IA

**Estado**: Vivo / Vigente en Producción  
**Área**: Inteligencia Artificial, Campaña Unipersonal y Heurísticas  
**Archivos fuente principales**: `ai/arcade-ai-utils.js`, `ai/personalities/*.js`, `script.js`

---

## 1. Visión General del Modo Arcade

El **Modo Arcade** es una campaña individual donde el jugador compite contra una serie progresiva de jefes de inteligencia artificial. Cada combate presenta dimensiones de tablero escalonadas, mayor número de líneas objetivo y personalidades con capacidades tácticas crecientes.

---

## 2. Secuencia de Combates y Jefes

| Combate | Jefe | Símbolo / Avatar | Escenario (Filas $\times$ Cols) | Líneas Objetivo ($K$) | Estilo Táctico |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **Boss X** | `X` | $3 \times 3$ | 1 | **Caótico / Principiante**: Movimientos semi-aleatorios, ignora bloqueos simples. |
| **2** | **Boss O** | `O` | $6 \times 6$ | 5 | **Estratégico / Defensivo**: Prioriza control del centro y bloqueo activo de líneas inmediatas. |
| **3** | **Boss △ (A)** | `△` | $7 \times 8$ | 7 | **Agresivo / Oportunista**: Busca maximizar conexiones simultáneas y bifurcaciones. |
| **4** | **Boss @** | `@` | $8 \times 10$ | 9 | **Avanzado / Equilibrado**: Heurística de doble amenaza, evalúa amenazas tanto horizontales como diagonales. |
| **5** | **Boss #** | `#` | $8 \times 10$ | 9 | **Maestro Táctico**: Evaluación profunda con búsqueda Minimax acotada ($depth=2$), anticipación de réplica y corte alfa-beta. |

---

## 3. Arquitectura del Motor de IA

### Librería Compartida (`window.ArcadeAiUtils`)
Todas las personalidades delegan sus cálculos espaciales en `ai/arcade-ai-utils.js`:

- `getEmptyCells(board)`: Retorna índices disponibles libres de fichas.
- `findImmediateLineMove(ctx, symbol)`: Simula colocación en cada celda libre y detecta si completa inmediatamente una línea de longitud $N$.
- `findBlockingMove(ctx, opponentSymbol)`: Detecta y devuelve la celda requerida para interceptar la victoria inmediata del adversario.
- `evaluateBoardHeuristic(ctx, symbol, opponentSymbol)`: Calcula el balance posicional ponderando casillas centrales, líneas semi-completadas y bifurcaciones potenciales.
- `minimax(board, depth, isMaximizing, alpha, beta)`: Motor de árbol de decisión para el jefe final (`Boss Hash`).

### Aislamiento de Módulos
Cada personalidad reside en su propio script en `ai/personalities/`:
- `boss-x.js`
- `boss-o.js`
- `boss-a.js`
- `boss-at.js`
- `boss-hash.js`

Al activarse su turno, el motor invoca:
```javascript
const moveIndex = window.ArcadeBosses[bossSymbol].calculateMove(context);
```

---

## 4. Gestión de Fichas y Resolución de Conflictos

1. **Selección del Jugador**: El usuario escoge libremente su símbolo en la pantalla de bienvenida o configuración.
2. **Conflicto de Símbolos**: Si el jugador escoge un símbolo idéntico al del jefe actual (por ejemplo, el jugador elige `X` contra Boss X):
   - El sistema reasigna al jefe el primer símbolo disponible de la reserva de reserva (`ARCADE_ALT_TOKENS = ['1', '2', '3', '4', ...]`).
3. **Avatares y Temas**: Cada jefe posee ilustraciones dedicadas en `images/characters/` tanto de cuerpo completo como de primer plano (`close_up`), así como una paleta de color CSS única.

---

## 5. Transiciones y Flujo de Campaña

1. **Pantalla de Entrada (Intro Screen)**: Al iniciar un combate, se presenta una pantalla con la ilustración del jefe, su nombre en tipografía retro arcade y un jingle sintetizado.
2. **Victoria del Jugador**: Se reproduce sonido triunfal, se incrementa el contador de victorias de la campaña y se inicia el siguiente combate.
3. **Derrota del Jugador**: Se ofrece reiniciar el combate actual sin perder el progreso global de la partida.
4. **Empate**: Se permite reintentar el nivel actual manteniendo la configuración intacta.
