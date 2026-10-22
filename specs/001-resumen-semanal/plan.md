# Plan 001 · Resumen semanal

Fase funcional de `specs/001-resumen-semanal/spec.md`. **No** incluye la pasada visual con `frontend-design`: esa va después, como fase separada.

## 1. Qué se toca y en qué orden

`app.js` de abajo arriba, luego el HTML que necesitan sus helpers, luego el CSS, luego los eventos, y la documentación al final.

1. `app.js` · **capa 2 Fechas**: `indiceDiaSemana`, `ultimaSemanaCerrada`, `lunesDeSemana`, `clavesSemana`.
2. `app.js` · **capa 5**: `calcularSemanasCerradas`, `calcularTotalesSemana`.
3. `index.html` + array `Pantallas`: `<section id="pantalla-resumen-semanal">` y `#boton-ver-resumenes`. En la misma tarea, siempre.
4. `estilos.css`: regla de `select` y bloque `/* ---------- Resumen semanal ---------- */`.
5. `app.js` · **capa 5**: `agruparSesionesPorDia`, `formatearDiaCorto`, `formatearRangoSemana`, `pintarCabeceraResumen`, `pintarDiasSemana`, `poblarSelectorSemana`, `pintarResumenSemanal`, `semanaSeleccionada`.
6. `app.js` · **capa 6 Eventos**: `abrirResumenSemanal` y los tres `addEventListener`.
7. Nada: recorrido de los 20 criterios de aceptación.
8. `docs/constitution.md`, `AGENTS.md` y `AVANCES.md`: el principio 5, las dos frases de "3 pantallas" y el estado real del proyecto.

RF por paso: 1 → RF-002 · 2 → RF-005, RF-006, RF-007, RF-009 · 3 → RF-001, RF-004, RF-011 · 4 → RF-012 · 5 → RF-005, RF-007, RF-008, RF-009, RF-010, RF-011 · 6 → RF-001, RF-003 · 8 → el texto del principio 5 y las dos frases de "3 pantallas" de `AGENTS.md`.

## 2. Helpers nuevos

**Capa 2 · Fechas.** Puras: reciben la clave, nunca leen el reloj.

- `indiceDiaSemana(clave)` → 0 (lunes) … 6 (domingo) con `(new Date(año, mes-1, día).getDay() + 6) % 7` sobre `clave.split('-')`: la línea `dowHoy` de RF-002, literal.
- `ultimaSemanaCerrada(hoy)` → `moverDias(hoy, -(indiceDiaSemana(hoy) + 7))`.
- `lunesDeSemana(clave)` → `moverDias(clave, -indiceDiaSemana(clave))`; dice a qué semana pertenece cada sesión.
- `clavesSemana(lunes)` → las siete claves de lunes a domingo aunque no tengan sesión: los siete días se pintan siempre (RF-009).

**Capa 5 · Interfaz.** Lo que se pinta o lo que se deriva de `BaseDeDatos.listar()`.

- `calcularSemanasCerradas(sesiones, hoy)` → claves de lunes de las semanas cerradas **con actividad**, de más antigua a más reciente. `Map` + `sort()` de texto: los huecos se omiten solos, y descartar `lunes >= ultimaCerrada` deja fuera la semana en curso sin casos especiales. Sin lista devuelve `[]`.
- `calcularTotalesSemana(sesiones)` → `{ minutos, dias }`: suma de `minutos` y número de `fecha` distintas. De aquí salen los estados (a), (b) y (c).
- `agruparSesionesPorDia(sesiones)` → `Map` `fecha` → sesiones **en el orden de entrada**; por eso `Map` y no objeto: el orden de `listar()` ya es el que RF-009 pide dentro de un día.
- `formatearDiaCorto(clave)` → `dd/mm`, con los ceros que ya trae la clave.
- `formatearRangoSemana(lunes)` → regla única de RF-008: dos `formatearDiaCorto` y el año en los dos extremos solo si difieren.
- `pintarCabeceraResumen(lunes, totales)` → `#resumen-semanal`.
- `pintarDiasSemana(lunes, grupos)` → `#lista-dias`, los siete `<li class="dia">` de lunes a domingo.
- `poblarSelectorSemana(semanas, elegida)` → `#selector-semana`; `option.value` es la clave del lunes y el texto sale de `formatearRangoSemana`. Nunca `disabled`.
- `pintarResumenSemanal()` → orquestador: lista, relee `claveDeHoy()`, calcula, elige semana y pinta. La llaman `abrirResumenSemanal` y el `change` del selector.
- `semanaSeleccionada` → `let` de capa 5, estado en memoria de la sesión. **No** va a `Claves`.

## 3. Decisiones que la spec deja abiertas

