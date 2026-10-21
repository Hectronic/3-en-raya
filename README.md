# 3 en Raya Personalizable (Tic-Tac-Toe Ultimate)

Bienvenido a la versión definitiva del 3 en Raya. Este juego permite configurar el tamaño del tablero y las condiciones de victoria para crear partidas únicas y desafiantes.

## 🎮 Cómo Jugar

1.  **Configuración**: Al inicio, verás un panel de configuración.
    -   **Filas y Columnas**: Elige el tamaño del tablero (desde 3x3 hasta 100x100).
    -   **Longitud para ganar (N)**: Cuántas fichas consecutivas necesitas para formar una "línea" (punto). Por ejemplo, en un tablero 3x3 lo normal es 3.
    -   **Líneas objetivo (K)**: Cuántas líneas debes completar para ganar la partida.
        -   Si K=1, el primero en hacer una línea gana (clásico).
        -   Si K>1, acumulas puntos por cada línea formada hasta llegar al objetivo.

2.  **Reglas de Puntuación (Importante)**:
    -   El juego utiliza un sistema **codicioso (greedy)** para contar líneas.
    -   **No se pueden reusar casillas en un mismo sentido**.
    -   *Ejemplo (N=3)*:
        -   `X X X` -> 1 línea (1 punto).
        -   `X X X X` -> 1 línea (las 3 primeras cuentan, la 4ª sobra).
        -   `X X X X X X` -> 2 líneas (las 3 primeras + las 3 siguientes).
    -   Las casillas SÍ se pueden cruzar (una casilla puede formar parte de una línea horizontal y otra vertical a la vez).

3.  **Controles**:
    -   Haz clic en cualquier casilla vacía para colocar tu ficha.
    -   El turno alterna automáticamente entre Jugador 1 (X) y Jugador 2 (O).
    -   Usa el botón "Reiniciar Partida" para limpiar el tablero actual.
    -   Usa "Volver a Configuración" para cambiar las reglas.

## 🛠️ Solución de Problemas

-   **No veo el tablero**: Asegúrate de pulsar "Iniciar Juego" después de configurar. Si el tablero es muy grande (ej. 100x100), usa las barras de desplazamiento (scroll) del navegador.
-   **No gano al hacer una línea**: Verifica el valor de "Líneas objetivo". Si pusiste 2 o más, necesitas hacer más líneas para ganar. Mira el marcador en la parte superior.

## ⌨️ Tecnologías

-   HTML5
-   CSS3 (Grid Layout)
-   JavaScript (ES6+)
