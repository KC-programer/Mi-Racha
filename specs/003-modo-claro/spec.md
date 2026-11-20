# Spec 003 · Modo claro

**Estado:** aprobado tras corrección. La dirección pictórica (paleta, tipografía, contraste) se define en esta spec; la implementación en `estilos.css` y el botón en `app.js` y `index.html` quedan para la fase visual posterior. No se tocan funciones ni esquemas de datos.

**Actualización (18-11-2026):** el RF-001, el RF-005 y los criterios 1, 2 y 7 cambian por decisión del cliente: el selector pasa a la esquina superior izquierda del bloque de la frase, muestra el modo en uso y el pie deja de nombrar el modo. El traslado de «Cambiar frase» a la esquina inferior derecha del bloque pertenece a ese cambio de cabecera, no a esta spec.

**Ámbito:** `index.html`, `app.js`, `estilos.css`. Al actualizarse la paleta, también `AVANCES.md` (estado de paleta actual) y, por actualización del principio 5 de `docs/constitution.md`, el texto que pide "cuatro pantallas" si quedaría duplicado con la nueva funcionalidad visual.

## Contexto

Aplicación web de una sola página "Mi Racha", sin build, sin frameworks, sin dependencias nuevas (única: `sql.js` desde CDN). Todo en español, un solo `<script>` clásico. Inserta texto con `textContent`/`createElement`, nunca `innerHTML`. Colores, radios, sombras y anchos salen de variables CSS. La fuente de verdad es `localStorage`; SQLite corre **en memoria**. Las fechas se tratan en **hora local**.

La app tiene cuatro pantallas (tablero, historial, resumen semanal, inicio/intención) y el pie (`#pie-modo`) informa de la base de datos en uso; el modo ya no se escribe allí. El selector de modo va en la esquina superior izquierda del bloque de la frase, muestra el modo en uso y persiste su elección entre recargas. Se añade `modo: 'miRacha:modo'` al objeto `Claves` (ver RF-001).

## Objetivo

Que el usuario pueda alternar entre modo oscuro (el actual) y modo claro con un interruptor deslizante en la esquina superior izquierda del bloque de la frase, acompañado del texto del modo en uso. El modo claro debe usar una paleta de colores derivada de rojos suaves, suficiente contraste para leer y que el modo elegido se guarde preferentemente en `localStorage` y también se detecte `prefers-color-scheme`. La interfaz debe seguir funcionando en los modos degradados (sin `sql.js`, sin `localStorage`).

## Fuera de alcance

- No se cambia el esquema SQLite, las claves de `localStorage` (salvo la nueva `miRacha:modo` añadida a `Claves`), el objeto `sesion` ni cómo se guarda y pinta el historial.
- No se añaden nuevas claves de `localStorage` sin añadirlas a `Claves`.
- No se modifica la rejilla de `.tablero` ni el número de pantallas.
- No se introduce `innerHTML` ni se inyecta texto de usuario como HTML.
- No se añade paso de build, `package.json`, bundler ni `npm install`.
- No se cambia la función del botón «Cambiar frase» (sigue abriendo la pantalla de intención), aunque su posición cambie con la cabecera.
- El cambio de modo usa una transición breve de 0,2 s; la regla global de `prefers-reduced-motion` la desactiva.

## Requisitos de funcionalidad

### RF-001 · Interruptor de modo en la esquina superior izquierda del bloque de la frase

Un interruptor deslizante situado en la esquina superior izquierda del bloque de la frase, con el texto del modo en uso a su lado. El control debe:

