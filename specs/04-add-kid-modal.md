# SPEC 04 — Agregar niño: modal en `/kids`

> **Estado:** Aprobado
> **Depende de:** SPEC 02
> **Fecha:** 2026-09-12
> **Objetivo:** Hacer funcional el botón "Agregar niño" de `/kids` abriendo una modal según `references/pantallas/agregar-nino.dc.html` — Nombre completo, Fecha de nacimiento y Sala obligatorios, Alergias y Notas médicas opcionales — con data mock de 3 salas y los niños creados persistidos en localStorage y agrupados por sala en el listado.

## Por qué existe este spec

Desbloquea el primer flujo de alta de la app: desde SPEC 02 el botón "Agregar niño" es decorativo. Introduce el data de salas (hoy `room` es un solo objeto) y la persistencia de altas en localStorage (patrón de SPEC 03), y con ella el listado pasa de un divisor fijo "SALA SOLES" a agrupar por sala. El comp presenta el alta como tarjeta centrada tipo página; se implementa como modal por pedido explícito.

## Alcance

**In:**

- `lib/mock-data.ts`: tipo `Room` + `rooms` (Soles, Lunas, Estrellas) + `roomName` en `Child` (los 8 del mock quedan en "Soles"); el objeto `room` del feed no se toca.
- `lib/kids-storage.ts` (nuevo): altas en localStorage (`odc-children:v1`), `getLocalKids`, `addKid` con derivaciones (id slug, edad, mes de ingreso, color de avatar).
- `components/AddKidModal.tsx` (client, nuevo): overlay + tarjeta del comp (header Cancelar / "Agregar niño" / Guardar, 5 campos), máscara de fecha dd/mm/aaaa, validación inline de los 3 obligatorios.
- `components/KidsScreen.tsx` (client, nuevo): encabezado con botón funcional, estado de altas locales (carga en efecto) y merge mock + locales.
- `app/(app)/kids/page.tsx`: queda en metadata + `<KidsScreen mockKids={children} />`.
- `components/KidsBrowser.tsx`: divisor por sala (orden de `rooms`, conteo y pluralización por grupo, grupos vacíos ocultos) sobre mock + agregados; buscador intacto.
- `components/KidCard.tsx`: prop para renderizar sin link (niños agregados, sin perfil todavía).
- `app/globals.css`: token de overlay si hace falta.
- Capturas de verificación con Playwright MCP en `.playwright-mcp/`.

**Out of scope (para specs futuros):**

- Editar niño (el botón "Editar" del perfil sigue decorativo) y el perfil del niño agregado.
- Vincular padres desde la modal e interacción sobre padres.
- Filtro de sala en el listado.
- DB real y salas administrables.

## Modelo de datos

`lib/mock-data.ts` (agregado a lo existente):

```ts
export type Room = { name: string };

export const rooms: Room[] = [
  { name: "Soles" },
  { name: "Lunas" },
  { name: "Estrellas" },
];

export type Child = {
  // …campos existentes sin cambio…
  roomName: string; // nueva: "Soles" para los 8 del mock
};
```

- El objeto `room` queda para el feed (SPEC 01); el listado pasa a usar `rooms` + `child.roomName`.

`lib/kids-storage.ts` (nuevo):

```ts
const CHILDREN_KEY = "odc-children:v1";

export type NewKidInput = {
  name: string;          // "Juana Pérez"
  birthDate: string;     // "12/03/2023" — dd/mm/aaaa ya mascareado y validado
  roomName: string;      // "Lunas"
  allergyTags: string[]; // ["MANÍ"] — split por coma, trim, mayúsculas
  allergyNotes: string;  // textarea; "" si no hay
};

getLocalKids(): Child[]           // [] sin clave; try/catch → fallback en memoria
addKid(input: NewKidInput): Child // deriva y persiste; devuelve el Child completo
```

Derivaciones de `addKid`:

- `id`: slug del nombre ("juana-perez"); sufijo `-2`, `-3`… si colisiona con mock o locales.
- `ageLabel`: años cumplidos entre `birthDate` y hoy ("2 años"; "1 año" singular).
- `birthDateLabel`: el dd/mm/aaaa tal cual (la DB futura lo reformatea).
- `enrollmentLabel`: mes de creación ("sep 2026").
- `avatarColor`: cicla por la paleta según la posición del niño.
- `parents`: `[]` → la tarjeta muestra "sin padres vinculados" + chip VINCULAR (ya existe en `KidCard`).

Comportamiento de la modal:

- Abre desde el botón del encabezado de `/kids`; cierra con Cancelar, Esc o click en el overlay, sin guardar.
- Guardar valida al submit con errores inline `#C5503A` (criterio SPEC 03): "Completá el nombre completo." / "Completá la fecha de nacimiento." / "La fecha tiene que ser dd/mm/aaaa." / "Elegí una sala."
- La máscara inserta las "/" sola al tipear ("12032023" → "12/03/2023") y corta en 10 caracteres.
- Guardar válido: cierra, persiste y el niño aparece arriba de su grupo de sala.

## Plan de implementación

