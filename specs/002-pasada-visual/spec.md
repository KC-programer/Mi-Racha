# Spec 002 · Pasada visual

**Estado:** borrador. Las cinco decisiones están **cerradas**: la dirección pictórica es A · el registro, el pie **no** avisa de la fuente, los días sin sesión **no** se marcan, el separador pasa a coma y el principio 2 se reescribe. No queda ninguna abierta.

**Ámbito:** `estilos.css` (completo: `:root`, el bloque oscuro y todas las reglas). `index.html`: **una** línea, el `<link>` de la fuente. `app.js`: **dos cadenas de texto**, y nada más. `docs/constitution.md`: **el principio 2, y solo ese**. Y la documentación que el cambio deja obsoleta: `AGENTS.md` y `AVANCES.md`.

**La frontera no se ensancha.** El encargo sigue siendo «cambios únicamente en la UI» y «nada de lógica»: ni un elemento nuevo, ni un atributo nuevo, ni una función nueva, ni una espera. Se studió avisar de que la fuente no ha cargado, el cliente lo rechazó, y la razón por la que no hacerlo es aceptable está en «La decisión que se revirtió». Es una decisión meditada, no un olvido.

## Contexto

Aplicación web de una sola página "Mi Racha", sin build, sin frameworks, sin módulos ES, un solo `<script>` clásico. **Hoy tiene una dependencia externa, `sql.js` 1.10.3 desde CDN**; esta spec añade una segunda, **una familia tipográfica web desde CDN**, ya consultada y aprobada por el cliente. Todo en español. Inserta texto con `textContent`/`createElement`, nunca `innerHTML`. Colores, radios, sombras y anchos salen de variables CSS. La fuente de verdad es `localStorage`; SQLite corre **en memoria**. Las fechas se tratan en **hora local**.

El resumen semanal (spec 001) está implementado y validado, y dejó cuatro decisiones de aspecto deliberadamente sin tomar: el **peso visual de la cabecera** del resumen y del **botón de volver** y su simetría, la **regla del `<select>`** más allá de lo funcional, la **separación de `.dia*` frente a `.sesion*`**, y **si hacía falta alguna variable nueva en `:root`** con su consecuencia en el bloque oscuro. Esta spec las cierra. A eso se añade una quinta que no venía en la 001: **qué se hace con el degradado de fondo y con la sombra repetida bajo cada tarjeta**.

El motivo de que la fase visual vaya ahora y no antes está escrito en `AVANCES.md`: diseñar el aspecto antes de tener la función integrada obliga a diseñar contra una hoja de estilos en movimiento. La función ya está integrada y comprobada, así que el terreno es firme.

**El encargo del cliente es estrecho y es ley:** se conserva la estructura —las cuatro pantallas, el DOM, la jerarquía de la información y el reparto de responsabilidades— y se cambia **solo lo que se ve**: paleta, tipografía, escala, espaciados, radios, sombras y estados.

**La dirección pictórica está fijada: A · el registro.** No es la que le habría salido sola a esta spec: del proyecto solo se podían sacar dos cosas, que **la unidad con sentido es el día** y que **el contenido pesado es texto que escribió la persona**. De eso se deducía un eje —el cuaderno— o el otro —la agenda—, y elegirlos es una decisión estética que no se deduce de `AGENTS.md`, ni de la constitution, ni del código. El cliente ha elegido el registro, y con esa elección el sistema de tokens, los contrastes medidos y el resto del plan quedan como estaban escritos.

**Y hay una tensión que esta spec registra en lugar de resolver por su cuenta.** La skill de diseño que guía la pasada (`frontend-design`) advierte contra rasgos que identifica como valores por defecto de una página generada: el *kit de tarjetas SaaS* (contenido troceado en tarjetas idénticas y redondeadas, un mismo radio para todo sea cual sea la jerarquía, la misma sombra gris suave bajo cada una, veladuras en degradado), el fondo casi blanco frío con degradado radial y un único acento índigo, las cadenas de metadatos unidas por puntos medios (`A · B · C`), las etiquetas en mayúsculas sostenidas con `letter-spacing`, y un `rgba(0,0,0,.1)` bajo cada tarjeta. **La hoja actual cae en casi todas esas categorías.** La pasada debería salir de ahí, pero el cliente ha fijado una dirección y la propia skill dice que cuando el encargo fija una dirección, esa gana. **Gana el encargo.** Consecuencia honesta: parte de lo que la skill querría cambiar no es cambiando la UI, sino cambiando la estructura, y eso queda fuera de alcance. La sección «Riesgos» dice cuáles son.

Lo que sí es UI, y por tanto sí entra: el **sistema de tokens** de `:root` (paleta, escala tipográfica, radios, sombras, anchos, ritmo), la **redefinición completa del bloque oscuro**, y **reescribir, reordenar, fusionar o eliminar reglas** y añadir las que necesite la dirección elegida.

## Objetivo

Que la app se vea como una sola idea y no como cuatro pantallas con la misma etiqueta puesta. Un sistema de tokens compacto del que sale todo lo visible, una familia tipográfica con un papel claro, un acento con **un solo trabajo**, los dos niveles del resumen semanal por fin distinguibles, y criterios que se puedan comprobar en un navegador: contraste medido en claro y en oscuro, sin desbordes a 375 y 480 px, la fuente que cae sin romper nada, el bloque oscuro solo con variables y cero colores literales fuera de `:root`.

## Fuera de alcance

Los tres puntos que la validación dejó abiertos, **de forma explícita**:

- **Nada de `aria-live` al cambiar de semana.** El total y los días no se anuncian al mover el selector.
- **Nada de anillo de foco propio en el `h1`.** `#encabezado-resumen-semanal` recibe foco por código y no recibe estilo de foco.
- **Nada de cambiar `#resumen-semanal` de regla por `id` a clase BEM.** Sigue siendo una regla por `id`.

Y, además:

- **El DOM.** Ningún `id`, ninguna clase, ningún atributo, ningún orden de bloques, nada de `Pantallas`, nada de `tabindex`, nada de `hidden`, y en particular **nada de `aria-live` en `#pie-modo`**. Las cuatro pantallas siguen siendo cuatro y en el mismo orden. Los atributos que ya existen —`aria-labelledby`, `role="alert"`, `role="status"`, `aria-live="polite"` en `#mensaje-formulario`— **no se tocan**: ese `aria-live` es de la spec anterior y no tiene nada que ver con esto.
- **La lógica de `app.js`.** Ni `Almacen`, ni `Claves`, ni `ESQUEMA_SQL`, ni `RUTA_SQL_JS`, ni `BaseDeDatos`, ni `calcularRacha`, ni `moverDias`, ni `claveDeHoy`, ni `fechaLegible`, ni `formatearTiempo`, ni `formatearDiaCorto`, ni `formatearRangoSemana`, ni `calcularSemanasCerradas`, ni `calcularTotalesSemana`, ni `agruparSesionesPorDia`, ni los listeners. **La única excepción** son las dos cadenas de texto de RF-013, que son texto de interfaz. `iniciar()` no cambia, ni una línea: ni una función nueva, ni una llamada, ni una espera, ni un `catch`.
- **Detectar si la fuente ha cargado.** Ni con `document.fonts`, ni con un `onerror` en el `<link>`, ni con un temporizador de seguridad. Decidido y razonado en «La decisión que se revirtió».
- **El formato del rango.** `dd/mm - dd/mm`, con ceros, y `dd/mm/aaaa - dd/mm/aaaa` solo cuando los años del lunes y del domingo difieren. Está verificado por los criterios de la spec 001 y **no se toca**.
- **La rejilla de `.tablero`** y los dos cortes existentes (860 px y 480 px). No se cambia ni se añaden.
- **La integridad de los avances.** `pre-wrap` y `overflow-wrap: anywhere` se conservan tal cual: de ellos dependen los criterios 10 y 12 de la spec 001. Nada de recortar `avances`, ni aquí ni en un refactor de las reglas compartidas.
- **El estado deshabilitado.** El selector **nunca** lleva `disabled`. No hay ningún estado deshabilitado en la app y esta spec no introduce ninguno.
- **Una segunda familia tipográfica, o fuentes locales.** El cliente lo fijó: una sola familia, de CDN.
- **Marcar visualmente los días sin sesión.** **Decidido: no se hace.** Ver D2.
- **Convertir todas las medidas de la hoja a variables.** El ritmo se apoya en la escala nueva donde toca; donde haga falta una medida que no está en la escala, su literal se queda. `AGENTS.md` prohíbe el literal de **color**, no el de longitud.
- **Animación de conteo, interpolación o marcador de posición en el número de la racha.** El principio 3 dice que la racha no miente; un número que sube hacia su valor miente mientras sube.
- **Los otros siete principios de `docs/constitution.md`** y la sección «Cómo se usa». Solo se reescribe el principio 2.
- **Cualquier paso de build, servidor, `npm install`, linter, formateador o test runner.**
- **La publicación.** Sigue aplazada.

