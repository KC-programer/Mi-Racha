# AVANCES.md - Mi Racha · Control de estudio diario

Memoria y reporte de avances entre sesiones. No más de 75 líneas: lo que no aporte se va.

## Estado actual

Invariantes: lo que no se toca sin querer, con el antes y el después.

- **Hoy hay cuatro pantallas.** La cuarta, el resumen semanal, se entra desde la
  tarjeta de historial y vuelve al tablero sin repintarlo, para que sobrevivan el
  scroll del listado y los valores del formulario.
- **El historial muestra solo las 5 sesiones más recientes.** Se limita a 5 en
  `pintarHistorial` usando `.slice(0, 5)` sobre `BaseDeDatos.listar()`, que sigue
  trayendo todas las sesiones para racha y resumen semanal. Las sesiones más
  antiguas se conservan guardadas pero no aparecen en el listado principal.
- **El resumen semanal se filtra en el cliente** sobre `BaseDeDatos.listar()`: sin
  consulta nueva, sin método nuevo en `BaseDeDatos` y sin clave nueva en
  `localStorage`, así que los modos degradados no se tocan. La semana elegida es
  estado en memoria: al reabrir, la última semana cerrada con actividad.
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
  `color: #fff` daba 6,29:1 en claro pero 2,98:1 en oscuro. Ahora es
  `--sobre-primario`, blanca en claro y `#171a23` en oscuro (5,83:1).
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
- **D6 · Minutos duplicados en el resumen:** excepción al RF‑009 de la spec 001. Si una sola sesión en el día → se muestra solo el total; si hay dos o más sesiones → total + cada sesión muestra su tiempo. Se registra porque rompe un RF de una spec anterior, pero se paga a cambio de quitar redundancia visible. Queda registrado en `specs/002-pasada-visual/spec.md` y aquí, con el coste de excepción a un RF validado.

## Aprendizajes y errores a evitar

- **Diseñar antes de integrar obliga a estilos en movimiento:** por eso la pasada con `frontend-design` va separada.
- **"No recortar avances" se vigila por el argumento, no por el nombre:** `slice` está en `fechaLegible` y `BaseDeDatos.listar` respaldo; el grep delata el método.
- **Confundir "semana cerrada" con la en curso** es error fácil: la semana en curso cambia l-d, la cerrada no se resume hasta la siguiente; usan claves `AAAA-MM-DD`, nunca `Intl`.
- **Olvidar un `class` deja la regla CSS sin aplicar:** pasó con `<ol id="lista-dias">` y `.dias`; la regla existe pero ningún elemento la toma.
- **El selector de interfaz nunca lleva `disabled`:** su ausencia es información, no descuido.

## Próximos pasos

- **T9:** Manual de verificación en navegador — al carecer el proyecto de test runner automatizado, la única verificación real es abrir `index.html` y recorrer las 4 pantallas, probar el camino feliz y errores, desconectar internet para verificar modo degradado, guardar sesiones y confirmar persistencia de racha y modo.
- **T10:** Consideraciones de compatibilidad y degradados — la app debe funcionar en los tres escenarios degradados (sin `sql.js`, sin `localStorage`, fallo arranque SQLite). El modo claro se mantiene mediante variables CSS locales y el pie avisa siempre del modo en uso. No se añaden build, `package.json` ni pasos de compilación.
- **La app falla en silencio si el arranque no termina:** en `iniciar()` el pie, el resumen y `conectarEventos()` van después de `await BaseDeDatos.iniciar()`; si el JS no carga, el CDN de `sql.js` se cuelga
  o el `.wasm` no llega, quedan un botón muerto y un pie vacío, y el `<noscript>` solo cubre JavaScript desactivado. Aplazado a la próxima.
- **`BaseDeDatos.nombreModo()` no se llama desde ningún sitio** y devuelve `'modo de respaldo'`, que no es el texto que usa el pie: decidir si se borra o se usa de verdad (ver trampa 10 de `AGENTS.md`).
- **`pintarHistorial` ignora su parámetro** y vuelve a llamar a `BaseDeDatos.listar()`; el resumen mezcla el recuento recortado (máximo 5) con los minutos de todas las sesiones, y puede leerse como "5 sesiones, 40 h" con muchas más guardadas. Decidir cuál es el texto correcto.