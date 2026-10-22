# Tareas 001 · Resumen semanal

Orden de dependencia, de lo que no depende de nada a la documentación. Cada
tarea deja el proyecto **arrancando y funcionando**: al terminar cualquiera de
ellas, `index.html` abre con las pantallas que hubiera y nada queda a medias.

Ninguna tarea incluye la fase visual con `frontend-design`. Ninguna incluye
refactor, limpieza ni pruebas nuevas: el proyecto no tiene runner ni Node.

---

## T1. Fechas de semana en la capa de Fechas

**Archivos:** `app.js`, capa 2 · Fechas, debajo de `moverDias` y encima de
`fechaLegible`.

**Qué hace:** añade `indiceDiaSemana(clave)`, `ultimaSemanaCerrada(hoy)`,
`lunesDeSemana(clave)` y `clavesSemana(lunes)`, con la fórmula de RF-002 escrita
literalmente: `(new Date(año, mes - 1, día).getDay() + 6) % 7` y
`moverDias(hoy, -(indiceDiaSemana(hoy) + 7))`. Todo con `function` y
concatenación, sin flechas ni plantillas. Ningún helper lee el reloj: reciben la
clave.

**RF:** RF-002. **Ninguna tarea más.**

**Hecho cuando:** en la consola, `indiceDiaSemana('2026-10-05')` devuelve `0` y
`indiceDiaSemana('2026-10-11')` devuelve `6`; `ultimaSemanaCerrada(...)` devuelve
`'2026-09-28'` para las siete fechas de la tabla de RF-002 y `'2026-09-21'` para
`'2026-10-03'`; `clavesSemana('2026-09-28')` devuelve siete claves de
`2026-09-28` a `2026-10-04`; y `lunesDeSemana('2026-09-30')` devuelve
`'2026-09-28'`. La app abre igual que antes: mismas pantallas, mismo pie, y
ningún texto nuevo en pantalla.

---

## T2. Cálculo de semanas y totales

**Archivos:** `app.js`, capa 5 · Interfaz, antes de `pintarRacha`.

**Qué hace:** añade `calcularSemanasCerradas(sesiones, hoy)` (claves de lunes de
las semanas cerradas con actividad, de más antigua a más reciente; descarta
cualquier semana cuyo lunes sea mayor o igual que `ultimaSemanaCerrada(hoy)`, y
por tanto la semana en curso) y `calcularTotalesSemana(sesiones)`
(`{ minutos, dias }`). Ninguna de las dos toca el DOM ni pinta nada.

**RF:** RF-005, RF-006, RF-007, RF-009.

**Hecho cuando:** con `hoy = '2026-10-05'` (lunes) y sesiones en `2026-09-15`,
`2026-09-30` y `2026-10-03`, `calcularSemanasCerradas(lista, '2026-10-05')` devuelve
`['2026-09-14', '2026-09-28']`: omite la semana del 21 al 27, no ofrece ninguna
posterior y ordena de más antigua a más reciente. Con el **mismo** `hoy =
'2026-10-05'`, la sesión del `2026-10-03` sí cuenta, porque la semana del 28/09 ya
estaba cerrada. Y con `hoy = '2026-10-03'` (sábado) el mismo conjunto devuelve
`['2026-09-14']`: la semana del 28/09 **es la semana en curso** ese día y queda
fuera. `calcularTotalesSemana([])` devuelve `{ minutos: 0, dias: 0 }`. La app
arranca y se comporta igual.

---

## T3. La pantalla en el HTML, con `Pantallas` al mismo tiempo · **Hecha**

**Archivos:** `index.html` y el array `Pantallas` de `app.js`.

**Qué hace:** añade dentro de la tarjeta "Historial de sesiones", después de
`#lista-sesiones` y de `#lista-vacia`, el `<button type="button"
id="boton-ver-resumenes" class="boton boton--suave">Ver resúmenes…</button>`.
Añade la `<section class="pantalla" id="pantalla-resumen-semanal" hidden
aria-labelledby="encabezado-resumen-semanal">` con el orden de RF-011:
`<h1 class="titulo" id="encabezado-resumen-semanal" tabindex="-1">`, `label`
+ `#selector-semana`, `<p id="resumen-semanal">`, `<ol id="lista-dias">` y
`<button type="button" class="boton boton--suave" id="boton-volver-tablero">Volver
al tablero</button>`. Y **en la misma tarea** añade `'resumen-semanal'` a
`Pantallas`.

