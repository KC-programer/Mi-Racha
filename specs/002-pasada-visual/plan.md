# Plan 002 · Pasada visual

Fase visual de `specs/002-pasada-visual/spec.md`. Es la fase que la spec 001 dejó fuera de alcance deliberadamente.

**La dirección está fijada:** **A · el registro**, y eso no se toca. La alternativa, la agenda, queda descartada con su porqué en la spec. La maquetación, la tipografía, la escala, el ritmo y las dos pasadas de revisión de este plan **se quedan como estaban**.

**La paleta sí se rehace, y es lo único que cambia.** Se aplicó una vez con un **verde de tinta** y el cliente lo rechazó al verla. Los valores de abajo son los de la vía C: **los mismos neutros con el sesgo verde quitado y el acento en violeta**. La tabla de contrastes está **recalculada**, no arrastrada, porque quitar un sesgo cambia los valores y con ellos las relaciones de luminancia.

**La frontera no se mueve.** Se studió avisar en el pie de que la fuente no ha cargado, con su mecanismo y sus criterios, y el cliente lo rechazó. **De aquel montaje no queda nada**: ni función, ni llamada, ni `catch`, ni temporizador, ni atributo, ni criterio de aviso. Lo único que sale de estudiarlo es la razón de no hacerlo, que está en la spec, y una decisión de forma de carga que ahora sí está libre. Ver el punto 5, decisiones 13 y 14.

---

## 1. Plan de diseño, primera pasada

### 1.1 Materia y sujeto

**La dirección ya está fijada: A · el registro.** Aquí está el razonamiento que la sostiene, porque es lo que fija el resto de las decisiones.

Del proyecto se podían sacar dos cosas con certeza, y solo dos:

1. **La unidad con sentido es el día.** Todo lo que la app calcula son días: la racha son días, el resumen son siete días, la sesión es de un día. Un día con varias sesiones cuenta una vez. La semana cerrada es el intervalo completo de siete días y se muestra siempre entero, aunque esté vacía.
2. **El contenido pesado es texto que escribió la persona.** La frase del día, los avances de cada sesión. Eso es lo que hay que proteger y lo que la app promete no recortar.

Las dos apuntan a lo mismo: **un papel con líneas donde se anota lo que se hizo cada día**, no un panel donde se agrega. De ahí sale el resto: si el día es una unidad de información por sí mismo, **no necesita una caja** —la caja solo añadiría un contenedor vacío— y sí necesita un filete que lo separe de sus vecinos. Si el contenido pesado es texto propio, ese texto tiene que ser lo de más cuerpo y lo de más medida de la pantalla. Y si la materia es un registro, el color que marca es el de la tinta que corrige y no el de un panel de control.

La otra dirección posible —la agenda, con el día como celda y la semana visible— **se descartó** porque su mejor movimiento exige cambiar la estructura, que el cliente congeló: el resumen ya está decidido como una columna de siete días y la spec 001 fijó su orden.

### 1.2 Color: seis valores con nombre

Los nombres son de la materia, no de la interfaz. **Los valores son de la vía C** —neutros nuevos sin el sesgo verde, acento azul/morado—, que es lo que el cliente eligió después de ver aplicada la paleta verde.

| Nombre | Claro | Oscuro | Papel |
|---|---|---|---|
| `hoja` | `#f2f4f5` | `#18191b` | El fondo: la página es el papel. Sin veladura encima. |
| `papel` | `#ffffff` | `#212121` | La superficie: donde hay contenido encima del papel. |
| `tinta` | `#212121` | `#ebebec` | Texto normal. |
| `grafito` | `#626363` | `#aaabab` | Texto secundario: ayudas, rótulos, notas, pie. |
| `regla` | `#dadadb` | `#393939` | Filetes y bordes. Sustituye a la sombra. |
| `violeta-tinta` | `#5a3f93` | `#b39ae0` | El acento. Un solo trabajo: **decir que esto cuenta.** |

Derivados, que no son colores base: `regla-tenue` (`#eaeaeb` / `#2f2f30`), `violeta-tinta-tenue` (`#eee9f7` / `#282234`), `violeta-tinta-fuerte` (`#483079` / `#cdb9f2`, el hover) y los dos semánticos: `error` (`#a52a2a` / `#ff9c9c`) con su tinte (`#fbeeee` / `#3a1f1f`), y `exito` (`#855611` / `#efbf72`) con su tinte (`#fbf1e2` / `#2f2617`).

**Ratios medidos** con la fórmula de WCAG 2.x, todos ≥ 4,5:1: tinta/hoja 14,59 y 14,77 · grafito/hoja 5,46 y 7,64 · violeta-tinta/hoja 7,41 y 7,22 · sobre-primario/violeta 7,41 y 7,22 · error/tinte 6,26 y 7,51 · exito/tinte 5,63 y 8,77. Y el acento además, porque se usa como texto en las otras superficies: 8,18 y 6,61 sobre `papel`, 7,68 y 5,88 sobre la superficie suave, 6,87 y 6,29 sobre su propio relleno suave.

**El acento tiene un solo trabajo.** Lo usan tres cosas y ninguna más: el número de la racha, los minutos que cuentan y la racha viva. Es el mismo violeta para las tres porque es la misma idea: *esto cuenta*. **No hay un segundo color de acento.**

**Y `--exito` ya no es el acento.** Cuando el acento era verde, «salió bien» y «esto cuenta» eran la misma idea y compartían color; con violeta eso no aguanta, y además le daría al acento un segundo trabajo, que es justo lo que la línea de arriba prohíbe. `--exito` pasa a **ámbar de bronce**, que es el único calor de la app y **no es verde**. Se descartó un cian o un verde azulado por cercanía de tono con el verde que el cliente quitó, y se descartó atarlo otra vez al acento. `--error` se queda rojo: no es «color verde» y es la única señal que separa «salió bien» de «falló».

### 1.3 Tipografía: una familia, dos papeles

Una sola familia web desde CDN, como manda el cliente. **Propuesta: `Faustina`.**