## Definición canónica: qué es «cambiar la UI»

Se escribe una vez y se usa en toda la spec, porque de esta línea depende todo lo demás.

> **Un cambio de UI cambia cómo se ven y cómo se sienten los elementos que ya existen. Un cambio de estructura añade, quita o mueve elementos, atributos o pantallas. Y no hay una tercera categoría.**
>
> - Cambian la UI: el valor de una variable, una regla reescrita, una regla eliminada, una regla nueva para un elemento que ya existe, el ancho de un control, el tratamiento de un estado, el texto de un rótulo.
> - Cambian la estructura: un `id`, una clase, un elemento nuevo o eliminado, el orden de los bloques, una pantalla, un campo, una interacción, un atributo de accesibilidad.
>
> **El límite del encargo son las dos primeras líneas, y son excluyentes.** Cualquier cosa que no entre en ninguna de las dos —detectar un recurso, añadir una función, esperar a algo— está fuera, por muy pequeña que sea y por muy justificada que parezca. Ya se escribió una vez que «una excepción acotada» no rompía el límite: la excepción más pequeña sigue siendo una excepción, y por eso esta spec vuelve a la formulación de dos categorías.
>
> La prueba de que un cambio es de UI es que **borrando el cambio la app sigue arrancando y haciendo lo mismo**. Y la prueba de que un cambio es de estructura es que **borrando el cambio el DOM sería distinto**.

## Requisitos de funcionalidad

### RF-001 · Un solo sistema de tokens, y todo lo visible sale de él

**Cada color, radio, sombra, ancho y medida de ritmo de la hoja sale de una variable de `:root`.** No hay ninguna excepción. Los únicos literales de color de todo el archivo van dentro del bloque `:root` o dentro del bloque `:root` del modo oscuro, y en ningún otro sitio.

Las medidas en `rem` y `%` pueden seguir siendo literales donde la escala no cubra el caso: la prohibición de `AGENTS.md` es sobre el color.

Comprobable: en `estilos.css` no hay ninguna coincidencia de `#hex`, `rgb(`, `rgba(`, `hsl(` ni `oklch(` fuera de los dos bloques `:root`. Los valores con alfa que hoy viven en `--sombra` siguen viviendo en `:root`.

### RF-002 · Una paleta de seis valores con nombre, y contraste medido en los dos modos

La paleta tiene **seis valores base con nombre de la materia del producto** —`hoja`, `papel`, `tinta`, `grafito`, `regla` y `violeta-tinta`— más los tintes derivados y los dos colores semánticos. No es una lista de colores decorativos: cada valor tiene **un papel** y un solo consumidor o una familia de consumidores.

**Los neutros no llevan matiz de color, pero tampoco están muertos.** Es la decisión que da el carácter del papel, así que conviene decirla con su argumento: el papel es `#f2f4f5`, con **croma de 2 sobre 255**, o sea un frío tan leve que no se ve como color pero evita que el papel sea un gris muerto. La razón de que sea **frío** y no neutro puro es el acento: con un acento violeta, un papel sin temperatura lo deja flotando encima —que es exactamente el choque que el cliente rechazó en la vía anterior— y con un matiz verde lo que flotaba era el violeta, que es el mismo problema del revés. Un papel ligeramente frío **sostiene** el acento sin competir con él.

Y la regla que sale de ahí, que es la que hay que respetar: **en toda la app hay un solo sitio con croma, y es el acento.** Los neutros van de croma 0 a 3; el acento va de 84. Esa asimetría es lo que impide que la paleta se lea como una plantilla: no es que el papel sea bonito, es que **el color solo aparece donde significa algo**.

Papeles y pares que tienen que cumplir **≥ 4,5:1** en claro y en oscuro, todos medidos:

| Papel | Se usa como | Claro | Oscuro |
|---|---|---|---|
| `tinta` | texto normal | 14,59:1 sobre `hoja` | 14,77:1 sobre `hoja` |
| `grafito` | texto secundario | 5,46:1 sobre `hoja` | 7,64:1 sobre `hoja` |
| `violeta-tinta` | el acento, como texto | 7,41:1 sobre `hoja` | 7,22:1 sobre `hoja` |
| `sobre-primario` | texto sobre el relleno del botón | 7,41:1 sobre el violeta | 7,22:1 sobre el violeta |
| `error` | texto de error | 6,26:1 sobre su tinte | 7,51:1 sobre su tinte |
| `exito` | texto de confirmación | 5,63:1 sobre su tinte | 8,77:1 sobre su tinte |

**El acento tiene que llegar además sobre `papel` y sobre el nivel más bajo**, porque se usa como texto en las dos superficies: **8,18:1** sobre `papel` en claro y **6,61:1** en oscuro, y **7,68:1** y **5,88:1** sobre la superficie suave. También sobre su propio relleno suave, que es el relleno de los botones suaves: **6,87:1** y **6,29:1**.

**Los filetes no tienen número, y es a propósito.** No son texto ni un componente que haya que identificar: `--borde` da 1,27:1 contra la hoja en claro y 1,52:1 en oscuro, y `--regla-tenue` da 1,09:1 y 1,32:1. Se comprueban **con captura**, en los dos modos, porque un filete que desaparece es una jerarquía que se deshace sola.

Los ratios son los medidos con la fórmula de WCAG 2.x sobre los valores de `plan.md`, y **se vuelven a medir en el navegador**: el criterio manda, no la tabla.

**El acento tiene un solo trabajo**: decir *esto cuenta*. Lo usan el número de la racha, los minutos que cuentan, y la racha viva. **No hay un segundo color de acento.**

**Y el éxito ya no es el acento.** `--exito` estaba atado a `--primario` porque cuando el acento era verde, «salió bien» y «esto cuenta» eran la misma idea y el mismo color. Con un acento violeta eso ya no aguanta: un mensaje de confirmación en violeta se lee como información, no como «hecho», y además le daría al acento un segundo trabajo, que es justo lo que la línea de arriba prohíbe. Así que **`--exito` se separa** y pasa a un **ámbar de bronce** (`#855611` en claro, `#efbf72` en oscuro), que **no es verde**: es cálido, y es el único sitio de la app donde hay calor. Esa es la razón de que funcione, y no un capricho de paleta: separa dos Signals que antes eran uno, y lo separa sin salirse de lo que el cliente pidió, que es no tener verde en ninguna parte. Se descartó un **cian o un verde azulado** por cercanía de tono con el verde —el cliente pidió quitarlo, no mudarlo de sitio— y se descartó atarlo otra vez al acento por las dos razones de arriba.

`--error` **se queda rojo**: un rojo de error no es «color verde», y es la única señal que separa «esto salió bien» de «esto falló». Como `--exito` es ámbar y `--error` es rojo, son tonos cálidos vecinos y no se confunden: los dos mensajes **nunca se muestran a la vez**, uno sustituye al otro, y además el texto y el `role="alert"` los distinguen.

### RF-003 · El modo oscuro solo redefine variables

El bloque `@media (prefers-color-scheme: dark)` contiene **únicamente declaraciones de variables**, y nada más: ni una regla, ni un selector, ni una propiedad suelta. Ninguna regla nueva se replica allí.

Comprobable de dos formas: se lee el bloque y no hay ni un selector, y en la consola se comprueba que todas las reglas que el bloque contiene son de `:root`.

### RF-004 · El degradado de fondo desaparece

