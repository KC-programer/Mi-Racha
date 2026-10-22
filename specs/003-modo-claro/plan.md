# Plan 003 · Modo claro

Fase visual y de persistencia de preferencia, derivada de `specs/003-modo-claro/spec.md`. No se tocan funciones de negocio ni esquema de datos: el cambio es puramente visual (variables CSS, clase en `<body>`, botón nuevo) y de persistencia en `localStorage`.

**Ámbito:** `index.html`, `app.js`, `estilosCSS`. Sin nuevas dependencias, sin build, sin `npm install`. La app sigue abriendo con doble clic.

**Orden de implementación:** de abajo hacia arriba (capas de `app.js`), luego el HTML que sus helpers necesitan, luego el CSS, y la documentación al final. Cada fase deja la app arrancando y funcional.

## 1. Qué se toca y en qué orden

1. `app.js` · **Objeto `Claves`**: añadir `modo: 'miRacha:modo'`. Es la única inserción nueva en `Claves` (RF-001, D4). No se tocan `sesiones` ni `frase`.

2. `app.js` · **Capa 6 · Eventos (`conectarEventos()`)**: añadir lógica de toggle del botón `#boton-modo-claro`. Al pulsarse, alternar la clase `modo-claro` en `<body>` y guardar la preferencia en `localStorage` bajo `miRacha:modo`. Si `localStorage` no está disponible, usar detección `prefers-color-scheme`. El toggle no interfiere con el botón "Cambiar frase".

3. `app.js` · **Capa 6 · Eventos (`iniciar()`)**: modificar la función de arranque para leer `miRacha:modo` de `localStorage` mediante `Almacen.leer(Claves.modo)` y, según el RF-005, aplicar el modo:
   - Si `localStorage` tiene `modo` guardado → usarlo.
   - Si no, detectar `prefers-color-scheme` del sistema → usarlo como default.
   - Si nada de lo anterior → default oscuro.
   - Actualizar el pie `#pie-modo` con el texto correspondiente: `Modo: Claro` u `Modo: Oscuro` (o con `(sistema)` si viene de la detección).
   - Mantener el comportamiento degradado: si `localStorage` está bloqueado, avisar en el pie y usar detección del sistema.

4. `index.html` · Añadir el botón `#boton-modo-claro` en la zona superior del tablero, después de `#boton-cambiar-frase` (línea 78-80). El botón debe tener `type="button"` y clase `boton boton--suave`.

5. `estilos.css` · Añadir variables CSS en `:root` para la paleta de modo claro (`--fondo-claro`, `--tinta-claro`, `--regla-claro`, `--exito-claro`, `--error-claro`, `--borde-claro`). Estas variables solo se definen en `:root` y se redefinen en `@media (prefers-color-scheme: light)`. Ningún color literal fuera de los bloques `:root`.

6. `estilos.css` · Añadir bloque `@media (prefers-color-scheme: light)` que redefine las mismas variables CSS con la paleta clara. El acento (violeta-tinta) se mantiene igual en los dos modos.

7. `estilos.css` · Modificar las reglas que usan `--fondo`, `--texto`, `--borde`, etc., para que en modo claro usen las nuevas variables `--fondo-claro`, `--tinta-claro`, etc., mediante la regla de `@media (prefers-color-scheme: light)` o la clase `modo-claro` en `<body>`.

8. `AVANCES.md` · Actualizar el estado de la paleta y el modo según corresponda (principio 5 de `docs/constitution.md`).

## 2. RF por paso

1 → `Claves.modo` añadido · 2 → RF-001 · 3 → RF-005, RF-008 · 4 → RF-001 · 5 → RF-002, RF-003 · 6 → RF-003 · 7 → RF-004 · 8 → `AVANCES.md` · principio 5

## 3. Decisiones que la spec deja abiertas