Por qué esta y no otra. La app se usa de noche, cansado y con una mano; el contenido mezcla cifras (`dd/mm`, minutos, cuenta de días) con frases cortas escritas por la persona; hace falta que sea legible a 0,8 rem y que aguante un número a 4 rem. Eso pide una **serif de texto resistente, de poco contraste y separada fuerte**, no una didone de display —que es el camino que lleva al primer valor por defecto de la skill— ni una geométrica de moda. Faustina cumple: es de lectura en pantalla, con partiruras marcadas que sobreviven al tamaño pequeño, sin altisonancia de contraste y sin ser la elección de moda. **Sus alternativas son `Bitter`**, si se quiere más sensación de registro mecanografiado y aún más corpulencia, y **`Alegreya`**, si se quiere el linaje de la caligrafía española y se acepta un `x-height` más bajo que exige más cuidado en los rótulos pequeños.

Dos papeles, **la misma familia**:

- **El registro**: cuerpo, etiquetas, campos, botones, y **todo el texto que escribió la persona** —la frase y los avances—, que es el que más cuerpo y más medida lleva, y con más interlineado del que llevaría una sans, porque tiene serifas.
- **La cifra**: el número de la racha y los minutos. No es otra familia: es la misma con más tamaño y más contraste entre el trazo fino y el grueso.

**Lo que la restricción cuesta.** Una sola familia quita la palanca de emparejar una de display con otra de texto, que es donde la personalidad suele venir. Así que la personalidad tiene que salir del **tratamiento**, no de la pareja, y de ahí sale el punto 1.5.

**Sin monoespaciada.** Una monoespaciada para etiquetas de datos pequeños es otro de los valores por defecto de la skill, y además estropearía el `dd/mm` en un margen que debe leerse de un vistazo.

### 1.4 Maquetación: el registro como columna de siete fechas

**Concepto, en una frase:** *el día es una línea con la fecha en el margen y el texto de esa persona colgando de un filete lateral; el papel no se trocea en cajas, se escribe encima.*

**Orientación:** el contenido va **a la izquierda**, todo con el mismo borde izquierdo, incluida la fecha del día en el margen. Las dos pantallas de ritual —inicio e intención— **siguen centradas**, y solo esas dos. Hoy la alineación no está motivada: el tablero mezcla una tarjeta centrada con columnas a la izquierda.

*Los tamaños no se ven en monoespaciado: la escala va en el punto 4.*

**Pantalla de inicio** (estructura intacta, solo cambia el aspecto):

```
                    Mi Racha

            ¿Listo para empezar?

     Registra lo que estudias cada día
          y mantén viva tu racha.

            [ Iniciar sesión ]

     Todavía no tienes sesiones registradas.
```

**Tablero**, con la racha a la izquierda y sin caja:

```
Tu frase                                  Cambiar frase
──────────────────────────────────────────────────────────────────────
Termino los ejercicios de JavaScript

   12  días de racha
       Hoy ya está registrado. Así se mantiene viva tu racha.

──────────────────────────────────────────────────────────────────────
Nueva sesión            │ Historial de sesiones
                         │ 3 sesiones, 2 h 30 min de estudio
                         │ ────────────────────────────────────
 Fecha     [05/10/2026]  ││ martes, 15 de septiembre    45 min
                         ││ "Termino los ejercicios de JS"
                         ││ Terminé los ejercicios…
 Minutos   [45         ]  ││ Eliminar esta sesión
                         ││ ────────────────────────────────────
 Avances   ┌───────────┐  ││ lunes, 14 de septiembre      60 min
            │           │  ││ …
            └───────────┘  │
                         │ Ver resúmenes…
 [Guardar sesión]         │
```

**Resumen semanal**, que es donde está el dispositivo memorable:

```
Resumen semanal
Semana
┌──────────────────┐
│ 28/09 - 04/10  ▾ │
└──────────────────┘

28/09 - 04/10, 2 h 30 min, 3 días con sesión
─────────────────────────────────────────────
28/09                    1 h 15 min
   │ 45 min
   │ Terminé los ejercicios de JavaScript
   │ 30 min
   │ Refactoricé el módulo de fechas
─────────────────────────────────────────────
29/09                          0 min
─────────────────────────────────────────────
30/09                    1 h 15 min
   │ 1 h 15 min
   │ Voy a rehacer la hoja de estilos del
   │ resumen antes del viernes
─────────────────────────────────────────────
… hasta el domingo, los siete días, aunque estén vacíos
─────────────────────────────────────────────
Volver al tablero
```

Dos wireframes alternativos, para comparar y descartar:

```
B · La columna de la semana              C · Tarjetas (lo que hay hoy)
┌────────────────────────────────┐     ┌────────────────────────────┐
│ 28/09 - 04/10 · 2 h 30 min     │     │ ┌────────────────────────┐ │
├────────────────────────────────┤     │ │ 28/09        1 h 15 min │ │
│ 28/09 │ 45 min                │     │ │ ┌────────────────────┐ │ │
│       │ Terminé los ejercicios │     │ │ │45 min               │ │ │
│ 29/09 │ Refactoricé el módulo  │     │ │ │Terminé los ejerc... │ │ │
│ 30/09 │ Voy a rehacer la hoja  │     │ │ └────────────────────┘ │ │
│ …     │ …                      │     │ └────────────────────────┘ │
└────────────────────────────────┘     │ ┌────────────────────────┐ │
  Volver al tablero                   │ │ 29/09            0 min │ │
                                       │ └────────────────────────┘ │
                                       └────────────────────────────┘
```

**B** se descarta porque mete el rango en una cabecera y **duplica** un dato que la línea de totales ya lleva, y porque su marco es una caja: vuelve al *kit de tarjetas* por la puerta de atrás. **C** es exactamente el valor por defecto que la skill quiere fuera: cajas idénticas, mismo radio, sombra suave bajo cada una.

### 1.5 El único sitio donde se gasta la osadía

Todo lo demás se mantiene disciplinado: fondo plano, filetes, un acento, rótulos pequeños, sin sombras, sin degradados, sin movimiento que no responda a una acción.

**El sitio único es la columna de días del resumen semanal**, con dos recursos que vienen de la materia y no de un catálogo:

- **La fecha en el margen, de ancho fijo.** Los siete días salen alineados en una columna y se pueden recorrer con la vista. Con siete filas eso es información de verdad, no decoración. Por eso el margen es de ancho fijo y no depende de la fuente: en el punto 3 de la revisión se explica por qué.
- **El filete lateral de las sesiones.** Las sesiones cuelgan del día del que salen, y el filete dice de quién son sin necesidad de escribir el nombre del día otra vez.

