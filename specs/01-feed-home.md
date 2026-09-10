# SPEC 01 — Feed como home (`/`) con el diseño de OpenDayCare

> **Estado:** Aprobado
> **Depende de:** ninguna
> **Fecha:** 2026-09-09
> **Objetivo:** Implementar la pantalla del feed (`references/pantallas/feed.dc.html`) como la home `/`, visualmente idéntica al comp, con datos mock tipados y una nav mobile nueva.

## Por qué existe este spec

Es la primera pantalla de la app: define los tokens del sistema de diseño (Fredoka/Nunito, paleta cálida) que heredarán las demás pantallas, y reemplaza el scaffold default de Next 16. La nav mobile no está en el comp y se diseña acá.

## Alcance

**In:**

- `app/layout.tsx`: Fredoka (títulos) + Nunito (cuerpo) vía `next/font/google`, `lang="es-AR"`, metadata con título "OpenDayCare".
- `app/globals.css`: tokens en `@theme` (Tailwind v4) con la paleta del comp; eliminar dark mode, Geist y la paleta neutra del scaffold.
- `lib/mock-data.ts`: tipos + mock con los 3 posts del comp, usuario actual y sala.
- `components/Sidebar.tsx`: sidebar desktop de 248px idéntica al comp, links decorativos.
- `components/MobileNav.tsx`: topbar + drawer con toggle real (`useState`), breakpoint `md` (768px).
- `components/PostCard.tsx`: variantes logro / actividad / anuncio con badges, contadores y placeholder de foto.
- `app/page.tsx`: encabezado, composer trigger, divisor "PUBLICADO HOY" y lista de posts desde el mock.

**Out of scope (para specs futuros):**

- Autenticación y login (el logout de la sidebar es decorativo).
- Base de datos y persistencia (el mock se reemplazará por la fuente real).
- Pantallas crear-publicación, niños, avisos, mi cuenta, detalle de publicación y foto.
- Interacción de likes, comentarios y "Editar" (solo display).
- Fotos reales (el placeholder punteado del comp queda tal cual).

## Modelo de datos

`lib/mock-data.ts`:

```ts
export type PostType = "achievement" | "activity" | "announcement";

export type Post = {
  id: string;
  type: PostType;
  child: string | null;    // "Mateo"; null para announcement
  time: string;            // "14:20" (string de display, sin Date)
  audience: string;        // "familia de Mateo" | "toda la sala" (copy de UI)
  body: string;
  photoCaption?: string;   // solo activity: "pintando con témperas"
  likes: number;
  comments: number;
};

export const currentUser = { name: "Caro Giménez", role: "Maestra", room: "Soles", initial: "C" };
export const room = { name: "Soles", childrenCount: 12, dateLabel: "martes 17 jun" };
export const posts: Post[]; // los 3 del comp: logro 14:20, actividad 09:40, anuncio 07:50
```

Convenciones: el título de la tarjeta se deriva (`child ?? "Anuncio general"`); "publicado por vos" es copy fija; las etiquetas españolas de badge ("LOGRO", "ACTIVIDAD", "ANUNCIO") y los colores por tipo viven en un mapa de constantes en la capa de UI.

## Plan de implementación

1. Tipografía y tokens: reescribir `app/layout.tsx` (Fredoka + Nunito, `lang="es-AR"`, título) y `app/globals.css` (`@theme` con la paleta del comp, sin dark mode). Manual: `npm run dev`, fondo `#F6ECDF` y fuentes correctas.
2. Crear `lib/mock-data.ts` con tipos y los 3 posts. Sin efecto visual aún.
3. Crear `components/Sidebar.tsx` (desktop, `hidden md:flex`). Manual: visible e idéntica al comp en ≥768px.
4. Crear `components/PostCard.tsx` con las 3 variantes. Manual: render de prueba contra el comp.
5. Crear `components/MobileNav.tsx` (topbar + drawer con `useState`, overlay que cierra). Manual: resize a <768px, abrir/cerrar drawer.
6. Ensamblar `app/page.tsx`: encabezado, composer, divisor y lista desde `posts`. Manual: comparación lado a lado con el comp.
7. Capturas de verificación con Playwright MCP en `.playwright-mcp/`: desktop (1280px) y mobile (375px).

## Criterios de aceptación

- [ ] `npm run build` pasa sin errores; `npm run lint` sin errores.
- [ ] En 1280×800, `/` reproduce el comp: sidebar de 248px, "Buenas, Caro", "12 niños · martes 17 jun", composer, "PUBLICADO HOY" y las 3 tarjetas con badges LOGRO / ACTIVIDAD / ANUNCIO, contadores 3·1, 5·2, 8·0 y placeholder de foto.
- [ ] Fredoka en títulos/branding y Nunito en cuerpo, cargadas con `next/font/google` (sin `<link>` a fonts.googleapis.com).
- [ ] Fondo general `#F6ECDF`; sin dark mode ni restos del scaffold (Geist, `next.svg`, paleta zinc).
- [ ] En <768px la sidebar desaparece, aparece la topbar y el drawer abre con la hamburguesa y cierra tocando el overlay.
- [ ] Ningún link navega a rutas inexistentes (todos decorativos).
- [ ] La copy es exactamente la del comp, en español voseo.
- [ ] Capturas desktop y mobile guardadas en `.playwright-mcp/`.

## Decisiones

- **Sí:** código limpio en todo lo generado — nombres, tipos, funciones y variables en inglés (regla de AGENTS.md); español únicamente para copy visible; sin magic values fuera de los tokens; componentes pequeños con una sola responsabilidad.
- **Sí:** el comp como única fuente de verdad visual — sus valores (fondo `#F6ECDF`, botón `#F4977E`→`#EE8164`) prevalecen sobre la paleta general citada en AGENTS.md (`#FBF4EC`, `#F6A98E`→`#EC7E62`).
- **Sí:** mock tipado aparte en `lib/mock-data.ts` — llegar la DB será cambiar la fuente, no la UI.
- **Sí:** `next/font/google` — self-hosting, sin FOUC, idiomático en Next 16.
- **Sí:** links decorativos — cada pantalla futura merece su propio spec.
- **Sí:** nav mobile topbar + drawer con toggle real (única interacción con estado del spec) — reutiliza los links de la sidebar.
- **Sí:** horarios como strings de display — sin DB no hay nada que calcular.
- **No:** tab bar inferior — más diseño nuevo que un drawer que reutiliza la sidebar.
- **No:** dark mode — el comp es solo claro.
- **No:** `<link>` a Google Fonts — dependencia externa y parpadeo.
- **No:** links a rutas que dan 404 — peor que decorativo.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Rendering de fuentes self-hosted puede diferir del CDN del comp | Captura lado a lado en el paso 7; ajustar pesos si hace falta |
| El drawer mobile es diseño inventado (no está en el comp) | Reutilizar tokens y estructura de la sidebar; captura mobile en aceptación |
| Next 16 difiere de versiones previas (aviso de AGENTS.md) | Leer `node_modules/next/dist/docs/` de layout/fonts antes de codear en `/spec-impl` |

## Lo que **no** está en este spec

- Autenticación, base de datos, crear publicación, niños, avisos, mi cuenta, detalle de publicación, fotos reales, interacción de likes/comentarios.

Cada una de esas, si llega, va en su propio spec.
