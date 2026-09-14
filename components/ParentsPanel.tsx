"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { LinkParentModal } from "@/components/LinkParentModal";
import {
  generateInvitationCode,
  getParentsForChild,
  addInvitation,
  getLocalInvitations,
  type NewInvitationInput,
} from "@/lib/invitations-storage";
import type { Child, Parent, ParentStatus } from "@/lib/mock-data";

const STATUS_CONFIG: Record<
  ParentStatus,
  { label: string; detail: string; chipBg: string; chipText: string }
> = {
  active: {
    label: "ACTIVA",
    detail: "activa",
    chipBg: "bg-status-active-bg",
    chipText: "text-status-active-text",
  },
  pending: {
    label: "PENDIENTE",
    detail: "invitación enviada",
    chipBg: "bg-status-pending-bg",
    chipText: "text-status-pending-text",
  },
};

function PlusIcon() {
  return (
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ParentRow({ parent }: { parent: Parent }) {
  const config = STATUS_CONFIG[parent.status];

  return (
    <div className="flex items-center gap-[12px]">
      <Avatar
        name={parent.name}
        color={parent.avatarColor}
        size={40}
        variant="parent"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-extrabold text-earth">
          {parent.name}
        </div>
        <div className="text-[12.5px] text-muted">
          {parent.role} · {config.detail}
        </div>
      </div>
      <span
        className={`shrink-0 rounded-full px-[9px] py-[4px] text-[10.5px] font-extrabold ${config.chipBg} ${config.chipText}`}
      >
        {config.label}
      </span>
    </div>
  );
}

type ParentsPanelProps = {
  child: Child;
};

export function ParentsPanel({ child }: ParentsPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parents, setParents] = useState<Parent[]>(() =>
    getParentsForChild(child.id, child.parents)
  );
  const [generatedCode, setGeneratedCode] = useState("");

  const handleOpenModal = () => {
    setGeneratedCode(generateInvitationCode());
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGeneratedCode("");
  };

  const handleSuccess = (input: NewInvitationInput & { code: string }) => {
    addInvitation(input);
    setParents(getParentsForChild(child.id, child.parents));
    setIsModalOpen(false);
    setGeneratedCode("");
  };

  const existingEmails = getLocalInvitations()
    .filter((inv) => inv.childId === child.id)
    .map((inv) => inv.email.toLowerCase());

  return (
    <>
      <div className="rounded-[16px] border border-border bg-paper p-4">
        <div className="mb-[14px] text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-dim">
          PADRES VINCULADOS
        </div>
        <div className="flex flex-col gap-[14px]">
          {parents.map((parent) => (
            <ParentRow key={parent.name} parent={parent} />
          ))}
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex cursor-pointer items-center gap-[12px] pt-2 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-dashed border-border text-muted">
              <PlusIcon />
            </span>
            <span className="text-[14.5px] font-extrabold text-coral-deep">
              Vincular otro padre
            </span>
          </button>
        </div>
      </div>

      <LinkParentModal
        key={generatedCode}
        isOpen={isModalOpen}
        childId={child.id}
        childName={child.name}
        existingEmails={existingEmails}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        generatedCode={generatedCode}
      />
    </>
  );
}