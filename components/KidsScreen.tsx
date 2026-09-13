"use client";

import { useEffect, useState } from "react";
import { children } from "@/lib/mock-data";
import { getLocalKids, addKid } from "@/lib/kids-storage";
import { KidsBrowser } from "@/components/KidsBrowser";
import { AddKidModal } from "@/components/AddKidModal";
import type { Child } from "@/lib/mock-data";

export default function KidsScreen({ mockKids }: { mockKids: Child[] }) {
  const [localKids, setLocalKids] = useState<Child[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar altas existentes de localStorage al montar
  useEffect(() => {
    const loaded = getLocalKids();
    setLocalKids(loaded);
  }, []);

  // Set de ids de los niños del mock (para saber cuáles son "originales")
  const mockIds = new Set(mockKids.map((kid) => kid.id));

  // Niños combinados: los altos locales primero, luego los del mock
  const mergedKids = [...localKids, ...mockKids];

  // Derivar el id único y agregar un niño al estado local
  const handleAddKid = (input: {
    name: string;
    birthDate: string;
    roomName: string;
    allergyTags: string[];
    allergyNotes: string;
  }) => {
    const child = addKid(input);
    setLocalKids((prev) => [child, ...prev]);
    setIsModalOpen(false);
  };

  // Máscara de fecha: dd/mm/aaaa
  const maskDate = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  // Validación simple de formato de fecha
  const isValidDate = (value: string): boolean => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // Parsear etiquetas de alergia separadas por coma
  const parseAllergyTags = (value: string): string[] =>
    value.split(",").map((tag) => tag.trim().toUpperCase()).filter((tag) => tag.length > 0);

  const inputBase =
    "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-earth placeholder:text-dim/60 focus:border-login-mid focus:outline-none";

  return (
    <>
      {/* Header con botón funcional */}
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-accent">
            GESTIÓN
          </div>
          <h1 className="font-heading text-[30px] font-semibold text-earth">
            Niños
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-[14px] bg-gradient-to-b from-coral to-coral-dark px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar niño
        </button>
      </div>

      <KidsBrowser kids={mergedKids} mockIds={mockIds} />

      <AddKidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(input) => handleAddKid(input)}
      />
    </>
  );
}