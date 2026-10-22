# Constitution · Mi Racha

Principios innegociables. Toda spec, plan y tarea los cumple; si una
funcionalidad los contradice, se cambia la funcionalidad, no el principio.
Aquí no van convenciones de código ni estado del proyecto: eso vive en
`AGENTS.md` y en `AVANCES.md`.

**1. Abre con doble clic.**
La app se usa con doble clic en `index.html`, sin instalar nada ni levantar servidor.
El paso previo se paga cuando el usuario menos ganas tiene: lo que exija build,
servidor o `npm install` no es una función, es otro producto.

**2. Los datos no salen del navegador.**
Sin cuentas, sin servidor, sin sincronización, sin telemetría. La única red es
descargar `sql.js`.
Lo que se guarda es un registro privado del esfuerzo y de la motivación: en
cuanto sale, cambia lo que el usuario está dispuesto a escribir.

**3. La racha no miente.**
El número mostrado es exactamente el de días consecutivos con al menos una
sesión, terminado hoy o ayer. Nunca se redondea ni se estima.
Una racha vale por ser un hecho; si puede halagar, deja de ser información. Es
la razón de la hora local y de que un día con varias sesiones cuente una vez.

**4. Funciona sin conexión, y lo dice.**
Los modos degradados responden igual que el normal, con la misma forma de
datos, y el pie avisa de cuál está en uso.
Estudiar sin cobertura no puede ser el motivo para perder el avance: cada
camino de datos nuevo necesita su alternativa sin red con la misma respuesta.

**5. Cuatro pantallas, una pregunta cada una.**
Inicio, intención, tablero y resumen semanal. Cada una responde una cosa y solo una.
El valor está en capturar en cinco segundos: cada campo y cada pantalla tributan de
ese momento, y una pantalla nueva solo entra con un argumento más fuerte que
«estaría bien»: responder a una pregunta que ninguna de las demás responde.

**6. Declara su estado real.**
El pie dice qué base de datos usa, los avisos se anuncian y los errores nunca
se tragan en silencio.
Degradar en silencio enseña a desconfiar de todo lo que la app muestra. Nada
de `catch` mudo: o se comunica, o no se captura.

**7. Accesible de serie.**
Teclado, foco visible, contraste suficiente, `aria-live` en los avisos, y
cada elemento nuevo con su etiqueta.
Esto se usa de noche, cansado y con una mano en el móvil. La accesibilidad no
es un extra que se añada al final.

**8. Todo en español.**
Código, identificadores, comentarios, textos de interfaz y documentos.
El código a medio traducir se paga en atención, y esa atención es del usuario.
Nada de identificadores en inglés «temporalmente».

## Cómo se usa

- Cada principio lleva su **por qué** porque es lo que decide cuando dos reglas
  chocan: sin él, quien llegue después elige la que le parezca.
- Si una regla de `AGENTS.md` contradice un principio, **manda el principio**.
- Un principio **solo se cambia aquí**, y solo cuando aquello que protege deja
  de existir. El antes y el después se anotan en `AVANCES.md`.
- No crece: si un principio no cabe en dos líneas, probablemente no es un
  principio.