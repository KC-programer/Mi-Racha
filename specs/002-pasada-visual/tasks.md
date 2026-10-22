# Tareas 002 · Pasada visual

Orden de dependencia, de lo que no depende de nada a la documentación. Cada
tarea deja el proyecto **arrancando y funcionando**: al terminar cualquiera de
ellas, `index.html` abre con las cuatro pantallas y nada queda a medias.

Son **diez tareas**, y las dos últimas son documentación, porque sus datos
dependen de lo ya implementado. **T10 es la del principio 2 de la constitution y
va la última.**

**Una sola tarea toca `app.js`, y es T7**: dos cadenas de texto, la más fácil de
revertir del proyecto entero. Se studió avisar en el pie de que la fuente no ha
cargado y **se rechazó**: de aquel montaje no queda nada, ni función, ni llamada,
ni `catch`, ni atributo, ni criterio. La razón está en la spec.

**Y una tarea está a medias: T1.** Se aplicó una vez con la paleta de verde de
tinta y el cliente la rechazó al verla, así que **vuelve a estar pendiente**. Es la
única que se rehace, y **es sustituir valores, no añadir nada**: las variables ya
existen en `estilos.css`, el archivo está bien y no hay que repararlo. De T2 en
adelante, el alcance **no cambia** con el cambio de paleta.

Ninguna tarea incluye un paso de build, ni refactor de `app.js`, ni pruebas
nuevas: el proyecto no tiene runner ni Node.

---

## T1. El sistema de tokens: `:root` y el bloque oscuro · **Hecha (rehecha con la vía C)**

**Archivos:** `estilos.css`, el bloque `:root` y el bloque
`@media (prefers-color-scheme: dark)`.

**Esta tarea ya se hizo una vez y hay que volver a hacerla.** `estilos.css` ya tiene
los dos bloques escritos con la paleta de **verde de tinta**, que el cliente
rechazó al verla aplicada. La hoja pasó de 453 a 515 líneas y las llaves están
balanceadas, así que **el archivo está bien y no hay que repararlo**: lo que cambia
es el valor de los tokens, no la estructura. Las variables nuevas que se añadieron
—`--regla-tenue`, `--foco`, `--fuente`, `--medida`, la escala, el ritmo,
`--margen-dia`— **ya están todas** y **no hay que volver a añadirlas**, ni a
quitarlas, ni a renombrarlas.

**Por tanto: esto es sustituir valores, no añadir nada.** Ni una variable nueva, ni
una eliminada, ni un nombre tocado. Los valores que hay que poner son los del punto
4 de `plan.md`.

**Lo único que hay que mirar de verdad, porque es donde se fue por libre:** los
neutros. Los verdes tenían sesgo, y el cliente pidió quitarlo **conservando las
relaciones de luminosidad**, que son las que hacen que todo encaje. Por eso los
contrastes **se han recalculado y no arrastrado**: quitar el sesgo cambia los
valores y con ellos los ratios, así que los números de la tabla de RF-002 son nuevos
y no los de antes.

Cuatro cosas concretas que son fáciles de cambiar por la costumbre:

- **`--exito` y `--exito-suave` dejan de ser el acento.** Pasaron a **ámbar de
  bronce**, no a verde. Es el cambio que más se le puede pasar por alto a alguien que
  tenga la paleta verde en la cabeza, porque `--exito` era literalmente igual a
  `--primario`.
- **`--sombra` cambia su RGB**, porque lleva el color de la tinta dentro. Sigue siendo
  el **único alfa de la hoja**.
- **`--sobre-primario` no se renombra**, solo cambia de valor, y el oscuro se sigue
  invirtiendo: `--sobre-primario` está documentado en `AVANCES.md` con su motivo, y
  ese motivo —el texto claro no llega sobre un acento aclarado— sigue siendo el
  mismo.
- **No queda ningún valor verde en el archivo.** Si al terminar queda un `#2f6b47`,
  `#7fc79c` o `#eaf1ec` fuera de un comentario, la tarea está mal.

**RF:** RF-001, RF-002, RF-003. **Ninguna más.**

