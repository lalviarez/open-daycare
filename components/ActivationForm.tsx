"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { activateAccount, homePathFor } from "@/lib/auth";
import { children, invitations, room } from "@/lib/mock-data";
import { getLocalInvitations } from "@/lib/invitations-storage";

type FieldErrors = {
  code?: string;
  email?: string;
  password?: string;
  consent?: string;
};

export function ActivationForm() {
  const router = useRouter();
  const [code, setCode] = useState("7K4P9");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invitation = useMemo(() => {
    const normalizedCode = code.trim().toUpperCase();
    const mock = invitations.find(
      (item) => item.code.toUpperCase() === normalizedCode
    );
    if (mock) return mock;
    const local = getLocalInvitations().find(
      (item) => item.code.toUpperCase() === normalizedCode
    );
    return local ?? null;
  }, [code]);

  const child = useMemo(() => {
    if (!invitation) return null;
    return children.find((item) => item.id === invitation.childId) ?? null;
  }, [invitation]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};

    if (!invitation) {
      nextErrors.code = "El código no es válido o expiró.";
    }
    if (!email.trim()) {
      nextErrors.email = "Completá tu email.";
    }
    if (password.length < 8) {
      nextErrors.password = "La contraseña necesita al menos 8 caracteres.";
    }
    if (!consentChecked) {
      nextErrors.consent =
        "Para activar necesitamos tu autorización para compartir fotos.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const result = activateAccount(code, email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      if (result.error === "code") {
        setFieldErrors({ code: "El código no es válido o expiró." });
      } else if (result.error === "email") {
        setFieldErrors({ email: "El email no coincide con la invitación." });
      } else if (result.error === "password") {
        setFieldErrors({
          password: "La contraseña necesita al menos 8 caracteres.",
        });
      }
      return;
    }

    router.push(homePathFor(result.session.role));
  };

  const inputBase =
    "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-earth placeholder:text-dim/60 focus:border-login-mid focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[440px]" noValidate>
      <div className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-gradient-to-br from-logo-start to-logo-end shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </div>

      <h1 className="font-heading text-[32px] font-semibold leading-[1.15] text-earth">
        Bienvenida a OpenDayCare
      </h1>
      <p className="mb-[26px] mt-2 text-[15.5px] leading-[1.55] text-dim">
        Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar
        la cuenta.
      </p>

      {child && invitation && (
        <div className="mb-[22px] flex items-center gap-[14px] rounded-2xl border-[1.5px] border-input-border bg-white px-4 py-3.5">
          <Avatar
            name={child.name}
            color={child.avatarColor}
            size={44}
            variant="kid"
          />
          <div>
            <div className="text-[13px] text-dim">Te invitaron a seguir a</div>
            <div className="font-heading text-[17px] font-semibold text-earth">
              {child.name.split(" ")[0]} · Sala {room.name}
            </div>
          </div>
        </div>
      )}

      <label
        htmlFor="code"
        className="mb-2 block text-xs font-bold uppercase tracking-[0.7px] text-dim"
      >
        Código de invitación
      </label>
      <input
        id="code"
        type="text"
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        className={`${inputBase} font-heading text-lg font-bold uppercase tracking-[3px] ${fieldErrors.code ? "border-coral-deep" : "border-input-border"}`}
      />
      {fieldErrors.code && (
        <p className="mt-1.5 text-sm font-medium text-coral-deep">
          {fieldErrors.code}
        </p>
      )}

      <label
        htmlFor="activation-email"
        className="mb-2 mt-[18px] block text-xs font-bold uppercase tracking-[0.7px] text-dim"
      >
        Email
      </label>
      <input
        id="activation-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tu@email.com"
        className={`${inputBase} ${fieldErrors.email ? "border-coral-deep" : "border-input-border"}`}
      />
      {fieldErrors.email && (
        <p className="mt-1.5 text-sm font-medium text-coral-deep">
          {fieldErrors.email}
        </p>
      )}

      <label
        htmlFor="activation-password"
        className="mb-2 mt-[18px] block text-xs font-bold uppercase tracking-[0.7px] text-dim"
      >
        Crear contraseña
      </label>
      <input
        id="activation-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        className={`${inputBase} ${fieldErrors.password ? "border-coral-deep" : "border-input-border"}`}
      />
      {fieldErrors.password && (
        <p className="mt-1.5 text-sm font-medium text-coral-deep">
          {fieldErrors.password}
        </p>
      )}

      <label
        className={`mb-6 mt-2 flex cursor-pointer items-start gap-3 rounded-[14px] bg-consent-bg px-4 py-3.5 ${fieldErrors.consent ? "ring-2 ring-coral-deep" : ""}`}
      >
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={(event) => setConsentChecked(event.target.checked)}
          className="sr-only"
        />
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${consentChecked ? "bg-consent-check" : "border-2 border-consent-text/30 bg-white"}`}
        >
          {consentChecked && (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="text-[14px] leading-[1.45] text-consent-text">
          Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de
          la app.
        </span>
      </label>
      {fieldErrors.consent && (
        <p className="mb-4 text-sm font-medium text-coral-deep">
          {fieldErrors.consent}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="block w-full rounded-[15px] bg-gradient-to-b from-coral to-coral-dark py-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] disabled:opacity-70"
      >
        Activar mi cuenta
      </button>

      <p className="mt-5 text-center text-[14.5px] text-dim">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-extrabold text-coral-deep">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
