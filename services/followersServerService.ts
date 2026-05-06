import { Follower } from "@/model/Follower";

/**
 * followersServerService
 * Backend business logic for managing follower relationships.
 */
export const followersServerService = {
  /**
   * Make `followerId` follow `userId`.
   * Safe to call multiple times — uses findOrCreate to avoid duplicates.
   * Returns true if a new follow was created, false if already existed.
   */
  followUser: async (userId: number, followerId: number): Promise<boolean> => {
    if (userId === followerId) return false; // Can't follow yourself

    const [, created] = await Follower.findOrCreate({
      where: { userId, followerId },
      defaults: { userId, followerId },
    });

    return created;
  },

  /**
   * Get the count of followers for a given user.
   */
  getFollowerCount: async (userId: number): Promise<number> => {
    return Follower.count({ where: { userId } });
  },

  /**
   * Get all follower records for a given user.
   */
  getFollowers: async (userId: number) => {
    return Follower.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
  },

  /**
   * Check whether followerId already follows userId.
   */
  isFollowing: async (userId: number, followerId: number): Promise<boolean> => {
    const record = await Follower.findOne({ where: { userId, followerId } });
    return record !== null;
  },
};
