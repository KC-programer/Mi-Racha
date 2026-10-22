# Spec 001 · Resumen semanal

**Estado:** borrador
**Ámbito:** `index.html`, `app.js`, `estilos.css`. Y, porque el cambio las deja obsoletas, también `docs/constitution.md` (el texto del principio 5), `AGENTS.md` (las dos frases que dicen "3 pantallas") y `AVANCES.md`.

## Contexto

Aplicación web de una sola página "Mi Racha", sin build, sin frameworks, sin dependencias nuevas (única: `sql.js` desde CDN). Todo en español, un solo `<script>` clásico. Inserta texto con `textContent`/`createElement`, nunca `innerHTML`. Colores, radios, sombras y anchos salen de variables CSS. La fuente de verdad es `localStorage`; SQLite corre **en memoria**. Las fechas se tratan en **hora local**.

Registra sesiones diarias: `sesion` = `{id, fecha:'AAAA-MM-DD', frase, minutos, avances, creado_en:'AAAA-MM-DD HH:MM:SS'}`. Muestra historial y calcula racha. Se añade una pantalla para ver un **resumen semanal** de semanas **ya cerradas** (lunes a domingo).

Principio 5 de `docs/constitution.md` pide un argumento más fuerte que "estaría bien" para una cuarta pantalla. **El argumento:** las tres pantallas existentes responden a iniciar sesión, fijar la intención del día y registrar/ver sesiones. El resumen responde a una pregunta distinta: **"¿qué reporté en total la última semana cerrada?"**. No cabe en el tablero porque mezcla vista diaria con agregación semanal y necesita un selector de semana y una jerarquía propia.

## Objetivo

Ver, por semana, los siete días de lunes a domingo con los avances **íntegros** (sin truncar nunca), agrupando por día, con total de minutos y número de días con sesión. Se calcula al entrar en la pantalla y al cambiar el selector. No se persiste nada.

## Fuera de alcance

- Cambiar el esquema SQLite, las claves de `localStorage`, el objeto `sesion` o cómo se guarda y pinta el historial.
- Quitar la frase del historial: lo hará el usuario por su cuenta.
- Añadir claves nuevas en `localStorage`.
- Añadir métodos nuevos en `BaseDeDatos`.
- Modificar la rejilla de `.tablero`.
- Generar el resumen automáticamente.
- Truncar `avances`.
- **La fase visual con `frontend-design`**, que va después de esta, como fase separada.
- **No se decide nada nuevo sobre el principio 5 más allá de lo que dice el Contexto.** Actualizar su texto para que incluya la cuarta pantalla, corregir las dos frases de `AGENTS.md` que dicen "3 pantallas" y anotar el antes y el después en `AVANCES.md`, es parte de esta spec, no una decisión nueva: el argumento del Contexto es el que la constitution pide. `AVANCES.md` sigue sin pasar de 75 líneas, así que "Apruebas manuales… recorrer las 3 pantallas" pasa a 4 y el hueco lo ocupa lo que esta spec deja aprendido.

## Definición canónica: semana inicial

**La semana inicial es la última semana cerrada con actividad. Si no existe ninguna semana cerrada con actividad, se muestra la última semana cerrada con totales 0.**

Se escribe aquí una sola vez y se referencia desde los RF y los criterios que la necesita.

## Requisitos de funcionalidad

### RF-001 · Pantalla nueva y navegación

`<section class="pantalla" id="pantalla-resumen-semanal" hidden>` con `aria-labelledby="encabezado-resumen-semanal"` y `<h1 class="titulo" id="encabezado-resumen-semanal" tabindex="-1">Resumen semanal</h1>`. El `tabindex="-1"` es necesario: sin él, `focus()` sobre el encabezado no hace nada y el foco se pierde en el `body`, porque el botón que lo tenía queda dentro de la pantalla oculta. Al añadir la pantalla, actualizar el array `Pantallas`.

Al entrar, el foco pasa al encabezado; al salir, vuelve a `#boton-ver-resumenes`. La sección nace oculta y se muestra u oculta con `hidden`.

Al volver al tablero se usa **`mostrarPantalla('tablero')` sin repintar**, para conservar el `scrollTop` de `.sesiones`. Sobreviven igualmente los valores de `fecha`, `minutos` y `avances` del formulario, `#frase-actual` y `#mensaje-formulario`.