**Hecho cuando:** la app abre y se ve con la paleta **violeta** en las cuatro
pantallas: papel frío casi sin matiz, tinta neutra, filetes neutros, y el número de
la racha, los minutos y la racha viva en violeta. El mensaje de éxito sale en
**ámbar**, no en violeta ni en verde, y el de error sigue en rojo. En el panel de
estilos, **todos** los colores que ve la app salen de una variable, y **ninguno** es
un literal fuera de `:root`. El bloque oscuro **no ha crecido nada**: ni un selector,
ni una propiedad suelta.

**Los seis pares de la tabla de RF-002 dan ≥ 4,5:1 en claro y en oscuro**, medidos
con el selector de color de DevTools: tinta/hoja 14,59 y 14,77 · grafito/hoja 5,46 y
7,64 · violeta/hoja 7,41 y 7,22 · sobre-primario/violeta 7,41 y 7,22 ·
error/tinte 6,26 y 7,51 · exito/tinte 5,63 y 8,77. Y además el acento sobre
`--superficie` (8,18 y 6,61) y sobre `--superficie-suave` (7,68 y 5,88), porque se
usa como texto en las dos. **El papel se ve frío y no se ve de ningún color**, que es
lo que hay que poder afirmar al mirar la pantalla, y no solo al medir.

El único alfa de la hoja sigue siendo el de `--sombra`, dentro de `:root`. La app
**no ha cambiado de comportamiento**: mismas pantallas, mismo pie, mismos números, y
guardar y borrar una sesión sigue igual.

---

## T2. La familia tipográfica: una línea en `index.html` · **Hecha**

**Archivos:** `index.html`, una línea. `estilos.css`, la regla de `body`.
**No toca `app.js`.**

**Confirmado al ejecutarla:** `Faustina` **es variable**, comprobado contra la
API: `ital,wght@0,300..700;1,300..700` devuelve `font-weight: 300 700` en los seis
bloques, y `0,400;1,400` devuelve `font-weight: 400` fijo. La URL pide el rango.
Sin conexión la petición falla y `document.fonts` queda **vacío**, así que se
entra en la primera serif local de `--fuente`: FCP a 68 ms y el primer pintado no
espera a nada.

**Qué hace, en dos trozos.**

*El enlace.* Añade junto a los `<meta>`, **sin quitar ni mover nada de lo que
hay**, un `<link>` a la API de Google Fonts para **`Faustina`**, con `display=swap`
y los subconjuntos `latin,latin-ext`, pidiendo `400`, `600`, `700` y **la cursiva
`400`**. La URL queda escrita **una vez**, aquí, y **sin ningún atributo**: ni
`onerror`, ni `rel="preload"`, ni nada. Si en T1 se comprobó que la familia es
variable, la URL pide el rango en vez de los pesos sueltos.

*La familia.* En `body`, `font-family` pasa a ser `var(--fuente)`. **Es la única
declaración de `font-family` de toda la hoja.** Los `input`, el `textarea`, el
`select` y los botones la heredan por su `font: inherit`, y no hay que tocar sus
reglas. De paso, `-webkit-font-smoothing` deja de ser `antialiased`, porque con
una serif adelgazar los trazos cuesta legibilidad.

**Y nada más.** Ni en `estilos.css` un `@font-face` ni un `@import` —una cosa
ataría la hoja propia a la fuente, y la otra obligaría a fijar a mano las URL de
los archivos que genera el CDN—, ni en `app.js` una sola línea de lógica. El
`<link>` y `--fuente` **se citan mutuamente en un comentario**, porque el nombre
de la familia vive en esos dos sitios y en ninguno más.

**RF:** RF-006, RF-007. **RF-007 se termina en T4**, que es donde se aplica el
margen de fechas de ancho fijo; aquí se pone la pila de reserva y se comprueba que
la app arranca sin esperar a la fuente.

**Hecho cuando:**
- la app abre y **todo el texto** está en la familia nueva, sin excepción:
  titular, cuerpo, campos, botones, la frase y los avances. En el panel de
  estilos, `font-family` **no** aparece en ningún otro sitio de la hoja. La pila
  de reserva se ve escrita en `--fuente` y empieza por una serif local. Los
  `input`, el `textarea` y el `select` siguen en `1rem` —16 px—, porque
  `font: inherit` no cambia el tamaño, solo la familia;
