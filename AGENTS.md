# AGENTS.md — Mi Racha

Aplicación web de una sola página para registrar sesiones de estudio diarias y
mantener viva una racha de días consecutivos. El usuario escribe una frase de
intención al día, guarda sesiones (fecha + minutos + avances) y ve su racha y su
historial. Todo el producto —código, comentarios, textos de interfaz e `id` del
DOM— está **en español**.

## Reglas

- Lee `docs/constitution.md` y la spec activa (`specs/NNN-*/`) antes de tocar código.

## Stack y estructura

**Stack.** Sin frameworks, sin librería de UI, sin módulos ES, sin bundler, sin
transpiler, sin package manager, sin linter, sin formateador, sin tests, sin Git.

| Elemento | Estado |
|---|---|
| HTML / CSS / JS | Sin frameworks, sin librería de UI |
| Módulos | No. Un solo `<script>` clásico, sin `type="module"` |
| Dependencias | Una sola: **sql.js 1.10.3** (SQLite compilado a WebAssembly) vía CDN |
| Bundler / transpiler / package manager | Ninguno |
| Tests automatizados | Ninguno |
| Linter / formateador | Ninguno |
| Git | No inicializado |
| Idioma | Español |

**Archivos.** Tres de código y tres de documentación. El proyecto es
deliberadamente plano:

```
Proyecto/
├── index.html   # 4 pantallas (<section class="pantalla">) + <noscript>
├── app.js       # toda la lógica, 6 capas (ver Convenciones)
├── estilos.css  # variables CSS + estilos, modo oscuro incluido
├── AGENTS.md    # este archivo: cómo se trabaja aquí
├── AVANCES.md   # estado, decisiones, aprendizajes y próximos pasos
└── docs/
    └── constitution.md  # principios innegociables (ver Reglas)
```

No crees una carpeta `src/`, `js/`, `css/` ni cualquier estructura nueva sin una
razón muy buena. Los tres `.md` (`AGENTS.md`, `AVANCES.md`,
`docs/constitution.md`) son documentación: no se tocan como parte de un cambio
de código (salvo que el cambio obligue, y entonces `AVANCES.md` es el que se
actualiza).

## Comandos

No hay build, ni instalación, ni servidor obligatorio. La app se abre con doble
clic en `index.html`; eso es todo.

- **Ejecutar**: `start index.html` (Windows) o doble clic en el archivo.
- **Depurar con servidor local** (opcional, no es un requisito):
  `python -m http.server 8000` y abre `http://localhost:8000`. Cualquier otro
  sirve (`npx serve`, extensión Live Server).
- **Probar**: no existe comando. La única verificación real es abrir el
  navegador y recorrer la app (ver *Verificación*).
- **Lint / formatear**: no existen. No los añadas.
- **Build / compilar**: no existe. No lo añadas.

Cualquier dependencia que exija un paso de compilación, un servidor o un
`npm install` rompe la premisa de "abre con doble clic". Antes de añadir una
librería, comprueba que se pueda cargar con un `<script>` desde un CDN y que la
app siga funcionando si la descarga falla.

## Convenciones

**Idioma.** Español en todo: código, identificadores, comentarios, textos de
interfaz, `id` del DOM y los dos `.md`.

**JavaScript.**

- Sin arrow functions, sin template literals: se usan `function` y concatenación
  de cadenas con `+`. Sí usa `const`/`let`, `async/await` y `Map`/`Set`.
- `'use strict'` al inicio del archivo.
- Funciones globales con `verboObjeto` en camelCase (`calcularRacha`,
  `pintarHistorial`, `mostrarMensaje`). Módulos/objetos en PascalCase
  (`Almacen`, `BaseDeDatos`, `Pantallas`, `Claves`, `ESQUEMA_SQL`, `RUTA_SQL_JS`).
- Constantes en SCREAMING_SNAKE_CASE.
- Comentarios en español, explicativos ("por qué"), no desc banal. Los bloques
  usan el banner `/* ===== ... ===== */`.
- **Usa siempre `textContent` y `createElement`, nunca `innerHTML`.** La frase
  y los avances son texto del usuario; insertarlos como HTML sería una
  inyección.

**CSS.**

- Todos los colores, radios, sombras y anchos salen de variables en `:root`.
  **Nunca escribas un color literal** en una regla: el bloque
  `@media (prefers-color-scheme: dark)` redefine las mismas variables.
  Cuando un color dependa del fondo sobre el que va (texto de un botón, por
  ejemplo), necesita su propia variable, no un valor fijo.