### RF-002 · Cálculo de la semana cerrada

Semana de **lunes a domingo**, en hora local.

**Convención:** `dow = (getDay() + 6) % 7`, con **0 = lunes** … **6 = domingo**, porque `Date.getDay()` devuelve 0 = domingo. La convención se declara explícitamente para que dos implementaciones no den semanas distintas.

Fórmula, con un único identificador para la clave de hoy:

- `hoy` = clave `"AAAA-MM-DD"` de hoy, en hora local (`claveDeHoy`).
- `partes = hoy.split('-').map(Number)`
- `dowHoy = (new Date(partes[0], partes[1] - 1, partes[2]).getDay() + 6) % 7`
- `lunesCerrado = moverDias(hoy, -(dowHoy + 7))`
- `domingoCerrado = moverDias(lunesCerrado, 6)`

Tabla verificada de los siete días:

| hoy | `dow` | última semana cerrada |
|---|---|---|
| 2026-10-05 (lunes) | 0 | 2026-09-28 – 2026-10-04 |
| 2026-10-06 (martes) | 1 | 2026-09-28 – 2026-10-04 |
| 2026-10-07 (miércoles) | 2 | 2026-09-28 – 2026-10-04 |
| 2026-10-08 (jueves) | 3 | 2026-09-28 – 2026-10-04 |
| 2026-10-09 (viernes) | 4 | 2026-09-28 – 2026-10-04 |
| 2026-10-10 (sábado) | 5 | 2026-09-28 – 2026-10-04 |
| 2026-10-11 (domingo) | 6 | 2026-09-28 – 2026-10-04 |

Y el sábado `2026-10-03` da `2026-09-21 – 2026-09-27`, que muestra cómo cambia al cruzar la semana.

El cálculo usa siempre `moverDias`, que reconstruye con `new Date(año, mes-1, día + cantidad)`. **Nunca** suma 86.400.000 ms. **No** usa funciones de fecha de SQLite (`date()`, `strftime()`, `julianday()`, `datetime()`): evalúan en UTC y pueden devolver un día distinto a partir de las 22:00 o en zonas tras UTC. El filtro de sesiones es **comparación de texto** sobre `"AAAA-MM-DD"`.

### RF-003 · No automático, y repintado solo por acción del usuario

El resumen **no se genera automáticamente**: no se calcula al arrancar la app ni al guardar una sesión. Se calcula **al entrar en la pantalla** y **cada vez que el usuario cambia el selector**, que es una acción explícita suya. Mientras la pantalla está abierta **no se repinta ni se revalida nada por su cuenta**: cruzar medianoche no la actualiza, aunque al volver a entrar sí usa la fecha de ese momento.

### RF-004 · Acceso desde la tarjeta de historial

Dentro de la tarjeta "Historial de sesiones", **al final**, después de `<ol class="sesiones" id="lista-sesiones">` y de `<p class="vacio" id="lista-vacia">`: `<button type="button" id="boton-ver-resumenes" class="boton boton--suave">Ver resúmenes…</button>`. No dentro del listado, no fuera de la tarjeta, y **no se toca la rejilla de `.tablero`**.

### RF-005 · Semanas disponibles

El selector ofrece **únicamente semanas ya cerradas con actividad**. Límite inferior: la **semana de la fecha más antigua guardada** (el **mínimo** de `sesion.fecha` entre todas las sesiones, no el primer elemento del listado, que por el orden `fecha DESC` sería la más reciente). Límite superior: la última semana cerrada con actividad. No es un intervalo de semanas: se omiten las semanas que no tienen ninguna sesión, aunque queden entre la más antigua y la más reciente. La lista de opciones es exactamente el conjunto de semanas cerradas con actividad, ordenadas de más antigua a más reciente.

La semana seleccionada por defecto es la **semana inicial**. El resumen **se recalcula en cada visita** y la semana seleccionada es **estado en memoria de la sesión**, en una variable de la capa de Interfaz: **no** se guarda en `Claves` ni en `Almacen`, así que **no hay ninguna clave nueva**. Al volver al tablero y reabrir el resumen, la selección vuelve a la semana inicial.

### RF-006 · Selector: orden, límites y opciones