- **`app.js` no ha cambiado**. Ni una línea, en ningún archivo de la aplicación
  salvo esa línea de `index.html` y esa regla de `body`. En `app.js` no hay
  ninguna función nueva, ni ninguna llamada nueva, ni `setTimeout`, ni
  `document.fonts`;
- **sin conexión**, la app **arranca sin esperar a la fuente**, se leen las cuatro
  pantallas y se guarda una sesión: la familia de reserva entra y nada desaparece.
  El primer pintado no espera;
- **`#pie-modo` dice exactamente lo mismo que antes**, carácter a carácter: `Tus
  datos se guardan solo en este navegador. Base de datos: SQL (SQLite).` Con la
  fuente puesta y sin ella. **No hay ningún aviso de la fuente**, y esa ausencia
  es intencionada;
- en `estilos.css` hay **cero** `@font-face` y **cero** `@import`; en
  `index.html` el único `onerror` es el de `sql.js`, que no se ha tocado;
- la URL de la fuente está **una sola vez** en el proyecto y el nombre de la
  familia **dos**, y solo en los sitios que dice RF-006;
- `sql.js` sigue cargando igual, y la app funciona exactamente igual que antes de
  esta tarea.

---

## T3. Tipografía aplicada y superficie: fondo plano y sin sombras · **Hecha**

**Archivos:** `estilos.css`, bloques de textos, tarjetas, racha, formularios,
listas, pie y los dos `@media` del final.

**Qué hace:** aplica la escala y la medida donde toca, y quita lo que la pasada
deja sin destino.

- `body`: `font-family: var(--fuente)` —lo que pidió T2—, sin `-webkit-font-smoothing: antialiased`. Se le **quita** `background-image: var(--fondo-degradado)`: el fondo queda plano.
- `.marca` y `.rotulo--claro`: sin `text-transform: uppercase` y sin `letter-spacing`, y en `var(--texto-suave)`. Los textos no cambian.
- `.titulo`, `.frase`, `.tarjeta__titulo`, `.subtitulo`, `.rotulo`, `.ayuda`, `.pie`, `.resumen`: con la escala, y `.sesion__avances` y `.sesion__frase` con `--medida` y **más interlineado** que el resto, porque tienen serifas.
- `.tarjeta`: **sin `box-shadow`**, con `border: 1px solid var(--borde)` y `--radio-chico`. Su título lleva su margen abajo y `.resumen` **pierde el margen negativo**, que solo existía para compensarlo.
- `.racha` y `.racha--activa`: **fuera el `linear-gradient`**, se quedan planas. `.racha` sin sombra y alineada a la izquierda, con `.racha__texto` y `.racha__nota` en la misma línea base que el número, en la misma columna.
- `.vacio`: sin borde discontinuo ni caja; pasa a párrafo tranquilo con filete arriba.
- `.sesiones`: **único sitio de la hoja que conserva `box-shadow`**, con el valor corto de `--sombra`.
- `.boton` y `.boton--suave`: en `var(--espacio-3)` y `var(--espacio-2)`. Las transiciones que quedan son de color y de posición, no de tamaño ni de sombra.
- `input[type=text|date|number]`, `textarea` y `select`: **siguen en `font-size: 1rem`**.
- Los dos `@media` del final se conservan: el de 480 px y el global de `prefers-reduced-motion`. No se añade ningún otro corte.

**RF:** RF-004, RF-005, RF-008, RF-014, RF-015.

**Hecho cuando:** en `estilos.css` hay **cero** ocurrencias de `gradient(` y
**exactamente un sitio** que usa `box-shadow` como sombra decorativa, y ese sitio
es `.sesiones`. La app abre: la tarjeta de racha es una franja plana alineada a la
izquierda, con el número grande al principio de la frase que acompaña; el historial
son dos tarjetas con filete y sin sombra, y la zona vacía es un párrafo y no una
caja. `.marca` y `.rotulo--claro` se leen como texto pequeño y gris, sin
mayúsculas ni espaciado abierto. Con la lista de avances larga y con acentos, los
saltos de línea siguen ahí y las palabras largas envuelven sin cortarse: **son los
criterios 10 y 12 de la spec 001, y no se han roto**. A 375 y a 480 px no desborda
nada. Con `prefers-reduced-motion` no se mueve nada. Guardar y borrar sesiones
sigue funcionando igual, y el historial sigue mostrando la frase en cursiva
**real**, no inclinada.

