"use client";

import { useEffect, useState } from "react";
import type { NewInvitationInput } from "@/lib/invitations-storage";

type FieldErrors = {
  parentName?: string;
  email?: string;
  parentRole?: string;
};

type LinkParentModalProps = {
  isOpen: boolean;
  childId: string;
  childName: string;
  existingEmails: string[];
  onClose: () => void;
  onSuccess: (input: NewInvitationInput & { code: string }) => void;
  generatedCode: string;
};

const PARENT_ROLES = ["Mamá", "Papá", "Tutor/a"] as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LinkParentModal({
  isOpen,
  childId,
  childName,
  existingEmails,
  onClose,
  onSuccess,
  generatedCode,
}: LinkParentModalProps) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [parentRole, setParentRole] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const childFirstName = childName.split(" ")[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!parentName.trim()) {
      nextErrors.parentName = "Completá el nombre del padre o madre.";
    }

    if (!email.trim()) {
      nextErrors.email = "Completá el email.";
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = "Ingresá un email válido.";
    } else if (existingEmails.includes(email.trim().toLowerCase())) {
      nextErrors.email = "Ese email ya está vinculado a este niño.";
    }

    if (!parentRole) {
      nextErrors.parentRole = "Elegí el parentesco.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    onSuccess({
      code: generatedCode,
      parentName: parentName.trim(),
      parentRole,
      email: email.trim().toLowerCase(),
      childId,
    });
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const inputBase =
    "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-earth placeholder:text-dim/60 focus:border-login-mid focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-earth/45 p-4 pt-10 md:p-6 md:pt-12"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-parent-title"
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] border border-border bg-login-bg shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <span
              id="link-parent-title"
              className="font-heading text-lg font-semibold text-earth"
            >
              Vincular padre
            </span>
            <span className="ml-2 text-[13px] text-muted">a {childName}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-footer-border text-dim hover:text-earth"
            aria-label="Cerrar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 py-5">
          <div className="mb-5 flex gap-2.5 rounded-[14px] bg-info-bg p-3.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-announcement-text"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="text-[13.5px] leading-snug text-info-text">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de {childFirstName}.
            </span>
          </div>

          <label
            htmlFor="parent-name"
            className="mb-2 block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
          >
            NOMBRE DEL PADRE/MADRE
          </label>
          <input
            id="parent-name"
            type="text"
            value={parentName}
            onChange={(event) => setParentName(event.target.value)}
            placeholder="Ej. Diego Fernández"
            className={`${inputBase} ${errors.parentName ? "border-coral-deep" : "border-input-border"}`}
          />
          {errors.parentName && (
            <p className="mt-1.5 text-sm font-medium text-coral-deep">
              {errors.parentName}
            </p>
          )}

          <label
            htmlFor="parent-email"
            className="mb-2 mt-[18px] block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
          >
            EMAIL
          </label>
          <input
            id="parent-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            className={`${inputBase} ${errors.email ? "border-coral-deep" : "border-input-border"}`}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm font-medium text-coral-deep">
              {errors.email}
            </p>
          )}

          <label className="mb-2.5 mt-[18px] block text-xs font-extrabold uppercase tracking-[0.7px] text-dim">
            PARENTESCO
          </label>
          <div className="mb-5 flex gap-2.5">
            {PARENT_ROLES.map((role) => {
              const isSelected = parentRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setParentRole(role)}
                  className={`flex-1 rounded-full border-[1.5px] py-2.5 text-[14px] font-extrabold transition-colors ${
                    isSelected
                      ? "border-pill-selected-border bg-announcement-bg text-announcement-text"
                      : "border-border bg-paper text-stone"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
          {errors.parentRole && (
            <p className="-mt-3 mb-5 text-sm font-medium text-coral-deep">
              {errors.parentRole}
            </p>
          )}

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-code-box-border bg-consent-bg p-4 text-center">
            <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.7px] text-code-box-title">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-heading text-[34px] font-semibold tracking-[7px] text-consent-text">
              {generatedCode}
            </div>
            <div className="mt-1.5 text-[13px] text-code-box-title">
              Vence en 7 días
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-b from-coral to-coral-dark px-4 py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] hover:opacity-90"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
            Enviar invitación
          </button>
        </form>
      </div>
    </div>
  );
}