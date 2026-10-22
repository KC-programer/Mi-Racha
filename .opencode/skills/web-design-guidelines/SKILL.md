---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <archivo-o-patrón>
---

# Directrices de interfaz web

Revisa archivos para comprobar el cumplimiento de las Web Interface Guidelines.

## Cómo funciona

1. Descarga las directrices más recientes desde la URL de origen de abajo
2. Lee los archivos indicados (o pide al usuario los archivos o el patrón)
3. Comprueba todas las reglas de las directrices descargadas
4. Devuelve los hallazgos en el formato conciso `archivo:línea`

## Origen de las directrices

Descarga directrices frescas antes de cada revisión:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Usa WebFetch para obtener las reglas más recientes. El contenido descargado
contiene todas las reglas y las instrucciones de formato de salida.

## Uso

Cuando el usuario aporte un argumento de archivo o patrón:

1. Descarga las directrices desde la URL de origen anterior
2. Lee los archivos indicados
3. Aplica todas las reglas de las directrices descargadas
4. Devuelve los hallazgos usando el formato que especifican las directrices

Si no se indica ningún archivo, pregunta al usuario cuáles quiere que revises.