`<select id="selector-semana">` con `<label class="rotulo" for="selector-semana">Semana</label>`; nombre accesible: "Semana". Las opciones van **de más antigua a más reciente**, de modo que la semana inicial es la última. El texto de cada opción sigue la regla de rango de RF-008. El selector **nunca lleva el atributo `disabled`** y **no se oculta en ningún caso**.

Si el mínimo de `sesion.fecha` cae **dentro de la semana en curso**, el rango arranca en la **primera semana cerrada que tenga actividad**; si no existe ninguna, aplica el caso de sin actividad. Las semanas cerradas sin actividad no se ofrecen nunca, ni aunque caigan entre la primera y la última. **Nunca** se ofrece la semana en curso.

La **sesión de hoy no aparece en el resumen hasta la semana siguiente**, porque la semana en curso nunca se resume.

### RF-007 · Sin actividad

Si **no hay ninguna sesión guardada**, o si toda la actividad está en la semana en curso, la pantalla muestra la última semana cerrada con **total de minutos 0** y **número de días con sesión 0**, y los siete días de lunes a domingo **sin ítems de sesión**. El selector ofrece **una sola opción**, esa, y **no puede moverse**; **no se oculta** y **no lleva `disabled`**. No se muestra ningún mensaje sustitutorio del tipo "sin actividad".

### RF-008 · Formato del rango, regla única

El rango se escribe **`dd/mm - dd/mm`**, con ceros a la izquierda. **Solo cuando los años del lunes y del domingo difieren** —lo que ocurre únicamente en el cruce de Año Nuevo— se escribe **`dd/mm/aaaa - dd/mm/aaaa`**, con el año en los dos extremos. En un cruce de mes dentro del mismo año (`28/09 - 04/10`) los años **no** difieren y el rango va **sin** año.

**Esta misma regla se aplica a la cabecera del resumen y a todas las opciones del selector.** No hay ninguna otra variante.

Para construirla se parte de la clave `"AAAA-MM-DD"`, no de una cadena ISO: `partes = clave.split('-')`, y el tramo es `partes[2] + '/' + partes[1]`, añadiendo `'/' + partes[0]` solo si difieren los años. **No** se usa `toLocaleDateString` para obtener `dd/mm`: medido en el navegador con `es-ES`, devuelve `28/9` y `3/1`, con el mes sin ceros. El almacenamiento sigue siendo `"AAAA-MM-DD"`.

### RF-009 · Agrupación por día, sin truncar avances

Se agrupa por **`sesion.fecha`** —el día local elegido—, **nunca** por `creado_en`: una sesión de las 00:30 cuenta en su día. Los días se muestran **de lunes a domingo**, los siete siempre. Dentro de un día, las sesiones van en orden `fecha DESC, creado_en DESC, id DESC`.

Cada día muestra su fecha en `dd/mm` y el **total de minutos** de sus sesiones. Cada sesión muestra sus **minutos individuales** y su bloque de **`avances` íntegro**. **No** se muestra la hora de creación. Cuando `avances` es cadena vacía, valor válido, se muestra **"Sin avances anotados."**, el mismo texto que usa el historial. Un día sin sesiones dentro de una semana con actividad muestra su cabecera `dd/mm`, minutos 0 y ningún ítem.

Cada sesión del resumen se marca con **`data-id`** con el valor de su `id`, para poder localizarla al verificar el texto.

Los `avances` se muestran **íntegros, sin truncar nunca**. Está prohibido `slice`, `substring`, `substr` o cualquier recorte **sobre `sesion.avances`**; esos métodos sí son válidos para construir la clave de fecha. Se conservan los **saltos de línea** (`white-space: pre-wrap`, como ya hace `.sesion__avances`) y se envuelven las palabras largas **sin cortarlas** (`overflow-wrap: anywhere`). "Íntegro" incluye conservar los saltos de línea del `<textarea>`.

En la pantalla de resumen **no** se ofrece "Eliminar esta sesión": esa acción es del tablero.

### RF-010 · La frase no aparece en el resumen

El resumen **no muestra la frase**, ni la actual ni la copia de cada sesión.

Conviene no confundirlo: **`sesion.frase` sí se guarda y sí se muestra en el historial** —al crear una sesión se copia la frase viva, y `pintarHistorial` la pinta con comillas—, pero el resumen no la usa. La frase viva vive en `miRacha:frase` y se sobrescribe en cada cambio, así que lo único que se conserva de cada frase es la copia que su sesión hizo de ella.