- Tener `type="button"`, `role="switch"` y `aria-checked` que refleje el estado (`true` = modo claro, `false` = modo oscuro).
- Mostrar el modo actual por partida doble: la posición de la bola (derecha = claro, izquierda = oscuro) y un texto visible que diga «Modo claro» o «Modo oscuro».
- Al pulsarse, alternar el modo y actualizar a la vez la clase de `<body>`, `aria-checked` y el texto visible.
- Guardar la preferencia en `localStorage` bajo la clave `miRacha:modo` con valor `"claro"` u `"oscuro"`.
- Si `localStorage` está bloqueado, caer en detección de `prefers-color-scheme` del sistema operativo.
- No interferir con el funcionamiento del botón «Cambiar frase»: cada uno tiene su propia acción independiente.
- No anunciar el cambio en el mensaje del formulario de sesión: el propio interruptor y su texto ya lo dicen.

### RF-002 · Paleta de modo claro con tonos rojos suaves

El modo claro debe usar una paleta de colores derivada de rojos suaves, definidos como variables CSS en `:root`. La paleta debe cumplir:

- `--fondo-claro`: tono muy suave de rojo claro (croma ≤ 15 sobre 255), usado como fondo general de la app en modo claro. Ejemplo: `rgb(253, 248, 245)` o equivalente en `oklch`. **Este color y todos los demás deben definirse solo como variables CSS en `:root`, nunca como literales fuera de ella.**
- `--tinta-claro`: texto sobre `--fondo-claro`, suficiente contraste ≥ 4,5:1. Ejemplo: `rgb(30, 20, 15)`. **También solo como variable CSS.**
- `--regla-claro`: separación sutil, croma ≤ 3, usado para filetes finos. **Solo variable CSS.**
- `--exito-claro`: opcional, tono cálido muy suave para mensajes de éxito, distinto de `--error-claro`. **Solo variable CSS.**
- `--error-claro`: tono rojo error legible sobre `--fondo-claro`, contraste ≥ 4,5:1. **Solo variable CSS.**
- `--borde-claro`: croma ≤ 2, para bordes de controles. **Solo variable CSS.**

Ningún color literal debe aparecer fuera de los bloques de paleta (`:root`, `body.modo-claro` y `body.modo-oscuro`). Las variables se definen en `:root`, se redefinen en `@media (prefers-color-scheme: dark)` para el primer pintado y en las clases `body.modo-claro` y `body.modo-oscuro`, que son las que mandan tras la elección. El acento (violeta-tinta) se mantiene igual en los dos modos para no añadir un segundo trabajo cromático.

### RF-003 · Contraste suficiente en modo claro

En modo claro, todos los textos y elementos interactivos deben tener contraste ≥ 4,5:1 sobre el fondo `--fondo-claro`, salvo que sea un elemento decorativo (filetes, separadores). Los ratios medidos en navegador:

- `--tinta-claro` sobre `--fondo-claro`: ≥ 4,5:1.
- `--error-claro` sobre `--fondo-claro`: ≥ 4,5:1.
- `--exito-claro` (si existe) sobre `--fondo-claro`: ≥ 4,5:1.
- El anillo de `:focus-visible` en modo claro: ≥ 3:1 contra `--fondo-claro` y contra `--tinta-claro`.

Si un ratio no se alcanza, se ajusta el tono del rojo (hacerlo un poco más oscuro o más claro) hasta cumplir la norma, nunca usando colores opacos que rompan la paleta "sucia".

### RF-004 · Modo claro en modos degradados

La app debe seguir funcionando en los tres escenarios degradados aun con modo claro activo:

- **`sql.js` no carga** (sin red o CDN caído): `modo = 'respaldo'`, array en memoria. El modo claro se mantiene mediante variables CSS locales; el pie indica `Base de datos: respaldo` y el selector sigue diciendo el modo en uso.
- **Fallo del primer arranque de SQLite**: un reintento y luego respaldo. El modo claro persiste en `localStorage` o en la detección del sistema.
- **`localStorage` bloqueado**: `Almacen` usa memoria; el modo vuelve a la detección de `prefers-color-scheme`, el selector lo refleja y la elección se pierde al cerrar.

En modo degradado, el cambio de modo no rompe la UI: las variables CSS siguen teniendo valores, y el interruptor sigue funcionando sobre ellas.