**En `estilos.css` no queda ninguna función `gradient(`.** El fondo es un color plano. La marca de agua radial que hoy está en `--fondo-degradado` se elimina también como variable.

Es una de las veladuras en degradado como decoración que la skill señala como valor por defecto, y no codifica nada: un registro no tiene fuente de luz.

### RF-005 · Una sola sombra en toda la hoja, y solo donde algo está de verdad elevado

De las sombras queda **una**, en el contenedor con scroll del historial, que está truncado y por tanto sí tiene algo que comunicar. **Las tarjetas no llevan sombra**: llevan un filete.

El resto de la hoja no usa `box-shadow` como decoración. La sombra que queda es un valor corto, no la doble capa suave gris de hoy repetida bajo cada tarjeta.

### RF-006 · Una familia tipográfica, y la fuente no puede nada con la app

La familia se pide con **un `<link>` en `index.html`** a la hoja de estilos que publica el CDN, con `font-display: swap` y con los subconjuntos `latin` y `latin-ext` (el producto está en español y los avances son texto del usuario). **Una sola familia**, la misma para el titular, el cuerpo, los campos y los botones. **Ni una segunda familia, ni un archivo de fuente local, ni un icono de fuente, ni un favicon de fuente.**

**No se declara con `@font-face` en `estilos.css` ni con `@import`.** El motivo es el principio 1 y es también la razón por la que esta spec no necesita ninguna lógica: **la fuente no puede retrasar, bloquear ni romper nada**. Un `@import` dentro de la hoja del proyecto es una petición **encadenada**: la hoja propia esperaría a la de la fuente, así que un CDN lento o colgado frenaría el estilo de la app entera. Y un `@font-face` escrito a mano obligaría a **fijar a dedo las URL de los archivos de fuente que genera el CDN**, que cambian cada vez que el CDN reconstruye los archivos y que fallarían en silencio. Las dos formas atan el aspecto de la app a un recurso que no hace falta para funcionar. Con un `<link>` en el HTML las dos peticiones van **en paralelo**, la hoja propia se aplica igual y el texto aparece de inmediato con la pila de reserva.

**Una mejora concreta que sí sale de aquí:** la URL de la fuente aparece **una sola vez en todo el proyecto**. No hay URL de archivo de fuente en nuestro código, porque viven dentro de lo que responde el CDN. Es mejor que el patrón de `sql.js`, donde la versión está en el `<script>` de `index.html` **y** en `RUTA_SQL_JS` de `app.js`, y donde el desacuerdo entre los dos sitios es un riesgo conocido.

**El coste que sí hay:** el **nombre** de la familia aparece en **dos** sitios, la URL del `<link>` y la variable `--fuente`. No hay forma de evitarlo sin inventar indirección, así que se acepta y se acota: **está prohibido** añadir un `<link rel="preload">`, un `@import`, un `@font-face`, un `onerror` o cualquier otra mención. Y ahora que no hay detección, desincronizar los dos sitios **no rompe nada**: la única consecuencia es que se usa la pila de reserva, que es un estado diseñado y no una mentira. Antes, con el aviso, esa desincronización habría hecho que el pie mintiera.

La hoja declara `font-family` **una sola vez**, en `body`, a través de una variable. Los campos y los botones heredan esa familia con su `font: inherit`, así que no hay una segunda declaración posible.

La familia **tiene que tener cursiva**: el historial muestra la frase y el texto de "Sin avances anotados." en cursiva, y sin cursiva real el navegador sintetiza una inclinación que en una serif se ve mal.

### RF-007 · Si la fuente no carga, la app arranca, se lee y no se rompe

**Ninguna lógica de la app depende de que la fuente haya cargado**, y no hay ninguna que la compruebe: no bloquea el arranque, no retrasa el primer pintado, no cambia ningún dato y no añade ningún aviso. Si la descarga falla, si el navegador la bloquea o si el usuario está sin conexión:

- la app **arranca igual**, con sus cuatro pantallas y su lógica intactas, y **sin esperar a la fuente**;
- **no hay pantalla en blanco** ni texto invisible;
- **el texto se sigue leyendo**, y bien: hay una pila de reserva local declarada en la propia variable de familia;
- el diseño **no se descuadra**: el margen de fechas del resumen es de **ancho fijo** y no depende de cifras tabulares, así que las siete fechas alinean igual con la fuente puesta y sin ella.

**Lo que sustituye a un aviso no es un aviso: es la calidad del reserva.** La garantía de que la app se sigue leyendo sin la fuente no la da una frase en el pie, la da que el diseño esté hecho para que la pila de reserva funcione. Eso es lo que se comprueba, y el criterio 7 lo comprueba.

### RF-008 · Una escala tipográfica explícita y una medida de lectura

Los tamaños salen de una **escala corta y nombrada**, no de números sueltos por la hoja. Los cortes los fija `plan.md`.

**El texto escrito por el usuario** —la frase, los avances del historial y los avances del resumen— es el texto de más cuerpo y el de más medida, y su medida **no llega a 80 caracteres**: se declara en una variable. El interlineado del texto con serifas es **mayor** que el del texto que no la tiene, como manda la guía.

### RF-009 · Una sola alineación para el contenido, una para el ritual

**El contenido va a la izquierda**: todo lo que se lee en columnas comparte borde izquierdo, incluida la fecha del día en el resumen, que se coloca en un margen de ancho fijo. **Las dos pantallas de ritual** (inicio e intención) siguen centradas.

El número de la racha **deja de estar centrado** y se alinea a la izquierda con el resto del tablero, en la misma línea base que sus palabras. Hoy está en una tarjeta centrada con degradado, que es exactamente el tratamiento de "número grande con etiqueta" que la skill marca como el hero por defecto.

### RF-010 · El día y la sesión del resumen son dos niveles distintos, por fin

Hoy el día y la sesión **comparten forma** porque el resumen reutiliza las clases del historial. Esta spec los separa **sin tocar el DOM**:

- El **día** es una **línea con filete superior**: caja, fondo, radio y sombra fuera. La fecha va en un **margen izquierdo de ancho fijo** y los minutos del día a la derecha.
- La **sesión dentro de un día** es una **entrada sangrada con filete lateral**, sin caja, sin fondo y sin radio.

Las reglas de la sesión del resumen **se acotan al listado del resumen**. El historial conserva su bloque con borde y su fondo: son dos jerarquías distintas y ya no parecen la misma.

`pre-wrap` y `overflow-wrap: anywhere` se conservan intactos.

### RF-011 · El selector es el identificador del periodo, no un campo más

El selector deja de ser un campo estirado a todo el ancho como los `input`: se ajusta a su contenido con un mínimo legible, y su borde se refuerza para que se lea como un control y no como un párrafo. **Conserva `font-size: 1rem`** y su anillo de foco.

Su etiqueta deja de ser un rótulo en mayúsculas sostenidas: pasa a ser texto tranquilo en `grafito`. Siguen apilados; el selector no se puede agrupar con su etiqueta sin tocar el DOM.

**Nunca lleva `disabled`**, ni con una sola opción, y no se oculta nunca.

### RF-012 · Estados: foco con contraste medido, y nada de estado deshabilitado

**`:focus-visible` en todo elemento interactivo**, con un anillo de **tinta**, no un halo de color. El anillo tiene que alcanzar **≥ 3:1** contra el fondo y contra la superficie, en claro y en oscuro.

El anillo de hoy es un halo `--primario-suave` de 3 px, que sobre la superficie clara no llega a 1,5:1: no se ve. Esto es un defecto real de foco visible que la pasada corrige. **No es uno de los tres puntos de accesibilidad que quedan fuera**: aquellos hablan del anillo del `h1`, que recibe foco por código; aquí se trata del anillo de los elementos sobre los que se navega con teclado.

Los demás estados:

- `hover` y `active` coherentes en los tres botones y en el enlace de eliminar, y **sin transiciones de color en las tarjetas**: el movimiento que responde al puntero no aporta nada aquí.
- **No hay estado deshabilitado** en ninguna parte de la app.
- `prefers-reduced-motion` se respeta: el bloque que anula animaciones y transiciones se conserva y sigue siendo global.

