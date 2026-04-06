import { PostAttributes } from "@/model/Post";
 
export const MOCK_POSTS: PostAttributes[] = [
  {
    id: 1,
    userId: 1, // Added missing property
    author: {
      id: 1,
      name: "Ishan Ranasinghe",
      avatarUrl: "https://ui-avatars.com/api/?name=Ishan+Ranasinghe&background=6366f1&color=fff",
      subscription: "medium",
    },
    content:
      "Just wrapped up our monthly team sync 🎉 — really proud of how much we shipped this sprint. Grateful for an amazing team that keeps leveling up every week. #productivity #teamwork",
    createdAt: new Date("2025-03-31T07:00:00Z"),
    reactions: { likes: 42, comments: 7, shares: 3 },
    tags: ["productivity", "teamwork"],
  } as any,
  {
    id: 2,
    userId: 2, // Added missing property
    author: {
      id: 2,
      name: "Amara Silva",
      avatarUrl: "https://ui-avatars.com/api/?name=Amara+Silva&background=ec4899&color=fff",
      subscription: "large",
    },
    content:
      "Finally finished my deep-dive on Next.js 15 App Router patterns. The way suspense boundaries now interact with server components is mind-blowing. Will write a full article soon! 📝",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    createdAt: new Date("2025-03-30T14:30:00Z"),
    reactions: { likes: 118, comments: 22, shares: 15 },
    tags: ["nextjs", "webdev"],
  } as any,
  {
    id: 3,
    userId: 3, // Added missing property
    author: {
      id: 3,
      name: "Dev Pathirana",
      avatarUrl: "https://ui-avatars.com/api/?name=Dev+Pathirana&background=10b981&color=fff",
      subscription: "trial",
    },
    content:
      "First day using MyConnect — loving the clean UI and how easy it is to find like-minded people here. Looking forward to building something great with this community 🚀",
    createdAt: new Date("2025-03-29T09:00:00Z"),
    reactions: { likes: 31, comments: 5, shares: 1 },
    tags: ["intro", "community"],
  } as any,
  {
    id: 4,
    userId: 4, // Added missing property
    author: {
      id: 4,
      name: "Nisha Perera",
      avatarUrl: "https://ui-avatars.com/api/?name=Nisha+Perera&background=f59e0b&color=fff",
      subscription: "small",
    },
    content:
      "\"The best time to plant a tree was 20 years ago. The second best time is now.\" — Starting my journey into cloud architecture today. AWS here I come ☁️",
    createdAt: new Date("2025-03-28T16:45:00Z"),
    reactions: { likes: 64, comments: 11, shares: 8 },
    tags: ["aws", "cloud", "learning"],
  } as any,
];