Y un segundo recurso, en la pantalla que más lo necesita: **el número de la racha como cifra, no como indicador**. Alineado a la izquierda, en la misma línea base que sus palabras, sin caja, sin degradado, sin etiqueta en mayúscula encima.

### 1.6 Principios

1. El día es una línea con la fecha en el margen, no una caja. Las cajas son del historial, y ahí sí sirven.
2. Un acento, un trabajo: **esto cuenta**. Y por eso el éxito ya no comparte color con él.
3. La persona escribió el texto: se lee primero, antes que la interfaz que lo rodea.
4. La estructura se cuenta con filetes y alineación, nunca con sombra.
5. **El color solo aparece donde significa algo.** Los neutros van de croma 0 a 3 y el acento de 84: esa asimetría es lo que hace que la paleta no se lea como una plantilla.
6. Sin red se ve peor, nunca peor de usar.

---

## 2. Revisión del plan contra el encargo

El proceso de la skill pide revisar el plan **antes** de construir y decir qué se cambió y por qué. Esta es esa revisión, y es donde el plan pierde bastante.

### 2.1 «Papel y tinta» estaba a un paso del primer valor por defecto

**El riesgo real, y hay que decirlo dos veces porque cambió.** La opción A se parecía a la receta que la skill pone la primera en su lista: fondo cálido, serifa de display de alto contraste, acento terracota. Con `#f3f4f0` y `#2f6b47` ya no era eso —no hay crema, no hay terracota y no hay contraste alto—, pero la *postura* de partida era la misma, y eso no lo arreglaba cambiar dos hex.

**Qué cambié.** Tres cosas. Rechacé la serifa de display y usé la **misma** familia de texto a tamaño grande, que es el movimiento contrario: donde el valor por defecto cambia de familia para el titular, aquí se cambia el tratamiento. Bajé el radio único, quité el degradado y maté la sombra bajo cada tarjeta, con lo que el *kit* se deshacía aunque el papel se pareciera. Y cambié el uso del acento: en vez de adornar, **marca lo que cuenta**.

**Y luego el cliente cambió el acento, y esto empeora el riesgo en vez de mejorarlo.** El verde estaba en el lado correcto de la frontera; el violeta está más cerca del valor por defecto. La skill pone «fondo casi blanco frío con degradado radial y un único acento índigo» como uno de sus rasgos de plantilla, y **un papel frío con un único acento violeta es exactamente esa forma**, sin el degradado pero con todo lo demás. La diferencia real es de tono y de croma: tono 259 frente a los 243 del índigo, y croma 84 frente a 159, así que es un morado sucio y no un azul eléctrico. Pero **no me voy a engañar: por croma, esta paleta está más cerca de la plantilla que la que había antes.**

**Por qué no importa tanto como parece, y por qué sí importa un poco.** Un cliente que elige el tono que ya tenía es un cliente que quiere su producto reconocible, y **eso no es un defecto**: es una decisión legítima sobre la identidad, y la skill misma dice que cuando el encargo fija una dirección, esa gana. Pero el coste se paga en un sitio concreto, y hay que pagarlo a conciencia: **el color es la primera y más fuerte señal de una interfaz**, así que si la paleta se lee como plantilla, el resto tiene que trabajar el doble para compensarlo. Ese resto es lo que hay que defender:

- los filetes en vez de sombras, y **una sola sombra en toda la hoja**;
- la serif, que es la mitad del trabajo de reconocibilidad y no depende del color;
- el registro como **columna de siete días con la fecha en el margen fijo**, un dispositivo que no sale de ningún kit de tarjetas;
- una escala tipográfica corta y un ritmo propio;
- y un acento **sucio**, que es la última defensa: un violeta de croma 84 no es el de la plantilla.

**Lo que sigue siendo relativamente genérico.** Una hoja clara con filetes es también el suelo de cualquier plantilla editorial y minimal. Dentro de la frontera del encargo —cambiar solo la UI, con el DOM congelado— **no veo forma de salir de ahí sin cambiar la estructura**, que es exactamente lo que el cliente ha prohibido. Es una limitación del encargo, no del intento, y el color ahora se le añade como una más.

**Y una nota sobre la frontera, después de haber estado a punto de moverse.** Se llegó a proponer ensancharla una vez, y solo una, para poder avisar de que la fuente no había cargado. Se retiró. La razón de que esta revisión siga siendo entera es precisamente esa: **no se tocó ni el DOM ni la lógica**, así que el argumento de «dentro de la frontera no se puede salir del genérico» sigue siendo el argumento, y no uno recortado por haber cedido por el camino.

### 2.2 El número grande sigue siendo, en el fondo, el gesto por defecto

**El riesgo real.** La skill llama «número grande con etiqueta pequeña» al tratamiento por defecto del hero, y el número de la racha es un número grande. Quitándole la caja, el degradado y el centrado queda: un número grande y sus palabras al lado. Sigue siendo lo mismo.

**Qué cambié.** Quite el marco y lo alineé con el resto del tablero, y quité el centrado, que es lo que lo.convertía en cartel. Las palabras ya no están encima: están en la misma línea base, así que el número se lee como **la primera palabra de una frase** y no como el título de una métrica. Y el rótulo dejó de estar en mayúsculas sostenidas.

**Lo que sigue siendo relativo.** Si el principio 3 manda que ese número sea el centro de la verdad, el número grande no es opcional. La forma de librarse —no tener número grande y escribir «llevas doce días seguidos»— **cambia la estructura**, así que queda como pregunta para el cliente y no se propone aquí.

### 2.3 Los filetes de un píxel también son una moda

**El riesgo real.** Sí: las reglas finas y el aire son el gesto editorial del momento, y no lo voy a disimular.

**Qué cambié.** Puse una condición: **los filetes aparecen donde separan, no alrededor de todo**. El día lleva filete superior porque separa días; la sesión lleva filete lateral porque cuelga de un día; el botón de volver lleva filete porque termina la columna. La tarjeta y el campo no llevan filete doble ni sombra: llevan **cambio de fondo**, que es más barato y menos manierista. Y el margen de ancho fijo hace un trabajo de alineación que un filete decorativo no haría.

**Lo que sigue siendo relativo.** La textura sigue siendo de «página cuidada». Es lo más lejos que llega esta pasada sin tocar la estructura.

### 2.4 La coma sigue siendo una cadena

