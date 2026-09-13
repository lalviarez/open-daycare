"use client";

import { useEffect, useState } from "react";
import { rooms } from "@/lib/mock-data";
import type { NewKidInput } from "@/lib/kids-storage";

type FieldErrors = {
  name?: string;
  birthDate?: string;
  roomName?: string;
};

type AddKidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (input: NewKidInput) => void;
};

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isValidDate(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function parseAllergyTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim().toUpperCase())
    .filter((tag) => tag.length > 0);
}

export function AddKidModal({ isOpen, onClose, onSuccess }: AddKidModalProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [roomName, setRoomName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

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

    if (!name.trim()) {
      nextErrors.name = "Completá el nombre completo.";
    }

    if (!birthDate.trim()) {
      nextErrors.birthDate = "Completá la fecha de nacimiento.";
    } else if (!isValidDate(birthDate)) {
      nextErrors.birthDate = "La fecha tiene que ser dd/mm/aaaa.";
    }

    if (!roomName) {
      nextErrors.roomName = "Elegí una sala.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    onSuccess({
      name: name.trim(),
      birthDate,
      roomName,
      allergyTags: parseAllergyTags(allergies),
      allergyNotes: notes.trim(),
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
      aria-labelledby="add-kid-title"
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-border bg-login-bg shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="text-[15px] font-bold text-dim hover:text-earth"
            >
              Cancelar
            </button>
            <span
              id="add-kid-title"
              className="font-heading text-lg font-semibold text-earth"
            >
              Agregar niño
            </span>
            <button
              type="submit"
              className="text-[15px] font-extrabold text-accent hover:text-coral-deep"
            >
              Guardar
            </button>
          </div>

          <div className="px-6 py-6">
            <label
              htmlFor="kid-name"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
            >
              Nombre completo
            </label>
            <input
              id="kid-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Martina López"
              className={`${inputBase} ${errors.name ? "border-coral-deep" : "border-input-border"}`}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm font-medium text-coral-deep">
                {errors.name}
              </p>
            )}

            <div className="mt-[18px] flex gap-3">
              <div className="flex-1">
                <label
                  htmlFor="kid-birthdate"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
                >
                  Fecha de nacimiento
                </label>
                <input
                  id="kid-birthdate"
                  type="text"
                  inputMode="numeric"
                  value={birthDate}
                  onChange={(event) =>
                    setBirthDate(maskDate(event.target.value))
                  }
                  placeholder="dd/mm/aaaa"
                  className={`${inputBase} ${errors.birthDate ? "border-coral-deep" : "border-input-border"}`}
                />
                {errors.birthDate && (
                  <p className="mt-1.5 text-sm font-medium text-coral-deep">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="kid-room"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
                >
                  Sala
                </label>
                <div className="relative">
                  <select
                    id="kid-room"
                    value={roomName}
                    onChange={(event) => setRoomName(event.target.value)}
                    className={`${inputBase} ${errors.roomName ? "border-coral-deep" : "border-input-border"} appearance-none pr-10 font-semibold`}
                  >
                    <option value="" disabled>
                      Seleccioná una sala
                    </option>
                    {rooms.map((room) => (
                      <option key={room.name} value={room.name}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-placeholder-text">
                    <ChevronDownIcon />
                  </span>
                </div>
                {errors.roomName && (
                  <p className="mt-1.5 text-sm font-medium text-coral-deep">
                    {errors.roomName}
                  </p>
                )}
              </div>
            </div>

            <label
              htmlFor="kid-allergies"
              className="mb-2 mt-[18px] block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
            >
              Alergias (etiquetas)
            </label>
            <input
              id="kid-allergies"
              type="text"
              value={allergies}
              onChange={(event) => setAllergies(event.target.value)}
              placeholder="Ej. Maní, Lactosa"
              className={`${inputBase} border-input-border`}
            />

            <label
              htmlFor="kid-notes"
              className="mb-2 mt-[18px] block text-xs font-extrabold uppercase tracking-[0.7px] text-dim"
            >
              Notas médicas
            </label>
            <textarea
              id="kid-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Indicaciones, medicación, contactos…"
              className="min-h-[90px] w-full resize-y rounded-[14px] border-[1.5px] border-input-border bg-white px-4 py-3.5 text-[15px] text-earth placeholder:text-dim/60 focus:border-login-mid focus:outline-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