Esta spec **no cambia** `ESQUEMA_SQL`, ni `Claves`, ni el objeto `sesion`, ni el historial. Quitar la frase del historial queda **fuera de alcance**: lo hará el usuario por su cuenta.

### RF-011 · Orden de bloques

En esta fase funcional solo se define la **jerarquía de la información**, que es una decisión de contenido y no de color. De arriba abajo:

1. Encabezado de pantalla (`#encabezado-resumen-semanal`).
2. Selector de semana (`#selector-semana`) con su etiqueta.
3. Cabecera del resumen: rango, total de minutos, días con sesión.
4. Lista de días, de lunes a domingo.
5. Botón "Volver al tablero" (`#boton-volver-tablero`).

Este orden debe reflejarse en el DOM. La pasada visual con `frontend-design` viene después.

### RF-012 · Estilos, responsive y modo oscuro

Todo color, radio, sombra y ancho sale de **variables CSS**, nunca de literales. El bloque `@media (prefers-color-scheme: dark)` **ya redefine las variables**, de modo que las reglas nuevas **no se replican** allí: basta con usar variables.

`estilos.css` solo agrupa hoy `input[type=text|date|number]` y `textarea`, así que un `<select>` sin regla propia **no hereda nada y no tiene `:focus-visible`**: hay que darle regla con variables. Sin desbordes a **≤ 480px**. Contraste **≥ 4,5:1** en texto normal. Los elementos interactivos nuevos llevan `:focus-visible`. El input de texto se mantiene en `font-size: 1rem`: por debajo de 16px iOS hace zoom al enfocar.

## Reglas de datos e invariantes

- `sesion` = `{id, fecha:'AAAA-MM-DD', frase, minutos, avances, creado_en}`. Sin cambios.
- Claves: `miRacha:sesiones` y `miRacha:frase`. **Ninguna nueva.**
- Fuente de verdad: `localStorage`. SQLite en memoria: al arrancar se crea una base vacía y se reinserta lo que haya en `localStorage`.
- El resumen **filtra `BaseDeDatos.listar()` en el cliente, sin método nuevo** en `BaseDeDatos`. Si algún día hiciera falta un método auxiliar, tendría **las dos implementaciones** (SQL y respaldo) con el mismo shape.
- Orden de listado: **`fecha DESC, creado_en DESC, id DESC`**, idéntico en modo SQL y en modo de respaldo.
- Fechas: **hora local, nunca UTC**. `new Date(año, mes-1, día)`, nunca desde cadenas ISO. Claves `"AAAA-MM-DD"` con ceros a la izquierda, comparables como texto. Helpers de la capa de fechas: `claveDeHoy`, `moverDias`, `claveFecha`.
- Una o varias sesiones del mismo día cuentan como **un** día.
- `sesionesValidas` sigue admitiendo datos ya guardados a los que les falte un campo.
- `localStorage` guarda también una clave `miRacha:prueba` que `Almacen` crea y borra al arrancar: al comprobar que no hay claves nuevas hay que tenerla en cuenta.
- Una `fecha` no válida en `localStorage` (por ejemplo `2026-02-31`, que `sesionesValidas` acepta porque solo comprueba la forma) queda **fuera de alcance**: esta spec no lo arregla y no lo agrava.

## Estados explícitos

- **(a) Sin actividad.** Sin sesiones guardadas, o con toda la actividad en la semana en curso: se muestra la última semana cerrada con total de minutos 0 y número de días con sesión 0, y los siete días sin ítems de sesión; el selector ofrece una sola opción, esa, y no puede moverse; el selector no se oculta ni lleva `disabled`.
- **(b) Una sola semana disponible.** Cuando solo existe una semana con actividad: `<select>` con una única opción, **sin `disabled`**.
- **(c) Primera sesión en la semana en curso.** Si el mínimo de `sesion.fecha` cae dentro de la semana en curso, el rango arranca en la primera semana cerrada que tenga actividad; si no existe ninguna, aplica **(a)**. Nunca se ofrece la semana en curso.
- **(d) Regla del rango.** `dd/mm - dd/mm`; solo si difieren los años, `dd/mm/aaaa - dd/mm/aaaa`. Misma regla en cabecera y selector.
- **(e) Semana inicial.** La **definición canónica** de arriba: última semana cerrada con actividad; si no hay ninguna, la última cerrada con totales 0.