### RF-013 · La cadena de datos deja de llevar puntos medios

`pintarCabeceraResumen` pinta `"28/09 - 04/10 · 2 h 30 min · 3 días con sesión"`. La cadena de metadatos unida por puntos medios es un rasgo de plantilla, y aquí además **compite con el propio contenido**: el rango de fechas usa el guion.

Esta spec cambia **exactamente dos cadenas**, en dos funciones:

- `pintarCabeceraResumen`: los dos ` · ` pasan a `, `.
- `pintarHistorial`: el ` · ` que separa el número de sesiones del tiempo total pasa a `, `.

**Lo que no se toca, y es lo importante:**

- **El rango no se toca.** `formatearRangoSemana` no se modifica, así que la regla de `dd/mm - dd/mm` y el año en el cruce de Año Nuevo siguen siendo los mismos, y el criterio 9 de la spec 001 sigue cumpliéndose. La cabecera **sigue empezando por el texto exacto del rango**.
- **No cambia ningún dato, ningún criterio funcional ni ningún invariante**: ni `sesion`, ni `Claves`, ni el esquema, ni el orden `fecha DESC, creado_en DESC, id DESC`, ni el cálculo de la racha, ni el de los totales. Solo cambia cómo se separa una lista de hechos dentro de una frase que el usuario ya estaba viendo.

Los dos textos quedan en español y en minúscula, como estaban.

**Este es el único cambio de esta spec que toca `app.js`.** Va aislado en su propia tarea, y es la más fácil de revertir del proyecto entero: son dos cadenas y dos funciones.

### RF-014 · Se retiran los rótulos en mayúsculas sostenidas

Ni `.marca` ni `.rotulo--claro` llevan `text-transform: uppercase` ni `letter-spacing` abierto. Los rótulos pasan a ser texto pequeño en `grafito`. Las palabras no cambian: `"Mi Racha"` y `"Paso 1 de 2"` siguen siendo esas.

### RF-015 · Lo que se mantiene, sin excepciones

- **`font-size: 1rem` en los campos.** Por debajo de 16 px iOS hace zoom al enfocar, y la web font no lo cambia.
- **`[hidden] { display: none !important }`.** La visibilidad la decide ese `!important`, no `display`; las reglas de la hoja no pueden ganar.
- **`.oculto`**, que oculta solo visualmente y no con `display: none`. Es lo que usa el encabezado oculto de la tarjeta de racha.
- **`prefers-reduced-motion`** respetado, con el bloque global que anula animaciones y transiciones.
- **La animación de aparición de pantalla y el resaltado de la sesión recién guardada.** Se quedan **dos** animaciones y ninguna más: la de pantalla porque responde a una acción de la persona y dice qué ha cambiado, y la del resaltado por la misma razón. **No hay entradas escalonadas por bloque, ni transiciones al pasar el puntero por las tarjetas.**
- **`-webkit-font-smoothing` deja de ser `antialiased`**: con una serif, adelgazar los trazos cuesta legibilidad, que es justo lo que no sobra en una app que se usa cansado.

### RF-016 · El número de la racha es un número, no un indicador

El número de la racha se ve grande porque **es** grande: es el único hecho calculado de la app. Se compone con la escala y con tracking cerrado. **No lleva animación de conteo, ni interpolación, ni guion de posición, ni degradado, ni caja propia.** Y sigue siendo el número exacto que devuelve `calcularRacha`.

**Su color no lo decide este RF:** lo decide RF-017, que llega después porque se resolvió con la spec ya a medio ejecutar.

### RF-017 · El cero va en tinta, y el acento se reserva para cuando hay racha

**Con racha 0, el número va en `tinta`. Con racha mayor que cero, va en el acento.** No hay un tercer color, ni un tono apagado, ni una variante.

**Y se resuelve sin tocar `app.js`, porque la condición ya está en el DOM.** `pintarRacha` ya hace `classList.toggle('racha--activa', racha > 0)`, así que «racha mayor que cero» está escrito en el DOM desde antes de esta pasada. La regla es solo esta: **el color por defecto de `.racha__numero` es `var(--texto)`, y `.racha--activa .racha__numero` lo devuelve a `var(--primario)`.** Tres líneas de CSS, y ninguna función nueva.

**Por qué.** El acento tiene **un solo trabajo** en esta pasada: decir *esto cuenta*. Una racha rota no cuenta para nada, así que poner el 0 en el acento gasta el acento en una afirmación que es falsa. Y hay un efecto de tamaño que va con lo anterior: la cifra va a `--cifra`, y **un cero a ese tamaño canta más que un siete**, porque el hueco del cero se lleva la mirada igual que el siete pero no dice nada. Al revés, el violeta significa «tienes racha» y el gris significa «todavía no», que es justo lo que hace falta leer de un vistazo.

**La objeción de T6 y esta decisión van en el mismo sentido.** T6 dejó el número siempre en el acento y lo Justificó porque «darle un color distinto le daría al acento un segundo trabajo». La objeción era correcta, y **este RF la cumple por el otro lado**: el 0 no recibe otro color de acento, sino que **deja** el acento. El acento conserva exactamente un trabajo.

**Descartado:** mantener el violeta siempre y distinguirlos con una etiqueta, un símbolo o un guion. Sobra, porque el 0 ya viene acompañado de «Aún no tienes racha» y de «Empieza una racha nueva hoy», que lo dicen mejor. Descartado también poner el 0 en `grafito`: un número de ese tamaño en gris se lee como desactivado, y la app no está desactivada.

**Lo que ocurre con el filete del canto, y no se resuelve aquí por ser una consecuencia.** `.racha--activa` es la clase que añade el filete, así que **con racha 0 el número pierde también el filete**. Y **no se pueden separar los dos cambios**: no hay una segunda clase en el DOM, y abrir `app.js` para añadirla sería mucho más caro que lo que aporta. Se acepta que con racha 0 la franja quede sin filete, porque una racha rota no debería recibir el cromado de «la racha está encendida». Ver D5.

### RF-018 · Los minutos no se repiten cuando el día tiene una sola sesión

**En la pantalla de resumen, una sesión solo pinta su tiempo si el día tiene dos o más.**

- **Día con una sola sesión:** la fila del día muestra la fecha y el **total** del día, y la sesión de debajo **no muestra su tiempo**. Solo su bloque de avances.
- **Día con dos o más sesiones:** la fila del día muestra la fecha y el **total**, y **debajo de cada sesión** su tiempo individual.

**Por qué.** Con una sola sesión el total del día y los minutos de la sesión **son el mismo número**, y salen uno al lado del otro: «25 min» y «25 min». Es redundancia visible, y la redundancia en una cifra es peor que en un texto, porque se lee como dos datos cuando hay uno. Con dos o más el total de arriba **ya no coincide** con ninguna de las de abajo, así que las dos filas **sí** aportan información distinta y se quedan.

**Qué se toca exactamente.** `pintarDiasSemana`, y **solo eso**: la construcción de la fila de minutos de cada sesión pasa a hacerse únicamente cuando el día tiene **dos o más** sesiones. Con una sola sesión, el `<li class="sesion">` de esa sesión contiene **únicamente** el bloque de avances, sin fila de minutos encima. No se crea una fila vacía: una fila vacía no costaría nada visualmente, pero dejaría un nodo sin contenido que después confunde a quien verifique.

**Es el único punto de `app.js` que se abre en esta spec fuera de las dos cadenas de texto de T7**, y sigue siendo el único.

**Lo que no se toca, y conviene enumerarlo porque es mucho:** ni `formatearRangoSemana`, ni `formatearTiempo`, ni el objeto `sesion`, ni `BaseDeDatos`, ni `Claves`, ni el esquema, ni el agrupamiento por `sesion.fecha`, ni el orden `fecha DESC, creado_en DESC, id DESC`, ni los `data-id` —que son como se localiza una sesión para comprobar su texto—, ni el total de la semana de la cabecera, ni el número de días con sesión. **Lo único que cambia es si una sesión concreta pinta su tiempo o no.**

