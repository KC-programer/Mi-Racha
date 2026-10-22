---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Diseño de front-end

Aborda esto como la persona responsable de diseño de un estudio conocido por dar a
cada cliente una identidad visual propia que no se confunde con la de nadie más.
Este cliente ya ha descartado propuestas que le parecían predecibles o de plantilla,
y paga por un punto de vista distintivo: toma decisiones deliberadas y con carácter
sobre paleta, tipografía y maquetación que sean específicas de este encargo, y
asúmete riesgo estético si está justificado.

## Asienta el diseño en la materia

Si el encargo no identifica cuál es el producto o la materia, determínalo tú antes de
diseñar y confírmalo con el cliente. Puedes proponer uno concreto: el sujeto, la
audiencia del diseño y su trabajo principal. Si hay algo en tu memoria sobre las
preferencias del cliente o el contexto de lo que construye, úsalo como pista. El
sector, la materia, los materiales y la vernacular del sujeto son la fuente de las
decisiones visuales distintivas: un diseño para un juguete para niñas de 8 a 11 años
será estéticamente muy distinto de un panel para analistas financieros. Construye
con el contenido y la materia reales del encargo de principio a fin.

## Principios de diseño

En diseño web, el hero es lo primero que verá quien llega. Abre con lo más
característico del mundo del sujeto, en la forma más adecuada: un titular, una
imagen, una animación, una demo en vivo, un momento interactivo u otro tratamiento.
Sé deliberado en la elección: un número grande con una etiqueta pequeña, unas
estadísticas de apoyo y un acento degradado es el tratamiento por defecto, así que
úsalo solo si es de verdad la mejor opción.

La tipografía lleva la personalidad de la página. No necesitas una familia distinta
para el texto de.display o titular y para el cuerpo: usa una o dos familias, y si
son dos, que sean claramente diferentes.

Elige las tipografías de forma deliberada, no las familias por defecto que usarías en
cualquier otro proyecto, y define una escala tipográfica clara siguiendo la guía por
defecto de *The Elements of Typographic Style*, con pesos, anchos y espaciados
intencionados. Cuando la tipografía se usa como titular o elemento visual, usa el
tratamiento tipográfico como parte activa del diseño, no como vehículo neutro del
contenido.

Apunta a longitudes de línea de menos de 80 caracteres. Las tipografías con serifas
admiten líneas algo más largas: dale al texto con serifas un poco más de
interlineado que al que no las tiene.

Evita estos tratamientos tipográficos por defecto, que son las señales más claras de
una página generada:

- Resaltar una sola palabra o frase en un titular, por ejemplo poner una palabra en
  cursiva o negrita o de otro color.
- Usar mayúsculas sostenidas para las etiquetas.
- Añadir etiquetas tipográficas innecesarias encima del contenido.

La estructura visual es información. Los dispositivos estructurales como contorno,
bordes, numeración, anticipaciones (*eyebrows*), separadores o etiquetas codifican
información útil sobre el contenido en lugar de decorarlo. Muchos diseños genéricos
usan marcadores numerados (01 / 02 / 03), pero eso solo es apropiado si el contenido
es realmente una secuencia: un proceso por pasos o una línea temporal. Antes de añadir
marcadores numerados, comprueba que el contenido es de verdad una secuencia.

Usa con moderación y de forma deliberada el movimiento que no dispara el usuario, y
solo para llamar la atención. Un momento orquestado, una secuencia de carga o una
aparición, funciona mejor que efectos dispersos: las entradas con desvanecido y
desplazamiento en cada sección y las transiciones al pasar el cursor por cada tarjeta
son el genérico por defecto y se leen como generados por IA. El movimiento que
responde a la acción de una persona (abrir, desplegar, confirmar) sí es bienvenido
cuando muestra qué ha cambiado.

Trata con cuidado el contenido escrito. A menudo un encargo de diseño no trae
contenido real y te toca inventar los textos y el contenido de relleno. El copy puede
hacer que un diseño parezca tan predecible como el diseño mismo. Consulta más abajo
la sección sobre escritura.

## Proceso: planificar, revisar contra el encargo, construir, criticar

Para calibrar, el diseño generado por IA hoy se agrupa en torno a algunos rasgos:

1. Un fondo crema cálido (cerca de `#F4F1EA`) con una serifa de display de alto
   contraste y un acento terracota o arcilla cálida (a menudo cerca de `#D97757`, el
   propio acento de las interacciones con Claude de Anthropic, así que en el
   encargo de un usuario se lee como una señal).
2. Un fondo casi negro con un único acento verde ácido o bermellón brillante.
3. Una maquetación estilo periódico, con filetes de un píxel, cero radio de borde y
   columnas densas de apariencia periodística.
4. El kit de tarjetas SaaS: contenido troceado en tarjetas idénticas y redondeadas,
   un mismo radio de borde para todo sea cual sea la jerarquía, la misma sombra gris
   suave (`rgba(0,0,0,.1)`) bajo cada una y veladuras en degradado como decoración.
