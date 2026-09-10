"use client";

import type { Post, PostType } from "@/lib/mock-data";

const badgeConfig: Record<
  PostType,
  { label: string; bg: string; text: string }
> = {
  achievement: { label: "LOGRO", bg: "bg-achievement-bg", text: "text-achievement-text" },
  activity: { label: "ACTIVIDAD", bg: "bg-activity-bg", text: "text-activity-text" },
  announcement: { label: "ANUNCIO", bg: "bg-announcement-bg", text: "text-announcement-text" },
};

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function PhotoPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  );
}

function Avatar({ post }: { post: Post }) {
  if (post.type === "announcement") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-announcement-bg text-announcement-text">
        <MegaphoneIcon />
      </div>
    );
  }

  const initial = post.child?.charAt(0) ?? "?";
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-avatar-blue-bg font-heading text-[17px] font-semibold text-avatar-blue-text">
      {initial}
    </div>
  );
}

function Badge({ type }: { type: PostType }) {
  const config = badgeConfig[type];
  return (
    <div
      className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${config.bg}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.text}`} />
      <span
        className={`text-[12px] font-extrabold tracking-[0.5px] ${config.text}`}
      >
        {config.label}
      </span>
    </div>
  );
}

function PhotoPlaceholder({ caption }: { caption: string }) {
  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      className="mt-3.5 flex h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-placeholder-border bg-placeholder-bg text-placeholder-text"
    >
      <PhotoPlaceholderIcon />
      <span className="text-[13.5px]">Foto · {caption}</span>
    </a>
  );
}

export function PostCard({ post }: { post: Post }) {
  const title = post.child ?? "Anuncio general";
  const config = badgeConfig[post.type];

  return (
    <article className="rounded-[20px] border border-border bg-paper p-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)]">
      <div className="mb-3.5 flex items-center gap-3">
        <Avatar post={post} />
        <div className="min-w-0 flex-1">
          <div className="font-heading text-[16.5px] font-semibold text-earth">
            {title}
          </div>
          <div className="text-[12.5px] text-muted">
            {post.time} · publicado por vos
          </div>
        </div>
        <Badge type={post.type} />
      </div>

      <div className="mb-2.5 text-[12.5px] text-muted">Para: {post.audience}</div>

      <p className="text-[15.5px] leading-[1.55] text-body">{post.body}</p>

      {post.type === "activity" && post.photoCaption && (
        <PhotoPlaceholder caption={post.photoCaption} />
      )}

      <div className="mt-4 flex items-center gap-[18px] border-t border-footer-border pt-3.5">
        <span className="flex items-center gap-[7px] text-[14px] font-bold text-coral-text">
          <HeartIcon />
          {post.likes}
        </span>
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="flex items-center gap-[7px] text-[14px] font-bold text-dim"
        >
          <CommentIcon />
          {post.comments}
        </a>
        <span className="flex-1" />
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="text-[14px] font-extrabold text-coral-deep"
        >
          Editar
        </a>
      </div>
    </article>
  );
}