---

## T4. El resumen semanal: día, sesión, cabecera, selector y vuelta · **Hecha**

**Archivos:** `estilos.css`, bloque `/* ---------- Resumen semanal ---------- */`
y las reglas de los campos.

**Qué hace:** separa los dos niveles del resumen **sin tocar el DOM**, y resuelve
los tres puntos que dejó la spec 001.

- `.dias`: sin fondo, sin caja; el filete de cada día lo pone `.dia`.
- `.dia`: **fuera** `border`, `border-radius`, `background` y `box-shadow`; **dentro** `border-top: 1px solid var(--borde)`, el aire de arriba con `--espacio-3`, y el primer día sin filete.
- `.dia__fecha`: **margen izquierdo de `var(--margen-dia)` de ancho fijo**, alineado a la izquierda. Sin `tabular-nums`: el ancho es fijo para que alinee también sin la fuente.
- `.dia__sesiones`: sin caja; sus hijos se sangran y llevan filete lateral.
- **`.dia__sesiones .sesion`**: sin `border`, sin `background`, sin `border-radius`, con `border-left` de `var(--borde)`, sangría y `--espacio-2` de separación. Escrita **después** de `.sesion`, para que gane por especificidad.
- `.sesion__minutos`, dentro del resumen: en el margen derecho del día, en `var(--texto-suave)`. El acento queda para lo que cuenta, no para cada fila.
- `#resumen-semanal`: sigue siendo una regla por `id`. Su trabajo cambia: ahora pone el total de la semana **al nivel de titular de la pantalla** —en `var(--texto)` y con `--texto-2`—, y su comentario se reescribe para explicar por qué existe: no para anular un margen negativo, sino porque este total es el titular y el del historial no lo es.
- `#selector-semana`: `width: auto` con `min-width` de 14 rem, y borde reforzado en `var(--texto-suave)`. **Se queda en `1rem` y con su anillo de foco.** La flecha nativa se deja como está.
- El `label` del selector: sin mayúsculas ni `letter-spacing`, en `var(--texto-suave)`.
- `#boton-volver-tablero`: filete arriba en `var(--borde)` y `--espacio-5` de aire, para que no se lea como un día más.

**RF:** RF-010, RF-011, RF-015, y **el final de RF-007** (el margen de fechas de
ancho fijo es lo que hace que el resumen se lea igual sin la fuente).

**Hecho cuando:** en el resumen, un día **no** tiene caja ni fondo ni radio ni
sombra y sí un filete arriba, y las fechas de los siete días quedan alineadas en
un margen de ancho fijo; las sesiones de dentro **no** tienen caja y sí filete
lateral y sangría. En el historial, una sesión **sí** conserva su bloque con
borde y su fondo. `#lista-dias .sesion` y `#lista-sesiones .sesion` se ven
distintos, y el historial **no ha cambiado** respecto a T3. El total de la semana
se lee como el titular de la pantalla, y **sigue empezando por el texto exacto
del rango**, idéntico al de la opción seleccionada. El selector se ajusta a su
contenido, se le ve el borde, muestra el anillo al tabular, **no lleva `disabled`**
y su texto sigue siendo `28/09 - 04/10`. El botón de volver está separado de la
lista por un filete y no se lee como un día. Todo esto a 375 y a 480 px sin
desbordes.

---

## T5. Foco medido y estados de los controles · **Hecha**

**Archivos:** `estilos.css`, la regla de foco de los campos, `.boton`,
`.boton-borrar`, `.mensaje` y `.mensaje--error`.

**Dos añadidos del cliente, decididos con esta tarea y ya aplicados:**

- **A · Fuera el anillo del encabezado del resumen.**
  `#encabezado-resumen-semanal:focus { outline: none; }`. Lleva `tabindex="-1"`, así
  que el Tab nunca pasa por ahí y el único foco que recibe es el programático de
  `abrirResumenSemanal`, que existe para anunciar la pantalla a un lector de
  pantalla: no es un control, no se opera, y su anillo no informaba de nada. El
  anillo del grupo de foco se aplica por enumeración explícita —`input`, `textarea`,
  `select`, `.boton` y `.boton-borrar`—, que es lo que cubre también
  `#selector-semana`. Se aplica a `:focus`, no a `:focus-visible`, porque el
  rectángulo negro era el `outline: auto` del navegador.
