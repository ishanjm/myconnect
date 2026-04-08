"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { profilePageStyles as styles } from "./ProfilePage.styles";
import { DocumentHub } from "../Documents/DocumentHub";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState("Profile info");
  const router = useRouter();

  const tabs = ["Profile info", "Docs", "Ask me", "Quiz", "Followers"];

  if (!user) return null;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const avatarSrc =
    user.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=200`;

  return (
    <div
      id="profile-page"
      className="min-h-screen bg-[var(--color-bg)] py-8 px-4"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile Header Card */}
        <div id="profile-header-card" className={styles.card}>
          {/* Banner */}
          <div className={styles.banner} />

          {/* Avatar + Name */}
          <div className={styles.avatarSection}>
            <img
              id="profile-avatar"
              src={avatarSrc}
              alt={fullName}
              className={styles.avatar}
            />
            <div className="flex-1 pt-2">
              <h1 id="profile-full-name" className={styles.name}>
                {fullName}
              </h1>
              <p id="profile-email" className={styles.email}>
                {user.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span id="profile-role-badge" className={styles.roleBadge}>
                  {user.role}
                </span>
                <span
                  id="profile-subscription-badge"
                  className={styles.subscriptionBadge}
                >
                  {user.subscription || "Trial"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div id="profile-tabs-nav" className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`profile-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.activeTab : styles.inactiveTab
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          id="profile-tab-content-area"
          className="transition-all duration-300"
        >
          {activeTab === "Profile info" && (
            <div id="profile-details-card" className={styles.card}>
              <div className="p-6">
                <h2 id="profile-details-title" className={styles.sectionTitle}>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <InfoField
                    id="profile-field-first-name"
                    label="First Name"
                    value={user.firstName}
                  />
                  <InfoField
                    id="profile-field-last-name"
                    label="Last Name"
                    value={user.lastName}
                  />
                  <InfoField
                    id="profile-field-email"
                    label="Email"
                    value={user.email}
                  />
                  <InfoField
                    id="profile-field-role"
                    label="Role"
                    value={user.role}
                  />
                  <InfoField
                    id="profile-field-subscription"
                    label="Subscription"
                    value={user.subscription || "Trial"}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Docs" && (
            <div
              id="profile-tab-docs-content"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <DocumentHub id="profile-docs-tab" isTabPage={true} />
            </div>
          )}

          {activeTab === "Ask me" && (
            <PlaceholderTab
              id="profile-tab-ask-me-content"
              title="Ask Me Anything"
              description="Enable people to ask you questions directly. Your responses will appear here."
              icon="💬"
            />
          )}

          {activeTab === "Quiz" && (
            <PlaceholderTab
              id="profile-tab-quiz-content"
              title="Knowledge Quizzes"
              description="Test your knowledge or challenge others with customized quizzes."
              icon="🧠"
              onGetStarted={() => router.push("/quiz")}
            />
          )}

          {activeTab === "Followers" && (
            <PlaceholderTab
              id="profile-tab-followers-content"
              title="Your Community"
              description="Manage your followers and see who is interested in your contributions."
              icon="👥"
            />
          )}
        </div>
      </div>
    </div>
  );
}

const PlaceholderTab = ({
  id,
  title,
  description,
  icon,
  onGetStarted,
}: {
  id: string;
  title: string;
  description: string;
  icon: string;
  onGetStarted?: () => void;
}) => (
  <div id={id} className={styles.card}>
    <div className="p-12 flex flex-col items-center text-center space-y-4">
      <span className="text-5xl">{icon}</span>
      <h2 className="text-xl font-bold text-[var(--color-fg)]">{title}</h2>
      <p className="text-sm text-[var(--color-fg)] opacity-60 max-w-sm mx-auto">
        {description}
      </p>
      <button
        onClick={onGetStarted}
        className="mt-4 px-6 py-2 bg-accent text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
      >
        Get Started
      </button>
    </div>
  </div>
);

const InfoField = ({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value?: string;
}) => (
  <div id={id} className="flex flex-col gap-1">
    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg)] opacity-40">
      {label}
    </span>
    <span className="text-sm font-medium text-[var(--color-fg)]">
      {value || "—"}
    </span>
  </div>
);