**Lo que cuesta, y es un precio real.** Este RF **rompe el RF-009 de `specs/001-resumen-semanal/spec.md`**, que dice que «cada sesión muestra sus minutos individuales». Es una **excepción consciente a un requisito de una spec anterior ya implementada y validada**, y se escribe aquí con esas palabras para que no se lea como una corrección ni como un descuido.

**La spec 001 no se reescribe y sus criterios no se tocan.** Comprobado uno por uno: **ninguno de sus veinte criterios comprobaba los minutos por sesión** —el 10 comprueba que los avances sean idénticos a `sesion.avances` y que no haya frase ni hora—, así que **los veinte se siguen cumpliendo**. Lo que queda falso es el enunciado del RF, y eso no se arregla">[corregiendo] reescribiendo la 001: se arregla dejando la excepción escrita aquí, y **queda pendiente que alguien decida si la 001 —que está cerrada— se anota o se deja como está**. Ver D6.

## Estados explícitos

- **(a) App normal.** Modo SQL, con almacenamiento, con la fuente cargada. Estado de referencia.
- **(b) Sin la fuente web, con la base de datos bien.** Familia de reserva local. La app funciona y se lee; el diseño aguanta; el margen de fechas sigue alineado. **El pie dice exactamente lo mismo que en (a).** No es un estado que se declare: es un estado que se tolera bien.
- **(c) Sin `sql.js`.** `modo = 'respaldo'`, y el pie **sí** lo dice. El aspecto es idéntico al de (a).
- **(d) Fallo del arranque de SQLite.** Un reintento y luego respaldo, y el pie lo dice. El aspecto es idéntico al de (a).
- **(e) `localStorage` bloqueado.** `Almacen` usa memoria y el pie avisa. El aspecto es idéntico al de (a).
- **(f) Racha viva o no.** El único acento de la hoja se usa en los dos casos: la diferencia es la cifra, no un color distinto. Con racha 0 el número sigue siendo un número, en tinta.
- **(g) Sesión recién guardada.** Resaltado de un momento y scroll hasta ella. Se anula con `prefers-reduced-motion`.
- **(h) Resumen con un día sin sesión.** El día vacío **no se distingue visualmente** de uno con sesión: se reconoce porque **no tiene nada debajo**, y solo muestra `0 min`. Es una limitación asumida, no un descuido. Ver D2.
- **(i) Historial vacío.** El mensaje de "todavía no has registrado ninguna sesión" deja de ser una caja de borde discontinuo y pasa a ser un párrafo tranquilo en el mismo registro. El texto no cambia.
- **(j) Aviso de éxito y de error.** Los dos avisos llevan un filete del color correspondiente en el canto, que dice qué pasó, y un fondo tenue del mismo color.
- **(k) Foco por teclado.** Todo elemento interactible muestra el anillo de tinta. Solo con `:focus-visible`: el puntero no lo dispara.

## Modos degradados

Los **tres** de la app **no cambian con esta pasada**: ni una línea de su lógica, ni una clave, ni un método de `BaseDeDatos`, ni un shape. Se comprueban igual que antes, y su aviso en el pie sigue igual.

**La fuente no es un modo degradado, y esta spec lo dice sin rodeos.** Los tres que el pie avisa son los de la tabla de `AGENTS.md`: `sql.js` caído, arranque de SQLite fallido y `localStorage` bloqueado. Una tipografía no está entre ellos, y no se cuela. Los tres se declaran como están, y la fuente **no se declara**, con la razón en «La decisión que se revirtió».

Lo que sí se hace con la fuente, y es la parte que **no** es un modo degradado: el diseño se hace para que la pila de reserva funcione, el margen de fechas es de ancho fijo para que no dependa de la fuente, y el primer pintado no la espera. Eso es lo que garantiza que la app sea igual de funcional sin red, y **es comprobable**; un aviso no lo sería, porque no se puede detectar.

## Accesibilidad

**Se mantiene, sin tocar:**

- Las cuatro `<section class="pantalla">` con `aria-labelledby`, mostradas y ocultadas con `hidden`.
- `role="alert"` en los mensajes de error, `role="status"` y `aria-live="polite"` en el de confirmación, tal como están.
- `<label for>` en todos los campos, incluidos el del selector.
- `type="button"` explícito en los botones que no envían formulario.
- `.oculto` para ocultar solo visualmente.
- El foco al entrar en el resumen y al volver, que los gestiona `abrirResumenSemanal` y el listener de `#boton-volver-tablero`, sin tocar.
- El `tabindex="-1"` del encabezado, sin tocar.

**Mejora, dentro de alcance:**

- El anillo de `:focus-visible` pasa a tinta y alcanza ≥ 3:1 contra fondo y superficie en los dos modos (RF-012). Hoy no llega a 1,5:1 en claro.

**Se queda fuera, por decisión del cliente, y no es una carencia que esta spec tape:**

- El anuncio al cambiar de semana.
- El anillo propio del `h1`.
- La conversión de `#resumen-semanal` a clase BEM.

Ninguno de los tres se usa como excusa para los demás puntos de esta spec: la mejora del anillo de foco es **adicional** y no sustituye al anillo del `h1`.

**Sobre `aria-live` en el pie.** Estuvo sobre la mesa y se queda fuera, y por dos razones que conviene tener escritas. La primera es que **ya no hay aviso que anunciar**: un `aria-live` en `#pie-modo` solo tendría sentido si algo cambiasse ahí después de haberlo pintado, y no cambia. La segunda es que añadir un atributo al DOM está fuera de la frontera, y no hay nada que lo justifique. `#pie-modo` sigue siendo un `<p>` con texto fijo, como lo ha sido siempre.

**Contraste.** Se mide en el navegador, en claro y en oscuro, para cada par de la tabla de RF-002. Hay dos cosas que aquí **no** tienen número y se comprueban con captura, porque no son requisitos de contraste: la visibilidad del filete estructural contra su fondo, y el aspecto de la sombra del contenedor con scroll.

## Criterios de aceptación

Verificables **en el navegador o con la consola de DevTools**. El proyecto **no tiene test runner ni Node en esta máquina**, así que ninguno de estos criterios se comprueba con un runner: se comprueba mirando la pantalla, con el panel de estilos y con la consola. Los que son de medición llevan la forma exacta de medirlos.

