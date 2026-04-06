"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Modal } from "../common/Modal";
import { KudosModalContent } from "./KudosModalContent";
import { PollModalContent } from "./PollModalContent";
import { createPostRequest } from "@/store/slices/posts";

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"kudos" | "poll" | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { isPosting } = useSelector((state: RootState) => state.posts);

  const avatarSrc = user?.profileImage
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "User"
    )}&background=4f46e5&color=fff`;

  const closeModal = () => setActiveModal(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = () => {
    if (!content.trim() && !selectedFile) return;
    dispatch(createPostRequest({ content, file: selectedFile }));
    // Clear form on success (the epic should handle success state, 
    // but for immediate UI feedback we'll clear here or wait for success)
    setContent("");
    removeImage();
  };

  return (
    <>
      <div
        id="home-post-creator"
        className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md overflow-hidden transition-all duration-300"
      >
        {/* Top: Avatar + Input */}
        <div className="flex items-start gap-4 p-4 text-[var(--color-fg)]">
          <img
            id="home-post-creator-avatar"
            src={avatarSrc}
            alt="Your avatar"
            className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-[var(--color-border)] shadow-sm"
          />
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              id="home-post-creator-input"
              rows={content ? 3 : 1}
              placeholder="Post a Shoutout"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-2xl bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-fg)] placeholder-[var(--color-fg)]/40 outline-none transition-all duration-300 border border-transparent focus:border-accent/30 hover:bg-[var(--color-border)]/20 resize-none min-h-[44px]"
            />
            
            {/* Image Preview Area */}
            {previewUrl && (
              <div className="relative group w-fit max-w-full rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm bg-[var(--color-bg)] mt-2">
                <img 
                  src={previewUrl} 
                  alt="Selected preview" 
                  className="max-h-48 w-auto object-contain rounded-xl"
                />
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]/30 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            {/* Image Upload Trigger */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-accent hover:bg-accent/10 rounded-full transition-all group"
              title="Add Image"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              id="home-post-creator-kudos-btn"
              onClick={() => setActiveModal("kudos")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--color-fg)]/60 hover:text-accent hover:bg-accent/5 transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h.215A5.98 5.98 0 0 0 11 16.94V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.06A5.98 5.98 0 0 0 15.785 15H16a5 5 0 0 0 5-5V7a2 2 0 0 0-2-2zM5 10V7h2v3.918A3.003 3.003 0 0 1 5 10zm12 3a3.001 3.001 0 0 1-2 .918V7h2v6z" />
              </svg>
              Give Kudos
            </button>

            <button
              id="home-post-creator-poll-btn"
              onClick={() => setActiveModal("poll")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--color-fg)]/60 hover:text-accent hover:bg-accent/5 transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zm2 1v14h14V5H5zm3 3h2v8H8V8zm4-2h2v10h-2V6zm4 4h2v6h-2v-6z" />
              </svg>
              Poll
            </button>
          </div>

          <button
            id="home-post-creator-submit-btn"
            onClick={handlePost}
            disabled={(!content.trim() && !selectedFile) || isPosting}
            className="px-6 py-2 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        id="home-kudos-modal"
        isOpen={activeModal === "kudos"}
        onClose={closeModal}
        title="Give Kudos"
      >
        <KudosModalContent onSuccess={closeModal} />
      </Modal>

      <Modal
        id="home-poll-modal"
        isOpen={activeModal === "poll"}
        onClose={closeModal}
        title="Ask me anything"
      >
        <PollModalContent onSuccess={closeModal} />
      </Modal>
    </>
  );
}