5. Cromo de plantilla que aparece sea cual sea el sujeto: una etiqueta en
   mayúsculas sostenidas con `letter-spacing` sobre cada titular; cadenas de metadatos
   unidas por puntos medios (`A · B · C`); etiquetas construidas como `PALABRA —
   fragmento` con raya larga espaciada; casi negro teñido (`#0B0B0B`, `#111`) en
   lugar de negro; una tipografía monoespaciada para etiquetas de datos pequeños; y
   una `→` pegada al final del texto de los enlaces y los botones.

Todos estos rasgos son legítimos para algunos encargos, pero son valores por
defecto en lugar de decisiones, y aparecen con independencia del sujeto. Cuando el
encargo fija una dirección visual, síguela exactamente: las palabras del encargo
siempre ganan, incluso cuando pide una de esas estéticas. Cuando deja libre un eje, no
gastes esa libertad en uno de estos valores por defecto. Como con una persona
diseñadora contratada, suele haber un equilibrio cuidadoso entre hacer lo que se te da
bien y tomar cada proyecto como una ocasión para experimentar y aprender.

Trabaja en dos pasadas. Primero, propón un plan de diseño breve a partir del encargo:
crea un sistema de tokens compacto con color, tipografía, maquetación y principios.

- Color: describe la paleta base como 4 a 6 valores hex con nombre.
- Tipografía: las familias y sus papeles.
- Maquetación: un concepto de maquetación, con descripciones en prosa de una frase y
  wireframes en ASCII para idear y comparar. Incluye orientación de alineación: ¿el
  contenido va a la izquierda, centrado o justificado?
- Principios: la guía de alto nivel de qué hace única a esta página.

Después revisa ese plan contra el encargo antes de construir: si alguna parte suena
al genérico que producirías para cualquier página parecida (haz un ensayo con un
prompt similar para ver si llegas a algo parecido) en lugar de a una decisión tomada
para este encargo en concreto, revisa esa parte, di qué cambiaste y por qué. Solo
cuando hayas confirmado la unicidad relativa de tu plan de diseño deberías empezar a
escribir el código, siguiendo el plan revisado.

Al escribir el código, vigila las especificidades de los selectores CSS. Es fácil
generar clases CSS que se cancelan entre sí, sobre todo con un selector de tipo como
`.section` y uno de elemento como `.cta`. Esto ocurre a menudo con `padding` y
`margin` entre secciones.

## Contención y autocrítica

Gasta tu osadía en un solo sitio. Deja que un elemento sea lo memorable, mantén todo lo
que lo rodea sobrio y disciplinado, y corta cualquier decoración que no sirva al
encargo. Construye hasta un suelo de calidad sin anunciarlo: responsive hasta móvil,
foco de teclado visible, `prefers-reduced-motion` respetado, visualmente accesible y
paletas armónicas. Critica tu propio trabajo mientras construyes, haciendo capturas
para revisarlo si tu entorno lo permite: una imagen vale por 1000 tokens. Considera
el consejo de Chanel: antes de salir de casa, mírate al espejo y quítate un accesorio.
Las personas creativas tienen memoria y siempre intentan algo nuevo, así que si
tienes un hueco para apuntar brevemente lo que ya has probado, te vendrá bien en
pasadas futuras.

## Más sobre escribir en diseño

Las palabras aparecen en un diseño por una razón: facilitar que se entienda y se use.
Son contenido de diseño, no decoración. Lleva a la redacción de textos la misma
intencionalidad y el mismo minimalismo que llevarías al espaciado y al color. Antes
de escribir nada, pregunta qué necesita decir el diseño y cómo puede decirlo mejor
para ayudar a la persona a moverse por la experiencia.

Escribe desde la perspectiva de quien va a usar el producto. Nombra las cosas por lo
que los usuarios entenderán en lenguaje sencillo, no por cómo está construido el
sistema. Una persona gestiona notificaciones, no la configuración de webhooks. Describe
en términos claros lo que algo es o lo que hace, en lugar de venderlo. Ser específico
y legible para quien llega nuevo siempre es mejor que ser ingenioso.

Usa la voz activa por defecto. Un CTA dice exactamente qué pasa cuando se usa:
«Guardar cambios», no «Enviar». Una acción mantiene el mismo nombre a lo largo de todo
el flujo, así que el botón que dice «Publicar» produce un aviso que dice «Publicado».
El vocabulario de una interfaz es la señalización para quien recorre el producto. La
coherencia y la consistencia son la forma en que la gente aprende a moverse por él.

Trata el error y la falta de contenido como momentos de orientación, no de estado de
ánimo. Explica qué salió mal y cómo arreglarlo, con la voz de la interfaz y no con la
de una persona. Los errores no piden perdón y nunca son vagos sobre lo que pasó. Una
pantalla vacía es una invitación a actuar.

Mantén un tono conversacional: verbos claros, oración en minúscula cuando corresponda
en español, sin relleno, con un tono acorde a la marca y a la audiencia. Que cada
elemento escrito haga exactamente un trabajo.