## Modos degradados

- **`sql.js` no carga** (sin red o CDN caído): `modo = 'respaldo'`, array en memoria. El resumen sigue funcionando.
- **Fallo del primer arranque de SQLite**: un reintento y luego respaldo. El resumen sigue funcionando.
- **`localStorage` bloqueado**: `Almacen` usa memoria y el pie avisa de que se perderá al cerrar. El resumen refleja lo que hay en memoria.

Con los mismos datos, el resumen da **exactamente los mismos números** en modo SQL y en modo de respaldo: coinciden con la **suma de minutos de las sesiones de esas fechas**, que es lo que muestra el historial. Los totales del resumen son **de la semana**, no los totales vitalicios del historial.

## Accesibilidad

- `<section class="pantalla" id="pantalla-resumen-semanal" hidden aria-labelledby="encabezado-resumen-semanal">`, mostrada y ocultada con `hidden`.
- `<h1 class="titulo" id="encabezado-resumen-semanal" tabindex="-1">Resumen semanal</h1>`.
- `<label class="rotulo" for="selector-semana">Semana</label>` con `<select id="selector-semana">`.
- `#boton-ver-resumenes` y `#boton-volver-tablero`, ambos con `type="button"`.
- Foco al entrar en el encabezado, de vuelta a `#boton-ver-resumenes` al salir.
- `role="alert"` y `aria-live="polite"` solo donde corresponde; `.oculto` para ocultar solo visualmente, nunca `display: none`.
- `:focus-visible` en todo elemento interactivo nuevo.

## Criterios de aceptación

Verificables en navegador o con la consola: el proyecto **no tiene test runner**.