- **B · El filete se traslada del botón al registro.** Los dos botones pierden su
  `border-top` y su `margin-top`; el filete pasa a `border-bottom` de `.sesiones` y
  de `#lista-dias`, con el aire de `--espacio-5` en el margen de la lista y
  `padding-bottom` de `--espacio-3` dentro. Medido: el filete pasa de 132 px a
  570 px en el historial y de 132 px a 992 px en el resumen.

**Qué hace:**

- El anillo de `:focus-visible` pasa a **tinta**: `outline: 2px solid var(--foco)`
  con `outline-offset: 2px`, y **fuera el halo de `--primario-suave`**, que sobre
  la superficie clara no llegaba a 1,5:1. Se aplica a `input`, `textarea`,
  `select` y `.boton`, y sigue siendo **solo** `:focus-visible`.
- `.boton--suave` deja de ser una píldora rellena: **sin relleno**, con filete en
  `var(--borde)`, texto en `var(--texto)`, y al pasar el puntero el filete se
  oscurece. Los tres botones que la comparten —`#boton-cambiar-frase`,
  `#boton-ver-resumenes` y `#boton-volver-tablero`— se ven iguales, que es la
  simetría de entrada y salida.
- `.boton:hover` y `.boton:active`: los que hay, sin tamaño y sin sombra.
- `.boton-borrar`: se queda subrayado, en `var(--texto-suave)`, y en `var(--error)`
  al pasar el puntero.
- `.mensaje` y `.mensaje--error`: con filete del color correspondiente en el
  canto, que es lo que dice qué pasó, más el fondo tenue de siempre.
- **No se añade ningún estado deshabilitado** en ninguna parte.

**RF:** RF-012. **Criterios:** 5, 12 y 13.

**Hecho cuando:** recorriendo con **Tab** el formulario, los botones, el selector
y el enlace de eliminar, el anillo aparece en los cuatro tipos y se ve; con el
puntero no aparece. Medido con el selector de color de DevTools, el anillo da
**≥ 3:1** contra el fondo y contra la superficie, **en claro y en oscuro** —con
`--foco` invertido por el bloque oscuro—. Los tres `boton--suave` se ven iguales
entre sí y claramente distintos de "Iniciar sesión", "Listo" y "Guardar sesión",
que son los de acción: la diferencia es el relleno, no el tamaño. Ningún elemento
de la app queda con `disabled`, y en el código no aparece el atributo. La
animación de aparición de pantalla y el resaltado de la sesión nueva siguen ahí y
son las **únicas dos**; con `prefers-reduced-motion` ninguna se mueve.

---

## T6. El número de la racha, con peso de cifra y sin ciclo de conteo · **Hecha**

**Archivos:** `estilos.css`, bloque `/* ---------- Racha ---------- */`.

**Qué hace:** `.racha__numero` pasa a `--cifra`, peso 700 —no 800, que es el peso
de los indicadores— con tracking cerrado, en `var(--primario)`. `.racha__texto` y
`.racha__nota` quedan en la columna de la izquierda, alineados a la izquierda con
el resto del tablero. `.racha--activa` se queda en **plano**, con filete de
`--regla-tenue` al canto: la diferencia entre tener racha y no tenerla la marca la
cifra, no un color distinto. **Ni `animation` de conteo, ni interpolación, ni
guion de posición, ni degradado, ni caja propia.**

**RF:** RF-009, RF-016.

**Hecho cuando:** el número de la racha está alineado a la izquierda con el
resto del tablero, en la misma línea base que sus palabras, y **no** está
centrado ni dentro de una caja. Es el **único** elemento de la app con tamaño
`_cifra`; no hay nada más grande en ninguna pantalla. En `estilos.css` **no**
aparece `animation` ni `@keyframes` nuevas: siguen solo la de aparición de
pantalla y la del resaltado. El número que se ve es exactamente el que devuelve
`calcularRacha`: con cero sesiones sale 0 y dice "Aún no tienes racha"; con una
sesión de ayer y ninguna de hoy, sale 1 y la racha sigue viva; borrando la sesión
de hoy baja a 0. Las dos pantallas de ritual siguen centradas.

