"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { profilePageStyles as styles } from "./ProfilePage.styles";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const avatarSrc =
    user.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=200`;

  return (
    <div id="profile-page" className="min-h-screen bg-[var(--color-bg)] py-8 px-4">
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
                <span id="profile-subscription-badge" className={styles.subscriptionBadge}>
                  {user.subscription || "Trial"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
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
      </div>
    </div>
  );
}

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
