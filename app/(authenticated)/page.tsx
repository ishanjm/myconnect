"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCreator from "@/components/PostCreator/PostCreator";
import PostCard from "@/components/PostCard/PostCard";
import { SidebarCards } from "@/components/Sidebar/SidebarCards";
import { DocumentHub } from "@/components/Documents/DocumentHub";
import { RootState } from "@/store/store";
import { fetchPostsRequest } from "@/store/slices/posts";

export default function Home() {
  const [activeTab, setActiveTab] = useState("All Posts");
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state: RootState) => state.posts);
  
  useEffect(() => {
    dispatch(fetchPostsRequest());
  }, [dispatch]);
  
  const tabs = ["All Posts", "Following", "Trending", "Docs"];

  return (
    <div id="home-page" className="min-h-screen bg-[var(--color-bg)] px-4 py-8">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row justify-center gap-8 items-start">

        {/* Main Feed Section */}
        <div id="home-feed-section" className="w-full max-w-3xl space-y-6">
          {/* Top Followers Card */}
          <div
            id="home-top-followers-card"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h2 id="home-top-followers-title" className="text-sm font-bold text-[var(--color-fg)]">
                  Top Stars
                </h2>
              </div>
              <button
                id="home-top-followers-see-all-btn"
                className="text-[11px] font-semibold text-accent hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>

            <div id="home-stories-row" className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
              {["Amara", "Dev", "Nisha", "Kamal", "Priya", "Saman"].map((name, i) => (
                <div
                  key={name}
                  id={`home-story-${i}`}
                  className="flex shrink-0 cursor-pointer flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                >
                  <div className="h-14 w-14 rounded-full p-0.5 bg-gradient-to-tr from-accent via-pink-500 to-yellow-400">
                    <img
                      src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff`}
                      alt={name}
                      className="h-full w-full rounded-full object-cover ring-2 ring-[var(--color-surface)]"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--color-fg)] opacity-70 truncate w-14 text-center">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Content Area */}
          <div className="space-y-6">
            {/* Nav Tabs */}
            <div id="home-feed-tabs" className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  id={`home-feed-tab-${tab.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${activeTab === tab
                    ? "bg-accent text-white shadow-sm"
                    : "text-[var(--color-fg)] opacity-60 hover:opacity-100 hover:bg-accent/10"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* View Switching */}
            {activeTab === "Docs" ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DocumentHub id="home-docs-tab" isTabPage={true} />
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PostCreator />
                
                {/* Post Wall */}
                <div id="home-post-wall" className="space-y-4">
                  {isLoading ? (
                    <div id="home-posts-loading" className="flex flex-col gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]" />
                      ))}
                    </div>
                  ) : error ? (
                    <div id="home-posts-error" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
                      <p>Failed to load posts. Please try again later.</p>
                      <button 
                        onClick={() => dispatch(fetchPostsRequest())}
                        className="mt-2 text-sm font-bold underline"
                      >
                        Retry
                      </button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div id="home-posts-empty" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-fg)]">No shoutouts yet</h3>
                      <p className="mt-1 text-sm text-[var(--color-fg)] opacity-60">Be the first to share something with the community!</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  )}
                </div>

                {/* Load More */}
                <div className="flex justify-center pb-8">
                  <button
                    id="home-load-more-btn"
                    className="cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2 text-sm font-semibold text-[var(--color-fg)] opacity-70 transition-all hover:bg-accent/10 hover:opacity-100 active:scale-95"
                  >
                    Load more posts
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div id="home-sidebar-section" className="hidden lg:block w-80 sticky top-24">
          <SidebarCards />
        </div>
      </div>
    </div>
  );
}