### RF-005 · Guardado y detección preferente de modo claro

La preferencia de modo debe seguirse en este orden:

1. **`localStorage` (`miRacha:modo`)**: si el usuario lo ha cambiado anteriormente y la clave existe, usarla.
2. **`prefers-color-scheme`**: si no hay preferencia guardada, detectar si el sistema operativo está en modo claro u oscuro y usarlo como default.
3. **Default oscuro**: si nada de lo anterior está disponible, la app arranca en modo oscuro (el actual).

Al arrancar, `iniciar()` debe leer `miRacha:modo` de `localStorage` mediante `Almacen.leer(Claves.modo)` y aplicar la clase `modo-claro` o `modo-oscuro` en `<body>`, de modo que el modo elegido se imponga sobre `prefers-color-scheme` en los dos sentidos. El selector debe mostrar el modo en uso. El pie (`#pie-modo`) ya no nombra el modo: solo indica la base de datos. Si `localStorage` no está disponible, se usa la detección del sistema y el selector lo refleja.

No se debe cambiar el idioma del producto ni del código al inglés.

## Estados explícitos

- **(a) Modo oscuro, guardado o por sistema.** La app arranca aquí si no hay preferencia guardada y el sistema no pide claro, o si la preferencia guardada es `oscuro`. Pie: `Base de datos: SQL (SQLite)`. Selector: «Modo oscuro», bola a la izquierda.
- **(b) Modo claro, guardado.** El usuario ha seleccionado claro y está guardado en `miRacha:modo`. Pie: `Base de datos: SQL (SQLite)`. Selector: «Modo claro», bola a la derecha.
- **(c) Modo claro, por detección del sistema.** No hay preferencia guardada, pero `prefers-color-scheme` indica claro. Mismo pie y mismo selector que (b).
- **(d) Modo claro, degradado sin `localStorage`.** `localStorage` bloqueado, se usa la detección del sistema; el selector lo refleja y la elección se pierde al cerrar.
- **(e) Modo degradado sin `sql.js`.** Igual que (a), (b) o (c), pero el pie indica `Base de datos: respaldo`.

## Modos degradados

Los modos degradados ya definidos en `AGENTS.md` se mantienen additionally a la nueva funcionalidad de modo claro:

- Sin `sql.js`: la UI sigue pintando con las variables CSS de modo claro si está activo; el pie avisa de respaldo.
- Fallo del primer arranque de SQLite: un reintento y luego respaldo; el modo claro se mantiene por `localStorage` o detección.
- `localStorage` bloqueado: `Almacen` usa memoria; el modo vuelve a detección del sistema y la pérdida al cerrar no se anuncia.

En todos los casos, el interruptor sigue visible y operativo, y el cambio de modo no causa error que deje la app sin UI.

## Accesibilidad

- El interruptor debe tener `aria-checked="true"` cuando el modo está claro y `aria-checked="false"` cuando está oscuro, para que lectores de pantalla anuncien el estado.
- El interruptor necesita `:focus-visible` con un anillo de `--tinta-claro` (modo claro) o `--foco` (modo oscuro) que alcance ≥ 3:1 contra el fondo correspondiente y contra `--tinta-claro`.
- Al pulsar el interruptor, el cambio se comunica por `aria-checked` y por el texto visible; no se usa el mensaje del formulario de sesión.
- El contraste en modo claro debe medirse en navegador (≥ 4,5:1 para texto normal). Los filetes y separadores no tienen ratio obligatorio, pero deben ser visibles.
- Nunca se debe usar `display: none` para ocultar elementos en modo claro; usar la clase `.oculto` si es necesario para ocultar solo visualmente.

## Criterios de aceptación

Verificables en navegador o con la consola (el proyecto no tiene test runner):

