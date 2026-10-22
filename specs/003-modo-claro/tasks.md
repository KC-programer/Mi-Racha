# Tareas 003 · Modo claro

Orden de dependencia, de lo que no depende de nada a la documentación. Cada
tarea deja el proyecto **arrancando y funcionando**: al terminar cualquiera de
ellas, `index.html` abre con las pantallas que hubiera y nada queda a medias.

**Todas las tareas son visuales y de persistencia:** no se tocan funciones de
negocio, no se modifica el esquema SQLite, no se cambia el objeto `sesion`, no se
añaden métodos nuevos a `BaseDeDatos`. El único código nuevo está en la capa de
Eventos y en el CSS.

---

## T1. Añadir `modo: 'miRacha:modo'` al objeto `Claves` · **Hecha**

**Archivos:** `app.js`, objeto `Claves`, línea 21-24.

**Qué hace:** añade la propiedad `modo: 'miRacha:modo'` al objeto `Claves`. Es la
única clave nueva que se introduce en `localStorage` para la preferencia de modo.
Las claves existentes `sesiones` y `frase` no se tocan.

**RF:** RF-001 (parte de la clave nueva). **Ninguna más.**

**Hecho cuando:** en la consola, `Claves.modo` devuelve `'miRacha:modo'` y la app
abre igual que antes: mismas pantallas, mismo pie, y ningún texto nuevo en pantalla.
El archivo `app.js` tiene una línea más en el objeto `Claves`, sin afectar a nada
que ya funcionara.

---

## T2. Añadir botón `#boton-modo-claro` en `index.html` · **Hecha**

**Archivos:** `index.html`, después de `#boton-cambiar-frase` (línea 78-80).

**Qué hace:** añade un botón tipo interruptor (slider) en la zona superior del
tablero, al lado derecho del botón "Cambiar frase". El botón debe tener:
- `type="button"` y clase `boton boton--suave` (misma clase que el botón
  cambiar-frase y ver-resúmenes).
- `aria-checked` que refleje el estado actual (`true` = modo claro, `false` =
  modo oscuro).
- Un texto accesible para lectores de pantalla (ej. "Modo claro").

**RF:** RF-001. **Ninguna más.**

**Hecho cuando:** en el navegador, al inspeccionar la zona superior del tablero,
aparece `#boton-modo-claro` después de `#boton-cambiar-frase`, con las clases
indicadas y `type="button"`. El botón no está dentro del formulario de sesión y no
interfiere con su funcionamiento. La app abre igual que antes.

---

## T3. Añadir variables CSS y bloque `@media (prefers-color-scheme: light)` en `estilos.css` · **Hecha**

**Archivos:** `estilos.css`, después del bloque oscuro `@media (prefers-color-scheme: dark)`.

**Qué hace:** añade variables CSS en `:root` para la paleta de modo claro:
- `--fondo-claro`: tono muy suave de rojo claro (croma ≤ 15 sobre 255), fondo general.
- `--tinta-claro`: texto sobre `--fondo-claro`, contraste ≥ 4,5:1.
- `--regla-claro`: separación sutil, croma ≤ 3, filetes finos.
- `--exito-claro`: tono cálido muy suave para mensajes de éxito (opcional).
- `--error-claro`: tono rojo error legible sobre `--fondo-claro`, contraste ≥ 4,5:1.
- `--borde-claro`: croma ≤ 2, para bordes de controles.

**Restricción:** ningún color literal fuera de los bloques `:root`. Los colores y
todos los demás deben definirse solo como variables CSS en `:root`, nunca como
literales fuera de ella.

**Además:** añadir bloque `@media (prefers-color-scheme: light)` que redefine las
mismas variables (`--fondo-claro`, `--tinta-claro`, etc.) para que el navegador
las use cuando el sistema operativo está en modo claro. El acento (violeta-tinta)
se mantiene igual en los dos modos: no se cambia el `--primario` en el bloque claro.

**RF:** RF-002, RF-003, RF-004. **Ninguna más.**

**Hecho cuando:** en el panel de estilos, **todos** los colores que ve la app en modo
claro salen de una variable CSS, y **ninguno** es un literal fuera de `:root`. El
bloque `@media (prefers-color-scheme: light)` está escrito y contiene solo
declaraciones de variables, sin selectores sueltos. La app muestra la paleta clara
cuando el sistema está en modo claro y el toggle la activa manualmente.

