# AVANCES.md - Mi Racha · Control de estudio diario

Memoria y reporte de avances entre sesiones. No más de 75 líneas: lo que no aporte se va.

## Estado actual

- **Hoy hay cuatro pantallas.** La cuarta, el resumen semanal, se entra desde la
  tarjeta de historial y vuelve al tablero sin repintarlo, para que sobrevivan el
  scroll del listado y los valores del formulario.
- **La cabecera es un bloque de esquinas rectas:** selector de modo arriba a la
  izquierda, frase centrada y más grande, y «Cambiar frase» abajo a la derecha.
  El pie ya solo dice la base de datos.
- **El tablero va en una sola columna:** la racha con la cifra a la izquierda y
  «Día de racha» con la nota a la derecha; después «Nueva sesión» a todo el ancho,
  con fecha y minutos a la izquierda y avances a la derecha; y el historial debajo.
- **El historial muestra solo las 5 sesiones más recientes.** `pintarHistorial`
  recorta con `.slice(0, 5)` lo que le pasa `pintarTodo`; el resumen cuenta todas
  las guardadas para que «en total» no mienta.
- **El resumen semanal se filtra en el cliente** sobre `BaseDeDatos.listar()`: sin
  consulta ni método nuevos ni clave de `localStorage`, así que los modos degradados
  no se tocan. La semana elegida es estado en memoria: la última cerrada con actividad.
- **Está publicada en GitHub Pages:** <https://kc-programer.github.io/Mi-Racha/>.
  Se abre con doble clic en el ordenador o con esa URL en el móvil.
- **El estado vive en el `localStorage` de cada navegador y cada origen.** Lo
  guardado en el móvil no aparece en el ordenador ni al revés, y lo guardado
  desde `file://` no se hereda al publicar: son almacenes distintos.

## Decisiones y sus razones

- Un comentario responde a **"por qué"**, no a **"qué"**. El "qué" es trabajo del
  código, y uno que lo repite acaba mintiendo en cuanto la línea cambia: se documenta
  el porqué de una decisión, la trampa y el contrato con otro archivo. Por eso
  `calcularRacha` se queda sin comentarios en el cuerpo: su banner ya declara las tres
  reglas y el código las transcribe.
- `app.js` lleva 6 capas y el índice de su cabecera las lista las seis, para que
  un comentario no vuelva a mentir sobre el archivo que lo contiene.
- **El texto que va sobre una variable de color necesita su propia variable.**
  El mismo tono se invierte entre modos, así que un literal se queda corto:
  `color: #fff` daba 6,29:1 en claro pero 2,98:1 en oscuro. Ahora manda
  `--sobre-primario`, beige cálido en claro y casi negro en oscuro, legible en ambos.
- **`AGENTS.md` ancla el código por nombre, nunca por número de línea.** Se
  intentó al revés y falló dos veces en una sola sesión (+23 y +2 líneas
  descolocaron 19 referencias): un número viejo no avisa de que lo está y manda
  al sitio equivocado en silencio.
- **La documentación se reparte en tres, sin solaparse.** `AGENTS.md` es el
  *cómo*, `docs/constitution.md` el *qué* y `AVANCES.md` el *estado*. La
  constitution no repite reglas de `AGENTS.md` porque dos documentos
  autoritativos se contradicen al envejecer. Si chocan, manda el principio.
- **El principio 5 pasó de "tres pantallas" a "cuatro".** Antes era una reserva: la
  cuarta pantalla necesitaba un argumento más fuerte que «estaría bien». Lo trajo el
  resumen semanal, que responde a qué se reportó en total la última semana cerrada,
  una pregunta que el tablero no puede responder sin mezclar la vista diaria con la
  agregación semanal. La frase dejó de ser una excepción y pasó a ser la regla.
- **D5 · Principio 2 de la constitution:** se reescribe para que ya no afirme que la única red es `sql.js`; ahora nombra la tipografía como segunda descarga y dice que ninguna de las dos transporta un dato. Se justifica porque la fuente es realce visual, no camino de datos; un aviso que no se pueda detectar sería una mentira. Se anota el antes y el después en `specs/002-pasada-visual/spec.md` y aquí.
- **D6 · Minutos duplicados en el resumen:** excepción al RF‑009 de la spec 001. Si una sola sesión en el día → se muestra solo el total; si hay dos o más sesiones → total + cada sesión muestra su tiempo. Se registra porque rompe un RF de una spec anterior, pero se paga a cambio de quitar redundancia visible. Queda registrado en `specs/002-pasada-visual/spec.md` y aquí, con el coste de excepción a un RF validado.
- **El modo elegido manda sobre el sistema.** `modo-claro` y `modo-oscuro`
  definen la paleta completa; el `@media` solo pinta el arranque. Faltaba la
  clase oscura y el modo guardado podía contradecir la pantalla.
- **D7 · Principio 6 sin aviso de degradación.** Antes: «los avisos se anuncian»;
  ahora: memoria sin aviso y pie solo con la base de datos; cerrar borra sin avisar.
- **D8 · Arranque acotado sin aviso.** `BaseDeDatos.iniciar()` corre `initSqlJs` contra un `Promise.race` de 10 s por intento: un `fetch` colgado antes dejaba el pie vacío y los botones muertos para siempre. El cliente eligió 10 s también para el reintento, sin texto provisional (el pie sigue vacío hasta los 20 s) ni aviso aparte; no hubo spec porque es arreglo del arranque, no función nueva.
- **D9 · `nombreModo()` manda en el pie.** Antes `iniciar()` decidía el texto con un ternario y el método devolvía «modo de respaldo», que no coincidía con lo visible. Ahora `iniciar()` llama a `BaseDeDatos.nombreModo()`, que devuelve `respaldo`: una sola fuente, mismo texto carácter a carácter y sin la redacción divergente.

## Aprendizajes y errores a evitar

- **Diseñar antes de integrar obliga a estilos en movimiento:** por eso la pasada con `frontend-design` va separada.
- **"No recortar avances" se vigila por el argumento, no por el nombre:** `slice` está en `fechaLegible` y `BaseDeDatos.listar` respaldo; el grep delata el método.
- **Confundir "semana cerrada" con la en curso** es error fácil: la semana en curso cambia l-d, la cerrada no se resume hasta la siguiente; usan claves `AAAA-MM-DD`, nunca `Intl`.
- **Olvidar un `class` deja la regla CSS sin aplicar:** pasó con `<ol id="lista-dias">` y `.dias`; la regla existe pero ningún elemento la toma.
- **El selector de interfaz nunca lleva `disabled`:** su ausencia es información, no descuido.
- **Un texto visible delata lo que la lógica no fuerza:** el selector habría mentido sobre el modo real; la etiqueta obligó a cerrar el hueco.

## Próximos pasos

- **Pendiente para V2 · `app.js` no carga y la app se queda sin arranque:** si el archivo falta o tiene un error de sintaxis, no se registra `DOMContentLoaded` y ningún código de `app.js` puede remediarlo; lo resolverá la idea prevista para la V2.