1. **Tokens.** Cada color, radio, sombra, ancho y medida de ritmo sale de una variable de `:root`.
2. **Cero colores literales fuera de `:root`.** En `estilos.css` no hay ninguna coincidencia de `#hex`, `rgb(`, `rgba(`, `hsl(` ni `oklch(` fuera de los dos bloques `:root`. Se comprueba en un editor con la búsqueda por expresión, y en la consola con `fetch` si se sirve la carpeta (ver «Cómo se verifica sin test runner» en `plan.md`).
3. **Modo oscuro solo variables.** Leyendo el bloque `@media (prefers-color-scheme: dark)` no aparece ni un selector. En la consola, recorriendo `document.styleSheets[0].cssRules` y buscando el `CSSMediaRule` cuya condición lleva `prefers-color-scheme`, todas las reglas que contiene tienen `selectorText` igual a `':root'`.
4. **Contraste en claro y en oscuro.** Los seis pares de la tabla de RF-002 dan **≥ 4,5:1** en los dos modos. Se mide con el selector de color de DevTools, que muestra el ratio del color comprobado contra el de debajo.
5. **Anillo de foco.** Con navegación por teclado, el anillo de `:focus-visible` aparece en `<button>`, `<input>`, `<textarea>` y `<select>`, y mide **≥ 3:1** contra el fondo y contra la superficie, en claro y en oscuro. Con el puntero no aparece.
6. **Sin desbordes a 375 y 480 px.** En ambos anchos, `document.documentElement.scrollWidth` **no es mayor** que `document.documentElement.clientWidth`, y ningún elemento tiene su borde derecho más allá del ancho de la ventana. Se comprueba con las herramientas de dispositivo.
7. **La fuente ausente no rompe el diseño.** Con la fuente bloqueada, las siete fechas del resumen **siguen alineadas** en un margen de ancho fijo, los avances **siguen con `pre-wrap` y `overflow-wrap: anywhere`**, y el texto se lee entero. Este criterio es el que sustituye a un aviso.
8. **La fuente que cae no rompe nada.** Con la fuente bloqueada (DevTools → Network → Offline, o bloqueando el dominio de la fuente), la app **arranca sin esperar**, se recorren las cuatro pantallas, se guarda una sesión, se borra una sesión, y **no hay pantalla en blanco**. El primer pintado **no espera** a la fuente.
9. **Una sola familia.** `font-family` aparece **una sola vez** en la hoja, en `body`. No hay segunda familia ni archivo local.
10. **Cómo se carga la fuente.** La familia se pide con **un `<link>` en `index.html`**. En `estilos.css` **no** hay ningún `@font-face` ni ningún `@import`, y en `index.html` **no** hay ningún `onerror` en el `<link>` de la fuente ni ningún `rel="preload"`. La URL de la fuente aparece **una sola vez en el proyecto**, y **ninguna URL de archivo de fuente** aparece en él. El nombre de la familia aparece **exactamente dos veces**, en la URL del `<link>` y en `--fuente`, y cada uno de esos dos sitios cita al otro en un comentario.
11. **Cursiva real.** El historial, en su sesión con frase y en su "Sin avances anotados.", **no muestra una inclinación sintética**: en el panel de estilos, la fuente resuelta de esos elementos es la cursiva de la familia y no la regular inclinada.
12. **El input se queda en `1rem`.** Los `input`, el `textarea` y el `select` tienen tamaño de fuente de 16 px.
13. **`.oculto` y `[hidden]`.** El encabezado oculto de la tarjeta de racha no aparece ni ocupa espacio, y las pantallas siguen apareciendo y desapareciendo con el `hidden` del HTML.
14. **Ninguna animación decorativa.** En la hoja hay **exactamente dos** animaciones: la de aparición de pantalla y la del resaltado de la sesión nueva. Con `prefers-reduced-motion` activo, ninguna se mueve.
15. **El día y la sesión se distinguen.** En el resumen, un día **no** tiene caja, ni fondo, ni radio, ni sombra, y sí un filete superior. Una sesión dentro de un día **no** tiene caja ni fondo y sí un filete lateral y sangría. En el historial, una sesión **sí** conserva su bloque con borde y su fondo.
16. **El historial y el resumen no se parecen.** `#lista-sesiones .sesion` y `#lista-dias .sesion` se ven distintos. Ninguna de las dos reglas pisa a la otra: el listado del resumen gana por especificidad y el historial no cambia.
17. **Avances íntegros.** El bloque de avances del resumen y el del historial **siguen enteros**, con acentos, saltos de línea y emoji; conservan `pre-wrap` y `overflow-wrap: anywhere`; un `avances` de 2000 caracteres sin espacios, a 375 px, envuelve sin desbordar ni cortarse. Son los criterios 10 y 12 de la spec 001, repetidos aquí porque esta pasada reescribe justo esas reglas.
18. **El selector.** No está estirado a todo el ancho, se ajusta a su contenido con un mínimo legible, tiene borde visible, su etiqueta es texto tranquilo, muestra el anillo al tabular, **nunca lleva `disabled`**, y su texto sigue siendo el rango según la regla de `dd/mm`.
19. **Simetría de entrada y salida.** `#boton-ver-resumenes`, `#boton-volver-tablero` y `#boton-cambiar-frase` se ven **iguales entre sí**, porque comparten clase `boton boton--suave`, y los tres se distinguen de los botones de acción —"Iniciar sesión", "Listo" y "Guardar sesión"— por **el relleno y el color**, no por el tamaño. La simetría no hay que construirla: sale de que la clase es la misma. Lo que hay que hacer es que esa clase se lea como navegación y no como acción.
20. **El botón de volver se distingue del final de la columna.** `#boton-volver-tablero` **no** se lee como un día más: hay un filete entre la lista de días y el botón, y el botón no está pegado al último día.
21. **Alineación.** El número de la racha está alineado a la izquierda con el resto del tablero, en la misma línea base que sus palabras, y no está centrado. Las dos pantallas de ritual siguen centradas.
22. **Sin degradado.** En `estilos.css` hay **cero** ocurrencias de `gradient(`.
23. **Una sola sombra.** Hay **exactamente un sitio** de la hoja que usa `box-shadow` como sombra decorativa, y es el contenedor con scroll del historial. Las tarjetas no tienen sombra.
24. **El separador.** El total de la semana se lee `"28/09 - 04/10, 2 h 30 min, 3 días con sesión"`, y el resumen del historial `"3 sesiones, 2 h 30 min de estudio en total"`. **La cabecera empieza por el texto exacto del rango**, y el texto de la opción del selector es **idéntico** a ese rango. `formatearRangoSemana` no ha cambiado: el criterio 9 de la spec 001 se sigue cumpliendo, y `28/12/2026 - 03/01/2027` sale igual en el cruce de Año Nuevo.
25. **El pie no ha cambiado. Criterio de regresión.** En las **cuatro** situaciones —normal, sin `sql.js`, con `localStorage` bloqueado y **sin la fuente**—, `#pie-modo` dice **exactamente** lo que dice hoy, carácter a carácter. En el caso normal: `Tus datos se guardan solo en este navegador. Base de datos: SQL (SQLite).` Y lo importante es la cuarta: **sin la fuente el pie dice lo mismo**, porque no hay nada que declarar sobre la tipografía.
26. **Ni una línea de lógica añadida.** En `app.js` **no** hay ninguna función nueva, ni ninguna llamada nueva, ni ningún `catch` nuevo, ni ningún `setTimeout` ni `setInterval`, ni ninguna mención de `document.fonts`. `iniciar()` no ha cambiado. Lo único que ha cambiado en `app.js` son **dos cadenas de texto**, en `pintarCabeceraResumen` y `pintarHistorial`.
27. **Modos degradados.** (a) Sin `sql.js`: el pie indica respaldo y todo funciona. (b) Fallo del arranque: mismo resultado tras el reintento. (c) `localStorage` bloqueado: el pie avisa y todo funciona. En los tres, el aspecto es el del modo normal.
28. **El rango y el DOM intactos.** El DOM no ha cambiado: los mismos elementos, los mismos `id`, las mismas clases y el mismo orden, y **ningún atributo nuevo**. La rejilla de `.tablero` sigue con los mismos dos cortes. Ninguna regla CSS nueva menciona `aria-live`, ni el anillo del `h1`, ni convierte `#resumen-semanal` en clase.
29. **Sin `innerHTML` y sin referencias por número de línea.** No hay ni `innerHTML`, ni recorte de `avances`, ni una referencia por número de línea en ningún archivo.
30. **La constitution y la documentación.** El principio 2 dice que los datos no salen del navegador y **ya no afirma que la única descarga sea `sql.js`**; los otros siete principios y la sección «Cómo se usa» están intactos. `AGENTS.md` dice que hay dos dependencias y su checklist comprueba la fuente. `AVANCES.md` sigue por debajo de 75 líneas y tiene anotado el antes y el después del principio 2.

## Decisiones del cliente

Cinco, todas cerradas.

### D1 · La dirección pictórica: A · el registro. Fijada

El cliente ha elegido el registro: hoja fría y casi sin matiz, tinta, filetes, un **violeta de tinta** como marca, y el día como una línea con la fecha en el margen. El acento dice *esto cuenta*.

**El acento se cambió después de ver la paleta aplicada.** La primera versión usaba un verde de tinta, y el cliente lo rechazó por dos vías que también descartó: dejar el verde y cambiar solo el acento era un morado flotando sobre papel verde, y volver a la paleta original con el índigo de antes era «como si no hubiera hecho nada». La vía que eligió es la tercera: **los neutros se conservan y pierden el sesgo verde, y el acento pasa a azul/morado**. Eso no toca la maquetación, que es donde vive el carácter: siguen los filetes en vez de sombras, la serif, la semana como columna de días y el texto de la persona como contenido más pesado.

**Por qué encaja con el producto:** la materia admite más de un eje, y del proyecto solo se podían sacar dos cosas con certeza —que **la unidad con sentido es el día**, y que el contenido pesado es **texto que escribió la persona**—. Ambas apuntan a un registro: un papel con líneas donde se anota lo que se hizo cada día, en vez de un panel donde se agrega. El día es una línea y no una caja porque un día ya es una unidad de información por sí mismo, y la caja solo añadiría un contenedor vacío.