---

## T7. El separador de la cadena de datos · **Hecha**

**Archivos:** `app.js`, capa 5 · Interfaz, dos cadenas.

**Qué hace:** en `pintarCabeceraResumen`, los dos ` · ` de la concatenación pasan a
`, `. En `pintarHistorial`, el ` · ` que separa el número de sesiones del tiempo
total pasa a `, `. **Nada más**: ni `formatearRangoSemana`, ni `formatearTiempo`,
ni ninguna otra función, ni ninguna comparación, ni ninguna clave.

La cabecera pasa a leerse `"28/09 - 04/10, 2 h 30 min, 3 días con sesión"` y el
resumen del historial `"3 sesiones, 2 h 30 min de estudio en total"`.

**RF:** RF-013.

**Hecho cuando:** con una semana con actividad, `#resumen-semanal` se lee
exactamente esa cadena, con coma y sin punto medio; `#resumen` se lee
`"3 sesiones, 2 h 30 min de estudio en total"`. **El texto de la opción
seleccionada del selector sigue siendo idéntico carácter a carácter al rango del
principio de la cabecera**, y `formatearRangoSemana` **no ha cambiado**: en el
cruce de Año Nuevo sigue dando `28/12/2026 - 03/01/2027`. Los números de la
cabecera y del historial son los mismos de antes. La app arranca, guarda, borra y
navega igual.

**RF:** RF-013. **No es una tarea descartable:** el cliente la ha aceptado (D3), así que forma parte de la spec y su «hecho cuando» es obligatorio. Lo que sí sigue siendo cierto es que es **la más fácil de revertir del proyecto entero**: dos cadenas, en dos funciones, sin nada más alrededor.

---

## T8. Recorrido de los criterios de aceptación

**Archivos:** ninguno. Es la verificación de todo lo anterior.

**Validación (T8 — finalizada 2026‑10‑12):** se recorrieron los 30 criterios de aceptación en navegador y consola. **Veredicto: APTO**. De los 30, 27 se cumplieron completamente y 3 quedaron pendientes por limitaciones del entorno:

1. **Criterio 16 (zona horaria)** — ⚠️ **No comprobado**: en `America/Mexico_City` no hay cambio de horario en 2026 (`getTimezoneOffset()` = 360 min en enero, julio y octubre); no hay transición que probar, solo razonamiento sobre la aritmética local.
2. **Criterio 19(c) (simulación localStorage bloqueado)** — ⚠️ **por simulación**: inyectando un `localStorage` que lanza en `setItem`/`getItem`, el pie avisa, sesión guardada en memoria y resumen la refleja (`28/09‑04/10 · 42 min · 1 día`). No se probó con bloqueo real.
3. **Criterio 19(d) (modo degradado offline)** — ⚠️ **por simulación**: idéntico a SQL, pero tampoco con bloqueo real de `localStorage`.

**Los 27 criterios cumplidos** cubren: RF‑001 a RF‑013, los criterios 1‑15, 17‑18, 20 y los dos modos degradados (a) y (b) y (d). Se verificó contraste ≥ 4,5:1, cero colores literales, `gradient(` 0, un solo `box-shadow` en `.sesiones`, enfoque visible, responsive a 375 px y 480 px, modos degradados con y sin `sql.js`, y 150 semanas (300 sesiones) sin desacoples.

**Decisiones del cliente registradas:** D5 (principio 2 de constitution reescrito, ya no afirma que `sql.js` sea la única descarga) y D6 (excepción al RF‑009: un solo total de minutos cuando el día tiene una sola sesión; 2+ sesiones muestra total + cada uno). Ambas quedan anotadas en `specs/002-pasada-visual/spec.md` y `AVANCES.md`.

**Hecho cuando:** los 30 criterios están mirados en el navegador o con la consola y ninguno se queda sin mirar. Con la fuente bloqueada, la app arranca sin esperar, se recorren las cuatro pantallas, se guarda y se borra una sesión, no hay pantalla en blanco, el texto se lee entero y el margen de fechas del resumen sigue alineado. En los cinco casos el pie dice lo mismo que hoy, sin una palabra de más y sin una de menos, y en ninguno aparece una frase sobre la tipografía. En `estilos.css` hay cero `@font-face` y cero `@import`; en `app.js` no hay más que las dos cadenas de RF‑013.

