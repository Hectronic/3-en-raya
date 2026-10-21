# Especificación Viva: Diseño UI/UX y Sistema Responsive

**Estado**: Vivo / Vigente en Producción  
**Área**: Interfaz de Usuario, Adaptabilidad Móvil, Audio y Micro-animaciones  
**Archivos fuente principales**: `style.css`, `index.html`, `script.js`

---

## 1. Visión General y Estética

El diseño visual adopta una estética **Arcade Retro Futurista** caracterizada por fondos oscuros (`#121826`), bordes de neón reactivos, avatares estilizados y paletas de color con alta saturación (`--primary-color: #00f0ff`, `--secondary-color: #ff3d71`, `--player3-color: #00e676`, `--player4-color: #ffd73d`).

---

## 2. Flujo de Navegación del Asistente (Stepper)

La interfaz utiliza un asistente modal dividido en pasos (`#step-mode`, `#step-players`, `#step-boards`):

1. **Paso 1: Selección de Modo**:
   - `Modo 1 vs 1 Local`: Permite configurar de 2 a 4 jugadores humanos en el mismo dispositivo.
   - `Modo Arcade`: Inicia la campaña individual contra la jerarquía de jefes.
2. **Paso 2: Configuración de Jugadores (Modo VS)**:
   - Carrusel de cantidad de jugadores (2 a 4).
   - Selección cíclica de avatares y símbolos para cada participante.
3. **Paso 3: Escenario y Reglas**:
   - Selector en cuadrícula de tableros predefinidos (3x3, 4x4, 5x5, 6x6, 8x8).
   - Panel de personalización avanzada para dimensiones ($N \times M$), longitud de victoria ($N$) y líneas objetivo ($K$).
4. **Paso 4: Tablero de Juego Activo (`#game-area`)**:
   - Marcador superior con avatares, nombres, puntos acumulados y líneas restantes.
   - Contenedor dinámico del tablero (`.board-wrapper` y `#game-board`).
   - Controles de partida: botón "Reiniciar Partida" y "Volver a Configuración".

---

## 3. Adaptabilidad Responsive y Dispositivos Móviles

### Altura Dinámica de Viewport (`dvh`)
- La raíz `.container` utiliza `height: 100dvh` (con respaldo a `100vh`) para prevenir que las barras de navegación de navegadores móviles (Safari iOS, Chrome Android) oculten botones de acción ("Continuar", "Jugar").

### Reglas de Renderizado de Celdas y Tablero
En `script.js` y `style.css`, las dimensiones de las celdas se calculan en tiempo de ejecución:
- **Dispositivos móviles y tablets ($\le 820\text{px}$)**:
  - Tamaño de celda mínimo acotado a **$36\text{px}$** (`minCellSize = 36`) para evitar errores táctiles por celdas diminutas (*fat-finger prevention*).
  - Tamaño de celda máximo acotado a **$80\text{px}$**.
- **Contenedor con desplazamiento bidireccional (`.board-wrapper`)**:
  - En tableros donde la cuadrícula sobrepasa el ancho o alto disponible de la pantalla, la cuadrícula se renderiza a tamaño completo (`width: fit-content`) dentro de un contenedor con `overflow: auto`.
  - Permite desplazamiento suave horizontal y vertical sin descuadrar la interfaz general ni los marcadores superiores.
- **Prevención de Zoom Accidental**:
  - Se aplica `touch-action: manipulation` en todas las celdas y botones para inhibir el zoom no deseado por doble toque.

---

## 4. Síntesis de Sonido Procedural (Web Audio API)

El juego prescinde de archivos de audio externos (MP3/WAV), generando todos los efectos mediante la Web Audio API:

- **Instanciación y Desbloqueo Seguro**:
  - El contexto de audio (`AudioContext`) se instancia bajo demanda y se reanuda de forma transparente ante la primera interacción del usuario (`handleCellClick` o clic en menús), cumpliendo con las políticas de autoplay de los navegadores.
- **Efectos Sintetizados**:
  1. **Colocación de Ficha**: Tono de onda cuadrada (`square`, $220\text{Hz}$ a $440\text{Hz}$) de $0.08\text{s}$ con decaimiento exponencial.
  2. **Línea Formada**: Arpegio triunfal de 3 notas ascendentes con barrido de frecuencia.
  3. **Combo / Múltiples Líneas**: Tono en cascada con modulación de frecuencia acelerada.
  4. **Victoria**: Fanfarria sintetizada con acordes mayores.
  5. **Derrota / Bloqueo**: Tono descendente modulado en frecuencia baja ($110\text{Hz} \to 55\text{Hz}$).

---

## 5. Micro-Animaciones y Retroalimentación Háptica-Visual

1. **Líneas de Victoria (`strike-line`)**:
   - Se dibujan mediante elementos posicionados de forma absoluta sobre el contenedor del tablero.
   - Aplican una animación de crecimiento `strikeGrow 0.25s ease-out` con el color identificativo del jugador que completó la línea.
2. **Sacudida de Pantalla (`screen-shake`)**:
   - Al generarse un combo o victoria decisiva, el escenario ejecuta una micro-vibración CSS de 4 fotogramas para transmitir impacto.
3. **Resaltado de Turno Activo**:
   - El avatar del jugador con turno en curso muestra un brillo de neón pulsante continuo (`box-shadow: 0 0 15px currentColor`).
