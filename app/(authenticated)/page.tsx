import PostCreator from "@/components/PostCreator/PostCreator";
import PostCard from "@/components/PostCard/PostCard";
import { MOCK_POSTS } from "@/common/mockPosts";

export default function Home() {
  return (
    <div id="home-page" className="min-h-screen bg-[var(--color-bg)] px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-4">

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

        {/* Post Creator */}
        <PostCreator />

        {/* Feed Filter Tabs */}
        <div id="home-feed-tabs" className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          {["All Posts", "Following", "Trending"].map((tab, i) => (
            <button
              key={tab}
              id={`home-feed-tab-${tab.toLowerCase().replace(" ", "-")}`}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${i === 0
                  ? "bg-accent text-white shadow-sm"
                  : "text-[var(--color-fg)] opacity-60 hover:opacity-100 hover:bg-accent/10"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Post Wall */}
        <div id="home-post-wall" className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
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
    </div>
  );
}
