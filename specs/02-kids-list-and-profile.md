# SPEC 02 — Niños: listado (`/kids`) y perfil (`/kids/[slug]`)

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-10
> **Objetivo:** Implementar el listado de niños en `/kids` y el perfil de cada niño en `/kids/[slug]` a partir de los comps `ninos.dc.html` y `perfil-nino.dc.html`, con datos mock tipados, buscador funcional y shell compartido.

## Por qué existe este spec

Es la primera pantalla con navegación real de la app: introduce el layout compartido en un route group (que heredarán avisos, mi cuenta, etc.), convierte en links reales los items Feed y Niños, y unifica el conteo de niños — los comps se contradicen (el feed dice 12, el listado dice 8).

## Alcance

**In:**

- `lib/mock-data.ts`: tipos `Child`, `Parent`, `AvatarColor` + `children` con los 8 niños del comp; baja `room.childrenCount` (el conteo pasa a `children.length`).
- `app/(app)/layout.tsx`: route group nuevo con el shell compartido (Sidebar + MobileNav); `app/page.tsx` se muda a `app/(app)/page.tsx` sin cambiar su URL.
- `app/(app)/kids/page.tsx`: listado — encabezado GESTIÓN/Niños, "Agregar niño" decorativo, buscador funcional, divisor "SALA SOLES · 8 niños", grilla responsive de 8 tarjetas.
- `components/KidsBrowser.tsx` (client): búsqueda con filtro en vivo (ignora mayúsculas/acentos), estado vacío y grilla filtrada.
- `components/KidCard.tsx`: tarjeta — avatar, nombre, "X años · Y padres vinculados", chip de alergia / VINCULAR / chevron según datos, hover del comp.
- `components/Avatar.tsx`: avatar reutilizable con clave semántica de color, variantes kid (texto color) / parent (texto blanco), tamaños 40/48/84.
- `app/(app)/kids/[slug]/page.tsx`: perfil — volver, cabecera con "Editar" decorativo, tarjeta de alergias, filas de datos, "Resumen del día" decorativo, PADRES VINCULADOS con estados, "Vincular otro padre" decorativo; `notFound()` para slug inválido.
- `components/Sidebar.tsx` y `components/MobileNav.tsx`: Feed → `/` y Niños → `/kids` como `<Link>` reales con estado activo por `usePathname`; Avisos y Mi cuenta siguen decorativos.
- `app/globals.css`: tokens nuevos (chips alergia/vincular/estados, tarjeta de alergias, hover).
- Capturas de verificación con Playwright MCP en `.playwright-mcp/`.

**Out of scope (para specs futuros):**

- Pantallas agregar/editar niño, resumen del día y vincular padre (sus botones quedan decorativos).
- Autenticación y login; persistencia/DB.
- Interacción sobre padres (vincular, revocar, reenviar invitación).

## Modelo de datos

`lib/mock-data.ts` (agregado a lo existente):

```ts
export type AvatarColor = "sky" | "blue" | "pink" | "mint" | "yellow" | "purple";
export type ParentStatus = "active" | "pending";

export type Parent = {
  name: string;          // "Lucía Fernández"
  role: string;          // "Mamá" | "Papá"
  status: ParentStatus;  // chip ACTIVA / PENDIENTE
  avatarColor: AvatarColor;
};

export type Child = {
  id: string;              // slug: "mateo-fernandez" → /kids/mateo-fernandez
  name: string;            // "Mateo Fernández"
  ageLabel: string;        // "3 años"
  birthDateLabel: string;  // "12 mar 2022"
  enrollmentLabel: string; // "feb 2025"
  allergyTags: string[];   // ["MANÍ"] → chips del listado
  allergyNotes: string;    // texto largo del perfil; "" si no hay
  avatarColor: AvatarColor;
  parents: Parent[];
};

export const children: Child[]; // los 8 del comp
```

- `room` pierde `childrenCount`; el conteo es `children.length` (8).
- Del comp salen: los 8 niños con edades/colores/chips y el perfil completo de Mateo (nacimiento, ingreso, notas, Lucía activa + Diego pendiente). Los demás padres, la nota de Tomás y las fechas del resto son mock inventado verosímil que respeta las cantidades del comp (2/1/2/0/1/1/1/1).
- Mapas de UI (en componentes, no en el mock): pares hex por `AvatarColor`, etiquetas de estado (`active` → "ACTIVA"/"activa", `pending` → "PENDIENTE"/"invitación enviada"), pluralización de "padres vinculados" (0 → "sin padres vinculados" + chip VINCULAR).

## Plan de implementación