---

## T4. Modificar `iniciar()` en `app.js` para detectar y aplicar el modo · **Hecha**

**Archivos:** `app.js`, función `iniciar()`, línea 886-910.

**Qué hace:** modificar la función de arranque para:
1. Leer `miRacha:modo` de `localStorage` mediante `Almacen.leer(Claves.modo)`.
2. Según el RF-005, aplicar la preferencia en este orden:
   - Si `localStorage` tiene `modo` guardado (`"claro"` u `"oscuro"`) → usarlo.
   - Si no hay preferencia guardada, detectar `prefers-color-scheme` del sistema → usarlo como default.
   - Si nada de lo anterior está disponible → default oscuro.
3. Añadir la clase `modo-claro` en `<body>` si el modo es claro, o quitarla si es
   oscuro.
4. Actualizar el pie `#pie-modo` con el texto correspondiente:
   - Modo oscuro normal: `Base de datos: SQL (SQLite)`.
   - Modo claro guardado: `Modo: Claro. Base de datos: SQL (SQLite)`.
   - Modo claro por detección del sistema: `Modo: Claro (sistema)`.
   - `localStorage` bloqueado: `Modo: Claro (memoria)` + aviso de que la elección se
     perderá al cerrar.
5. Mantener los modos degradados: si `sql.js` no carga o `localStorage` está
   bloqueado, la app arranca y el modo se mantiene por la ruta definida en RF-004.

**RF:** RF-005, RF-008. **Ninguna más.**

**Hecho cuando:** al recargar la página, el modo se mantiene según la preferencia
(`localStorage` > sistema > default oscuro). El pie `#pie-modo` muestra el texto
correcto en cada caso. Con `localStorage` bloqueado, el pie avisa y el modo viene
de la detección del sistema. La clase `modo-claro` se añade/elimina en `<body>`
correctamente. La app arranca igual que antes en modo oscuro si no hay preferencia
guardada.

---

## T5. Añadir lógica de toggle en `conectarEventos()` en `app.js` · **Hecha**

**Archivos:** `app.js`, función `conectarEventos()`, dentro de la capa 6, después del
listener del botón "Cambiar frase" (línea 793).

**Qué hace:** añadir event listener al botón `#boton-modo-claro` que, al pulsarse:
1. Alternar la clase `modo-claro` en `<body>`: `document.body.classList.toggle('modo-claro')`.
2. Guardar la preferencia en `localStorage` bajo `miRacha:modo` con valor `"claro"` u
   `"oscuro"` (comprobando `body.classList.contains('modo-claro')` después del toggle).
3. Si `localStorage` está bloqueado, no fallar: usar detección `prefers-color-scheme`
   y no causar error en la actualización del pie (la lógica de actualización ya está en
   `inicar()`).
4. Anunciar el cambio usando `mostrarMensaje(document.getElementById('mensaje-formulario'),
   'Modo cambiado a claro'/'Modo cambiado a oscuro', false)` con `role="alert"` y
   `aria-live="polite"`.
5. Actualizar el atributo `aria-checked` del botón (`true` = modo claro, `false` = modo
   oscuro).

**Restricción:** el toggle no interfiere con el botón "Cambiar frase": cada uno tiene
su propia acción independiente. Se usa `function` y concatenación, sin arrow
functions que rompan el binding de `this` en callbacks cercanos.

**RF:** RF-001 (toggle y persistencia). **Ninguna más.**

**Hecho cuando:** al pulsar el botón `#boton-modo-claro`:
- La clase `modo-claro` se añade o se quita en `<body>`.
- El pie `#pie-modo` actualiza su texto a `Modo: Claro` o `Modo: Oscuro`.
- La preferencia se guarda en `localStorage` y persiste tras recargar.
- Si `localStorage` está bloqueado, el modo cambia visualmente (clase en `<body>`)
  pero el pie avisa de que se perderá al cerrar.
- El atributo `aria-checked` del botón refleja el estado actual.
- El botón "Cambiar frase" sigue funcionando igual, sin conflictos.

---

## T6. Mantener modos degradados funcionando

**Archivos:** `app.js`, `estilosCSS`, `index.html` (verificación global).

**Qué hace:** asegurar que las tres situaciones degradadas siguen funcionando con
el modo claro activo:
- **`sql.js` no carga** (sin red o CDN caído): `modo = 'respaldo'`, array en memoria.
  El modo claro se mantiene mediante variables CSS locales; el pie indica `Modo: Claro`
  y `Base de datos: SQL (SQLite)` (o respaldo si falló el arranque).
