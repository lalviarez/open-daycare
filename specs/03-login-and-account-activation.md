# SPEC 03 — Login (`/login`) y activación de cuenta (`/activate`)

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-09-12
> **Objetivo:** Implementar las pantallas de login y activación de cuenta (`references/pantallas/login.dc.html` y `references/pantallas/activar-cuenta.dc.html`) como rutas públicas `/login` y `/activate`, con sesión mock en localStorage y sin el selector de rol del comp de login.

## Por qué existe este spec

Es la primera pantalla de acceso de la app: introduce la capa de auth mock (usuarios, invitaciones y sesión) que los specs futuros reemplazarán por la fuente real. El comp de login elegía el destino con el selector "INGRESO COMO: Personal/Familia", que se elimina por pedido explícito — el rol pasa a salir del usuario autenticado. También resuelve una contradicción: el comp de activación muestra a Lucía (ya ACTIVA en el mock de SPEC 02) activándose para Mateo; la demo pasa a ser Diego, su papá PENDIENTE.

## Alcance

**In:**

- `lib/mock-data.ts`: tipos `UserRole`, `User`, `Invitation` + `users` (Caro staff y Lucía familia, los 2 emails demo del comp) + `invitations` (Diego · `7K4P9` · Mateo).
- `lib/auth.ts` (nuevo): sesión y cuentas activadas en localStorage (`odc-session:v1`, `odc-accounts:v1`), `getSession`, `signIn`, `activateAccount`, `signOut`, helper `homePathFor(role)`.
- `app/login/page.tsx` + `components/LoginForm.tsx` (client): split del comp sin el bloque "INGRESO COMO"; campos vacíos; errores inline.
- `app/activate/page.tsx` + `components/ActivationForm.tsx` (client): tarjeta "Te invitaron a seguir a Mateo · Sala Soles", código `7K4P9` precargado, checkbox de autorización; errores inline.
- Links cruzados login ↔ activación; "¿Olvidaste tu contraseña?" decorativo.
- `components/Sidebar.tsx` y `components/MobileNav.tsx`: logout real (`signOut()` + `/login`).
- `app/globals.css`: token de error/links `#C5503A` si falta; tamaño 44 en `components/Avatar.tsx` si hace falta.
- Capturas de verificación con Playwright MCP en `.playwright-mcp/`.

**Out of scope (para specs futuros):**

- `familia-feed` y el destino/shell real de familia — ambos roles redirigen a `/` por ahora.
- Pantalla "olvidé mi contraseña" y envío de emails de invitación.
- Protección de rutas: `/` y `/kids` siguen accesibles sin sesión.
- DB y auth reales (mock + localStorage se reemplazan por la fuente real).
- Mutación del estado de padres del mock (PENDIENTE → ACTIVA) y sidebar personalizada por rol.

## Modelo de datos

`lib/mock-data.ts` (agregado a lo existente):

```ts
export type UserRole = "staff" | "family";

export type User = {
  email: string;       // "caro@opendaycare.com"
  password: string;    // demo: "guarderia2026" / "familia2026"
  role: UserRole;
  name: string;        // "Caro Giménez" / "Lucía Fernández"
  roleLabel: string;   // "Maestra" / "Mamá de Mateo"
};

export const users: User[]; // Caro (staff) y Lucía (family)

export type Invitation = {
  code: string;        // "7K4P9"
  parentName: string;  // "Diego Fernández"
  parentRole: string;  // "Papá"
  email: string;       // "diego.fernandez@gmail.com"
  childId: string;     // "mateo-fernandez" → child + room desde el mock
};

export const invitations: Invitation[]; // la de Diego
```

`lib/auth.ts`:

```ts
const SESSION_KEY = "odc-session:v1";
const ACCOUNTS_KEY = "odc-accounts:v1"; // cuentas creadas vía activación

export type Session = { email: string; name: string; role: UserRole; roleLabel: string };

getSession(): Session | null
signIn(email, password): Session | null          // users del mock + cuentas activadas
activateAccount(code, email, password):
  { ok: true; session: Session } | { ok: false; error: "code" | "email" | "password" }
signOut(): void
homePathFor(role: UserRole): string              // hoy "/" para ambos roles
```

