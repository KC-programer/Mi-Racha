---
name: local-dates
description: Úsala siempre que escribas, modifiques o revises código que trabaje con fechas, días, semanas o rachas del proyecto Mi Racha.
---

# Fechas locales

Las fechas pueden ser una fuente de bugs. Sigue esta guía siempre que trabajes con código con fechas.

## Reglas

- Las fechas se guardan como texto `"AAAA-MM-DD"` en la zona horaria local del
  usuario. Se comparan y se ordenan **como texto**, así que los ceros a la
  izquierda no son opcionales: un día sin `padStart` se cuela en el orden y
  rompe la racha.
- Para obtener el día de hoy, construye el texto con `claveDeHoy()`. **Nunca**
  con `new Date().toISOString().slice(0, 10)`: `toISOString()` devuelve UTC, así
  que a partir de las 22:00, o en cualquier zona por detrás de UTC, devuelve el
  día **siguiente**.
- De `Date` a texto, solo con los getters locales, como hace `claveFecha`:
  `getFullYear()`, `getMonth() + 1` y `getDate()`. `getMonth()` va de 0 a 11,
  así que sin el `+1` todos los meses salen desplazados. Para texto que se
  muestra, usa `fechaLegible()`, que va por `toLocaleDateString`.
- Suma días con `moverDias(clave, cantidad)`, que reconstruye la fecha con
  `new Date(año, mes - 1, día + cantidad)`. **Nunca sumes 86 400 000
  milisegundos**: un día no siempre dura 24 h, y el resultado se descoloca una
  sesión al día alrededor del cambio de hora.
- **Nunca construyas una fecha desde una cadena ISO.** `new Date("2026-03-05")`
  significa medianoche **UTC** por especificación, no local: en una zona `+02:00`
  sus getters locales ya devuelven el día **4**. Desde piezas, usa
  `new Date(año, mes - 1, día)`, que sí es hora local.
- `creado_en` es hora local, no UTC: se arma con `claveFecha(creado)` más
  `getHours()`, `getMinutes()` y `getSeconds()` con `padStart`. Si lo sustituyes
  por `toISOString()`, rompes el orden `fecha DESC, creado_en DESC, id DESC`, que
  tiene que ser idéntico en SQL y en el modo de respaldo.
- El día de una sesión es el **calendario local del usuario**, no el de UTC:
  cuenta la clave `fecha` que eligió, no `creado_en`. Por eso una sesión de las
  00:30 suma al día en curso y no al anterior.
- Las fechas futuras están bloqueadas en dos sitios y **tienen que seguir en los
  dos**: `campoFecha.max` en `prepararFormularioSesion` y
  `if (fecha > claveDeHoy())` en el submit. El `max` solo protege el selector
  nativo, así que el texto necesita su propia comparación.

## Checklist de revisión
- [ ] ¿Algún toISOString() o new Date("AAAA-MM-DD")?
- [ ] ¿Algún cálculo con 86400000 milisegundos?
- [ ] ¿Qué pasa con una sesión registrada a las 00:30?
- [ ] ¿Qué pasa el día del cambio de hora (último domingo de marzo y de octubre)?
- [ ] ¿Se ignoran las fechas futuras donde corresponde?
- [ ] ¿Se relee `claveDeHoy()` al recalcular, en vez de cachear un "hoy" que caduca al cruzar medianoche?

## Al terminar
Indica qué puntos del checklist has comprobado y cómo.