**Opción B · La agenda: descartada, con su porqué.** También era legal y también cabía dentro de lo que el cliente había decidido. Se descarta porque su mejor movimiento —enseñar la semana entera como estructura, celdas y columnas— **exige cambiar la estructura**: el resumen ya está decidido como una columna de siete días y su orden lo fija la spec 001. Su acento, el azul de bolígrafo, además era el que más se acercaba al índigo con el que ya venía la app, y eso el cliente lo confirmó después al rechazar también la vía de «volver a la paleta original». No era mala: era peor para este encargo.

**Lo que esto no cambia.** Ni el DOM, ni la lógica, ni el orden de listado, ni ningún otro requisito. Y lo que sí cambia, por decisión posterior del cliente, es la paleta: **el sistema de tokens se rehace** y con él el nombre del acento. La maquetación, la tipografía, la escala, el ritmo y las dos pasadas de revisión del plan **se quedan como estaban**.

### El acento: violeta de tinta

`verde-tinta` ya no existe. El acento ahora se llama **`violeta-tinta`**, y el nombre sigue el mismo patrón a propósito —«el color de la marca que hace esta app»—, con el tono cambié **y el trabajo intacto**: sigue diciendo *esto cuenta*.

**El tono se eligió por los contrastes, no por el gusto**, y con tres restricciones queVINieron de la vía C:

- **Tiene que ser morado, no el azul de siempre.** El cliente descartó volver al índigo de la app, así que el tono está al otro lado: un violeta de tono 259, mientras que el índigo rechazado era de tono 243. No es el mismo color movido de sitio.
- **Tiene que ser sucio, no eléctrico.** El índigo descartado tenía croma 159 de 255, que es un cromo de interfaz. El elegido va de **84**, casi la mitad: un violeta de tinta, no un resplandor. Es el movimiento que más se aleja del valor por defecto sin tener que renunciar al tono que el cliente pidió.
- **Tiene que funcionar como texto**, porque se usa en la cifra de la racha y en los minutos. De ahí los márgenes: **7,41:1** sobre el papel en claro y **7,22:1** en oscuro, contra el 4,5:1 que se pide.

**En oscuro se aclara y `--sobre-primario` se invierte**, igual que antes, porque con un acento claro el texto claro ya no llegaría. El nombre `--sobre-primario` **no se toca**: está documentado en `AVANCES.md` con su motivo, y lo que cambia es su valor, no su nombre.

### D2 · Marcar los días sin sesión: no se abre el DOM

**Decidido: los días sin sesión no se marcan visualmente.** No hay `dia--vacia`, no hay línea nueva en `pintarDiasSemana`, y no hay ninguna otra forma de apuntarlos.

**Por qué es imposible por estilo, y no por pereza.** Los siete `<li>` de la semana llevan todos la misma clase, y la lista interna de cada día se crea **siempre**, vacía o no: `pintarDiasSemana` la añade en los siete casos. Así que no hay ningún selector que pueda separar un día vacío de uno con sesión, porque **en el DOM son el mismo elemento con el mismo contenido estructural**. CSS no puede preguntar por el texto de un hijo ni por si una lista tiene elementos. Marcarlos exigiría una diferencia en el DOM, y la diferencia mínima es **una clase más**.

**Por qué la ausencia de marca es aceptable.** Porque el día vacío **se reconoce por lo que no tiene**: no tiene ninguna sesión colgando debajo, y su total es `0 min` al lado de los demás. En una columna de siete días, la ausencia de contenido **es** la marca. Un día con actividad y un día sin ella ya no se parecen en nada aunque el día vacío no lleve ninguna señal: uno tiene la fecha y los minutos y los bloques de avances debajo, y el otro tiene la fecha y `0 min` y nada más. Añadir un filete más tenue sería redundancia visual, no información.

**Abrir esa puerta sería una excepción nueva.** Una clase en `pintarDiasSemana` es una línea en `app.js` que el encargo excluye. Si algún día se quiere, hay que pedirla **como se ha pedido todo lo demás**: por escrito, nombrada, y con su coste. No se cuela como «un detalle de estilo».

### D3 · El separador de la cadena de datos: coma, aceptada

**Decidido: los dos ` · ` pasan a `, `.** Con esto la tarea deja de ser descartable y es parte de la spec.

**Por qué la coma y no otra cosa.** La cadena es `rango · tiempo · días`, y el rango **ya usa guion**, así que el punto medio compite con el contenido en vez de separarlo. La coma es puntuación y no gesto de diseño: separa los hechos sin fingir ser un separador. Se descartó el punto y coma por pesado, el guion por colisión con el rango, y la raya larga por ser exactamente el «etiqueta — fragmento» que la skill marca como cromo de plantilla.

**Lo que sigue sin arreglarse, y es honesto decirlo:** una cadena de hechos sigue siendo una cadena de hechos. La solución de verdad —tres elementos en vez de uno— necesita DOM y queda fuera. Lo que se acepta es la mejora pequeña, no el problema resuelto.

### D4 · El principio 2 de la constitution: se reescribe

La frase «la única red es descargar `sql.js`» deja de ser cierta y el principio se reescribe para seguir protegiendo lo que protege —que los datos no salen del navegador— sin afirmar ya que no hay una segunda descarga. El antes y el después se anotan en `AVANCES.md`, con el motivo. Es una tarea propia, **la última**, porque sus datos dependen de lo implementado. Ver C1.

### La decisión que se revirtió: el pie no avisa de que la fuente no ha cargado

Esta pasó por dos estados y conviene que los dos queden escritos, porque dentro de seis meses alguien va a preguntar por qué el pie no dice nada de la fuente.

**Cómo se llegó aquí.** Avisar parecía la lectura estricta del principio 4, y esta spec llegó a proponer exactamente eso: un aviso en `#pie-modo`, con `document.fonts.load()` midiendo la fuente real, porque un `onerror` en el `<link>` —el patrón que ya usa la app con `sql.js`— solo mide si llegó la hoja de estilos y es mudo justo en el caso de los bloqueadores, donde la hoja llega y el archivo de fuente no. El cliente aceptó esa frontera ensanchada. Luego la revirtió. **La spec no conserva nada de aquel montaje.**

**Por qué no avisar es defendible, y es lo que sostiene la decisión:**

1. **Una fuente ausente no cambia ninguna respuesta de la app.** Ni los datos, ni la racha, ni el historial, ni el resumen, ni el orden, ni ninguna forma de dato. No es un camino de datos: es realce visual. La app responde exactamente lo mismo con la fuente y sin ella.
2. **Los tres modos que el pie declara son los de la tabla de `AGENTS.md`** —`sql.js` caído, arranque de SQLite fallido, `localStorage` bloqueado— y una fuente **no está entre ellos**. Añadirla sería cambiar el conjunto de modos degradados del proyecto, no completar uno.
3. **Lo que sustituye al aviso es la calidad de la reserva**, y eso **sí** es comprobable: pila de reserva local en la variable de familia, margen de fechas de ancho fijo, primer pintado que no espera. El criterio 7 lo comprueba. Un aviso no lo comprobaría, porque no se puede detectar.
4. **El argumento fuerte: como no hay detección, no hay promesa.** El principio 6 dice que degradar en silencio enseña a desconfiar, y eso es cierto **cuando la app afirma algo y no lo cumple**. Aquí la app **no afirma nada** sobre su tipografía: no dice «tu fuente está cargada» ni «no está». No hay afirmación que pueda ser falsa. Un aviso de que la fuente no cargó sería, irónicamente, la primera afirmación de la app sobre su tipografía, y sería la que más fácil sería falsa.
5. **Y no contradice el principio 4**, que habla de que **cada camino de datos** tenga su alternativa sin red con la misma respuesta. La respuesta de la fuente es siempre la misma: se ve con otra letra. La alternativa existe, funciona y es idéntica en forma de datos. Lo que el principio 4 no pide es que se **declare**, porque declara los caminos de datos, y esta no lo es.