1. Extender `lib/mock-data.ts` (`Room`, `rooms`, `roomName` en `Child`; los 8 en "Soles"). Manual: sin cambio visual; `npm run build` pasa.
2. Crear `lib/kids-storage.ts` (clave versionada, `getLocalKids`/`addKid`, derivaciones, try/catch). Manual: sin cambio visual; queda ejercitado en los pasos 4–5.
3. Crear `components/AddKidModal.tsx` (overlay + tarjeta del comp, máscara, validación inline). Sin uso aún; commitable.
4. Crear `components/KidsScreen.tsx` y achicar `app/(app)/kids/page.tsx` a metadata + `<KidsScreen mockKids={children} />`. Manual: el botón abre la modal; guardar un niño válido lo hace aparecer arriba de su sala; al recargar persiste.
5. Agrupar por sala en `components/KidsBrowser.tsx` y agregar la variante sin link en `components/KidCard.tsx`. Manual: sin agregados el listado es idéntico a SPEC 02; con un niño en Lunas aparece "SALA LUNAS · 1 niño"; la tarjeta del agregado no navega; el buscador filtra sobre el total.
6. Capturas con Playwright MCP en `.playwright-mcp/`: modal abierta y estado de error en desktop (1280px) y mobile (375px), y listado con niño agregado en otra sala.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` pasan sin errores.
- [ ] El botón "Agregar niño" de `/kids` abre la modal con la estructura del comp: header Cancelar / "Agregar niño" / Guardar y los 5 campos con sus placeholders.
- [ ] Guardar con campos obligatorios vacíos muestra error inline bajo cada campo (nombre, fecha, sala), sin cerrar la modal ni agregar nada.
- [ ] La máscara de fecha inserta las "/" sola ("12032023" → "12/03/2023"); una fecha mal formada muestra "La fecha tiene que ser dd/mm/aaaa."
- [ ] El dropdown SALA lista las 3 salas del data y requiere selección.
- [ ] Guardar válido cierra la modal y el niño aparece arriba del divisor de su sala con conteo pluralizado ("SALA LUNAS · 1 niño").
- [ ] La tarjeta del agregado muestra avatar con color de la paleta, "X años" calculada desde la fecha, chips de alergia ("maní" → "MANÍ") o chip VINCULAR + "sin padres vinculados" si no cargó alergias.
- [ ] Recargar `/kids` preserva los niños agregados (`odc-children:v1`); sin agregados el listado es idéntico al verificado en SPEC 02 ("SALA SOLES · 8 niños").
- [ ] La tarjeta del niño agregado no navega; las tarjetas del mock siguen linkeando a su perfil.
- [ ] Cancelar, Esc y click en el overlay cierran la modal sin guardar ni alterar el listado.
- [ ] El buscador filtra en vivo sobre el total (mock + agregados) y los grupos sin resultados quedan ocultos.
- [ ] En <768px la modal es usable sin scroll horizontal y el listado se comporta como en SPEC 02.
- [ ] La copy visible de la modal es la del comp, en español voseo; el código en inglés (regla del repo).
- [ ] Capturas guardadas en `.playwright-mcp/`.

## Decisiones

- **Sí:** modal en vez de página — pedido explícito; la tarjeta centrada del comp se traduce directa a overlay.
- **Sí:** salas Soles / Lunas / Estrellas — mock verosímil (criterio de specs previos); Soles primero para no alterar el listado por defecto.
- **Sí:** `roomName` en `Child` + agrupación por sala — elegido en fase de preguntas; supersede el divisor único de SPEC 02 cuando hay varias salas con niños.
- **Sí:** localStorage `odc-children:v1` — consistente con `odc-accounts:v1` (SPEC 03); recarga verificable.
- **Sí:** tarjeta del agregado sin link a perfil — el perfil es server component contra el mock; su soporte va con la DB/edición.
- **Sí:** input de texto dd/mm/aaaa con máscara — elegido en fase de preguntas (opción del comp + máscara pedida).
- **Sí:** edad calculada desde la fecha — la tarjeta muestra "X años" y el form no la pide.
- **Sí:** alergias como texto split por coma → tags en mayúsculas — replica el placeholder "Ej. Maní, Lactosa" del comp.
- **Sí:** `enrollmentLabel` = mes de creación y `avatarColor` ciclando por paleta — verosímil y determinista.
- **Sí:** pluralización del conteo por grupo ("1 niño" / "N niños") — el "8 niños" fijo de SPEC 02 no la necesitaba.
- **Sí:** cierre por Cancelar, Esc y overlay — convención estándar de modales; el comp (página) solo trae Cancelar.
- **No:** editar niño — merece su spec; el botón "Editar" sigue decorativo.
- **No:** vincular padres desde la modal — el form del comp no lo incluye.
- **No:** filtro de sala en el listado — si llega, spec propio.
- **No:** input date nativo — difiere del comp.
- **No:** mutar el mock — los agregados viven en localStorage (criterio SPEC 03).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| localStorage leído en el render inicial causaría mismatch de hidratación | Cargar las altas en un efecto, como la sesión de SPEC 03 |
| Modo privado con localStorage bloqueado | try/catch con fallback en memoria; el alta funciona en la sesión |
| Next 16 difiere de versiones previas (client components, eventos de teclado) | Leer `node_modules/next/dist/docs/` antes de codear en `/spec-impl` |
| `KidsBrowser`/`KidCard` ya verificados (SPEC 02) | Captura de regresión del listado sin agregados |

## Lo que **no** está en este spec

- Editar niño, perfil del niño agregado, vincular padres, filtro por sala, DB real, salas administrables.

Cada una de esas, si llega, va en su propio spec.