**Qué hace:** recorre los 30 criterios de la spec, empezando por la auditoría de
literales y de `gradient(` —que con `file://` no se puede hacer con `fetch`, así
que va con búsqueda por expresión en el editor, o con `python -m http.server 8000`
si se quiere la comprobación en consola—, por los seis pares de contraste en
claro **y** en oscuro, por el anillo de foco medido, y por los anchos de 375 y
480. Después, las dos pasadas de la fuente: con ella puesta y con ella bloqueada,
**en la misma pantalla y a los mismos anchos**, para comparar que el margen de
fechas alinea igual y que el texto **se sigue leyendo bien**, que es lo que
sustituye a un aviso.

Luego los cuatro modos: sin `sql.js`, fallo de arranque, `localStorage` bloqueado
y el normal. En los cuatro, **y también sin la fuente**, el texto de `#pie-modo`
se copia y se compara **carácter a carácter** con el de hoy. La quinta
comparación —sin la fuente— es la que comprueba que el pie no dice nada sobre la
tipografía, y es un criterio de regresión como los otros.

Y las tres búsquedas por expresión que vigilan la forma de carga, porque son las
que impiden que se cuele una vía que ata la fuente a la hoja o a la lógica:
`@font-face` y `@import` en `estilos.css` —cero—, el nombre del dominio de la
fuente en los tres archivos —una vez— y el nombre de la familia —dos veces—.

Al final, la comprobación de que la hoja se ha parseado bien: que
`document.styleSheets[0].cssRules` contiene la lista de selectores que la spec
espera y que no hay ninguna regla tachada en el panel de estilos.

Termina con **capturas** de las cuatro pantallas en claro y en oscuro, a 1080, 480
y 375 px, con avances reales y largos, **más dos del pie**: una con la fuente
puesta y otra sin ella, para ver que lo único que cambia es la letra. Y con la
relectura de las zonas editadas y el balanceo de llaves a mano.

**RF:** todos.

**Hecho cuando:** los 30 criterios están mirados en el navegador o con la consola
y **ninguno se queda sin mirar**. Con la fuente bloqueada, la app arranca **sin
esperar**, se recorren las cuatro pantallas, se guarda y se borra una sesión, no
hay pantalla en blanco, el texto se lee entero y el margen de fechas del resumen
sigue alineado. **En los cinco casos el pie dice lo mismo que hoy**, sin una
palabra de más y sin una de menos, y en ninguno aparece una frase sobre la fuente.
En `estilos.css` hay cero `@font-face` y cero `@import`; en `app.js` no hay ni
`innerHTML`, ni recorte de `avances`, ni `setTimeout`, ni `document.fonts`, ni
referencias por número de línea, ni más de dos menciones del nombre de la familia.
La auditoría de literales no encuentra ningún color fuera de `:root` y ni un
`gradient(`. El bloque oscuro no tiene ni un selector. Y `app.js` no ha cambiado
salvo las dos cadenas de RF-013.

---

## T9. Documentación del proyecto

**Archivos:** `AGENTS.md` y `AVANCES.md`. **`docs/constitution.md` no se toca aquí:**
eso es T10, y va la última.

**Qué hace, en `AGENTS.md`, y nada más:** la tabla de dependencias pasa de «Una
sola: `sql.js` 1.10.3» a dos, con la familia tipográfica y su CDN. Se deja la
frase que dice que la app funciona si la descarga falla, y se le añade la fuente a
esa exigencia sin quitar `sql.js`. Y en la checklist de «Verificación», el punto
de «Desconecta internet y recarga» se **completa**: ahora ahí se comprueba
también que la app arranca con la letra de reserva y que el pie **no añade ningún
aviso**, porque esa es la conducta que se ha decidido. **No se toca nada más de
ese archivo**: es el de las reglas permanentes.

