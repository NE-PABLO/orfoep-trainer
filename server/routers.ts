import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getUserAccountByNickname, createUserAccount, getUserStats, updateUserStats, getAllUserStats, updateUserLastLogin } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  users: router({
    loginByNickname: publicProcedure
      .input(z.object({ nickname: z.string().min(1).max(64) }))
      .mutation(async ({ input }) => {
        const { nickname } = input;
        
        let user = await getUserAccountByNickname(nickname);
        
        if (!user) {
          user = await createUserAccount(nickname);
        } else {
          // Update last login time
          if (user.id) {
            await updateUserLastLogin(user.id);
          }
        }
        
        return {
          success: true,
          user: {
            id: user?.id,
            nickname: user?.nickname,
          },
        };
      }),
  }),

  stats: router({
    getModuleStats: publicProcedure
      .input(z.object({ userId: z.number(), moduleId: z.string() }))
      .query(async ({ input }) => {
        const stats = await getUserStats(input.userId, input.moduleId);
        return stats || { totalAttempts: 0, correctAnswers: 0, accuracy: 0 };
      }),

    getAllStats: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getAllUserStats(input.userId);
      }),

    updateStats: publicProcedure
      .input(z.object({
        userId: z.number(),
        moduleId: z.string(),
        totalAttempts: z.number(),
        correctAnswers: z.number(),
      }))
      .mutation(async ({ input }) => {
        const result = await updateUserStats(
          input.userId,
          input.moduleId,
          input.totalAttempts,
          input.correctAnswers
        );
        return { success: true, stats: result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
