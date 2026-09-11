import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { children, room, type Parent, type ParentStatus } from "@/lib/mock-data";

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

function BackIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function DaySummaryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function AllergyIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

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

type ProfileParams = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProfileParams) {
  const { slug } = await params;
  const child = children.find((c) => c.id === slug);
  return {
    title: child ? `${child.name} · OpenDayCare` : "Niño no encontrado · OpenDayCare",
  };
}

function ProfileHeader({ child }: { child: (typeof children)[number] }) {
  return (
    <div className="flex items-center gap-[18px]">
      <Avatar
        name={child.name}
        color={child.avatarColor}
        size={84}
        variant="kid"
      />
      <div className="flex-1">
        <h1 className="font-heading text-[28px] font-semibold text-earth">
          {child.name}
        </h1>
        <p className="mt-[3px] text-[15px] text-dim">
          {child.ageLabel} · Sala {room.name}
        </p>
      </div>
      <a
        href="#"
                className="rounded-[12px] border-[1.5px] border-border bg-paper px-4 py-[9px] text-[14px] font-bold text-stone"
      >
        Editar
      </a>
    </div>
  );
}

function AllergyCard({ child }: { child: (typeof children)[number] }) {
  if (!child.allergyNotes && child.allergyTags.length === 0) return null;

  return (
    <div className="flex gap-[14px] rounded-[16px] bg-allergy-card-bg p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-allergy-icon-bg text-white">
        <AllergyIcon />
      </div>
      <div>
        <div className="mb-[2px] text-[15px] font-extrabold text-allergy-title-text">
          Alergias y notas
        </div>
        <div className="text-[14.5px] leading-relaxed text-allergy-body-text">
          {child.allergyNotes}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ child }: { child: (typeof children)[number] }) {
  const rows = [
    { label: "Fecha de nacimiento", value: child.birthDateLabel },
    { label: "Sala", value: room.name },
    { label: "Ingreso", value: child.enrollmentLabel },
  ];

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-paper">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex justify-between px-[18px] py-[15px] ${
            index < rows.length - 1 ? "border-b border-footer-border" : ""
          }`}
        >
          <span className="text-[14.5px] text-dim">{row.label}</span>
          <span className="text-[14.5px] font-extrabold text-earth">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function DaySummaryButton() {
  return (
    <a
      href="#"
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-earth p-[13px] text-[15px] font-extrabold text-white"
    >
      <DaySummaryIcon />
      Resumen del día
    </a>
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

function ParentsCard({ parents }: { parents: Parent[] }) {
  return (
    <div className="rounded-[16px] border border-border bg-paper p-4">
      <div className="mb-[14px] text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-dim">
        PADRES VINCULADOS
      </div>
      <div className="flex flex-col gap-[14px]">
        {parents.map((parent) => (
          <ParentRow key={parent.name} parent={parent} />
        ))}
        <a
          href="#"
                    className="flex items-center gap-[12px] pt-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-dashed border-border text-muted">
            <PlusIcon />
          </span>
          <span className="text-[14.5px] font-extrabold text-coral-deep">
            Vincular otro padre
          </span>
        </a>
      </div>
    </div>
  );
}

export default async function ChildProfilePage({ params }: ProfileParams) {
  const { slug } = await params;
  const child = children.find((c) => c.id === slug);
  if (!child) notFound();

  return (
    <div className="mx-auto max-w-[820px] px-6 py-8 md:px-10 md:py-[34px]">
      <Link
        href="/kids"
        className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-dim"
      >
        <BackIcon />
        Volver a Niños
      </Link>

      <div className="flex flex-wrap items-start gap-[26px]">
        <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
          <ProfileHeader child={child} />
          <AllergyCard child={child} />
          <InfoCard child={child} />
        </div>

        <aside className="flex w-full flex-none flex-col gap-[14px] md:w-[300px]">
          <DaySummaryButton />
          <ParentsCard parents={child.parents} />
        </aside>
      </div>
    </div>
  );
}
