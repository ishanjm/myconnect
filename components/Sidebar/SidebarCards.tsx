"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { sidebarStyles } from "./SidebarCards.styles";
import Link from "next/link";
import { hasPermission } from "@/common/permissions";

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
              <Link href="/profile" className="text-sm font-semibold text-blue-500 hover:underline cursor-pointer">
                Go to my profile
              </Link>
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
          <Link 
            href="/documents" 
            id="sidebar-action-company-docs" 
            className={sidebarStyles.listItem}
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[var(--color-fg)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className={sidebarStyles.listItemLabel}>Documents</span>
            </div>
            <svg className={sidebarStyles.listItemArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {/* Quiz */}
          {hasPermission(user?.subscription, 'quiz_builder') && (
            <Link 
              href="/quiz" 
              id="sidebar-action-quiz" 
              className={sidebarStyles.listItem}
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[var(--color-fg)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={sidebarStyles.listItemLabel}>Quiz</span>
              </div>
              <svg className={sidebarStyles.listItemArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Student Go to Quiz */}
          {hasPermission(user?.subscription, 'take_quiz') && (
            <Link 
              href="/take-quiz" 
              id="sidebar-action-take-quiz" 
              className={sidebarStyles.listItem}
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={sidebarStyles.listItemLabel}>Go to Quiz</span>
              </div>
              <svg className={sidebarStyles.listItemArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* 4. Master Data Card */}
      <div id="sidebar-master-data-card" className={sidebarStyles.card}>
        <div className="p-4 border-b border-[var(--color-border)]">
          <h3 className={sidebarStyles.cardTitle}>Master Data</h3>
        </div>
        <div className="flex flex-col">
          <Link href="/master-data/locations" id="sidebar-action-locations" className={sidebarStyles.listItem}>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[var(--color-fg)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className={sidebarStyles.listItemLabel}>Locations</span>
            </div>
            <svg className={sidebarStyles.listItemArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