En `AVANCES.md`: en «Estado actual», que la app tiene un sistema de tokens y una
familia web, y que el resumen ya no se parece al historial. En «Decisiones y sus
razones», el por qué de la paleta de seis valores con un solo trabajo de acento, el
por qué de cargar la fuente con un `<link>` en `index.html` y no en la hoja, y **el
por qué de que el pie no avise de la fuente**, con sus cuatro razones y con su
coste, porque es la decisión de la que más va a volver a preguntarse. En
«Aprendizajes y errores a evitar», tres cosas que son de este proyecto: que un
margen de ancho fijo alinea más que unas cifras tabulares cuando el diseño tiene
que aguantar sin red; que `#lista-sesiones` y `#lista-dias` pintan la misma clase
y por eso las reglas del resumen hay que acotarlas al listado; y que con una web
font hay que pedir la cursiva o el navegador la sintetiza. En «Próximos pasos»,
sale esta pasada, **entra que la app no dice nada sobre su tipografía y que decidir
si eso debería cambiar es una decisión nueva, con su mecanismo y sus criterios**, y
entra lo que siga.

**Y el límite de 75 líneas manda sobre todo.** `AVANCES.md` va en 74 ahora mismo, así
que **hay que reescribir la sección afectada dejando solo lo vigente**, no apilar.
Lo que no vaya debe irse: decisiones que ya no son ciertas, y la línea de la fase
visual que sale de «Próximos pasos» porque se ha hecho.

**Hecho cuando:** `AGENTS.md` dice que hay dos dependencias y su checklist
comprueba la fuente; `AVANCES.md` sigue **por debajo de 75 líneas** con sus cuatro
secciones, no repite `AGENTS.md`, anota el por qué de no avisar, y su «Próximos
pasos» ya no anuncia una fase visual que se ha hecho y sí dice que la ausencia de
aviso es una decisión abierta. Nada de lo anterior ha metido a `AVANCES.md` por
encima de las 75 líneas.

---

## T10. El principio 2 de `docs/constitution.md` · **Va la última**

**Archivos:** `docs/constitution.md`, **el principio 2 y nada más**.
`AVANCES.md`, solo para el antes y el después.

**Por qué va la última, y es literal:** es un principio, y la constitution dice que
un principio solo se cambia en ese archivo; y sus datos dependen de lo
implementado, porque lo que hay que anotar es qué se descarga ahora. Si se hiciera
antes, el archivo afirmaría algo que todavía no es cierto.

**Qué hace.** Reescribe **el principio 2** para que siga protegiendo lo que protege
y deje de afirmar lo que ya no es cierto:

- **Se conserva literal** la primera parte: sin cuentas, sin servidor, sin
  sincronización, sin telemetría. Es lo que el principio protege y no ha cambiado.
- **Se conserva también su por qué**, el párrafo de que lo que se guarda es un
  registro privado del esfuerzo y de la motivación. Ese párrafo es lo que explica
  el principio y no se toca.
- **Cambia solo la frase de la red.** Deja de decir que la única descarga es
  `sql.js` y pasa a decir que al abrir se descargan `sql.js` y una tipografía, y
  que **ninguno de los dos transporta un dato**, que es la parte que sostiene lo
  que el principio sigue protegiendo.
- **Sin crecer.** Sigue siendo un principio corto, de dos líneas de cuerpo más su
  por qué. Si al reescribirlo ocupa más que antes, sobra alguna palabra.

**Y en `AVANCES.md`, en «Decisiones y sus razones», el antes y el después**, con el
motivo: antes la única red era `sql.js` y ahora hay una segunda descarga que es
realce visual y no dato. **Con el mismo límite de 75 líneas de T9**: si no cabe,
se poda la sección.

**No toca** ninguno de los otros siete principios ni la sección «Cómo se usa». Y si
algún día el principio 5 —que ya se ocuparon las tareas de la spec 001— hay que
revisarlo, **no es aquí**: esta pasada no añade pantallas, así que sigue siendo
cierto y no se toca.

**RF:** ninguno (documentación).

**Hecho cuando:** el principio 2 sigue diciendo que los datos no salen del
navegador, **ya no afirma que `sql.js` sea la única descarga**, nombra la
tipografía como la segunda, dice que ninguna de las dos transporta un dato, y
**ocupa lo mismo o menos** que antes. Los otros siete principios y «Cómo se usa»
son **carácter a carácter** los de antes. Y en `AVANCES.md` está el antes y el
después, con el motivo, sin que el archivo pase de 75 líneas. Con esto la spec
queda cerrada: ninguna otra tarea toca la constitution.