1. **Ubicación del interruptor.** `#boton-modo-claro` está en la esquina superior izquierda del bloque de la frase, con `type="button"`, `role="switch"` y el texto `#texto-modo` a su lado. No está fuera del bloque.
2. **Alternancia de modo.** Al pulsar el interruptor, se aplica la clase `modo-claro` o `modo-oscuro` en `<body>`, `aria-checked` cambia y `#texto-modo` pasa a «Modo claro» o «Modo oscuro». El pie no cambia: solo informa de la base de datos.
3. **Persistencia.** Recargar la página con el modo claro guardado en `localStorage` mantiene el modo claro tras la recarga. Igual para el modo oscuro.
4. **Detección de sistema.** Si no hay preferencia guardada, al abrir la app en un sistema con `prefers-color-scheme: light` el modo claro se activa automáticamente.
5. **Contraste en claro.** El texto sobre `--fondo-claro` y los elementos interactivos tienen ≥ 4,5:1 de contraste, medido en el navegador con el selector de color de DevTools.
6. **Enfoque visible.** El interruptor muestra anillo de `:focus-visible` con tinta sobre el fondo claro y sobre el fondo oscuro, ≥ 3:1 en ambos casos.
7. **Modos degradados.** Con `sql.js` caído, con `localStorage` bloqueado y con fallo del arranque de SQLite, la app arranca y el interruptor sigue funcionando; el pie informa de la base de datos y el selector del modo.
8. **No `innerHTML`.** Ningún cambio de modo usa `innerHTML` para pintar la UI; todo se hace mediante clases y variables CSS.
9. **Sin color literal fuera de la paleta.** En `estilos.css` no hay `#hex`, `rgb(`, `rgba(`, `hsl(` ni `oklch(` fuera de los bloques de paleta (`:root`, `body.modo-claro` y `body.modo-oscuro`).
10. **Idioma español.** Todo el texto de la UI, incluyendo el pie y el texto del selector, está en español.

## Decisiones del cliente

### D1 · Dirección pictórica: tonos rojos suaves, no pastel ni oscuro

El cliente ha elegido una paleta de modo claro basada en rojos suaves, que transmile calidez sin resultar un fondo pastel ni un rojo intenso. La decisión atiende a que:

- Un rojo pastel resultaría infantil y no acorde a la seriedad de registrar estudio diario.
- Un rojo oscuro reduciría el contraste y cansaría la vista en sesiones largas.
- Un rojo "sucio", croma bajo (≥ 15 sobre 255), da calidez y simultáneamente discreción, como una hoja de papel ligeramente teñida.

### D2 · Interruptor, posición y comportamiento

El interruptor ocupa la esquina superior izquierda del bloque de la frase y «Cambiar frase» la inferior derecha: las dos acciones de personalización diaria quedan en esquinas opuestas y la frase, centrada, es lo único que ocupa el medio. El interruptor tiene forma de píldora porque su posición es el estado; no se reutiliza `boton--suave`, que es la forma de las acciones y no de un control de estado. El texto del modo en uso va al lado para que el estado no dependa solo del color o de la posición.

### D3 · Guardado en `localStorage` y detección `prefers-color-scheme`

El orden de preferencia (localStorage → sistema → default oscuro) fue acordado porque respeta la elección del usuario cuando existe, pero no obliga a guardar nada si el usuario nunca la tocó. La detección del sistema evita que la app arranque en modo claro si el usuario tiene el sistema en oscuro y nunca ha interactuado con el botón.

### D4 · No se tocan funciones ni esquema de datos

Todo el cambio es visual: variables CSS, una clase en `<body>` y un botón nuevo. No se modifican métodos de `BaseDeDatos`, no se añaden claves nuevas a `Claves` (la de modo ya está añadida), no se cambia `ESQUEMA_SQL` y no se altera el objeto `sesion`. La única excepción son las inserciones en `app.js` para leer/escribir `miRacha:modo` y toggle de clase, que quedan aisladas en la capa de Eventos, y la añadida `modo: 'miRacha:modo'` al objeto `Claves` en `app.js:21-24`.

---