**RF:** RF-001, RF-004, RF-006, RF-011.

**Hecho cuando:** el botón aparece al final de la tarjeta de historial, fuera del
`<ol>`; `Pantallas` tiene cuatro entradas; la sección nace con `hidden` y sigue
oculta tras recargar. Como todavía no hay listeners, ni `#boton-ver-resumenes`
ni `#boton-volver-tablero` hacen nada y el resto de la app funciona igual: se
sigue entrando por inicio o por la frase guardada, se guarda y se borra una
sesión, y el pie no cambia.

---

## T4. CSS del selector y del bloque de días · **Hecha**

**Archivos:** `estilos.css`.

**Qué hace:** añade `select` al grupo de `input[type=text|date|number]` y
`textarea`, con `font-size: 1rem` (por debajo de 16 px iOS hace zoom al enfocar) y
`:focus-visible` como los demás. Añade el bloque `/* ---------- Resumen semanal
---------- */` con `.dias`, `.dia`, `.dia__fila`, `.dia__fecha`, `.dia__minutos`
y `.dia__sesiones`. Todas las reglas usan variables existentes. **No** se
introduce ninguna variable nueva, así que el bloque `@media
(prefers-color-scheme: dark)` no se toca.

**RF:** RF-012. **Criterios:** 12 y 18 (parcialmente; el texto largo se
comprueba en T5).

**Hecho cuando:** con la sección visible a mano desde la consola
(`document.getElementById('pantalla-resumen-semanal').hidden = false`, sin tocar
código), el `select` se ve igual que los `input` y muestra el foco al tabular;
el bloque CSS nuevo no contiene ningún color literal; el bloque oscuro no ha
crecido; a 480 px nada desborda. Las reglas de `.dia*` se comprueban en T5, cuando
ya haya días pintados.

---

## T5. Pintado del resumen · **Hecha**

**Archivos:** `app.js`, capa 5 · Interfaz.

**Qué hace:** añade `agruparSesionesPorDia`, `formatearDiaCorto`,
`formatearRangoSemana`, `pintarCabeceraResumen`, `pintarDiasSemana`,
`poblarSelectorSemana`, `pintarResumenSemanal` y el `let semanaSeleccionada`.
`pintarResumenSemanal` hace, en este orden: `BaseDeDatos.listar()`, releer
`claveDeHoy()`, `calcularSemanasCerradas`, y con lista vacía usar
`[ultimaSemanaCerrada(hoy)]` como única opción (estado (a)); poblar el selector;
filtrar por `lunesDeSemana(s.fecha) === semanaSeleccionada`; pintar cabecera y los
siete días. Dentro de cada día reutiliza `.sesion__fila`, `.sesion__minutos`,
`.sesion__avances` y `.sesion__vacio`, con `data-id` en el `<li>` de la sesión, sin
frase, sin hora y sin botón de eliminar. El texto de la cabecera sale de
`formatearRangoSemana` y los minutos de `formatearTiempo`. Todo con
`createElement` y `textContent`.

**RF:** RF-005, RF-007, RF-008, RF-009, RF-010, RF-011.

**Hecho cuando:** con la sección visible a mano, `pintarResumenSemanal()` pinta:
- sin sesiones: siete días, total `0 min`, `0 días con sesión`, selector con una
  sola opción y **sin** `disabled`, y ningún mensaje sustitutorio;
- con las tres sesiones de T2 **y la fecha del sistema fijada a `2026-10-05`
  (lunes)**: dos opciones, la última `28/09 - 04/10`, el texto de la cabecera
  **idéntico** al de esa opción, los días de lunes a domingo en orden, el 30/09 con
  su sesión y el 04/10 con 0. Ojo: con la fecha real del sistema el selector puede
  tener **una** sola opción, y eso también es correcto;
- el bloque de avances de la sesión del 30/09 cumple
  `String(sesion.avances) === String(document.querySelector('#lista-dias
  [data-id="' + id + '"] .sesion__avances').textContent)`, con la sesión
  localizada en `BaseDeDatos.listar()`; y un `avances` vacío muestra "Sin avances
  anotados.". Ninguna sesión muestra frase ni "Eliminar esta sesión".
- un `avances` de 2000 caracteres sin espacios, a 480 px, no desborda ni se corta.

---

## T6. Navegación, foco y recálculo por acción · **Hecha**

**Archivos:** `app.js`, capa 6 · Eventos, dentro de `conectarEventos`.

