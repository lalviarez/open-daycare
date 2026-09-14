"use client";

import { useState } from "react";
import { getLocalKids, addKid } from "@/lib/kids-storage";
import { KidsBrowser } from "@/components/KidsBrowser";
import { AddKidModal } from "@/components/AddKidModal";
import type { Child } from "@/lib/mock-data";

export default function KidsScreen({ mockKids }: { mockKids: Child[] }) {
  const [localKids, setLocalKids] = useState<Child[]>(() => getLocalKids());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set de ids de los niños del mock (para saber cuáles son "originales")
  const mockIds = new Set(mockKids.map((kid) => kid.id));

  // Niños combinados: los altos locales primero, luego los del mock
  const mergedKids = [...localKids, ...mockKids];

  // Agregar un niño al estado local
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

  return (
    <div className="mx-auto max-w-[880px] px-6 py-8 md:px-10 md:py-[34px]">
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
          className="flex cursor-pointer items-center gap-2 rounded-[14px] bg-gradient-to-b from-coral to-coral-dark px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
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
    </div>
  );
}