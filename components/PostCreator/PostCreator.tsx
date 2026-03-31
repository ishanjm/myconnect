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
      className={`w-full rounded-2xl border bg-[var(--color-surface)] shadow-sm transition-all duration-300 ${isFocused ? "border-accent shadow-accent/10 shadow-md" : "border-[var(--color-border)]"
        }`}
    >
      {/* Top: Avatar + Textarea */}
      <div className="flex gap-3 p-4">
        <img
          id="home-post-creator-avatar"
          src={avatarSrc}
          alt="Your avatar"
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-accent/40"
        />
        <textarea
          id="home-post-creator-input"
          rows={isFocused ? 3 : 1}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { if (!content) setIsFocused(false); }}
          className="w-full resize-none rounded-xl bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-fg)] placeholder-[var(--color-fg)]/40 outline-none transition-all duration-200 border border-[var(--color-border)] focus:border-accent"
        />
      </div>

      {/* Bottom: Attachments + Actions */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-2.5">
        {/* Attachment Options */}
        <div className="flex items-center gap-1">
          <button
            id="home-post-creator-photo-btn"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] opacity-60 transition-all hover:bg-accent/10 hover:opacity-100"
            title="Add photo"
          >
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button
            id="home-post-creator-video-btn"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] opacity-60 transition-all hover:bg-accent/10 hover:opacity-100"
            title="Add video"
          >
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Video</span>
          </button>

          <button
            id="home-post-creator-tag-btn"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] opacity-60 transition-all hover:bg-accent/10 hover:opacity-100"
            title="Tag someone"
          >
            <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="hidden sm:inline">Tag</span>
          </button>
        </div>

        {/* Post Button */}
        <button
          id="home-post-creator-submit-btn"
          disabled={!content.trim()}
          className={`rounded-full px-5 py-1.5 text-sm font-bold transition-all duration-200 ${content.trim()
              ? "cursor-pointer bg-accent text-white hover:opacity-90 active:scale-95 shadow-sm"
              : "cursor-not-allowed opacity-40 bg-[var(--color-border)] text-[var(--color-fg)]"
            }`}
        >
          <svg className="inline-block h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Post
        </button>
      </div>
    </div>
  );
}