Cambiar `·` por `,` quita el gesto de plantilla pero **no quita la cadena**: sigue siendo una fila de hechos separados por un signo. La solución de verdad —tres elementos en vez de uno— necesita DOM.

Lo dejo dicho en la spec y **no lo maquillo**: es una mejora pequeña y honesta, y el cliente la ha aceptado (D3).

### 2.5 La regla del selector no tiene nada de este encargo

Lo reconozco tal cual: tratar el selector como identificador de periodo y ajustar su ancho al contenido es lo que haría en cualquier proyecto. Lo único que hice fue **no** dibujar una flecha propia ni convertirlo en una píldora, porque eso añade reglas y platformismo a cambio de nada. La información que aporta —qué semana se está mirando— la da el texto del rango, que ya estaba.

### 2.6 La familia elegida es defendible, no un descubrimiento

Faustina cumple los requisitos y no es la elección de moda, pero después de mirar `Bitter` y `Alegreya` es una **elección sólida**, no un hallazgo. Y como solo se admite una familia, el carácter tiene que salir del tratamiento. Queda dicho en el punto 1.5 porque es la concesión real de la restricción.

### 2.7 Lo que la propuesta de avisar **no** habría cambiado del diseño

La propuesta de avisar se retiró antes de construir, así que aquí no hay nada construido que retirar. Pero conviene dejarlo escrito, porque es la pregunta que se hará: **si el aviso hubiera entrado, ¿habría cambiado el diseño?** No. El aviso era una frase más en el pie, con el mismo estilo que el pie ya tenía: sin icono, sin color, sin recuadro y sin regla nueva. Y la comparación de que el diseño aguanta sin la fuente se hace **exactamente igual** en las dos versiones: el margen de fechas de ancho fijo, las capturas de la misma pantalla con la fuente puesta y sin ella, y la comprobación de que el primer pintado no espera.

Lo único que el aviso habría cambiado es que la app tendría una cosa más que puede romperse y una cosa más que puede mentir. Retirarlo deja el diseño intacto y le devuelve esa margen de fallo.

---

## 3. Qué se toca y en qué orden

De lo que no depende de nada a la documentación. Cada paso deja la app arrancando.

1. **`estilos.css`, bloque `:root` y bloque oscuro.** Los valores nuevos, la escala, el ritmo, las variables nuevas. Los nombres de variable que ya existen **se conservan**: `--sobre-primario` está documentado en `AVANCES.md` y renombrarlo no cambia nada que se vea.
2. **`index.html`, una línea.** El `<link>` de la familia. Sin atributo, sin `onerror`, sin `preload`: nada de lo que se cargue depende de que haya cargado.
3. **`estilos.css`, tipos y superficie.** Escala aplicada, alineación, retirada de mayúsculas sostenidas, fondo plano, sombras.
4. **`estilos.css`, el resumen.** `#lista-dias .dia*` y `#lista-dias .sesion*` acotados a su listado, la cabecera por `id`, el selector, el botón de volver.
5. **`estilos.css`, foco y estados.** El anillo medido, los tres `boton--suave`, los avisos de los formularios.
6. **`estilos.css`, el número de la racha.**
7. **`app.js`, dos cadenas.** `pintarCabeceraResumen` y `pintarHistorial`.
8. **Nada.** Recorrido de los 30 criterios.
9. **Documentación del proyecto.** `AGENTS.md` y `AVANCES.md`.
10. **`docs/constitution.md`, el principio 2.** Solo, al final, porque es lo que cierra la spec y porque es un principio, que solo se cambia en ese archivo.

Cada uno de estos pasos es una tarea de `tasks.md`, y es el mismo orden:

| Paso | Tarea | RF que cubre |
|---|---|---|
| 1 · `:root` y bloque oscuro | **T1** | RF-001, RF-002, RF-003 |
| 2 · El `<link>` de la familia | **T2** | RF-006, RF-007 |
| 3 · Tipografía aplicada y superficie | **T3** | RF-004, RF-005, RF-008, RF-014, RF-015 |
| 4 · El resumen semanal | **T4** | RF-010, RF-011, RF-015, y el final de RF-007 |
| 5 · Foco y estados de los controles | **T5** | RF-012 |
| 6 · El número de la racha | **T6** | RF-009, RF-016 |
| 7 · El separador de la cadena | **T7** | RF-013 |
| 8 · Recorrido de los criterios | **T8** | todos |
| 9 · Documentación del proyecto | **T9** | ninguno |
| 10 · El principio 2 de la constitution | **T10** | ninguno |

Los pasos 3 y 4 se separan porque tocan bloques de reglas distintos de la hoja, y así una regla mal puesta en uno no se lleva por delante al otro. Los pasos 5 y 6 se separan porque `RF-012` es el requisito que el cliente dejó **fuera** de toda esta pasada en su mayor parte, y conviene poder comprobarlo por separado.

**Sobre el orden de T2.** Va segunda porque es la que trae la dependencia externa, y conviene tenerla puesta antes de aplicar la escala: así se depura el CSS con la letra definitiva en pantalla y no con la de reserva. Y **no lleva nada más**: el aviso que se studió se retiró, así que esta tarea no toca `app.js` en absoluto. Lo que hace son **tres líneas** en dos archivos.

**Sobre `RF-013` y `RF-008`.** `RF-008` se verifica repartido: la escala se aplica en T3 y la medida, en T3 y T4. `RF-013` va entero en T7, y **ya no es una tarea descartable**: el cliente la aceptó.

---

## 4. El sistema de tokens, con nombre y valor

Es lo que hace T1. Va aquí, y no en la spec, porque son valores de implementación.

### 4.1 `:root`, modo claro