**Qué hace:** añade `abrirResumenSemanal()`, que pone `semanaSeleccionada = null`,
muestra la pantalla, la pinta y mueve el foco a `#encabezado-resumen-semanal`. Conecta
tres listeners: `#boton-ver-resumenes` → `abrirResumenSemanal()`;
`#boton-volver-tablero` → `mostrarPantalla('tablero')` **sin repintar** y foco
de vuelta a `#boton-ver-resumenes`; `#selector-semana` en `change` → guarda
`evento.target.value` en `semanaSeleccionada` y vuelve a pintar. No se añade nada
al arranque, ni al submit del formulario, ni al `iniciar`.

**RF:** RF-001, RF-003.

**Hecho cuando:**
- pulsar "Ver resúmenes…" muestra la pantalla, oculta el tablero y deja el foco
  en el encabezado (comprobable en el panel de accesibilidad o con
  `document.activeElement.id`);
- cambiar el selector actualiza a la vez el rango de la cabecera, el total de
  minutos, el número de días y la lista de días;
- desplazar la lista del historial, ir al resumen y volver conserva el
  `scrollTop` de `.sesiones`, los valores de fecha, minutos y avances del
  formulario, `#frase-actual` y `#mensaje-formulario`, y el foco vuelve al botón;
- tras recargar, la pantalla de resumen está oculta y vacía hasta pulsar el
  botón (no se calcula nada al arrancar);
- con la pantalla abierta, guardar una sesión o borrar otra **no** repinta el
  resumen; y al volver a entrar tras cruzar medianoche corresponde a la última
  semana cerrada de ese momento;
- las únicas claves de `localStorage` siguen siendo `miRacha:sesiones` y
  `miRacha:frase` (más `miRacha:prueba`, que se borra sola).

---

## T7. Recorrido de los criterios de aceptación

**Archivos:** ninguno. Es la verificación de todo lo anterior.

**Qué hace:** recorre en el navegador los 20 criterios de la spec, empezando por
la tabla de RF-002 con fechas fijas en consola, los dos montajes del criterio 8
(sola la sesión de hoy, y la de hoy más una semana cerrada anterior), el
cambio de día del sistema para el 16 y las 2000 caracteres del 12, y los cuatro
puntos del 19 con los tres modos degradados. Después recorre la checklist de
`AGENTS.md`, incluido el modo oscuro si algo del CSS ha cambiado.

**RF:** todos.

**Hecho cuando:** los 20 criterios están comprobados en el navegador o con la
consola y no queda ninguno sin mirar; el pie dice `Base de datos: SQL (SQLite).`
en el modo normal; y las zonas editadas de `app.js` se han releído y balanceado a
mano, sin `innerHTML`, sin recorte de `avances` y sin referencias por número de
línea.

---

## T8. Documentación · **Hecha**

**Archivos:** `docs/constitution.md`, `AGENTS.md` y `AVANCES.md`. **Va la última**,
porque sus datos dependen de lo implementado.

**Qué hace:** actualiza el principio 5 de la constitution para que incluya la
cuarta pantalla con el argumento del Contexto de la spec (la que responde a
"¿qué reporté en total la última semana cerrada?"), **sin crecer**: sigue siendo
un principio corto. En `AGENTS.md`, corrige **las dos** frases que dicen "3
pantallas" y solo esas: el comentario del árbol de `index.html`, que pasa a
`# 4 pantallas`, y el primer punto de la checklist de "Verificación", que pasa a
"recorre las 4 pantallas". No toques nada más de `AGENTS.md`: es el archivo de
reglas permanentes del proyecto y ahí no se reescribe ni se reordena nada.
En `AVANCES.md`, anota el antes y el después del principio, en
"Estado actual" la cuarta pantalla y el filtrado en cliente, y en "Aprendizajes y
errores a evitar" lo que esta spec deja aprendido (hoja de estilos a medias,
`slice` appearing en sitios inocuos, la aritmética de semanas al cruzar el
lunes). Sale de "Próximos pasos" lo de la prueba manual de las 3 pantallas y
entra lo de la fase visual.

**RF:** ninguno (documentación). **Hecho cuando:** la constitution nombra las
cuatro pantallas; las dos frases de `AGENTS.md` dicen ya "4 pantallas" y ninguna
otra línea de ese archivo ha cambiado; y `AVANCES.md` sigue por debajo de 75
líneas, sin repetir `AGENTS.md`, con las cuatro secciones y la Fase visual anotada
como lo que queda.
