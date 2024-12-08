import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePostInteractionStore = create(
  persist(
    (set) => ({
      reactions: [], // [{postId, userId, type}]
      reports: [], // [{postId, userId, reason, status}]
      bookmarks: [], // [{postId, userId}]
      shares: [], // [{postId, userId, platform}]
      
      // Reaction actions
      addReaction: (postId, userId, type) =>
        set((state) => ({
          reactions: [...state.reactions, { postId, userId, type, timestamp: Date.now() }],
        })),

      removeReaction: (postId, userId) =>
        set((state) => ({
          reactions: state.reactions.filter(
            (reaction) => !(reaction.postId === postId && reaction.userId === userId)
          ),
        })),

      // Report actions
      reportPost: (postId, userId, reason) =>
        set((state) => ({
          reports: [
            ...state.reports,
            {
              postId,
              userId,
              reason,
              status: 'pending',
              timestamp: Date.now(),
            },
          ],
        })),

      updateReportStatus: (reportId, status) =>
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId ? { ...report, status } : report
          ),
        })),

      // Bookmark actions
      toggleBookmark: (postId, userId) =>
        set((state) => {
          const isBookmarked = state.bookmarks.some(
            (bookmark) => bookmark.postId === postId && bookmark.userId === userId
          );

          if (isBookmarked) {
            return {
              bookmarks: state.bookmarks.filter(
                (bookmark) =>
                  !(bookmark.postId === postId && bookmark.userId === userId)
              ),
            };
          }

          return {
            bookmarks: [
              ...state.bookmarks,
              { postId, userId, timestamp: Date.now() },
            ],
          };
        }),

      // Share actions
      recordShare: (postId, userId, platform) =>
        set((state) => ({
          shares: [
            ...state.shares,
            { postId, userId, platform, timestamp: Date.now() },
          ],
        })),

      // Analytics
      getPostAnalytics: (postId) => ({
        reactionCount: (state) =>
          state.reactions.filter((reaction) => reaction.postId === postId).length,
        bookmarkCount: (state) =>
          state.bookmarks.filter((bookmark) => bookmark.postId === postId).length,
        shareCount: (state) =>
          state.shares.filter((share) => share.postId === postId).length,
        reportCount: (state) =>
          state.reports.filter((report) => report.postId === postId).length,
      }),
    }),
    {
      name: 'post-interaction-storage',
    }
  )
);