**El coste, sin disfrazarlo.** La fuente es realce. Sin ella la app es **igual de funcional** y se ve un poco peor, y **quien lo note no va a saber por qué**. Quien prefiera verla igual a todos los costes es quien pagaría una detección —una función, una llamada y una promesa en `app.js`—, y el cliente la ha rechazado dos veces. No es una solución limpia: es un compromiso, y el compromiso es exactamente «la letra puede cambiar y no te lo vamos a decir». Queda anotado en «Limitaciones conocidas», en «Riesgos» y en los próximos pasos de `AVANCES.md`, para que si algún día cambia de idea sea una decisión nueva y no un despiste.

## Choques con las reglas del proyecto

**C1 · El principio 2 decía, literalmente, que la única red es descargar `sql.js`. Resuelto: el principio se reescribe.** Una familia web desde CDN es una segunda descarga, y el principio, tal como estaba, dejaba de ser cierto. Lo que protege —que los datos no salen del navegador— **sigue intacto**: una fuente no transporta ni un dato. La reescritura mantiene la primera parte tal cual y cambia solo la frase de la red, **sin crecer**, y el antes y el después quedan anotados. Lo hace la última tarea; **nadie más toca ese archivo**.

**C2 · El principio 4 dice «funciona sin conexión, y lo dice». Resuelto por el cliente: sin aviso.** Hubo un momento en que se resolvió hacia el aviso, con la lectura estricta del «y lo dice». Está revertido, y el choque queda resuelto hacia el otro lado por la razón que sostiene la decisión: la fuente no es un camino de datos, y **sin detección no hay nada que declarar**. No queda ninguna consecuencia pendiente de este choque: no hay aviso, no hay mecanismo, y por tanto **no hay nada que anunciar y ningún atributo que tocar**.

## Limitaciones conocidas

- **Un día sin sesión no se distingue de uno con sesión por estilo**, y no se va a distinguir. Se reconoce porque no tiene nada debajo y porque su total es `0 min`. La diferencia mínima —una clase— saldría del DOM congelado. Ver D2.
- **Sin la fuente, el texto se ve con otra letra y el pie no dice nada.** Es el compromiso de la decisión, no un descuido. La app es igual de funcional; el aspecto es peor y **no se explica**. Ver «La decisión que se revirtió».
- **Con la fuente puesta, el diseño es el bueno.** Offline o con el CDN caído, la app se ve con la pila de reserva. Antes era idéntico sin red, y ahora no: es la primera vez que **abrir con doble clic** significa también **abrir con menos aspecto**.
- **La primera carga puede desplazar el texto** un instante mientras entra la fuente. Con `swap` y pila de reserva el contenido aparece de inmediato, pero el ancho de línea puede cambiar al cargar.
- **El nombre de la familia está en dos sitios**, la URL del `<link>` y `--fuente`. No hay forma de evitarlo. La consecuencia de desincronizarlos es que se usa la pila de reserva, que es un estado diseñado, y lo cazan los criterios 10 y 25.
- **La línea base se queda sin su marco vacío**: la escala tipográfica es una decisión de esta pasada, pero las medidas exactas de cada regla quedan en el plan y en la hoja, no en un archivo de tokens aparte.
- **El papel es casi un gris.** `#f2f4f5` está a dos unidades de ser un gris neutro. Es deliberado, y es lo que hace que el violeta no flote, pero conviene que quede dicho: **el carácter de esta paleta no está en el tinte del papel, está en que el papel no tiene tinte y el acento sí.** Si alguien «mejora» la paleta tiñendo el papel, vuelve el problema que el cliente acaba de rechazar.
- **El ámbar del éxito es el único calor de la app.** Es una decisión, y también una exposición: si `--exito` se acerca al rojo de `--error`, los dos mensajes dejan de distinguirse a simple vista. Hoy están separados y nunca coexisten, así que funciona; si algún día se muestran juntos, hay que revisarlo.
- **Una `fecha` no válida guardada** (`2026-02-31`) no se corrige. Sigue fuera de alcance.
- **Solo se resumen semanas ya cerradas.** La sesión de hoy no aparece hasta la semana siguiente.

## Riesgos

- **Reescribir casi toda la hoja sin linter ni parser.** Una llave que falta deja muerta la regla siguiente sin avisar. Mitigación: el navegador **sí** es parser — DevTools marca la regla inválida y `document.styleSheets[0].cssRules` pierde entradas; se comprueba la lista de selectores esperados. Ver «Cómo se verifica sin test runner» en `plan.md`.
- **Peleas de especificidad.** Es el aviso explícito de la skill, y aquí es un riesgo real, no teórico: `#lista-dias .sesion` tiene que ganar a `.sesion`, y la regla por `id` de `#resumen-semanal` tiene que ganar a `.resumen` sin que una y otra se pisen el `margin`. Ver «Trampas» en `plan.md`.
- **Perder `pre-wrap` o `overflow-wrap: anywhere`** al reescribir las reglas compartidas: rompe los criterios 10 y 12 de la spec 001, que esta pasada repite como 17.
- **Tocar `formatearRangoSemana` por accidente** al cambiar el separador de la cabecera: rompe el criterio 9 de la spec 001. La separación es por diseño: son dos cadenas, no una función.
- **Que la cursiva se sintetice** porque la URL no la pida: en una serif se nota mucho. Va en el criterio 11.
- **Que el alineado del margen de fechas dependa de cifras tabulares**, que son una función de la fuente: con la fuente bloqueada el margen se desalinearía. Por eso el margen es de **ancho fijo** y no depende de la fuente.
- **Un diseño que solo funciona con la fuente.** Sería el peor resultado posible: la pasada fallaría su propio requisito. De ahí que el margen sea de ancho fijo y que los criterios 7 y 8 estén en primera línea.
- **Que el acento se lea como el valor por defecto.** Es el riesgo más probable de esta pasada y **no está resuelto**: un violeta sobre papel frío es más parecido al «kit de tarjetas SaaS» —fondo casi blanco frío con un único acento— que el verde lo era. El cliente lo eligió aun así, y es una decisión suya que se respeta. Lo único que esta spec puede hacer es no perder el resto del carácter, que es donde está el trabajo: los filetes en vez de sombras, la serif, el registro como columna de siete días, la escala, el ritmo. Si al final la página se lee como una plantilla con violeta, será por el color y no por lo demás, y eso hay que asumido. Ver «El acento: violeta de tinta».
- **Que alguien «arregle» los neutros volviéndolos verdes o tiñendo el papel.** Es el error más probable de la implementación, porque **el verde ya estuvo aplicado** y los valores viejos van a seguir un tiempo en la cabeza de quien los escribió. Con los valores de `plan.md` no cabe ninguna ambigüedad, y el criterio 4 lo mide en los dos modos.
- **Que al quitar el sesgo se rompió una relación de luminancia.** Por eso los contrastes se han **recalculado** y no arrastrado: quitar el verde cambia los valores y con ellos los ratios, y un par que antes pasaba puede dejar de pasar. Está medido en los seis pares y en los tres que el acento necesita además.
- **Colar la fuente en la hoja por comodidad.** Como no hay nada que la fuerce, es posible que a alguien le resulte más fácil poner un `@import` o un `@font-face` y no mirar la consecuencia: la hoja propia pasa a esperar a la fuente y la app se ralentiza sin que nada falle. Es un fallo silencioso, y por eso el criterio 10 prohíbe las tres formas explícitamente.
- **Que alguien reintroduzca el aviso «porque el principio 4 lo pide».** Ya se estudió y se rechazó dos veces, con su razón escrita. Que quede por escrito es lo que evita que la pregunta se repita.
- **Riesgo preexistente, observado y no tratado aquí** por quedar fuera de alcance: `pintarTodo` busca `.sesion[data-id="..."]` en todo el documento con `querySelector`, y el resumen pinta sesiones con la misma clase y el mismo atributo. Hoy el primer acierto es siempre el del historial porque `#lista-sesiones` va antes que `#lista-dias` en el documento, así que no se ve; pero es un acoplamiento frágil que esta spec no arregla ni agrava. Queda anotado para que no se le atribuya.
- **El principio 2 se queda falso** si esta spec se implementa sin hacer la última tarea. Ver C1. Por eso esa tarea va la última y es la que cierra la spec.