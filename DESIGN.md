# DESIGN.md — monitor anaquel

Design system v1. Generado por /design-consultation el 2026-06-30.
Esta es la fuente de verdad para todas las decisiones visuales del proyecto.

---

## Estetica

**Industrial / Utilitario** — herramienta de trabajo de campo, no app de consumo.
La UI debe comunicar precision, velocidad y confianza. Nada decorativo que no aporte
informacion. El dato es el protagonista; la interfaz es el soporte.

Referencia visual: dashboards de auditoria + apps de inventario de campo.

---

## Palette

| Token | Hex | Uso |
|-------|-----|-----|
| `--c-accent` | `#0F766E` | CTAs primarios, badges de exito, links activos |
| `--c-accent-hover` | `#0D6460` | Hover/pressed de accent |
| `--c-accent-subtle` | `#CCFBF1` | Fondos de chips "tu marca", highlights sutiles |
| `--c-bg` | `#FAFAF9` | Fondo de toda la app |
| `--c-surface` | `#FFFFFF` | Cards, modales, inputs, action bars |
| `--c-text` | `#1C1917` | Texto principal |
| `--c-text-muted` | `#78716C` | Texto secundario, labels, metadatos |
| `--c-border` | `#E7E5E4` | Bordes de separacion suave |
| `--c-border-strong` | `#D6D3D1` | Bordes de inputs, divisores fuertes |
| `--c-success` | `#15803D` | "EXHIBIDA", estados positivos |
| `--c-success-bg` | `#DCFCE7` | Fondo de alertas de exito |
| `--c-warning` | `#B45309` | "NO EXHIBIDA", advertencias |
| `--c-warning-bg` | `#FEF3C7` | Fondo de alertas de advertencia |
| `--c-error` | `#DC2626` | Errores, fallos de analisis |
| `--c-error-bg` | `#FEE2E2` | Fondo de alertas de error |
| `--c-overlay` | `rgba(28,25,23,0.5)` | Fondos de modales/drawers |

### Modo oscuro

| Token | Hex oscuro |
|-------|------------|
| `--c-bg` | `#0C0A09` |
| `--c-surface` | `#1C1917` |
| `--c-accent` | `#0D9488` |
| `--c-accent-subtle` | `#042F2E` |
| `--c-text` | `#F5F5F4` |
| `--c-text-muted` | `#A8A29E` |
| `--c-border` | `#292524` |
| `--c-border-strong` | `#44403C` |
| `--c-success-bg` | `#052E16` |
| `--c-warning-bg` | `#451A03` |
| `--c-error-bg` | `#450A0A` |

---

## Typography

### Fuentes

| Rol | Familia | Peso(s) | Uso |
|-----|---------|---------|-----|
| Display | Plus Jakarta Sans | 700, 800 | Indicadores (EXHIBIDA/NO EXHIBIDA), titulos de pantalla |
| Body / UI | DM Sans | 400, 500, 600 | Cuerpo, listas, botones, labels, inputs |

Cargar desde Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
```

### Escala de tipo

| Token | Familia | Peso | Tamano | Uso |
|-------|---------|------|--------|-----|
| `text-display-xl` | Plus Jakarta Sans | 800 | 40px / lh 1.1 | Indicador EXHIBIDA/NO EXHIBIDA |
| `text-display-lg` | Plus Jakarta Sans | 700 | 24px / lh 1.2 | Nombre de tienda + fecha en encabezados |
| `text-display-md` | Plus Jakarta Sans | 600 | 18px / lh 1.3 | Subtitulos de seccion |
| `text-body` | DM Sans | 400 | 15px / lh 1.6 | Texto de cuerpo, descripciones |
| `text-ui` | DM Sans | 500 | 15px | Botones, labels de inputs |
| `text-label` | DM Sans | 500 | 12px / ls 0.04em / uppercase | Labels de seccion, chips |
| `text-caption` | DM Sans | 400 | 12px | Metadatos, timestamps, textos de apoyo |
| `text-data` | DM Sans | 400 | 14px / tabular-nums | Precios, numeros alineados |

**Numero = tabular-nums siempre.** Usar `font-variant-numeric: tabular-nums` en cualquier
celda que muestre precios, conteos, o porcentajes para que los valores se alineen verticalmente.

---

## Spacing

Base: **4px**. Solo estos valores son validos — no pixel-hunting entre ellos.

| Token | Valor | Uso tipico |
|-------|-------|------------|
| `space-1` | 4px | Gap entre elementos inline |
| `space-2` | 8px | Padding interno de chips, gap entre icon+label |
| `space-3` | 12px | Padding vertical de filas de lista |
| `space-4` | 16px | Padding lateral de pantalla, gap entre cards |
| `space-6` | 24px | Separacion entre secciones |
| `space-8` | 32px | Margen entre bloques mayores |
| `space-12` | 48px | Altura minima de touch targets, separadores de pantalla |
| `space-16` | 64px | Padding de pantalla completa, separadores grandes |

**Touch targets minimo: 48px** de alto en todos los elementos interactivos.
En mobile: botones principales tienen 52px para ser mas faciles de presionar.

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--r-sm` | 4px | Tags, badges pequenos, skeleton |
| `--r-md` | 8px | Botones, inputs, alertas |
| `--r-lg` | 12px | Cards, modales, bottom sheets |
| `--r-pill` | 9999px | Chips de estado, avatares, toggles |

