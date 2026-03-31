"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const avatarSrc = user?.profileImage
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "User"
    )}&background=6366f1&color=fff`;

  return (
    <div
      id="home-post-creator"
      className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
    >
      {/* Top: Avatar + Input */}
      <div className="flex items-center gap-3 p-3 text-[var(--color-fg)]">
        <img
          id="home-post-creator-avatar"
          src={avatarSrc}
          alt="Your avatar"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <input
          id="home-post-creator-input"
          type="text"
          placeholder="Post a Shoutout"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-full bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-fg)] placeholder-[var(--color-fg)]/50 outline-none transition-all duration-200 border border-transparent focus:border-[var(--color-border)] hover:bg-[var(--color-border)]/20"
        />
      </div>

      {/* Bottom: Actions */}
      <div className="flex items-center border-t border-[var(--color-border)]">
        <button
          id="home-post-creator-kudos-btn"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 py-3 text-sm font-bold text-[var(--color-fg)] opacity-70 transition-all hover:bg-[var(--color-fg)]/5 hover:opacity-100 rounded-bl-md"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 5h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h.215A5.98 5.98 0 0 0 11 16.94V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.06A5.98 5.98 0 0 0 15.785 15H16a5 5 0 0 0 5-5V7a2 2 0 0 0-2-2zM5 10V7h2v3.918A3.003 3.003 0 0 1 5 10zm12 3a3.001 3.001 0 0 1-2 .918V7h2v6z" />
          </svg>
          Give Kudos
        </button>

        <button
          id="home-post-creator-poll-btn"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 py-3 text-sm font-bold text-[var(--color-fg)] opacity-70 transition-all hover:bg-[var(--color-fg)]/5 hover:opacity-100 rounded-br-md"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zm2 1v14h14V5H5zm3 3h2v8H8V8zm4-2h2v10h-2V6zm4 4h2v6h-2v-6z" />
          </svg>
          Create a poll
        </button>
      </div>
    </div>
  );
}