```css
:root {
  /* Superficies. Croma 0-3: los neutros no llevan matiz de color, solo una
     temperatura fría muy leve para que el violeta no flote sobre ellos. */
  --fondo: #f2f4f5;
  --superficie: #ffffff;
  --superficie-suave: #f6f8f9;

  /* Texto */
  --texto: #212121;
  --texto-suave: #626363;

  /* Filetes: sustituyen a la sombra */
  --borde: #dadadb;
  --regla-tenue: #eaeaeb;

  /* El acento: un solo trabajo, decir que esto cuenta. Violeta de tinta, tono
     259 y croma 84: morado, y sucio. El índigo de la app era tono 243 con croma
     159, y volver a él era lo que el cliente descartó. */
  --primario: #5a3f93;
  --primario-fuerte: #483079;
  --primario-suave: #eee9f7;
  --sobre-primario: #f2f4f5;

  /* El éxito ya no es el acento: pasa a ámbar, el único calor de la app */
  --exito: #855611;
  --exito-suave: #fbf1e2;
  --error: #a52a2a;
  --error-suave: #fbeeee;

  /* Foco: tinta, no halo de color. Hoy no llega a 1,5:1 en claro */
  --foco: #212121;

  /* Familia: aquí se queda la única declaración de font-family de la hoja */
  --fuente: 'Faustina', 'Iowan Old Style', 'Palatino Linotype', Palatino,
            Georgia, 'Times New Roman', serif;

  /* Medida de lectura: por debajo de 80 caracteres */
  --medida: 62ch;

  /* Escala tipográfica */
  --texto-1: 1rem;
  --texto-0: 0.875rem;
  --texto-2: 1.125rem;
  --titulo: clamp(1.75rem, 5vw, 2.5rem);
  --cifra: clamp(2.75rem, 11vw, 4rem);

  /* Ritmo */
  --espacio-1: 0.25rem;
  --espacio-2: 0.5rem;
  --espacio-3: 1rem;
  --espacio-4: 1.5rem;
  --espacio-5: 2.5rem;

  /* Formas y medidas */
  --radio-chico: 6px;
  --ancho: 64rem;
  /* El único alfa de la hoja, y su RGB sigue al de la tinta nueva. */
  --sombra: 0 1px 2px rgba(33, 33, 33, 0.06);

  /* Margen de fechas del resumen: ancho FIJO, no depende de la fuente */
  --margen-dia: 4.25rem;
}
```

**Valoraciones con su alternativa descartada:**

- `--borde` sube un valor en la paleta, `--regla-tenue` baja otro. Dos pesos de filete, porque el peso codifica: filete de contenido contra filete que solo separa.
- `--radio` **desaparece**. Con 16 px era el radio de todo, que es el gesto que la skill marca; y en el reparto nuevo no lo usa nadie. Se elimina de `:root` y del bloque oscuro. *Descartado:* mantenerlo y aplicarlo a la racha, que es usar un valor grande para fingir jerarquía.
- `--sombra` pasa de dos capas a **una**, más corta. La consume un solo sitio. *Descartado:* conservarla y bajarle la opacidad; una sombra casi invisible bajo cuatro cajas sigue siendo la sombra repetida.
- `--ancho` baja de 1080 px a 64 rem porque a 1080 px la columna de texto llega a unos 70 caracteres y la medida nueva es de 62. *Descartado:* no tocarlo y bajar solo `--medida`; la rejilla de `.tablero` no se toca, así que el ancho del contenedor es la única palanca de la medida.
- `--margen-dia` es una variable y no un literal porque es la medida más fácil de afinar en un móvil de 375 px, y porque el criterio 7 la mide.
- El `rgba()` de `--sombra` **es el único alfa de la hoja**, y vive en `:root` como manda `AGENTS.md`.

### 4.2 El bloque oscuro

Reescrito entero, y **solo con declaraciones de variables**: ni un selector, ni una propiedad suelta.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --fondo: #18191b;
    --superficie: #212121;
    --superficie-suave: #2a2a2b;
    --texto: #ebebec;
    --texto-suave: #aaabab;
    --borde: #393939;
    --regla-tenue: #2f2f30;
    --primario: #b39ae0;
    --primario-fuerte: #cdb9f2;
    --primario-suave: #282234;
    --sobre-primario: #18191b;
    --exito: #efbf72;
    --exito-suave: #2f2617;
    --error: #ff9c9c;
    --error-suave: #3a1f1f;
    --foco: #ebebec;
    --sombra: 0 1px 2px rgba(0, 0, 0, 0.4);
  }
}
```

Cuatro cosas que hay que mirar aquí, porque son las que fallan de verdad:

1. **`--sobre-primario` se invierte.** En claro el botón es violeta oscuro con texto claro; en oscuro el violeta se aclara y el texto se oscurece, que es lo que hace falta para que el relleno siga siendo legible. La misma regla, sin una sola línea en el bloque oscuro. **El nombre no se renombra:** `--sobre-primario` está documentado en `AVANCES.md` con su motivo y su historia, y lo que cambia aquí es su valor, no su nombre.
2. **`--regla-tenue` también necesita versión oscura**: un valor claro sobre fondo oscuro desaparece, y un filete que desaparece es una jerarquía que se deshace sola.
3. **No repite ninguna regla.** Si algún selector aparece dentro de este bloque, es un error: el criterio 3 lo detecta.
4. **El texto claro no llega sobre el acento aclarado.** `#ebebec` sobre `#b39ae0` da **2,05:1**, muy por debajo del 4,5:1 que se pide: por eso `--sobre-primario` es `#18191b` —el fondo oscuro— y no el color de texto, que es exactamente lo que hace que en oscuro la cifra siga siendo legible. Es el mismo motivo por el que `AVANCES.md` recoge el caso de `--sobre-primario`, y el motivo por el que esa variable tiene dos versiones. Con el violeta pasa igual que con el verde: **aclarar el acento obliga a oscurecer el texto encima**, y esa es la deuda que paga cada modo con el otro.

5. **Los neutros del modo oscuro también van sin matiz**, y eso es lo que hace que el conjunto no se lea como dos paletas distintas. La prueba es el filete: `--borde` da 1,52:1 contra el fondo y `--regla-tenue` 1,32:1, exactamente la misma distancia relativa que en claro, así que la jerarquía se conserva al invertir el modo.

**Lo que NO se redefin aquí:** `--fuente`, `--medida`, la escala, el ritmo, `--radio-chico`, `--ancho` y `--margen-dia`. Son medidas, no colores: no cambian con el modo. Se declaran solo en `:root`.

---

## 5. Decisiones del plan, con la alternativa descartada

Ninguna de estas estaba abierta: son las decisiones que este plan toma al escribir, y cada una lleva por qué se descartó lo otro.

