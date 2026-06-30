# monitor-anaquel — Brief

> Este es el resumen de tu proyecto tal como lo confirmaste en raicode.ai.
> Vive en la raíz de la carpeta del proyecto como referencia rápida.
> Si necesitas las reglas de comportamiento de Claude, ve a `CLAUDE.md`.

## La idea

Tomar fotos de anaqueles en tiendas y usar AI para identificar productos, precios propios y de competencia, y nivel de exhibición

## Para quién

Enrique y su equipo de ventas de tés e infusiones en tiendas físicas

## Cómo lo hacen hoy (status quo)

Toman fotos manualmente y usan Pabis Teamcore para inventario, pero no hay conexión entre fotos, precios y ventas

## Qué duele del proceso (pain point superficial)

El producto frecuentemente está en bodega sin exhibir, los precios de competencia se monitorean a mano, y no hay forma de correlacionar exhibición con ventas

## Qué cuesta eso al usuario (pain impact)

No pueden medir cuánto les cuesta tener producto en bodega vs exhibido, ni tomar decisiones con datos sobre dónde y cómo exhibir para vender más

## MVP (punto de partida)

Subir una foto de anaquel y que la app identifique automáticamente los productos visibles, sus precios, y si hay tés de la marca en exhibición o no

## Guarda información

Sí — el proyecto guarda datos (usamos Supabase)

## Referencias / inspiración

Power BI / Looker — dashboards visuales con datos claros

## Privacidad

🔒 **App privada** — guarda info que solo el dueño o personas específicas deberían ver. Requiere auth (login con usuarios) configurado antes del deploy a Vercel.
