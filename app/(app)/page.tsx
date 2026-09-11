import { PostCard } from "@/components/PostCard";
import { children, currentUser, posts, room } from "@/lib/mock-data";

function CameraIcon() {
  return (
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
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ComposerTrigger() {
  return (
    <button
      type="button"
      className="mb-6 flex w-full items-center gap-[14px] rounded-[18px] border border-border bg-paper px-[18px] py-3.5 text-left shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-user-avatar-bg font-heading text-[16px] font-semibold text-white">
        {currentUser.initial}
      </div>
      <span className="flex-1 text-[15px] text-muted">Compartí un momento…</span>
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-nav-active-bg text-coral-text">
        <CameraIcon />
      </span>
    </button>
  );
}

function TodayDivider() {
  return (
    <div className="mb-3.5 flex items-center gap-[14px]">
      <span className="text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-dim">
        PUBLICADO HOY
      </span>
      <span className="h-[1px] flex-1 bg-divider" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-8 md:px-10 md:py-[34px]">
      <header className="mb-6">
        <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-accent">
          GUARDERÍA · SALA {room.name.toUpperCase()}
        </div>
        <h1 className="font-heading text-[30px] font-semibold text-earth">
          Buenas, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[14.5px] text-dim">
          {children.length} niños · {room.dateLabel}
        </p>
      </header>

      <ComposerTrigger />
      <TodayDivider />

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
