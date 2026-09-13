"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { homePathFor, signIn } from "@/lib/auth";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    const nextErrors: FieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Completá tu email.";
    }
    if (!password) {
      nextErrors.password = "Completá tu contraseña.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const session = signIn(email, password);
    setIsSubmitting(false);

    if (!session) {
      setGeneralError("Email o contraseña incorrectos.");
      return;
    }

    router.push(homePathFor(session.role));
  };

  const inputBase =
    "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-earth placeholder:text-dim/60 focus:border-login-mid focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[392px]" noValidate>
      <h2 className="font-heading text-[30px] font-semibold leading-none text-earth">
        Iniciar sesión
      </h2>
      <p className="mb-7 mt-1.5 text-[15px] text-dim">
        Ingresá para ver el día de hoy.
      </p>

      <label
        htmlFor="email"
        className="mb-2 block text-xs font-bold uppercase tracking-[0.7px] text-dim"
      >
        Email
      </label>
      <input
        id="email"
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
        htmlFor="password"
        className="mb-2 mt-[18px] block text-xs font-bold uppercase tracking-[0.7px] text-dim"
      >
        Contraseña
      </label>
      <input
        id="password"
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

      <div className="mb-5 mt-2.5 text-right">
        <span className="cursor-pointer text-[13.5px] font-bold text-coral-deep">
          ¿Olvidaste tu contraseña?
        </span>
      </div>

      {generalError && (
        <p className="mb-4 text-sm font-medium text-coral-deep">{generalError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="block w-full rounded-[15px] bg-gradient-to-b from-coral to-coral-dark py-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] disabled:opacity-70"
      >
        Iniciar sesión
      </button>

      <p className="mt-6 text-center text-[14.5px] text-dim">
        ¿Te invitó la guardería?{" "}
        <Link href="/activate" className="font-extrabold text-coral-deep">
          Activá tu cuenta
        </Link>
      </p>
    </form>
  );
}