1. **Los nombres de variable que ya existen se conservan.** La paleta se habla con nombres de la materia en el plan, pero el CSS sigue diciendo `--primario`, `--texto`, `--borde`. *Descartada:* renombrar todo a un vocabulario de paleta, que además de no cambiar nada visible rompe los comentarios que documentan `--sobre-primario` y obliga a repasar 40 reglas sin ganancia.
2. **`font-family` una sola vez, en `body`, por `--fuente`.** Los campos, los botones y el `select` heredan con `font: inherit`. *Descartada:* declarar la familia en cada familia de elementos, que es la forma normal de hacerlo y aquí sería la forma de tener cinco declaraciones que se desincronizan.
3. **La pila de reserva es de serifas locales**, no la del sistema. *Descartada:* `system-ui`, que es la que hay hoy: cambia de golpe a una sans sin serifas al cargar la fuente, y el salto es mucho mayor.
4. **`tabular-nums` no se usa, y el margen es de ancho fijo.** Las cifras tabulares alinearían las fechas con menos código. *Descartada:* porque son **una función de la fuente**: sin conexión el margen se desalinearía solo, que es exactamente el fallo que el criterio 7 prohíbe. Un ancho fijo alinea igual con la fuente puesta y sin ella.
5. **Sin `preload`.** Preload pediría los archivos de la fuente uno a uno en el `index.html`. *Descartada:* porque la familia son **cuatro** archivos y eso serían cuatro URLs fijadas a mano, o sea la misma trampa que con la versión de `sql.js` escrita dos veces. El coste es un primer salto de línea, que `font-display: swap` ya hace aceptable.
6. **Las medidas pedidas a la CDN, no los rangos variables.** Se piden `400`, `600`, `700` y **la cursiva `400`**, que hace falta porque `.sesion__frase` y `.sesion__vacio` la usan. *Descartada:* pedir solo `wght@300..700` a ciegas, porque si la familia no es variable la URL devuelve algo distinto de lo pedido. Se comprueba primero en la respuesta del CDN y, si resulta ser variable, se pide el rango y bajan a dos archivos.
7. **La sombra se queda en `.sesiones`.** Es el único contenedor con `max-height` y `overflow-y`, o sea el único que está truncado. *Descartada:* quitarle toda sombra, que deja la lista cortada sin nada que lo diga; y *descartada también* la veladura en los bordes con `mask-image`, que es un degradado otra vez y además esconde el final de la última fila.
8. **`#resumen-semanal` sigue siendo una regla por `id`.** Es lo que el cliente decidió. Su trabajo cambia: ya no existe el margen negativo que neutralizar, así que ahora gana por especificidad para poner el total de la semana al nivel de titular de la pantalla. *Descartada:* fusionarla con `.resumen` y usar `:nth-of-type`, más frágil y menos legible.
9. **El margen negativo de `.resumen` desaparece.** Existía para pegarse al título de la tarjeta. Con el ritmo nuevo, el título lleva su propio margen abajo y `.resumen` no necesita un valor negativo paracompensarlo. *Descartada:* dejarlo y adjustarlo, que deja el acoplamiento invisible entre dos reglas.
10. **El botón de volver lleva filete arriba y aire**, para que no se lea como un día más. *Descartada:* separarlo con `margin-top` grande, que deja el final de la lista y el botón en la misma línea visual.
11. **Las reglas del resumen van acotadas a `#lista-dias`.** Es lo que separa de verdad los dos niveles sin tocar el DOM. *Descartada:* crear clases `.sesion--resumen` en `pintarDiasSemana`, que es la solución limpia y **exige tocar `app.js`**, que el cliente no ha abierto.
12. **`.marca` y `.rotulo--claro` se quedan, pero como texto tranquilo.** Van a `--texto-suave`, sin mayúsculas y sin `letter-spacing`. *Descartada:* borrarlas del CSS y dejar que salgan con el color del texto: el rótulo de "Tu frase" dejaría de competir con la frase, que es justo lo contrario de lo que quiere.

### Cómo se carga la fuente, y las dos formas descartadas

Sin nada que la fuerce —no hay `onerror`, no hay `document.fonts`, no hay aviso— la forma de cargar la fuente queda libre. Y la libertad se decide aquí, contra la convención del proyecto.

13. **Un `<link>` en `index.html`, y nada en `estilos.css`.**

    **Se descarta `@import` en `estilos.css`, y es la más tentadora de las dos porque dejaría las dos menciones en el mismo archivo.** El motivo es que un `@import` es una petición **encadenada**: la hoja del proyecto no se aplica hasta que la de la fuente resuelva. Traducido: un CDN lento o colgado **frena el estilo de la app entera**, no solo la letra. Con la fuente como recurso decorativo, eso es exactamente la dependencia que el principio 1 no admite y que esta spec no quiere crear. Con un `<link>` en el HTML, las dos peticiones salen **en paralelo**, la hoja propia se aplica igual y el texto aparece de inmediato con la pila de reserva.

    **Se descarta `@font-face` en `estilos.css`, y aquí el motivo es de mantenimiento, no de rendimiento.** Escribir un `@font-face` a mano obliga a **fijar las URL de los archivos de fuente que genera el CDN**, con su número de versión dentro. Esas URL cambian cada vez que el CDN reconstruye los archivos, y cuando cambian **fallan en silencio**: la fuente deja de aplicarse y nadie recibe ningún error, porque la CSS se aplicó bien y el archivo simplemente no está. Es peor que el problema de la versión de `sql.js` escrita en dos sitios: allí la versión la controlamos nosotros y basta con recordar actualizarla en los dos; aquí la escribe un tercero y no podemos fijarla.

    **Lo que se gana con la elección, y es concreto:** la URL de la fuente aparece **una sola vez en todo el proyecto**. No hay ninguna URL de archivo de fuente en nuestro código, porque viven dentro de lo que responde el CDN. Sobre el patrón de `sql.js` —donde la versión está en el `<script>` de `index.html` **y** en `RUTA_SQL_JS` de `app.js`—, esto es una mejora y no una repetición.

    **Lo que queda, que no se puede eliminar:** el **nombre** de la familia aparece **dos** veces, en la URL del `<link>` y en `--fuente`, en dos archivos. No hay forma de evitarlo sin inventar indirección, así que se acota: los dos sitios **se citan en un comentario** y el criterio 10 comprueba que no aparezca un tercero. Y como **no hay detección**, el desajuste es barato: la única consecuencia es que se usa la pila de reserva, que es un estado diseñado y no una mentira. Con el aviso, ese mismo desajuste habría hecho que el pie mintiera sin parar.

    *Descartado:* `<link rel="preload">` con el `onerror` al lado, que era la opción que la propuesta de aviso iba a usar. Queda prohibido por el mismo motivo: sería una tercera mención de la URL y, además, ataría la fuente a la lógica.