- Clases estilo BEM: `.tarjeta`, `.tarjeta__titulo`, `.sesion__fecha`,
  `.boton--grande`. Los grupos se separan con `/* ---------- Título ---------- */`.
- El input de texto usa `font-size: 1rem` a propósito: por debajo de 16px, iOS
  hace zoom al enfocar. No lo bajes.
- Todo nuevo elemento interactivo necesita estado `:focus-visible`.

**HTML.**

- Las pantallas son `<section class="pantalla" id="pantalla-<nombre>">` y se
  muestran con el atributo `hidden`. Al añadir una pantalla, actualiza también
  el array `Pantallas`.
- Accesibilidad ya cuidada: `aria-labelledby`, `role="alert"`,
  `aria-live="polite"`, `for` en todos los labels, `type="button"` explícito en
  botones que no envían formulario. Para ocultar solo visualmente usa la clase
  `.oculto`, no `display: none`.
- El `<link rel="icon" href="data:,">` existe para evitar el 404 del favicon.
  No lo quites.

**Patrón a seguir: las 6 capas de `app.js`.** `app.js` se organiza en capas que
se leen de abajo hacia arriba; respeta el orden y mantén los encabezados. La
cabecera del archivo las lista (ver *Decisiones* en `AVANCES.md`):

1. **Almacén** (`Almacen`) — envoltorio de `localStorage` que nunca lanza
   excepciones; si el navegador lo bloquea, cae a memoria.
2. **Fechas** — helpers de fecha, siempre en **hora local**.
3. **BaseDeDatos** — sesiones en SQL real, con alternativa en memoria.
4. **Cálculo de racha** (`calcularRacha`).
5. **Interfaz** — dibujado de pantallas, historial y racha.
6. **Eventos** (`conectarEventos`) y arranque (`iniciar`).

**Cómo citar código.**

- **Nunca referencies código por número de línea** (`app.js:317`, `estilos.css:6`).
  Un número de línea se queda viejo en el primer cambio y no avisa: te manda al
  sitio equivocado en silencio, que es peor que no señalar nada.
- Usa el **nombre de la función u objeto** (`calcularRacha`, `sesionesValidas`,
  `ESQUEMA_SQL`, `Pantallas`) o el **nombre del bloque** (`en :root`, en el
  bloque `@media (prefers-color-scheme: dark)`). Los dos son estables: el
  nombre no se mueve porque le añadas líneas encima.
- La única excepción admisible es un dato que cambia y que además describes
  como provisional, del tipo "el `#fff` de la línea 259". Si el proyecto tiene
  esa excepción en un momento dado, no la conviertas en costumbre.

## Reglas de dominio / trampas conocidas

**Modelo de datos.** Objeto `sesion`:

```js
{ id: Number, fecha: 'AAAA-MM-DD', frase: String, minutos: Number, avances: String, creado_en: 'AAAA-MM-DD HH:MM:SS' }
```

- Tabla SQLite: `sesiones` (definida en `ESQUEMA_SQL`), con
  `CHECK (minutos > 0)` e índice en `(fecha DESC)`.
- Claves de `localStorage`: `miRacha:sesiones`, `miRacha:frase` (en `Claves`).
- Orden de listado, **idéntico en los dos modos**: `fecha DESC, creado_en DESC, id DESC`.
  El `id` final desempata sesiones guardadas en el mismo segundo.

**La fuente de verdad es `localStorage`.** SQLite corre **en memoria**. Al
arrancar, `BaseDeDatos.iniciar()` crea una base nueva e inserta las sesiones
leídas de `localStorage`. No esperes que el estado de SQLite sobreviva a un
cierre de pestaña: `BaseDeDatos.guardar()` se llama después de cada `crear` y
cada `borrar` y ahí es donde se persiste todo.

**Racha** (`calcularRacha`) — días consecutivos que terminan hoy:

- Sin ninguna sesión guardada → `0`.
- Con sesión hoy, la cuenta empieza en hoy.
- Sin sesión hoy pero con sesión ayer → la racha sigue viva hasta que termine
  el día; si tampoco hay sesión ayer, `0`.
- Una o varias sesiones el mismo día cuentan como **un** día.

**Fechas** — todo con hora local, nunca UTC. Construye fechas con
`new Date(año, mes - 1, día)`, nunca con cadenas ISO. Las claves `"AAAA-MM-DD"`
se comparan como texto, así que el formato con ceros a la izquierda es
obligatorio.

**Restricción de fechas futuras** — validada en dos sitios: `max` en el
`<input type="date">` (lo pone `prepararFormularioSesion`) y comparación en el
submit. Mantén las dos.

**Tras guardar una sesión** se conservan la fecha y la frase; solo se limpian
minutos y avances, al final del submit.