- `activateAccount` valida: código existente en `invitations`, email igual al de la invitación, contraseña ≥ 8 caracteres. Si pasa, persiste la cuenta en `ACCOUNTS_KEY` y crea la sesión.
- Copia de errores (inventada con tokens existentes, criterio de specs previos): "Completá tu email." / "Completá tu contraseña." / "Email o contraseña incorrectos." / "El código no es válido o expiró." / "El email no coincide con la invitación." / "La contraseña necesita al menos 8 caracteres." / "Para activar necesitamos tu autorización para compartir fotos."
- La tarjeta de activación deriva el niño desde `invitations[0].childId` (Mateo · Sala Soles, avatar M sky); "Bienvenida a OpenDayCare" queda verbatim del comp.

## Plan de implementación

1. Extender `lib/mock-data.ts` (tipos + `users` + `invitations`). Manual: sin cambio visual; `npm run build` pasa.
2. Crear `lib/auth.ts` (claves versionadas, `getSession`/`signIn`/`activateAccount`/`signOut`/`homePathFor`, try/catch para localStorage bloqueado). Manual: sin cambio visual; queda ejercitado en los pasos 3–5.
3. Crear `components/LoginForm.tsx` + `app/login/page.tsx` (server, metadata "Iniciar sesión · OpenDayCare", fuera del route group `(app)` para no heredar el shell). Manual: `/login` reproduce el comp sin "INGRESO COMO"; login de Caro → `/`; login de Lucía → `/`; credenciales mal → error inline sin redirect.
4. Crear `components/ActivationForm.tsx` + `app/activate/page.tsx` (metadata "Activar cuenta · OpenDayCare"). Manual: `/activate` reproduce el comp con Diego · Mateo · Sala Soles y `7K4P9` precargado; flujo feliz crea sesión y redirige; los 4 errores inline se provocan y verifican uno por uno.
5. Logout real en `components/Sidebar.tsx` y `components/MobileNav.tsx`. Manual: logout desde `/` limpia `odc-session:v1` y cae en `/login`; tras activar, logout y re-login de Diego funciona.
6. Capturas con Playwright MCP en `.playwright-mcp/`: login y activación en desktop (1280px) y mobile (375px), más un estado de error por pantalla.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` pasan sin errores.
- [ ] `/login` reproduce el comp sin el bloque "INGRESO COMO": panel izquierdo (gradiente, logo OpenDayCare, titular "El día de cada niño, compartido con su familia.", "🌿 Guardería Sala Soles") y formulario con "Ingresá para ver el día de hoy.", EMAIL, CONTRASEÑA, "¿Olvidaste tu contraseña?", botón "Iniciar sesión" y "¿Te invitó la guardería? Activá tu cuenta" → `/activate`.
- [ ] Los campos de `/login` cargan vacíos (solo placeholders).
- [ ] Login con `caro@opendaycare.com` + `guarderia2026` redirige a `/` y guarda la sesión en `odc-session:v1`; al recargar, la sesión persiste.
- [ ] Login con `lucia.fernandez@gmail.com` + `familia2026` redirige a `/` (destino familia temporal, anotado en decisiones).
- [ ] Credenciales incorrectas o campos vacíos muestran error inline bajo el campo, sin redirect ni crash.
- [ ] `/activate` reproduce el comp: "Bienvenida a OpenDayCare", tarjeta "Te invitaron a seguir a / Mateo · Sala Soles" con avatar M, CÓDIGO DE INVITACIÓN precargado con `7K4P9`, EMAIL y CREAR CONTRASEÑA vacíos, checkbox de autorización, "Activar mi cuenta" y "¿Ya tenés cuenta? Iniciar sesión" → `/login`.
- [ ] Activar con `7K4P9` + `diego.fernandez@gmail.com` + contraseña ≥ 8 caracteres + checkbox marcado crea la sesión de Diego y redirige a `/`.
- [ ] Código inválido, email que no coincide, contraseña < 8 y checkbox desmarcado muestran cada uno su error inline, sin redirect.
- [ ] Tras activar y cerrar sesión, el login con `diego.fernandez@gmail.com` y la contraseña elegida funciona (cuenta persistida en `odc-accounts:v1`).
- [ ] El logout de la sidebar y del drawer mobile limpia la sesión y navega a `/login`.
- [ ] "¿Olvidaste tu contraseña?" no navega (decorativo).
- [ ] El perfil de Mateo (`/kids/mateo-fernandez`) sigue mostrando a Diego como PENDIENTE después de activar (el mock no muta).
- [ ] En <768px el panel izquierdo del login se oculta y queda el formulario centrado; `/activate` apila sin scroll horizontal.
- [ ] Ningún link navega a una ruta inexistente.
- [ ] Capturas guardadas en `.playwright-mcp/` (login y activación, desktop y mobile, un estado de error por pantalla).

## Decisiones

- **Sí:** sin selector "INGRESO COMO" — pedido explícito; el rol se deriva del usuario autenticado en el mock.
- **Sí:** rutas `/login` y `/activate` en inglés — convención de SPEC 02 (rutas en inglés, copy en español).
- **Sí:** usuarios e invitaciones en `lib/mock-data.ts` y sesión/cuentas en `lib/auth.ts` con claves versionadas — llegar la DB/auth real es cambiar la fuente, no la UI.
- **Sí:** cuentas activadas persistidas en `odc-accounts:v1` — el link "¿Ya tenés cuenta?" del comp implica poder re-loguearse tras activar.
- **Sí:** `homePathFor(role)` devuelve `/` para ambos roles — el destino familia queda temporal y un SPEC futuro (familia-feed) lo supersede cambiando una línea.
- **Sí:** demo de activación = Diego (pendiente real del mock) en vez de Lucía (comp) — coherencia con SPEC 02; se conserva el código `7K4P9` y la estructura visual del comp.
- **Sí:** "Bienvenida a OpenDayCare" verbatim aunque Diego sea varón — el comp es la fuente de verdad de la copy; derivar género es over-engineering para un mock.
- **Sí:** no mutar el mock — el perfil de Mateo sigue mostrando Diego PENDIENTE tras activar; la activación persiste en localStorage, no en el mock.
- **Sí:** errores inline al submit con `#C5503A` y tokens existentes — mismo criterio que la nav mobile y el estado vacío de specs previos.
- **Sí:** login vacío con placeholders; activación con código precargado (simula llegar desde el link del email) y tarjeta del niño visible desde ya.
- **Sí:** logout real en Sidebar/MobileNav — pedido; cambio mínimo a componentes ya verificados.
- **Sí:** rutas abiertas sin protección — sin backend, la protección es cosmética y arriesga regresión a pantallas verificadas.
- **Sí:** panel izquierdo del login oculto en <768px — mismo criterio que la sidebar de SPEC 01.
- **No:** selector Personal/Familia — pedido explícito.
- **No:** pantalla "olvidé mi contraseña" — no existe comp; el link queda decorativo.
- **No:** proteger `/` y `/kids` con sesión.
- **No:** incluir familia-feed o sidebar por rol en este spec.
- **No:** toggle de visibilidad de contraseña — no está en el comp.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Next 16 difiere de versiones previas (client components, `useRouter`, formularios) | Leer `node_modules/next/dist/docs/` antes de codear en `/spec-impl` |
| localStorage leído durante el render causaría mismatch de hidratación | Leer sesión solo en handlers/efectos, nunca en el render inicial de server components |
| Modo privado con localStorage bloqueado | try/catch con fallback en memoria; la app funciona sin persistencia |
| Logout toca Sidebar/MobileNav ya verificados | Captura de regresión de `/` y `/kids` en la verificación |

## Lo que **no** está en este spec

- familia-feed, destino y shell real de familia, "olvidé mi contraseña", emails de invitación, protección de rutas, DB/auth reales, mutación del estado de padres, sidebar por rol.

Cada una de esas, si llega, va en su propio spec.