14. **Sin nada que fuerce la carga, y sin nada que la vigile.** No hay `onerror` en el `<link>`, ni función de comprobación, ni `setTimeout` de seguridad, ni mención de `document.fonts`. La fuente **no puede retrasar el arranque** porque nadie la espera, **no puede romper nada** porque nada depende de ella, y **no puede hacer mentir al pie** porque el pie no habla de ella.

    Esto es lo que la decisión de no avisar deja **ganado**, y conviene decirlo: sin detección, el número de piezas que pueden fallar baja en uno y el de cosas que pueden mentir también. Una dependencia decorativa que no se vigila es más segura que una que se vigila a medias.

    *Descartado:* el `@font-face` con `font-display: block`, que además de lo anterior bloquearía el texto hasta el tiempo de espera.

---

## 6. Trampas del proyecto que esta pasada toca

- **`pre-wrap` y `overflow-wrap: anywhere` de `.sesion__avances` no se tocan.** De ellos dependen los criterios 10 y 12 de la spec 001, y esta pasada reescribe justo esa regla. Es la trampa más fácil de cometer: la regla «se parece a una tarjeta» invita a limpiarla.
- **`.sesion` la usan los dos listados.** `#lista-sesiones` y `#lista-dias` pintan sesiones con la misma clase. Hoy se distinguen por el contenedor; si se escribe `#lista-dias .sesion` **después** de `.sesion`, gana por especificidad y el historial no se mueve. Si se escribe **antes**, gana `.sesion` y el resumen sigue igual de parecido al historial: es el fallo silencioso.
- **El aviso de la skill sobre especificidades, aquí es literal.** `.dia` y `.dia__sesiones .sesion` se escriben `padding` y `margin` sobre cajas que antes los tenían; si ambos se pisan, el `padding` que gana no es el que se cree. Cada regla que toque `padding` o `margin` de un elemento que ya los tenía, se comprueba en pantalla, no se da por buena.
- **`.resumen` y `#resumen-semanal` se pisan el `margin`.** La regla por `id` gana siempre. Si alguien toca `.resumen` esperando que se mueva `#resumen`, no se mueve.
- **No cambiar `formatearRangoSemana`.** El separador de RF-013 está en `pintarCabeceraResumen`, que llama a esa función. Si el cambio de ` · ` a `, ` toca la función, se rompe el criterio 9 de la spec 001, que compara el rango de la cabecera con el de la opción del selector. **Dos cadenas, una función intacta.**
- **La URL de la fuente vive en un solo sitio**, el `<link>` de `index.html`. La trampa de este trabajo es escribirla dos veces: con un `<link rel="preload">`, con un `@import` en `estilos.css`, o con un `onerror` que la mencione. Cualquiera de las tres cosas convierte una URL en dos, que es la razón por la que `RUTA_SQL_JS` tiene su comentario.
- **Colar la fuente dentro de `estilos.css`.** Como ya no hay nada que la fuerce, no hay ninguna consecuencia visible que empuje a hacerlo mal: nadie ve una diferencia si el `@import` funciona. Y ahí está el problema. Un `@import` ata la hoja propia a la de la fuente, y un `@font-face` a mano ata la fuente a unas URL versionadas que el CDN cambia cuando quiere. **Ninguno de los dos falla de forma visible**, y por eso son los que hay que **prohibir por criterio** y no por costumbre. El criterio 10 los busca por nombre.
- **El nombre de la familia está en dos sitios**, la URL del `<link>` y `--fuente`, en dos archivos. La trampa es que sean **tres**, y la forma más fácil de que pase es añadir un `preload` o un `onerror` «por si acaso». Los dos sitios **se citan mutuamente en un comentario**, y el criterio 10 cuenta las menciones. La consecuencia de que se desincronicen ya no es grave: se usa la pila de reserva. Antes, con el aviso, habría sido ruido permanente en el pie.
- **`sql.js` se deja entero.** Ni su `<script>`, ni su `onerror`, ni `RUTA_SQL_JS`. El nuevo `<link>` se coloca **al lado** de la línea existente, no en su lugar. Y el `onerror` de `sql.js` **no es un molde para la fuente**: es justo el patrón que se descartó, porque mide la hoja de estilos y no la fuente.
- **El `<link rel="icon" href="data:,">` no se quita** ni se sustituye por un icono de fuente.
- **La animación de pantalla se queda.** Se dispara también en la primera carga, sin acción de la persona, y eso no se puede arreglar sin lógica; está anotado en la spec como limitación. Lo que no se puede es añadir más movimiento alrededor. **La comprobación de la fuente no es movimiento**, y no se le puede añadir una transición para que el pie no cambie de golpe: eso sería animar la aparición de un aviso de fallo.
- **`.oculto`, `[hidden]` con su `!important` y el bloque global de `prefers-reduced-motion`** no se tocan: son reglas de las que dependen el arranque, la navegación por teclado y el criterio 14.
- **`font-size: 1rem` en los campos, siempre.** Una web font cambia la altura de línea del control y hace tentador subirla o bajarla. Bajarla devuelve el zoom de iOS.
- **Sin `innerHTML`**, sin referencias por número de línea, y sin tocar `Claves`, `ESQUEMA_SQL`, el objeto `sesion`, ni el orden `fecha DESC, creado_en DESC, id DESC`. Esta pasada no toca `BaseDeDatos`: no añade métodos y no llega a activarse la regla de las dos implementaciones.

---

## 7. Cómo se verifica sin test runner

El proyecto **no tiene test runner ni Node**, y una hoja de estilos tampoco los necesita. Los criterios de la spec se comprueban en el navegador o con la consola de DevTools, y nunca con un runner. Esta sección territorializa cada familia de criterios.