---

## Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,.06)` | Cards sutiles en surface |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,.1)` | Modales, dropdowns |
| `--shadow-lg` | `0 24px 48px rgba(0,0,0,.18)` | Bottom sheets |

En modo oscuro: reducir opacidad de sombras un 50% — el contraste ya lo da el fondo.

---

## Motion

**Principio: intencional-funcional.** Cada animacion ayuda al usuario a entender
que cambio y por que, no decora.

| Token | Valor | Uso |
|-------|-------|-----|
| `--dur-fast` | 150ms | Hover states, focus rings |
| `--dur-base` | 200ms | Transiciones de estado, chips |
| `--dur-slow` | 300ms | Modales, bottom sheets |
| `--ease-out` | `cubic-bezier(0.0, 0, 0.2, 1)` | Easing estandar |

**Skeleton shimmer** — siempre durante carga de analisis (10s tipicos):
```css
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--c-border) 25%, var(--c-border-strong) 50%, var(--c-border) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## Componentes — Patrones establecidos

### Indicador de exhibicion

El dato mas importante de la app. Tipografia display-xl, color semantico.

```html
<!-- Exito -->
<p class="text-display-xl text-success">EXHIBIDA</p>
<!-- Fallo -->
<p class="text-display-xl text-warning">NO EXHIBIDA</p>
```

Siempre acompanado de chip de confianza inmediatamente debajo.

### Chips de estado

```html
<span class="chip chip-own">Tu marca</span>      <!-- --c-accent-subtle / --c-accent -->
<span class="chip chip-comp">Competencia</span>  <!-- --c-surface / --c-text-muted + border -->
<span class="chip chip-conf">Confianza: Alta</span>
```

### Botones

| Variante | Cuando usar |
|----------|-------------|
| `btn-primary` | Una sola accion principal por pantalla (Analizar, Compartir) |
| `btn-secondary` | Accion alternativa (Nueva foto, Cancelar) |
| `btn-ghost` | Links de navegacion (Ver historial) |

Minimo 48px de alto. En action bars full-width, el primario ocupa `flex: 1`.

### Action Bar

Fija en el fondo de pantallas de resultado. `bg-surface`, borde superior `--c-border`.
```
[Compartir — flex:1]  [Nueva foto]
```

### Alertas de estado

```html
<div class="alert alert-success">Marca exhibida en 2 de 2 frentes.</div>
<div class="alert alert-warning">Foto borrosa — intenta con mas luz.</div>
<div class="alert alert-error">Error al analizar. Reintentar</div>
```

### Skeleton / Loading

Durante el analisis (~10s) mostrar skeletons en lugar de spinners.
El badge del indicador y las filas de productos se reemplazan con barras shimmer
del mismo tamano que el contenido final. Esto ancla las expectativas del usuario
sobre que va a aparecer.

---

## Logo

Archivo: `public/logo.svg`
Variante: Mark + wordmark (shelf-lines + "MONITOR anaquel")
Color del mark: `#0F766E` (accent)
Wordmark "MONITOR": peso 300, `#78716C` (muted), espaciado +5
Wordmark "anaquel": peso 700, `#1C1917` (text), espaciado -0.5

En modo oscuro: el texto "anaquel" cambia a `#F5F5F4`.

---

## Prohibiciones absolutas

- **Cero hex hardcodeados en componentes.** Siempre el token: `bg-accent`, `text-success`, `var(--c-accent)`.
- **Cero pixel sizes arbitrarios.** Solo la escala de spacing de arriba.
- **Cero fuentes, colores, radii o sombras nuevos** sin actualizar primero este archivo Y `globals.css`. Si necesitas algo que no esta aqui, pregunta antes de inventarlo.
- **Cero componentes que mezclen tokens de colores semanticamente incorrectos.** `--c-success` es exclusivo para exhibicion confirmada y estados positivos; no lo uses para destacar cualquier cosa verde.
