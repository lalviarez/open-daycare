# SPEC 05 — Vincular padre: modal en el perfil del niño

> **Estado:** Aprobado
> **Depende de:** SPEC 02, SPEC 03
> **Fecha:** 2026-09-13
> **Objetivo:** Hacer funcional el link «Vincular otro padre» del perfil del niño (`/kids/[slug]`) con una modal según `references/pantallas/vincular-padre.dc.html` — nombre, email y parentesco obligatorios y código de invitación generado al abrir — persistiendo la invitación en localStorage para mostrar al padre como PENDIENTE en el perfil y permitirle activar su cuenta en `/activate`.

## Por qué existe este spec

Desbloquea el primer flujo de mutación sobre padres: desde SPEC 02 el link es decorativo. Reifica el concepto de invitación (SPEC 03 tiene una sola invitación mock estática, `7K4P9` de Diego) con su propia capa de storage (`odc-invitations:v1`, patrón de SPEC 04), vuelve client la tarjeta PADRES VINCULADOS para mergear mock + locales, y conecta la modal con `/activate` para que el flujo sea demoable de punta a punta. El comp presenta la acción como tarjeta centrada tipo página; se implementa como modal por pedido explícito.

## Alcance

**In:**

- `lib/invitations-storage.ts` (nuevo): invitaciones en localStorage (`odc-invitations:v1`) — `generateInvitationCode`, `getLocalInvitations`, `addInvitation`, `getParentsForChild`; try/catch con fallback en memoria.
- `lib/auth.ts` (cambio): `activateAccount` busca el código también en las invitaciones locales, con la misma validación de email/contraseña y creación de cuenta `family`.
- `components/LinkParentModal.tsx` (client, nuevo): overlay + tarjeta del comp — header «Vincular padre / a {nombre}» con X, banner azul, NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO (Mamá / Papá / Tutor/a), recuadro CÓDIGO DE INVITACIÓN con código generado al abrir y «Vence en 7 días», botón «Enviar invitación»; validación inline.
- `components/ParentsPanel.tsx` (client, nuevo): migra `ParentsCard`/`ParentRow`/`STATUS_CONFIG` del page; carga invitaciones locales en un efecto; merge mock + locales; link «Vincular otro padre» funcional.
- `app/(app)/kids/[slug]/page.tsx`: usa `<ParentsPanel />` en el aside; el resto del perfil queda server sin cambios.
- `app/globals.css`: tokens nuevos (banner info `#E3ECFB`/`#3F5694`, pill seleccionada border `#9FB8EC`, recuadro código border `#E6D08A` y título `#A88526`; bg/textos reusan `consent-bg`/`consent-text`/`announcement-bg`/`announcement-text`).
- Capturas de verificación con Playwright MCP en `.playwright-mcp/`.

**Out of scope (para specs futuros):**

- Mutación PENDIENTE → ACTIVA en el perfil tras activar (criterio SPEC 03; el padre nuevo queda PENDIENTE).
- Envío real de emails y expiración real del código («Vence en 7 días» es copy fija del comp).
- Interacción sobre padres existentes (revocar, reenviar, desvincular).
- Vincular padres de niños agregados vía SPEC 04 (no tienen página de perfil).
- DB real y family-feed (el banner «Solo verá el feed de…» es copy).

## Modelo de datos

`lib/invitations-storage.ts` (nuevo):

```ts
const INVITATIONS_KEY = "odc-invitations:v1";

export type StoredInvitation = {
  code: string;        // "X7K4P" — 5 mayúsculas alfanuméricas sin ambiguos (sin 0/O/1/I)
  parentName: string;  // "Diego Fernández"
  parentRole: string;  // "Mamá" | "Papá" | "Tutor/a"
  email: string;       // "diego.fernandez@gmail.com"
  childId: string;     // "mateo-fernandez"
  avatarColor: AvatarColor; // para la fila del perfil; cicla por paleta al insertar
};

export type NewInvitationInput = Omit<StoredInvitation, "avatarColor">;

generateInvitationCode(): string             // único vs mock (`invitations`) + locales
getLocalInvitations(): StoredInvitation[]    // [] sin clave; fallback memoria
addInvitation(input: NewInvitationInput): StoredInvitation  // prepend + persiste
getParentsForChild(childId: string, mockParents: Parent[]): Parent[]
// mock primero; invitaciones locales del niño como { status: "pending" }
```

`lib/auth.ts` (cambio en `activateAccount`):

- Orden de búsqueda del código: `invitations` (mock) → `getLocalInvitations()`.
- Mismas validaciones y errores (`"code"` / `"email"` / `"password"`); cuenta `family` con `roleLabel` "«parentRole» de «primer nombre del niño»" (el niño se resuelve desde `childId` contra el mock).
- La invitación local no se consume ni muta (el padre sigue PENDIENTE en el perfil).

Comportamiento de la modal:

- Abre desde el link del perfil; el código se genera al abrir y se muestra en el recuadro; si se cancela, se descarta.
- Cierra con X, Esc o click en el overlay, sin persistir.
- Valida al submit con errores inline `#C5503A` (convención SPEC 03/04): "Completá el nombre del padre o madre." / "Completá el email." / "Ingresá un email válido." (regex simple `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) / "Elegí el parentesco." / "Ese email ya está vinculado a este niño." (duplicado contra padres del mock + invitaciones locales del niño).
- Envío válido: `addInvitation`, cierra la modal y el padre aparece en PADRES VINCULADOS como PENDIENTE (chip + "invitación enviada").

## Plan de implementación

1. Crear `lib/invitations-storage.ts` (clave versionada, tipos, `generateInvitationCode`, `addInvitation`, `getParentsForChild`, try/catch + fallback). Manual: sin cambio visual; `npm run build` pasa.
2. Integrar `lib/auth.ts` (búsqueda del código en locales). Manual: sin cambio visual; queda ejercitado en el paso 5.
3. Tokens nuevos en `app/globals.css`. Sin uso aún; commitable.
4. Crear `components/LinkParentModal.tsx` (overlay + tarjeta del comp, pills, código al abrir, validación inline). Sin uso aún; commitable.
5. Crear `components/ParentsPanel.tsx` y cambiar `app/(app)/kids/[slug]/page.tsx` para usarlo. Manual: el link abre la modal; enviar un padre válido lo muestra PENDIENTE; al recargar persiste; `/activate` con el código generado + email activa la cuenta.
6. Capturas con Playwright MCP en `.playwright-mcp/`: modal abierta y estado de error en desktop (1280px) y mobile (375px), perfil con padre nuevo PENDIENTE, y activación con código generado.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` pasan sin errores.
- [ ] El link «Vincular otro padre» de `/kids/[slug]` abre la modal con la estructura del comp: header «Vincular padre / a {nombre}» con X, banner azul con la copy exacta, NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO (Mamá / Papá / Tutor/a), recuadro CÓDIGO DE INVITACIÓN con «Vence en 7 días» y botón «Enviar invitación».
- [ ] El recuadro muestra un código de 5 caracteres distinto en cada apertura (y distinto de `7K4P9`).
- [ ] Ningún parentesco seleccionado al abrir; los 3 botones alternan la selección (una sola activa, estilo del comp).
- [ ] Enviar con nombre o email vacíos, email mal formado o parentesco sin elegir muestra el error inline correspondiente bajo el campo, sin cerrar la modal ni crear nada.
- [ ] Enviar con un email ya vinculado a ese niño (padres del mock o invitaciones locales) muestra error inline y no crea la invitación.
- [ ] Enviar válido cierra la modal y el padre aparece en PADRES VINCULADOS como PENDIENTE (chip + "invitación enviada") con avatar de la paleta.
- [ ] Recargar el perfil preserva al padre vinculado (`odc-invitations:v1`); sin invitaciones locales el perfil es idéntico al verificado en SPEC 02.
- [ ] `/activate` con el código generado + email de la invitación + contraseña ≥ 8 caracteres crea la sesión del padre nuevo; el flujo de Diego (`7K4P9`) sigue funcionando.
- [ ] Tras activar, el padre nuevo sigue PENDIENTE en el perfil (nada muta a ACTIVA).
- [ ] X, Esc y click en el overlay cierran la modal sin crear la invitación (el código se descarta).
- [ ] El mismo email en otro niño se permite (invitaciones independientes).
- [ ] En <768px la modal es usable sin scroll horizontal y el perfil se comporta como en SPEC 02.
- [ ] La copy visible de la modal es la del comp, en español voseo; el código en inglés (regla del repo).
- [ ] Capturas guardadas en `.playwright-mcp/`.

## Decisiones

- **Sí:** modal en vez de página — pedido explícito; mismo criterio que SPEC 04.
- **Sí:** `odc-invitations:v1` en un módulo propio — consistente con `odc-children:v1`/`odc-accounts:v1`; recarga verificable.
- **Sí:** la invitación local es el único registro del padre (la fila del perfil se deriva de ella) — una sola fuente para perfil y activación, sin clave duplicada.
- **Sí:** código aleatorio al abrir, 5 mayúsculas sin caracteres ambiguos, único contra mock + locales — elegido en fase de preguntas; el comp muestra el código dentro del form.
- **Sí:** «Vence en 7 días» como copy fija, sin expiración real — sin backend no hay reloj; la DB la traerá.
- **Sí:** parentesco sin selección inicial y validado al submit — elegido en fase de preguntas; hace explícita la obligatoriedad (supersede la «Mamá» seleccionada del comp).
- **Sí:** bloquear email duplicado en el mismo niño, permitirlo entre niños — elegido en fase de preguntas.
- **Sí:** integrar `/activate` con las invitaciones locales — elegido en fase de preguntas; flujo demoable de punta a punta.
- **Sí:** `avatarColor` persistida en la invitación, ciclando por paleta al insertar — estable entre recargas; mismo criterio que `addKid`.
- **Sí:** errores inline `#C5503A` al submit con copy vosea inventada — convención SPEC 03/04.
- **Sí:** cierre con X, Esc y overlay — convención `AddKidModal` (el comp trae solo X).
- **Sí:** `ParentsPanel` client con carga de locales en un efecto — patrón `KidsScreen` (SPEC 04); evita mismatch de hidratación.
- **No:** mutar PENDIENTE → ACTIVA — criterio SPEC 03.
- **No:** envío real de email y expiración real del código.
- **No:** revocar / reenviar / desvincular padres — spec futuro.
- **No:** vincular sobre niños agregados (SPEC 04) — no tienen perfil.
- **No:** mutar el mock — Diego queda PENDIENTE hasta la DB.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| localStorage leído en el render inicial causaría mismatch de hidratación | Cargar invitaciones locales en un efecto, como `KidsScreen` (SPEC 04) |
| Modo privado con localStorage bloqueado | try/catch con fallback en memoria (convención `lib/auth.ts`) |
| Tocar `activateAccount` ya verificado (SPEC 03) | Re-verificar el flujo de Diego `7K4P9` en la verificación de este spec |
| Perfil ya verificado (SPEC 02) | Captura de regresión sin invitaciones locales |
| Next 16 difiere de versiones previas | Leer `node_modules/next/dist/docs/` antes de codear en `/spec-impl` |

## Lo que **no** está en este spec

- Mutación a ACTIVA, emails reales, expiración del código, interacción sobre padres existentes, vincular en niños sin perfil, DB real, family-feed.

Cada una, si llega, va en su propio spec.