- **Auditoría de literales y de `gradient(`.** Con la app abierta por **doble clic**, `fetch('estilos.css')` **está bloqueado**: el origen de un archivo local es `null` y la petición se rechaza. La auditoría se hace de dos formas, y las dos valen. La primera, sin nada más: búsqueda por expresión en el editor sobre `#hex`, `rgb(`, `rgba(`, `hsl(`, `oklch(` y `gradient(`, y se comprueba que todas las coincidencias caen dentro de los dos `:root`. La segunda, con más potencia: `python -m http.server 8000` en la carpeta —que `AGENTS.md` permite como ayuda de depuración, no como requisito— y entonces en la consola:
  `fetch('estilos.css').then(r => r.text()).then(t => console.log(t.match(/#[0-9a-f]{3,8}|rgba?\(|hsla?\(|gradient\(/gi)))`
  La lista que sale se compara con el contenido de los dos `:root`.
- **Contraste.** Con el selector de color de DevTools, se comprueba el color de texto con el eyedropper y el panel muestra el ratio contra el de debajo. Se hace en claro y en oscuro, con la emulación de `prefers-color-scheme`. Los números de la tabla de RF-002 son el punto de partida; **lo que manda es la medición**.
- **Anillo de foco.** Se mide de la misma manera, y además con navegación por teclado de verdad para confirmar que solo aparece con `:focus-visible`.
- **Modo oscuro solo variables.** Sin servidor: se lee el bloque. Con servidor:
  `Array.from(document.styleSheets[0].cssRules).filter(r => (r.conditionText || '').indexOf('prefers-color-scheme') !== -1)`
  y sobre la regla encontrada, todas las de dentro con `selectorText === ':root'`.
- **Desbordes.** En las herramientas de dispositivo a 480 y a 375:
  `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
  y, si sale `false`, el culpable se localiza con `Array.from(document.querySelectorAll('*')).filter(e => e.getBoundingClientRect().right > window.innerWidth)`.
- **La fuente que cae.** DevTools → Network → Offline y recarga. La app tiene que arrancar, dejar guardar y borrar sesiones, y **no esperar a la fuente**: se comprueba que el primer pintado no se retrasa. Con la fuente puesta se repite todo lo anterior y se **compara**: el criterio es que el margen de fechas siga alineado en los dos casos, y eso se ve en dos capturas de la misma pantalla. Con la fuente bloqueada el texto tiene que **seguir leyéndose bien**, no solo estar presente: esa es la comprobación que sustituye al aviso, y por eso es la que importa.
- **Que no hay nada que vigile la fuente.** Búsqueda por expresión en `app.js` de `setTimeout`, `setInterval`, `document.fonts` y `onerror`: no hay ninguno, y `iniciar()` no ha cambiado. Búsqueda en `index.html` de `onerror` en el `<link>` de la fuente: no lo hay. En `index.html` solo hay un `onerror`, el de `sql.js`, que es el de antes.
- **Que la fuente se carga como se ha decidido.** Búsqueda por expresión en `estilos.css` de `@font-face` y `@import`: **cero** en los dos casos. Búsqueda del nombre del dominio de la fuente en `index.html`, `estilos.css` y `app.js`: **una vez**, en `index.html`. Búsqueda del nombre de la familia en los tres: **dos veces**, en la URL del `<link>` y en `--fuente`. Las tres búsquedas son de un momento y son las que impiden que la forma de carga se vaya por donde no debe.
- **Que el pie no se ha tocado.** En las cuatro situaciones —normal, sin `sql.js`, con `localStorage` bloqueado y **sin la fuente**—, el texto de `#pie-modo` se copia y se compara **carácter a carácter** con lo que dice hoy. La cuarta es la importante: **sin la fuente el pie dice exactamente lo mismo**, y esa es la forma comprobable de «no avisar». Una comparación literal, no una impresión.

- **La hoja se ha parseado bien.** No hay parser en la máquina, pero **el navegador sí es parser**: una llave que falta deja la siguiente regla sin aplicarse y DevTools la marca tachada. La comprobación es que `document.styleSheets[0].cssRules` contiene la lista de selectores que la spec espera, y que al elegir un elemento sus reglas aparecen todas en el panel de estilos.
- **Los modos degradados.** DevTools → Network → Offline cubre «sin `sql.js`», el fallo de arranque y la fuente; `localStorage` bloqueado necesita un navegador con el almacenamiento bloqueado. Los tres se ven en `#pie-modo`, y **ninguno añade una cuarta frase**.
- **Capturas.** Al final, y **no son un adorno**: capturas de las cuatro pantallas en claro y en oscuro, a 1080, 480 y 375 px, con `avances` reales y largos, no texto de relleno. **Y dos del pie**, una con la fuente puesta y otra sin ella, para ver que la diferencia es solo la letra.
- **Al final, relectura.** Se releen las zonas editadas de `estilos.css` y de `app.js` y se balancean llaves y paréntesis a mano. En `app.js` el cambio son dos cadenas de texto: no hay estructura que pueda romperse.

---

## 8. Qué queda fuera de esta pasada

- Los tres puntos de accesibilidad que la validación dejó abiertos: el anuncio al cambiar de semana, el anillo propio del `h1` y la clase BEM para `#resumen-semanal`.
- El DOM entero: ningún `id`, ninguna clase, ningún atributo nuevo. **Y en particular ningún `aria-live` en `#pie-modo`.**
- Toda la lógica de `app.js`, menos las dos cadenas de RF-013. **Y toda detección de si la fuente cargó**, que se studió y se rechazó.
- El formato del rango, y las reglas que la spec 001 ya dejó fuera: truncar avances, añadir métodos en `BaseDeDatos`, claves nuevas, modificar la rejilla.
- Marcar los días sin sesión: decidido que no (D2).
- Repartir la cabecera del resumen en varios elementos, que es lo que arreglaría de verdad la cadena de hechos.
- Una segunda familia, o una fuente local. Y `@font-face` o `@import` en la hoja, que son la versión de meter la fuente dentro de la hoja propia.
- **Todo lo que la skill querría cambiar y que no es UI**: la estructura de las pantallas, el orden, el número de pantallas. Y también, ahora, lo que **sí** es UI pero que la skill querría cambiar y esta pasada deja como está porque el encargo manda: la cadena de hechos y la regla del selector.
- **Lo que queda abierto para el futuro, y hay que dejarlo escrito:** la app no dice nada sobre su tipografía. Si algún día eso molesta, la forma correcta es una decisión nueva con su nombre, su mecanismo y sus criterios —no un `onerror` rápido— y empezando por decidir si merece la pena. Queda anotado en los próximos pasos de `AVANCES.md`.