1. Extender `lib/mock-data.ts` (tipos + `children`, baja `childrenCount`) y actualizar el header del feed a `children.length`. Manual: `/` muestra "8 niños · martes 17 jun".
2. Crear `app/(app)/layout.tsx` con el shell y mudar `app/page.tsx` → `app/(app)/page.tsx` (sin shell propio). Manual: `/` idéntica a SPEC 01 salvo el conteo.
3. Crear `components/Avatar.tsx` + tokens nuevos en `globals.css`. Sin uso aún; commitable.
4. Crear `app/(app)/kids/page.tsx` + `components/KidsBrowser.tsx` + `components/KidCard.tsx`. Manual: `/kids` reproduce el comp del listado y el buscador filtra en vivo.
5. Crear `app/(app)/kids/[slug]/page.tsx` (busca por id, `notFound()` si no existe). Manual: `/kids/mateo-fernandez` reproduce el comp del perfil; `/kids/pepe` → 404.
6. Nav real en `components/Sidebar.tsx` y `components/MobileNav.tsx` (`<Link>` + `usePathname`, fin del `isActive` hardcodeado). Manual: Feed activo en `/`, Niños activo en `/kids` y perfiles.
7. Capturas con Playwright MCP en `.playwright-mcp/`: listado y perfil en desktop (1280px) y mobile (375px), más estado vacío del buscador.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` pasan sin errores.
- [ ] `/kids` reproduce el comp: eyebrow GESTIÓN, título Niños, "Agregar niño" decorativo, buscador, "SALA SOLES · 8 niños" con divisor, grilla de 2 columnas (≥768px) con las 8 tarjetas.
- [ ] Cada tarjeta muestra avatar con inicial y color del comp, nombre, "X años · Y padres vinculados" con pluralización correcta, y a la derecha chip MANÍ (Mateo) / LACTOSA (Tomás) / VINCULAR (Valentina) / chevron (el resto).
- [ ] Hover de tarjeta: borde `#F2A78E` y lift de -2px, como el comp.
- [ ] El buscador filtra por nombre en vivo, sin distinguir mayúsculas ni acentos ("sofia" encuentra a "Sofía Méndez"); sin resultados muestra el estado vacío; al vaciar vuelven las 8 tarjetas.
- [ ] `/kids/mateo-fernandez` reproduce el comp del perfil: "Volver a Niños", avatar 84px, "3 años · Sala Soles", "Editar" decorativo, tarjeta de alergias con el texto exacto, filas 12 mar 2022 / Soles / feb 2025, "Resumen del día" decorativo, Lucía (ACTIVA) y Diego (PENDIENTE), "Vincular otro padre" decorativo.
- [ ] `/kids/[slug]` con slug inexistente devuelve 404 (`notFound()`).
- [ ] Sidebar y mobile nav linkean Feed → `/` y Niños → `/kids` con estado activo según la ruta; Avisos y Mi cuenta siguen decorativos; ningún link navega a una ruta inexistente.
- [ ] El feed muestra "8 niños · martes 17 jun" con conteo derivado de `children` (supersede el "12 niños" verificado en SPEC 01).
- [ ] El shell vive una sola vez en `app/(app)/layout.tsx` y `/` no sufre regresión visual frente a las capturas de SPEC 01 (salvo el conteo).
- [ ] En <768px la grilla pasa a 1 columna, el perfil apila sus bloques y el shell mobile se comporta como en SPEC 01.
- [ ] La copy visible es exactamente la de los comps, en español voseo.
- [ ] Capturas guardadas en `.playwright-mcp/`.

## Decisiones

- **Sí:** rutas en inglés (`/kids`, `/kids/[slug]`) con copy en español ("Niños") — indicación explícita; consistente con la regla de código en inglés.
- **Sí:** id = slug del nombre ("mateo-fernandez") — URLs legibles; la DB traerá ids reales.
- **Sí:** route group `(app)` con layout de shell — sin duplicar Sidebar/MobileNav por página; los próximos specs lo heredan.
- **Sí:** nav real solo para Feed y Niños — los demás items esperan sus specs.
- **Sí:** conteo único `children.length` (8) — los comps se contradicen; se toma el listado como verdad y queda anotado que supersede el "12 niños" de SPEC 01.
- **Sí:** edad y fechas como strings de display — convención de SPEC 01, sin lógica de fechas sin DB.
- **Sí:** `allergyTags` + `allergyNotes` separados — el listado muestra etiquetas cortas y el perfil un párrafo.
- **Sí:** clave semántica de color de avatar mapeada a pares hex en la capa de UI — mock legible, presentación fuera de los datos.
- **Sí:** `notFound()` para slug inválido — estándar de Next.
- **Sí:** estado vacío del buscador y responsive (1 columna, perfil apilado) inventados con tokens existentes — no están en los comps; mismo criterio que la nav mobile de SPEC 01.
- **No:** fechas ISO + helpers — se reescribiría igual contra la DB.
- **No:** chips de alergia derivadas del texto de notas — frágil.
- **No:** color de avatar por índice — el comp no sigue patrón y se rompe al reordenar el mock.
- **No:** pantallas agregar/editar niño, resumen del día, vincular padre — cada una merece su spec.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Next 16 difiere de versiones previas (route groups, `params` como Promise, `notFound`) | Leer `node_modules/next/dist/docs/` de layouts/route groups/segmentos dinámicos antes de codear en `/spec-impl` |
| Mover `app/page.tsx` al route group toca una pantalla ya verificada (SPEC 01) | Captura lado a lado de `/` post-refactor contra las capturas de SPEC 01 |
| La nav activa agrega lógica a dos componentes client existentes | Ambos ya son `"use client"`; mantener el cálculo de ruta en un helper chico |

## Lo que **no** está en este spec

- Agregar/editar niño, resumen del día, vincular padre, autenticación, base de datos, interacción sobre padres.

Cada una, si llega, va en su propio spec.
