import { children } from "@/lib/mock-data";
import { KidsBrowser } from "@/components/KidsBrowser";

function PlusIcon() {
  return (
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
  );
}

export default function KidsPage() {
  return (
    <div className="mx-auto max-w-[880px] px-6 py-8 md:px-10 md:py-[34px]">
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-accent">
            GESTIÓN
          </div>
          <h1 className="font-heading text-[30px] font-semibold text-earth">
            Niños
          </h1>
        </div>
        <a
          href="#"
          className="flex items-center gap-2 rounded-[14px] bg-gradient-to-b from-coral to-coral-dark px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
        >
          <PlusIcon />
          Agregar niño
        </a>
      </div>
      <KidsBrowser kids={children} />
    </div>
  );
}