**Modos degradados.** La app tiene que funcionar igual en los tres escenarios
degradados, y todos avisan al usuario en el pie (`#pie-modo`):

| Fallo | Comportamiento |
|---|---|
| `sql.js` no carga (sin red, CDN caído) | `modo = 'respaldo'`: array en memoria, misma API |
| Falla el primer arranque de SQLite | Un reintento, luego respaldo (bucle de `BaseDeDatos.iniciar`) |
| `localStorage` bloqueado | `Almacen` usa memoria; se avisa de que se perderá al cerrar |

**Regla:** cualquier método nuevo de `BaseDeDatos` debe tener las dos
implementaciones (SQL y respaldo) y devolver el mismo shape. Si solo funciona
en modo SQL, la app está rota sin internet.

**Trampas conocidas** (lo fácil de hacer mal, no deducible leyendo el código):

1. **La versión de sql.js está escrita dos veces**: en el `<script>` de sql.js en
   `index.html` y en `RUTA_SQL_JS`. Si actualizas una, actualiza la otra, o el
   `.wasm` ya no se encontrará.
2. **`this` en callbacks**: `lista.forEach(this.insertar, this)`, dentro de
   `BaseDeDatos.iniciar`, depende del `thisArg`. Si refactorizas esas llamadas a
   arrow functions, rompe el binding.
3. **Añadir un campo a `sesion` toca muchos sitios**: `ESQUEMA_SQL`, `insertar`,
   `filas`, `crear` (ambas ramas), `sesionesValidas` y el comparador de
   `listar`. `sesionesValidas` debe seguir aceptando datos ya
   guardados a los que le falte el campo nuevo, o los usuarios existentes
   pierden sus sesiones al arrancar.
4. **Cambiar el esquema no migra datos**: al arrancar se crea la tabla con
   `CREATE TABLE IF NOT EXISTS` y se reinserta lo que haya en `localStorage`.
   Si cambias columnas o tipos, escribe la transformación en `sesionesValidas`.
5. **`localStorage` es un objeto compartido por origen**: los datos no son
   privados ni se sincronizan entre navegadores. No los trates como secretos.
6. **No hay tests.** La única verificación real es abrir el navegador. Si añades
   pruebas, recuerda que `app.js` depende del DOM y de `sql.js`, así que
   necesitan ejecutarse en un navegador, no en Node.
7. **`ESQUEMA_SQL` no admite comentarios dentro**: es un array de cadenas unido
   con `join`, así que un `//` pasaría a formar parte del SQL y lo rompería. El
   comentario va encima del bloque, nunca dentro.

## Forma de trabajar

**`AVANCES.md` es parte del trabajo, no un extra.** Una tarea no está terminada
hasta que ese archivo refleje el estado real del proyecto.

- **Al empezar:** lee `AVANCES.md` entero, antes de tocar nada. Es la memoria del
  proyecto: te dice en qué punto está, qué se decidió y por qué, y qué errores ya
  se cometieron. No te lo saltes aunque el archivo parezca corto, y aunque el
  cambio te parezca obvio.
- **Al terminar:** comprueba si tu trabajo deja obsoleto algo de lo que el
  archivo afirma. Si es así, actualiza esa sección. Si no lo deja obsoleto, no
  hay nada que escribir: no rellenes por rellenar.

**Estructura fija de `AVANCES.md`.** Cuatro secciones, respetadas, sin añadir una
quinta y sin convertirlo en un log con una entrada por fecha:

1. **Estado actual** — cómo funciona la app hoy, sin adornos.
2. **Decisiones y sus razones** — qué se eligió y por qué, sobre todo lo que no
   se deduce leyendo el código.
3. **Aprendizajes y errores a evitar** — lo que salió mal y qué hacer en su lugar.
4. **Próximos pasos** — lo que queda abierto.

Cada sección es un **estado vivo**, no un diario. Se actualiza la que cambia y se
dejan intactas las demás.

**El límite de 75 líneas manda sobre todo.** El archivo **no puede pasar de 75
líneas**, y lo que no aporta **se va**. Si te pasas, **reescribe** la sección
afectada dejando solo lo vigente, en vez de apilar líneas. Fuera lo que:

- **Ya no es cierto.** Una decisión que se cambió o un comportamiento que se
  sustituyó: vale la versión nueva, no las dos.
- **Describe código que ya no existe**, o lo hace de tal modo que confunde.
- **Repite `AGENTS.md`.** Si una línea solo reitera una regla permanente del
  proyecto, sobra aquí.