1. **Clase en `<body>` vs variables `@media`**. La spec dice "aplicar la clase `modo-claro` en `<body>` o redefinir las variables CSS en `@media (prefers-color-scheme: light)`". El plan usa **clase en `<body>`** porque:
   - No requiere cambio de medio (screen vs print, etc.).
   - Es más directa para el toggle JavaScript: `body.classList.toggle('modo-claro')`.
   - Las variables CSS ya tienen valores definidos en `:root`; la clase `modo-claro` solo activa un camino en el CSS (ej. `body.modo-claro --fondo { var(--fondo-claro) }`).
   - **Descartado:** solo `@media (prefers-color-scheme: light)`, porque no permite toggle manual por parte del usuario si el sistema está en oscuro y el usuario quiere claro (o viceversa).

2. **Detección `prefers-color-scheme` vs default oscuro**. El orden RF-005 es: 1. `localStorage`, 2. `prefers-color-scheme`, 3. default oscuro. El plan respeta este orden exacto: si el usuario nunca toca el botón y el sistema está en claro, la app arranca en modo claro; si el usuario cambia a oscuro, el toggle lo cambia y lo guarda.

3. **Persistencia del pie**. El pie `#pie-modo` siempre informa: en modo normal oscuro dice `Base de datos: SQL (SQLite)`, en modo claro guardado dice `Modo: Claro. Base de datos: SQL (SQLite)`, y si viene de detección del sistema dice `Modo: Claro (sistema)`. Si `localStorage` está bloqueado, dice `Modo: Claro (memoria)` y avisa de que la elección se perderá al cerrar.

## 4. Trampas del proyecto que este plan toca

- **Claves nuevas sin añadir a `Claves`**: la única clave nueva es `modo: 'miRacha:modo'`, añadida en esta tarea. Cualquier otra clave nueva sin pasar por `Claves` rompería el modo degradado.
- **`innerHTML` en el toggle**: el cambio de modo nunca usa `innerHTML`; todo se hace mediante `classList.toggle('modo-claro')` en `<body>` y variables CSS.
- **Referenciar código por número de línea**: el plan usa nombres de funciones (`iniciar`, `conectarEventos`, `Almacen.leer`) y bloques (`:root`, `@media`), nunca números de línea.
- **Modos degradados**: el plan asegura las tres situaciones (sin `sql.js`, fallo de arranque de SQLite, `localStorage` bloqueado) y que el botón y el modo persisten en cada una.
- **`this` en callbacks**: en `BaseDeDatos.iniciar`, `lista.forEach(this.insertar, this)` depende del binding. No convertirlo a arrow function. La nueva lógica de modo usa `function` anónimos con binding explícito si es necesario.

## 5. Cómo se verifica sin test runner

- Abre `index.html` con doble clic y verifica las 4 pantallas.
- Pulsar el botón modo y comprobar que la clase `modo-claro` se añade/elimina en `<body>`.
- Recargar la página y confirmar que el modo se mantiene (persistencia en `localStorage`).
- Desconectar internet y recargar: la app debe arrancar en modo respaldo y el modo claro persistente debe mantenerse (o caer a detección del sistema si no hay guardado).
- Verificar el pie `#pie-modo` muestra el texto correcto en cada caso.
- Medir contraste en modo claro con el selector de color de DevTools (≥ 4,5:1 para texto y elementos interactivos).
- Navegar con Tab y confirmar que el botón muestra anillo de `:focus-visible` con `--foco` (modo oscuro) o `--tinta-claro` (modo claro), ≥ 3:1.
- Comprobar que no hay colores literales fuera de los bloques `:root` en `estilos.css`.
- Comprobar que `sql.js` no carga y la app sigue funcionando en modo respaldo.

## 6. Queda para la fase visual

- Peso y color de la cabecera y del botón de volver.
- Si alguna variable nueva hace falta en `:root` más allá de la paleta clara (en esta fase no: con las definidas basta).
- El cambio de selector necesita `aria-live` (dejado para futura especificación).