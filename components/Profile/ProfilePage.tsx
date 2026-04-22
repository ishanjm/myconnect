"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { profilePageStyles as styles } from "./ProfilePage.styles";
import { DocumentHub } from "../Documents/DocumentHub";
import {
  clearQuizStatus,
  deleteQuizRequest,
  fetchQuizzesRequest,
} from "@/store/slices/quizzes";
import { fetchLocationsRequest } from "@/store/slices/locations";
import { updateProfileImageRequest } from "@/store/slices/auth";
import { FaCamera, FaSpinner } from "react-icons/fa";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    items: userQuizzes,
    isLoading: isLoadingQuizzes,
    error: quizLoadError,
    isSaving: isQuizSaving,
  } = useSelector((state: RootState) => state.quizzes);
  const {
    items: locations,
    isLoading: isLoadingLocations,
    error: locationsLoadError,
  } = useSelector((state: RootState) => state.locations);
  const [activeTab, setActiveTab] = useState("Profile info");
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { isLoading: isUploading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      // Find the tab that matches the param (case insensitive or exact)
      const matchedTab = tabs.find(
        (t) => t.toLowerCase() === tabParam.toLowerCase(),
      );
      if (matchedTab) {
        setActiveTab(matchedTab);
      }
    }
  }, [searchParams]);

  const tabs = [
    "Profile info",
    "Docs",
    "Locations",
    "Ask me",
    "Quiz",
    "Followers",
  ];

  useEffect(() => {
    if (!user) return;
    if (activeTab !== "Quiz") return;

    dispatch(fetchQuizzesRequest());

    return () => {
      dispatch(clearQuizStatus());
    };
  }, [activeTab, dispatch, user]);

  useEffect(() => {
    if (!user) return;
    if (activeTab !== "Locations") return;

    dispatch(fetchLocationsRequest());
  }, [activeTab, dispatch, user]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(updateProfileImageRequest(formData));
    }
  };

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
            <div 
              id="profile-avatar-container" 
              className={styles.avatarContainer}
              onClick={handleAvatarClick}
            >
              <img
                id="profile-avatar"
                src={avatarSrc}
                alt={fullName}
                className={styles.avatar}
              />
              <div className={styles.avatarOverlay}>
                {isUploading ? (
                  <FaSpinner className={`${styles.editIcon} animate-spin`} />
                ) : (
                  <FaCamera className={styles.editIcon} />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </div>
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

          {activeTab === "Locations" && (
            <div id="profile-tab-locations-content" className={styles.card}>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-fg)]">
                      Your Locations
                    </h2>
                    <p className="text-sm text-[var(--color-fg)] opacity-60 mt-1">
                      All saved branches and workplaces linked to your account.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/master-data/locations")}
                    className="px-5 py-2 bg-accent text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Manage Locations
                  </button>
                </div>

                {isLoadingLocations ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border p-4 animate-pulse bg-[var(--color-surface)]"
                      >
                        <div className="h-4 bg-[var(--color-border)] rounded w-1/3"></div>
                        <div className="mt-3 h-5 bg-[var(--color-border)] rounded w-2/3"></div>
                        <div className="mt-2 h-4 bg-[var(--color-border)] rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : locationsLoadError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {locationsLoadError}
                  </div>
                ) : locations.length === 0 ? (
                  <div className="rounded-xl border border-border p-8 text-center">
                    <p className="text-sm text-[var(--color-fg)] opacity-70">
                      No locations found yet.
                    </p>
                    <button
                      onClick={() => router.push("/master-data/locations")}
                      className="mt-4 px-5 py-2 bg-accent text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Add Your First Location
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        id={`profile-location-item-${location.id}`}
                        className="rounded-xl border border-border p-4 bg-[var(--color-surface)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-2 py-1 rounded">
                            {location.code}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                              location.status === "active"
                                ? "text-emerald-500 bg-emerald-500/10"
                                : "text-red-500 bg-red-500/10"
                            }`}
                          >
                            {location.status}
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-bold text-[var(--color-fg)]">
                          {location.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-fg)] opacity-70">
                          {location.city || "City not set"}
                        </p>
                        <p className="mt-2 text-xs text-[var(--color-fg)] opacity-50 line-clamp-2">
                          {location.address || "Address not available"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Quiz" && (
            <div id="profile-tab-quiz-content" className={styles.card}>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-fg)]">
                      Your Quizzes
                    </h2>
                    <p className="text-sm text-[var(--color-fg)] opacity-60 mt-1">
                      Review quizzes you created and add new ones.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/quiz")}
                    className="px-5 py-2 bg-accent text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Create Quiz
                  </button>
                </div>

                {isLoadingQuizzes ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border p-4 flex items-center justify-between gap-3 animate-pulse bg-[var(--color-surface)]"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-[var(--color-border)] rounded w-1/3"></div>
                          <div className="h-4 bg-[var(--color-border)] rounded w-1/4"></div>
                        </div>
                        <div className="h-6 w-16 bg-[var(--color-border)] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                ) : quizLoadError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {quizLoadError}
                  </div>
                ) : userQuizzes.length === 0 ? (
                  <div className="rounded-xl border border-border p-8 text-center">
                    <p className="text-sm text-[var(--color-fg)] opacity-70">
                      You have not created any quizzes yet.
                    </p>
                    <button
                      onClick={() => router.push("/quiz")}
                      className="mt-4 px-5 py-2 bg-accent text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Get Started
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        id={`profile-quiz-item-${quiz.id}`}
                        className="rounded-xl border border-border p-4 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-base font-bold text-[var(--color-fg)] truncate cursor-pointer hover:text-accent transition-colors"
                            onClick={() => router.push(`/quiz?id=${quiz.id}`)}
                            title="Click to edit"
                          >
                            {quiz.title}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--color-fg)] opacity-70">
                            {quiz.questions.length} question
                            {quiz.questions.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {quiz.accessKey && (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-fg)] opacity-40 mb-0.5">
                                Access Key
                              </span>
                              <span className="font-mono text-lg font-extrabold tracking-widest text-accent">
                                {quiz.accessKey}
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => dispatch(deleteQuizRequest(quiz.id))}
                            disabled={isQuizSaving}
                            className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
