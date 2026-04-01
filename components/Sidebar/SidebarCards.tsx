"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { sidebarStyles } from "./SidebarCards.styles";

export const SidebarCards = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const name = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Ishan Chathuranga Ranasing...";
  const avatarSrc = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

  return (
    <div id="home-sidebar-cards" className="flex flex-col gap-4">
      {/* 1. User Profile Card */}
      <div id="sidebar-user-card" className={sidebarStyles.card}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={avatarSrc}
              alt={name}
              className="h-14 w-14 rounded-full object-cover border-2 border-[var(--color-bg)] shadow-md"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-[var(--color-fg)] line-clamp-1">
                {name}
              </span>
              <span className="text-sm font-semibold text-blue-500 hover:underline cursor-pointer">
                Go to my profile
              </span>
            </div>
          </div>
          <button id="sidebar-request-time-off-btn" className={sidebarStyles.actionBtn}>
            Request time off
          </button>
        </div>
      </div>

      {/* 2. Help Card */}
      <div id="sidebar-help-card" className={sidebarStyles.card}>
        <div className={sidebarStyles.helpInner}>
          <h3 className={sidebarStyles.helpTitle}>Get help using MyConnect</h3>
          <p className={sidebarStyles.helpDesc}>
            Instantly get answers from the MyConnect Help Center, powered by AI.
          </p>
          <button id="sidebar-ask-question-btn" className={sidebarStyles.helpBtn}>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.13.19 2.217.535 3.235L.305 21.695a.5.5 0 0 0 .616.616l6.46-2.23C8.783 21.81 10.87 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-.89 0-1.74-.132-2.545-.375a.5.5 0 0 0-.447.07L4.6 21.15l1.455-4.408a.5.5 0 0 0-.07-.447C5.132 14.74 5 13.89 5 13c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
              </svg>
              Ask a question
            </span>
          </button>
        </div>
      </div>

      {/* 3. Quick Actions Card */}
      <div id="sidebar-quick-actions-card" className={sidebarStyles.card}>
        <div className="p-4 border-b border-[var(--color-border)]">
          <h3 className={sidebarStyles.cardTitle}>Quick actions</h3>
        </div>
        <div className="flex flex-col">
          {/* My Reviews */}
          <div id="sidebar-action-my-reviews" className={sidebarStyles.listItem}>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[var(--color-fg)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className={sidebarStyles.listItemLabel}>My reviews</span>
            </div>
            <svg className={sidebarStyles.listItemArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Company Docs */}
          <div id="sidebar-action-company-docs" className={sidebarStyles.listItem}>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[var(--color-fg)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className={sidebarStyles.listItemLabel}>Company docs</span>
            </div>
            <svg className={sidebarStyles.listItemArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
