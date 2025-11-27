import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("users.loginByNickname", () => {
  it("creates a new user account when nickname does not exist", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.users.loginByNickname({
      nickname: "testuser123",
    });

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.nickname).toBe("testuser123");
    expect(result.user?.id).toBeDefined();
  });

  it("returns existing user when nickname already exists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create first user
    const result1 = await caller.users.loginByNickname({
      nickname: "existinguser",
    });

    // Login with same nickname
    const result2 = await caller.users.loginByNickname({
      nickname: "existinguser",
    });

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result2.user?.id).toBe(result1.user?.id);
    expect(result2.user?.nickname).toBe("existinguser");
  });

  it("rejects empty nickname", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.loginByNickname({
        nickname: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain(">=1 characters");
    }
  });

  it("rejects nickname longer than 64 characters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const longNickname = "a".repeat(65);

    try {
      await caller.users.loginByNickname({
        nickname: longNickname,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("<=64 characters");
    }
  });
});

describe("stats endpoints", () => {
  it("returns zero stats for new user and module", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create a user
    const userResult = await caller.users.loginByNickname({
      nickname: "statsuser",
    });

    // Get stats for non-existent module
    const statsResult = await caller.stats.getModuleStats({
      userId: userResult.user?.id || 0,
      moduleId: "orfoepiya",
    });

    expect(statsResult.totalAttempts).toBe(0);
    expect(statsResult.correctAnswers).toBe(0);
  });

  it("updates and retrieves user statistics", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create a user
    const userResult = await caller.users.loginByNickname({
      nickname: "statsuser2",
    });

    const userId = userResult.user?.id || 0;

    // Update stats
    const updateResult = await caller.stats.updateStats({
      userId,
      moduleId: "orfoepiya",
      totalAttempts: 10,
      correctAnswers: 7,
    });

    expect(updateResult.success).toBe(true);
    expect(updateResult.stats?.totalAttempts).toBe(10);
    expect(updateResult.stats?.correctAnswers).toBe(7);

    // Retrieve stats
    const getResult = await caller.stats.getModuleStats({
      userId,
      moduleId: "orfoepiya",
    });

    expect(getResult.totalAttempts).toBe(10);
    expect(getResult.correctAnswers).toBe(7);
  });

  it("retrieves all user statistics across modules", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create a user
    const userResult = await caller.users.loginByNickname({
      nickname: "multimoduleuser",
    });

    const userId = userResult.user?.id || 0;

    // Update stats for multiple modules
    await caller.stats.updateStats({
      userId,
      moduleId: "orfoepiya",
      totalAttempts: 5,
      correctAnswers: 3,
    });

    await caller.stats.updateStats({
      userId,
      moduleId: "punctuation",
      totalAttempts: 8,
      correctAnswers: 6,
    });

    // Get all stats
    const allStats = await caller.stats.getAllStats({ userId });

    expect(allStats.length).toBeGreaterThanOrEqual(2);
    
    const orfoepiyaStats = allStats.find(s => s.moduleId === "orfoepiya");
    const punctuationStats = allStats.find(s => s.moduleId === "punctuation");

    expect(orfoepiyaStats?.totalAttempts).toBe(5);
    expect(orfoepiyaStats?.correctAnswers).toBe(3);
    expect(punctuationStats?.totalAttempts).toBe(8);
    expect(punctuationStats?.correctAnswers).toBe(6);
  });

  it("updates existing statistics instead of creating duplicates", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create a user
    const userResult = await caller.users.loginByNickname({
      nickname: "updatestatsuser",
    });

    const userId = userResult.user?.id || 0;

    // First update
    await caller.stats.updateStats({
      userId,
      moduleId: "orfoepiya",
      totalAttempts: 5,
      correctAnswers: 3,
    });

    // Second update with same module
    const secondUpdate = await caller.stats.updateStats({
      userId,
      moduleId: "orfoepiya",
      totalAttempts: 10,
      correctAnswers: 8,
    });

    expect(secondUpdate.stats?.totalAttempts).toBe(10);
    expect(secondUpdate.stats?.correctAnswers).toBe(8);

    // Verify only one record exists
    const allStats = await caller.stats.getAllStats({ userId });
    const orfoepiyaStats = allStats.filter(s => s.moduleId === "orfoepiya");

    expect(orfoepiyaStats.length).toBe(1);
    expect(orfoepiyaStats[0]?.totalAttempts).toBe(10);
  });
});