1. **Minutos con `formatearTiempo`, no el número desnudo.** El historial ya la usa (`#resumen`, `.sesion__minutos`), así que el usuario no ve dos formatos de la misma magnitud, y no hace falta función nueva. No redondea ni pierde minutos (`150` → `2 h 30 min`, `0` → `0 min`, y el estado (a) sigue mostrando un cero inequívoco). *Descartada:* número sin unidad, que deja la unidad para la fase visual.
2. **`resumen-semanal`** como `id` de la cabecera del resumen, en paralelo con `#resumen` del historial. *Descartada:* `cabecera-resumen`, más corta y menos paralela.
3. **`lista-dias`** como `id` de la lista de días, en paralelo con `#lista-sesiones`. *Descartada:* `lista-dias-semana`, redundante dentro de la pantalla.
4. **`formatearDiaCorto` y `formatearRangoSemana` en capa 5**, junto a `formatearTiempo`. *Descartada:* capa 2, que tiene `fechaLegible`. Son texto de pantalla, y la regla del año solo debe vivir en un sitio (criterio 9: mismo texto en cabecera y selector).
5. **`calcularTotalesSemana` en capa 5**, no en la 4: el banner de la capa 4 dice "CÁLCULO DE LA RACHA" y sus reglas son las de la racha. *Descartada:* una capa "Cálculos" nueva, que además rompería el índice de la cabecera de `app.js`.
6. **El filtro de la semana compara `lunesDeSemana(s.fecha) === semanaSeleccionada`.** *Descartada:* intervalo `>= lunes && <= domingo`, que obliga a dos `moverDias` por sesión y duplica la comparación de texto.
7. **Cada sesión del resumen reutiliza `.sesion__fila`, `.sesion__minutos`, `.sesion__avances` y `.sesion__vacio`**; solo el día es nuevo (`.dias`, `.dia`, `.dia__fila`, `.dia__fecha`, `.dia__minutos`, `.dia__sesiones`). Razon: `.sesion__avances` ya trae `pre-wrap` y `overflow-wrap: anywhere`, que son los criterios 10 y 12. *Descartada:* clases paralelas, que obligarían a duplicar esas reglas y mantenerlas en sincronía. La fase visual puede separarlas.
8. **Entrada y salida con la misma clase `boton boton--suave`**, así que la simetría del botón de volver ya es estructural; el peso visual se decide después.
9. **Al reabrir, `abrirResumenSemanal` pone `semanaSeleccionada = null`** y `pintarResumenSemanal` la sustituye por la semana inicial canónica: es lo que pide la última frase de RF-005. *Descartada:* conservar la selección anterior si sigue siendo válida; cumpliría la primera mitad de RF-005 y contradiría la última.

Los demás identificadores los nombra la spec: `pantalla-resumen-semanal` (RF-001, y en `Pantallas` como `'resumen-semanal'`), `encabezado-resumen-semanal` (RF-001, `class="titulo"` y `tabindex="-1"`), `boton-ver-resumenes` (RF-004), `selector-semana` (RF-006), `boton-volver-tablero` (RF-011) y `data-id` por sesión (RF-009).

## 4. Trampas del proyecto que esta implementación toca

- **Ninguna en `BaseDeDatos`.** No se añade ningún método (la spec lo decide) y no se toca `BaseDeDatos.iniciar`, así que `lista.forEach(this.insertar, this)` sigue intacto: no convertirlo en arrow. La regla de "todo método nuevo necesita las dos implementaciones" **no llega a activarse**; si algún día hiciera falta uno, tendría SQL y respaldo con el mismo shape.
- **Prohibido recortar `sesion.avances`**: nada de `slice`, `substring` ni `substr` sobre ese campo. Ojo al grep: `slice` sí aparece en `BaseDeDatos.listar` (respaldo) y en `fechaLegible`; lo que se vigila es el argumento.
- **Fechas:** ni `toISOString`, ni `new Date("AAAA-MM-DD")`, ni 86.400.000 ms, ni funciones de fecha de SQLite (`date()`, `strftime()`, `julianday()`), que evalúan en UTC. `claveDeHoy()` se relee en cada entrada: cruzar medianoche con la pantalla abierta no repinta, pero al volver a entrar sí.
- **`toLocaleDateString('es-ES', {day, month})` devuelve `28/9`**: el rango sale de `clave.split('-')`, nunca de `Intl`.
- **`Pantallas` en la misma tarea que el HTML.** Con la sección en el DOM y fuera del array, `mostrarPantalla` no la oculta nunca y se quedan dos pantallas a la vez.
- **Volver al tablero con `mostrarPantalla('tablero')` a secas.** `abrirTablero()` o `pintarTodo()` repintan y pierden el `scrollTop` de `.sesiones`; el `window.scrollTo(0, 0)` de `mostrarPantalla` no toca ese scroll interno.
- **`miRacha:prueba`** se crea y se borra al arrancar: al comprobar que no hay claves nuevas hay que contar con ella. No se tocan `Claves`, `ESQUEMA_SQL`, la versión de `sql.js` ni el objeto `sesion`. Todo con `textContent` y `createElement`, sin `innerHTML`.

## 5. Cómo se verifica sin test runner

- `app.js` es un `<script>` clásico: sus funciones de primer nivel son globales y se pueden llamar desde la consola de DevTools. Por eso los helpers puros reciben `hoy` o la clave como parámetro y **no leen el reloj**: los criterios 3, 4, 5 y 8 se comprueban con fechas fijas sin tocar el reloj del sistema.
- Criterio 11, literal: localizar la sesión en `BaseDeDatos.listar()` por `id` con `String(...)` en ambos lados y comparar su `.avances` con el `textContent` del bloque localizado por `[data-id]`. Nunca contra `#avances.value`.
- Modos degradados: DevTools → Network → Offline y recarga (cubre `sql.js` caído y fallo de arranque); `localStorage` bloqueado necesita un navegador con el almacenamiento bloqueado. Los tres se ven en `#pie-modo`.
- Al final, relectura de las zonas editadas y balanceo de llaves a mano: no hay parser en esta máquina.

## 6. Qué queda para la fase visual

Peso y color de la cabecera y del botón de volver, la regla del `<select>` más allá de lo funcional, la separación de `.dia*` de `.sesion*`, si alguna variable nueva hace falta en `:root` (en esta fase **no**: con las de `AGENTS.md` basta, así que el bloque oscuro no se toca) y si el cambio de selector necesita `aria-live`. Las dos decisiones que sí eran estructurales —los `id` y el formato de los minutos— no se dejan para entonces: están arriba porque la pasada visual tendrá que observarlas.
