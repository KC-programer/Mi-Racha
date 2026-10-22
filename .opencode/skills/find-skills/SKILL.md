---
name: find-skills
description: Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.
---

# Buscar skills

Esta skill ayuda a descubrir e instalar skills del ecosistema abierto de skills
para agentes.

## Cuándo usar esta skill

Usa esta skill cuando el usuario:

- Pregunta "¿cómo hago X?", donde X podría ser una tarea común con una skill
  existente.
- Dice "busca una skill para X" o "¿existe alguna skill para X?".
- Pregunta "¿puedes hacer X?", donde X es una capacidad especializada.
- Muestra interés en ampliar las capacidades del agente.
- Quiere buscar herramientas, plantillas o flujos de trabajo.
- Menciona que le gustaría ayuda con un dominio concreto (diseño, pruebas,
  despliegue, etc.).

## ¿Qué es la CLI de skills?

La CLI de skills (`npx skills`) es el gestor de paquetes del ecosistema abierto de
skills para agentes. Las skills son paquetes modulares que amplían las capacidades
del agente con conocimiento, flujos de trabajo y herramientas especializados.

**Comandos clave:**

- `npx skills find [consulta] [--owner <owner>]` - Busca skills de forma
  interactiva o por palabra clave, opcionalmente limitadas a un owner de GitHub.
- `npx skills add <paquete>` - Instala una skill desde GitHub u otra fuente.
- `npx skills update` - Actualiza todas las skills instaladas.

**Explora skills en:** https://skills.sh/

## Cómo ayudar al usuario a encontrar skills

### Paso 1: entender qué necesita

Cuando el usuario pide ayuda con algo, identifica:

1. El dominio (por ejemplo, React, pruebas, diseño, despliegue).
2. La tarea concreta (por ejemplo, escribir pruebas, crear animaciones, revisar
   pull requests).
3. Si la tarea es lo bastante común como para que probablemente exista una skill.

### Paso 2: mirar primero el ranking

Antes de lanzar una búsqueda por CLI, consulta el [ranking de skills.sh](https://skills.sh/)
para ver si ya existe una skill conocida para ese dominio. El ranking ordena por
instalaciones totales, así que saca a la luz las opciones más populares y
probadas.

Por ejemplo, las skills más instaladas para desarrollo web incluyen:

- `vercel-labs/agent-skills` - React, Next.js, diseño web (más de 100 000
  instalaciones cada una).
- `anthropics/skills` - Diseño de front-end, procesamiento de documentos (más de
  100 000 instalaciones).

### Paso 3: buscar skills

Si el ranking no cubre lo que el usuario necesita, lanza el comando de búsqueda:

```bash
npx skills find [consulta] [--owner <owner>]
```

Por ejemplo:

- El usuario pregunta "¿cómo hago mi app de React más rápida?" ->
  `npx skills find react performance`
- El usuario pregunta "¿puedes ayudarme con revisiones de código?" ->
  `npx skills find pr review`
- El usuario dice "necesito crear un changelog" -> `npx skills find changelog`

### Paso 4: verificar la calidad antes de recomendar

**No recomiendes una skill solo por los resultados de búsqueda.** Verifica
siempre:

1. **Número de instalaciones** - Prioriza skills con más de 1000 instalaciones.
   Desconfía de cualquier cosa por debajo de 100.
2. **Reputación de la fuente** - Las fuentes oficiales (`vercel-labs`,
   `anthropics`, `microsoft`) son más fiables que autores desconocidos.
3. **Estrellas en GitHub** - Consulta el repositorio de origen. Una skill de un
   repositorio con menos de 100 estrellas debe tratarse con escepticismo.

### Paso 5: presentar opciones al usuario

Cuando encuentres skills relevantes, preséntaselas al usuario con:

1. El nombre de la skill y qué hace.
2. El número de instalaciones y la fuente.
3. El comando de instalación que puede ejecutar.
4. Un enlace para saber más en skills.sh.

Ejemplo de respuesta:

```
He encontrado una skill que te puede servir. La skill "react-best-practices"
incluye guías de rendimiento de React y Next.js del equipo de ingeniería de
Vercel. (185 000 instalaciones)

Para instalarla:
npx skills add vercel-labs/agent-skills@react-best-practices

Más info: https://skills.sh/vercel-labs/agent-skills/react-best-practices
```

### Paso 6: ofrecer la instalación

Si el usuario quiere continuar, puedes instalarle la skill:

```bash
npx skills add <owner/repo@skill> -g -y
```

El flag `-g` instala de forma global (a nivel de usuario) y `-y` omite los
diálogos de confirmación.

## Categorías habituales de skills

Cuando busques, considera estas categorías:

| Categoría            | Consultas de ejemplo                                |
| -------------------- | --------------------------------------------------- |
| Desarrollo web        | react, nextjs, typescript, css, tailwind             |
| Pruebas              | testing, jest, playwright, e2e                       |
| DevOps               | deploy, docker, kubernetes, ci-cd                    |
| Documentación        | docs, readme, changelog, api-docs                    |
| Calidad de código    | review, lint, refactor, best-practices               |
| Diseño               | ui, ux, design-system, accessibility                 |
| Productividad        | workflow, automation, git                            |

## Consejos para buscar mejor

1. **Usa palabras clave concretas**: "react testing" funciona mejor que solo
   "testing".
2. **Prueba sinónimos**: si "deploy" no devuelve nada, prueba "deployment" o
   "ci-cd".
3. **Mira las fuentes populares**: muchas skills vienen de `vercel-labs/agent-skills`
   o de `ComposioHQ/awesome-claude-skills`.

## Cuando no se encuentra ninguna skill

Si no existen skills relevantes:

1. Dilo con claridad: no se ha encontrado ninguna skill existente.
2. Ofrece ayuda para hacer la tarea directamente con tus capacidades generales.
3. Sugiere que el usuario podría crear su propia skill con `npx skills init`.

Ejemplo de respuesta:

```
Busqué skills relacionadas con "xyz" pero no encontré ninguna coincidencia.
¡Puedo ayudarte con esa tarea directamente! ¿Quieres que proceda?

Si es algo que haces a menudo, podrías crear tu propia skill:
npx skills init mi-skill-xyz
```