- **Fallo del primer arranque de SQLite**: un reintento y luego respaldo. El modo
  claro persiste en `localStorage` o en la detección del sistema.
- **`localStorage` bloqueado**: `Almacen` usa memoria; el modo vuelve a la detección
  de `prefers-color-scheme` y se avisa en el pie de que la elección se perderá al
  cerrar.

En modo degradado, el cambio de modo no rompe la UI: las variables CSS siguen
teniendo valores, y el botón sigue funcionando sobre ellas.

**RF:** RF-004. **Ninguna más.**

**Hecho cuando:** probando los tres escenarios degradados (Network → Offline en
DevTools, navegador con `localStorage` bloqueado, y arranque normal) la app
arranca, el botón modo es visible y operable, y el pie informa adecuadamente en
cada caso.

---

## T7. Recorrido de los criterios de aceptación

**Archivos:** ninguno. Es la verificación de todo lo anterior.

**Qué hace:** verifica en navegador o con la consola los 10 criterios de aceptación
de la spec 003:

1. **Ubicación del botón.** `#boton-modo-claro` está dentro de la zona superior del
   tablero, después de `#boton-cambiar-frase` y antes de ningún otro elemento, con
   clase `boton boton--suave` y `type="button"`.
2. **Alternancia de modo.** Al pulsar el botón, la clase `modo-claro` se añade/elimina
   en `<body>` o las variables CSS se redefinen en `@media (prefers-color-scheme: light)`,
   y el pie `#pie-modo` actualiza su texto a `Modo: Claro` o `Modo: Oscuro` en
   consecuencia.
3. **Persistencia.** Recargar la página con el modo claro guardado en `localStorage`
   mantiene el modo claro tras la recarga. Igual para el modo oscuro.
4. **Detección de sistema.** Si no hay preferencia guardada, al abrir la app en un
   sistema con `prefers-color-scheme: light` el modo claro se activa automáticamente.
5. **Contraste en claro.** El texto sobre `--fondo-claro` y los elementos interactivos
   tienen ≥ 4,5:1 de contraste, medido en el navegador con el selector de color de
   DevTools.
6. **Enfoque visible.** El botón muestra anillo de `:focus-visible` con tinta sobre
   el fondo claro y sobre el fondo oscuro, ≥ 3:1 en ambos casos.
7. **Modos degradados.** Con `sql.js` caído, con `localStorage` bloqueado y con fallo
   del arranque de SQLite, la app arranca y el botón sigue funcionando; el pie
   informa adecuadamente.
8. **No `innerHTML`.** Ningún cambio de modo usa `innerHTML` para pintar la UI; todo
   se hace mediante clases y variables CSS.
9. **Sin color literal fuera de `:root`.** En `estilos.css` no hay `#hex`, `rgb(`,
   `rgba(`, `hsl(` ni `oklch(` fuera de los bloques `:root` (claro y oscuro).
10. **Idioma español.** Todo el texto de la UI, incluyendo el pie y el mensaje de
    alerta, está en español.

**RF:** todos (RF-001 a RF-005).

**Hecho cuando:** los 10 criterios de aceptación están comprobados en el navegador o
con la consola y ninguno se queda sin mirar. El pie dice el texto correcto en cada
caso. En `estilos.css` hay cero colores literales fuera de `:root`. Y `AVANCES.md`
sigue por debajo de 75 líneas.

---

## T8. Documentación · **Hecha**

**Archivos:** `AVANCES.md`. **Va la última**, porque sus datos dependen de lo ya
implementado.

**Qué hace:** en «Estado actual», anotar que la app ahora tiene modo claro con botón
toggle y persistencia en `localStorage`. En «Aprendizajes y errores a evitar», lo que
esta spec deja aprendido (uso de `classList.toggle` para modo, detección
`prefers-color-scheme`, orden RF-005 localStorage → sistema → default oscuro). En
«Próximos pasos», decidir qué queda abierto (puede estar vacío si todo está cerrado).

**RF:** ninguno (documentación). **Hecho cuando:** `AVANCES.md` sigue por debajo de 75
líneas con sus cuatro secciones, no repite `AGENTS.md`, y anota el por qué de las
decisiones tomadas en estas tareas.