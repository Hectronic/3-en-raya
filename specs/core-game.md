# Especificación Viva: Motor Central y Reglas de Juego

**Estado**: Vivo / Vigente en Producción  
**Área**: Motor de Juego, Evaluación de Tablero y Reglas de Victoria  
**Archivos fuente principales**: `script.js`, `index.html`, `style.css`

---

## 1. Visión General

El motor de **3 en Raya Personalizable** es una implementación en JavaScript ES6+ sin dependencias que desacopla la lógica de tablero clásico ($3 \times 3$, $N=3$, $K=1$) para permitir geometrías arbitrarias, reglas de victoria personalizadas y partidas multijugador local de 2 a 4 jugadores o combates individuales Arcade.

---

## 2. Parámetros de Configuración del Tablero

Cada partida se rige por un objeto de configuración (`config`):

| Parámetro | Rango Válido | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `rows` | $3 \le \text{filas} \le 100$ | 3 | Número de filas de la matriz del tablero. |
| `cols` | $3 \le \text{columnas} \le 100$ | 3 | Número de columnas de la matriz del tablero. |
| `winLength` ($N$) | $3 \le N \le \min(\text{rows}, \text{cols})$ | 3 | Número de marcas consecutivas idénticas necesarias para formar una línea. |
| `targetLines` ($K$) | $1 \le K \le 99$ | 1 | Cantidad de líneas que un jugador debe completar para ganar la partida. |
| `numPlayers` | $2 \le P \le 4$ | 2 | Número de jugadores locales participantes en modo VS. |

### Presets Predefinidos
El sistema incluye presets accesibles mediante tarjetas interactivas:
- **3x3 Clásico**: $3 \times 3$, $N=3$, $K=1$.
- **4x4 Cuarteto**: $4 \times 4$, $N=4$, $K=1$.
- **5x5 Batalla**: $5 \times 5$, $N=4$, $K=2$.
- **6x6 Táctico**: $6 \times 6$, $N=4$, $K=3$.
- **8x8 Épico**: $8 \times 8$, $N=5$, $K=3$.
- **Personalizado**: Parámetros libres definidos por el usuario en inputs numéricos.

---

## 3. Algoritmo Codicioso de Evaluación de Líneas (Greedy Line-Counting)

La detección de alineaciones sigue un principio **estrictamente codicioso**:

### Principios Fundamentales
1. **No reutilización en la misma dirección**: Las marcas que ya forman parte de una línea completada en una dirección específica no pueden ser aprovechadas para extender o formar una segunda línea en esa misma dirección.
   - *Ejemplo ($N=3$)*: Una fila consecutiva de `X X X X` cuenta como **1 línea** (las 3 primeras marcas se consumen, la 4ª queda libre).
   - *Ejemplo ($N=3$)*: Una fila consecutiva de `X X X X X X` cuenta como **2 líneas** independientes (celdas 0-1-2 y celdas 3-4-5).
2. **Cruce válido multidireccional**: Una misma celda SÍ puede formar parte simultáneamente de líneas en diferentes orientaciones:
   - Horizontal ($0^\circ$)
   - Vertical ($90^\circ$)
   - Diagonal descendente ($\searrow$, $45^\circ$)
   - Diagonal ascendente ($\nearrow$, $135^\circ$)
3. **Persistencia visual de líneas (Strikes)**: Cada línea detectada almacena sus celdas componentes y renderiza una línea de impacto (`strike-line`) de su color representativo sobre el tablero SVG/CSS.

---

## 4. Sistema de Puntuación y Progresión

Durante la partida se mantienen dos métricas por cada símbolo de jugador:
- **Líneas (`scores[symbol]`)**: Número acumulado de líneas de longitud $N$ conseguidas.
- **Puntos (`points[symbol]`)**: Puntuación total basada en acciones:

| Evento | Puntos Asignados | Constante |
| :--- | :--- | :--- |
| **Colocar ficha válida** | $+1$ punto | `MOVE_POINTS = 1` |
| **Completar una línea** | $+6$ puntos | `LINE_POINTS = 6` |
| **Combo por líneas múltiples** | $+4$ puntos por cada línea adicional | `COMBO_EXTRA_PER_LINE = 4` |

*Fórmula de combo*: Si un solo movimiento completa $L$ líneas simultáneamente ($L > 1$), los puntos por líneas son:
$$\text{Puntos} = (L \times 6) + ((L - 1) \times 4)$$

---

## 5. Reglas de Turnos y Ciclo de Vida

1. **Selección de Celda**:
   - Solo se admiten clics en celdas vacías (`null`).
   - Clics en celdas ocupadas no alteran el turno ni generan penalización.
2. **Alternancia de Jugadores**:
   - Tras cada movimiento válido, el índice de turno avanza: `currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers`.
3. **Condición de Victoria**:
   - Si un jugador alcanza `scores[symbol] >= config.targetLines`, el juego se detiene (`gameActive = false`), se resalta al ganador y se despliega el modal de fin de juego con felicitación y confeti procedural.
4. **Condición de Empate**:
   - Si todas las celdas del tablero están ocupadas (`board.every(cell => cell !== null)`) y ningún jugador alcanzó el objetivo de líneas, la partida finaliza en empate técnico.