1. **Ubicación del botón.** `#boton-ver-resumenes` está dentro de la tarjeta "Historial de sesiones", después de `#lista-sesiones` y de `#lista-vacia`, con texto "Ver resúmenes…", clase `boton boton--suave` y `type="button"`. No está fuera de la tarjeta ni dentro del listado.
2. **Navegación y foco.** Al pulsarlo se muestra `pantalla-resumen-semanal` y el tablero se oculta; el foco pasa a `#encabezado-resumen-semanal`. "Volver al tablero" regresa con `mostrarPantalla('tablero')` sin repintar, conservando el `scrollTop` de `.sesiones`, y el foco vuelve a `#boton-ver-resumenes`. La sección nace con `hidden`.
3. **Cálculo de la semana.** La tabla de los siete días de RF-002 se cumple: de lunes a domingo, la última semana cerrada es la misma, y el sábado anterior da la semana anterior.
4. **Semana inicial.** Sin sesiones: última cerrada con totales 0. Con sesiones: la última cerrada **con actividad**. Caso de comprobación: con hoy sábado `2026-10-03` y una única sesión el `2026-09-15`, la pantalla muestra `14/09 - 20/09`, no la semana vacía del 21 al 27 de septiembre.
5. **Selector.** Contiene únicamente semanas cerradas con al menos una sesión, de más antigua a más reciente, y **omite las semanas intermedias sin actividad**: el listado no es contiguo. La primera opción es la semana del **mínimo** de `sesion.fecha`, salvo que ese mínimo caiga en la semana en curso, en cuyo caso la primera opción es la primera semana cerrada con actividad (criterio 8). El texto de las opciones sigue la regla de rango. **Nunca lleva `disabled`**.
6. **Sin actividad.** Totales 0, cero días con sesión, los siete días sin ítems, selector con una sola opción que no puede moverse y no se oculta. Sin mensaje sustitutorio.
7. **Una sola semana disponible.** Selector con una única opción, sin `disabled`, y el resumen se ve correctamente.
8. **Primera sesión en la semana en curso.** Dos montajes: (a) una sesión de hoy **más** otra en una semana cerrada anterior → el rango arranca en la primera semana cerrada con actividad, no en la semana en curso; (b) solo la sesión de hoy → aplica el caso sin actividad. Nunca se ofrece la semana en curso.
9. **Regla del rango.** Mismo texto en cabecera y selector. `28/09 - 04/10` sin año. Cruce de Año Nuevo: `28/12/2026 - 03/01/2027` con año en ambos extremos. Construido desde la clave con `split('-')`.
10. **Agrupación y avances.** Cada día agrupa por `sesion.fecha`. Días de lunes a domingo, los siete siempre. Los avances son **idénticos a `sesion.avances`**, con acentos, saltos de línea y emoji; se conservan los saltos (`pre-wrap`) y las palabras largas se envuelven sin cortarse (`overflow-wrap: anywhere`). Sin `slice`, `substring`, `substr` ni truncado **sobre `sesion.avances`**. Avances vacíos → "Sin avances anotados.". No se muestra la frase ni la hora de creación.
11. **Comprobación literal de los avances.** Con la sesión ya guardada, localizar en `BaseDeDatos.listar()` la sesión por su `id` (con `String(...)` en ambos lados) y comparar su `.avances` con el `textContent` del bloque pintado en la pantalla de resumen, identificada por su `data-id`. **No** se compara contra `#avances.value`, porque `app.js` limpia ese campo al final del submit y la comparación daría siempre `false`.
12. **Texto largo.** Un `avances` de 2000 caracteres sin espacios, a ≤ 480px, no desborda ni se corta.
13. **Recalcular.** Cambian los datos, se vuelve a entrar y el resumen refleja el cambio. Cambiar el selector actualiza a la vez el rango de la cabecera, el total de minutos, el número de días con sesión y la lista de días.
14. **Sin arranque automático.** Tras cargar la app, `pantalla-resumen-semanal` está oculta y su contenido solo aparece tras pulsar `#boton-ver-resumenes`.
15. **Repintado solo por acción.** Con la pantalla abierta, guardar una sesión o cambiar el día no repinta el resumen por su cuenta. Al volver a entrar tras cruzar medianoche, corresponde a la última semana cerrada de ese momento.
16. **Cambio de hora.** En una zona con cambio de hora, el resumen de una semana que contiene el domingo del cambio muestra los siete días correctos y cuenta bien los días con sesión.
17. **Orden de bloques.** El DOM de la pantalla de resumen respeta el orden de RF-011: encabezado, selector, cabecera, lista de días, botón de volver.
18. **Responsive y modo oscuro.** Sin desbordes a ≤ 480px; variables CSS sin literales; el bloque oscuro no repite reglas y solo redefine variables; contraste ≥ 4,5:1; foco visible en los elementos interactivos.
19. **Modos degradados.** (a) Sin `sql.js`: el pie indica respaldo y el resumen carga. (b) Fallo del arranque de SQLite: mismo resultado tras el reintento. (c) `localStorage` bloqueado: el resumen refleja la memoria y el pie avisa. (d) Con los mismos datos, **exactamente los mismos números** en modo SQL y en respaldo, coincidentes con la suma de minutos de las sesiones de esas fechas.
20. **Volumen.** El selector funciona con alrededor de 150 semanas.

## Fase posterior

Esta spec es la **fase funcional**. La **pasada visual con `frontend-design` sobre toda la plataforma** va **después**, ya con la función integrada, para no diseñar la pantalla nueva contra una hoja de estilos en movimiento. En esta fase solo se ha decidido la jerarquía de la información (RF-011). La pasada visual definirá paleta, tipografía y espaciados con criterios comprobables (contraste ≥ 4,5:1, reflow a ≤ 480px, modo oscuro, foco visible), sin contradecir ningún RF.

## Limitaciones conocidas

- Solo se resumen semanas **ya cerradas**: la sesión de hoy no aparece hasta la semana siguiente.
- El filtrado es 100 % cliente sobre `BaseDeDatos.listar()`; no hay índice ni consulta específica.
- La frase viva se sobrescribe en `miRacha:frase`: solo se conserva la copia de cada sesión, y el resumen no la usa.
- El rango no distingue años si no difieren los del lunes y el domingo.
- Una `fecha` no válida guardada (`2026-02-31`) no se corrige.

## Riesgos

- Confundir "última semana cerrada" con "última semana cerrada **con actividad**".
- Reutilizar `toLocaleDateString('es-ES', {day, month})` y obtener `28/9` sin ceros.
- Comparar los avances contra `#avances.value`, que `app.js` limpia tras el submit.
- Confundir "inicio de la lista" con "fecha más antigua", e invertir los límites del selector.
- Replicar reglas en el bloque oscuro en vez de usar variables.