- **Ya está hecho.** Un paso de "Próximos pasos" que se completó sale de ahí; si
  su resultado importa, pasa a "Estado actual".

Lo que **nunca** se borra: el **por qué** de una decisión que sigue vigente, y
lo que evita repetir un error. Ante la duda, acorta la redacción antes que
eliminar el contenido.

**Reparto con `AGENTS.md`.** Para que lo mismo no acabe escrito en los dos:

- **Regla permanente** de trabajo (convenciones, trampas del código,
  restricciones) → `AGENTS.md`.
- **Estado o historia del proyecto** (cómo está hoy, qué se decidió, qué falta)
  → `AVANCES.md`.

"Aprendizajes y errores a evitar" es para lo que es **de este proyecto** y
aprendiste trabajando aquí. Si el aprendizaje sirve para cualquier cambio futuro
en el repositorio, es una regla permanente y va a `AGENTS.md`.

**Cuándo planificar antes de tocar código.** Antes de escribir código, piensa si
el cambio afecta al modelo de datos o al esquema, si toca varios archivos, si
rompe un invariante, o si una decisión de diseño no está clara de primeras. En
esos casos, escribe antes el plan y confírmalo.

**Qué explicar al terminar.** Qué cambiaste, por qué, cómo lo verificaste y qué
queda pendiente. Si algo queda pendiente, anótalo también en "Próximos pasos" de
`AVANCES.md`; no lo dejes solo en el mensaje.

## Límites

**✅ Siempre, sin preguntar:**

- Leer `AVANCES.md` entero antes de empezar; actualizarlo al terminar si quedó
  obsoleto (y solo si quedó obsoleto).
- Mantener todo en español.
- Comentar el porqué, no el qué.
- Usar `textContent`/`createElement`, nunca `innerHTML`.
- Colores, radios, sombras y anchos desde variables CSS; nunca literales.
- Cualquier método nuevo de `BaseDeDatos` con sus dos implementaciones.
- No introducir claves de `localStorage` sin añadirlas a `Claves`.
- Anclar el código por nombre/bloque, nunca por número de línea.

**⚠️ Pregunta antes:**

- Dependencias nuevas o subir la versión de `sql.js`.
- Archivos, carpetas o cualquier estructura nueva.
- Cambios en el formato de datos, el esquema SQLite o los campos de `sesion`
  (afecta a los datos ya guardados por los usuarios).
- Quitar, mover o simplificar una trampa conocida o un invariante.
- Cualquier cambio que exija romper "abre con doble clic".

**🚫 Nunca, bajo ningún concepto:**

- Añadir un paso de build, `package.json`, bundler, framework o `npm install`.
- Introducir `innerHTML` o inyectar texto de usuario como HTML.
- Escribir un color literal en una regla CSS.
- Cambiar el idioma del producto o del código al inglés.
- Dejar que la app deje de funcionar en los modos degradados (sin `sql.js`, sin
  red, sin `localStorage`).
- Referenciar código por número de línea.

## Verificación

No hay test runner ni Node en esta máquina, así que un cambio en `app.js` no se
comprueba con un parser. Antes de dar algo por bueno, abre el navegador y
recorre la checklist:

- [ ] Abre `index.html` en el navegador y recorre las 4 pantallas.
- [ ] Prueba el camino feliz y los errores: frase vacía, minutos `0`, minutos no
      numérico, sin fecha, fecha futura.
- [ ] Comprueba el pie: debería decir `Base de datos: SQL (SQLite).`
- [ ] **Desconecta internet y recarga**: la app debe arrancar igual en modo de
      respaldo y guardar/eliminar sesiones con normalidad.
- [ ] Guarda una sesión, recarga y confirma que la racha y el historial persisten.
- [ ] Redimensiona a móvil (≤480px) y revisa que nada se desborde.
- [ ] Revisa el modo oscuro si tocaste el CSS.
- [ ] No introduzcas claves de `localStorage` nuevas sin añadirlas a `Claves`.
- [ ] Actualiza `AVANCES.md` si tu trabajo lo dejó obsoleto (ver *Forma de
      trabajar*).
- [ ] Decide tu "Próximos pasos": algo queda abierto, o está todo cerrado.
- [ ] Comprueba que `AVANCES.md` sigue por debajo de 75 líneas; si no, poda.

Como no hay parser, **balancea llaves, paréntesis y corchetes respetando cadenas
y comentarios**, y lee las zonas que has editado. Si recorres el archivo con
PowerShell, no uses `switch` para el recorrido: dentro de él `continue` sale del
`switch` y no del bucle, así que el índice se desalinea y acaba reportando
errores de sintaxis que no existen. Usa `if/elseif`.
