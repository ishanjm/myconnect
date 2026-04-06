"use client";

import { Post, PostAttributes } from "@/model/Post";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deletePostRequest } from "@/store/slices/posts";

function timeAgo(dateStr: string | Date | undefined) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostCard({ post }: { post: PostAttributes }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isOwner = currentUser?.id === post.userId;

  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const reactions = post.reactions || { likes: 0, comments: 0, shares: 0 };
  const [likeCount, setLikeCount] = useState(reactions.likes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleDelete = () => {
    dispatch(deletePostRequest(post.id));
    setShowMenu(false);
  };

  return (
    <article
      id={`home-post-card-${post.id}`}
      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <img
            id={`home-post-card-${post.id}-avatar`}
            src={post.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'User')}&background=random&color=fff`}
            alt={post.author?.name || "User"}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[var(--color-fg)]">{post.author?.name || "Unknown User"}</p>
              {post.author?.subscription && (
                <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                  {post.author.subscription}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-fg)] opacity-50">
              {timeAgo(post.createdAt ? (typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.toISOString()) : new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* More Options */}
        <div className="relative">
          <button
            id={`home-post-card-${post.id}-more-btn`}
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-1.5 text-[var(--color-fg)] opacity-40 transition-all hover:bg-accent/10 hover:opacity-100 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
          </button>

          {showMenu && (
            <>
              {/* Overlay to close menu */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div 
                id={`home-post-card-${post.id}-menu`}
                className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-xl animate-in fade-in zoom-in-95 duration-100"
              >
                {isOwner ? (
                  <button
                    id={`home-post-card-${post.id}-delete-btn`}
                    onClick={handleDelete}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                ) : (
                  <button
                    className="flex w-full cursor-not-allowed items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-[var(--color-fg)] opacity-50 transition-all"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Report
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed text-[var(--color-fg)] opacity-90">{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[11px] font-semibold text-accent cursor-pointer hover:underline"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mx-4 mb-3 overflow-hidden rounded-xl">
          <img
            id={`home-post-card-${post.id}-image`}
            src={post.imageUrl}
            alt="Post attachment"
            className="w-full object-cover max-h-72 transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 text-xs text-[var(--color-fg)] opacity-50 border-t border-[var(--color-border)]">
        <span>{likeCount} likes</span>
        <span>{reactions.comments} comments · {reactions.shares} shares</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button
          id={`home-post-card-${post.id}-like-btn`}
          onClick={handleLike}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 hover:bg-accent/10 active:scale-95 ${
            liked ? "text-accent" : "text-[var(--color-fg)] opacity-60 hover:opacity-100"
          }`}
        >
          <svg className="h-4 w-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>

        <button
          id={`home-post-card-${post.id}-comment-btn`}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[var(--color-fg)] opacity-60 transition-all hover:bg-accent/10 hover:opacity-100 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>

        <button
          id={`home-post-card-${post.id}-share-btn`}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[var(--color-fg)] opacity-60 transition-all hover:bg-accent/10 hover:opacity-100 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </article>
  );
}
