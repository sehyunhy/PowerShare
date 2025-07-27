import { 
  users, 
  energyProviders, 
  energyRequests, 
  energyTransactions, 
  communityStats,
  type User, 
  type InsertUser,
  type EnergyProvider,
  type InsertEnergyProvider,
  type EnergyRequest,
  type InsertEnergyRequest,
  type EnergyTransaction,
  type InsertEnergyTransaction,
  type CommunityStats,
  type InsertCommunityStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Energy provider operations
  getEnergyProvider(id: number): Promise<EnergyProvider | undefined>;
  getEnergyProvidersByUser(userId: number): Promise<EnergyProvider[]>;
  getActiveEnergyProviders(): Promise<EnergyProvider[]>;
  createEnergyProvider(provider: InsertEnergyProvider): Promise<EnergyProvider>;
  updateEnergyProvider(id: number, updates: Partial<InsertEnergyProvider>): Promise<EnergyProvider | undefined>;
  updateProviderEnergyData(id: number, currentProduction: number, availableEnergy: number): Promise<void>;

  // Energy request operations
  getEnergyRequest(id: number): Promise<EnergyRequest | undefined>;
  getEnergyRequestsByUser(userId: number): Promise<EnergyRequest[]>;
  getPendingEnergyRequests(): Promise<EnergyRequest[]>;
  createEnergyRequest(request: InsertEnergyRequest): Promise<EnergyRequest>;
  updateEnergyRequest(id: number, updates: Partial<EnergyRequest>): Promise<EnergyRequest | undefined>;

  // Transaction operations
  getEnergyTransaction(id: number): Promise<EnergyTransaction | undefined>;
  getTransactionsByUser(userId: number): Promise<EnergyTransaction[]>;
  getRecentTransactions(limit: number): Promise<EnergyTransaction[]>;
  createEnergyTransaction(transaction: InsertEnergyTransaction): Promise<EnergyTransaction>;
  updateEnergyTransaction(id: number, updates: Partial<EnergyTransaction>): Promise<EnergyTransaction | undefined>;

  // Community stats operations
  getCommunityStats(): Promise<CommunityStats | undefined>;
  updateCommunityStats(stats: InsertCommunityStats): Promise<CommunityStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Energy provider operations
  async getEnergyProvider(id: number): Promise<EnergyProvider | undefined> {
    const [provider] = await db.select().from(energyProviders).where(eq(energyProviders.id, id));
    return provider || undefined;
  }

  async getEnergyProvidersByUser(userId: number): Promise<EnergyProvider[]> {
    return await db.select().from(energyProviders).where(eq(energyProviders.userId, userId));
  }

  async getActiveEnergyProviders(): Promise<EnergyProvider[]> {
    return await db.select()
      .from(energyProviders)
      .where(and(
        eq(energyProviders.isActive, true),
        sql`${energyProviders.availableEnergy} > 0`
      ))
      .orderBy(desc(energyProviders.availableEnergy));
  }

  async createEnergyProvider(provider: InsertEnergyProvider): Promise<EnergyProvider> {
    const [newProvider] = await db.insert(energyProviders).values(provider).returning();
    return newProvider;
  }

  async updateEnergyProvider(id: number, updates: Partial<InsertEnergyProvider>): Promise<EnergyProvider | undefined> {
    const [provider] = await db.update(energyProviders)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(energyProviders.id, id))
      .returning();
    return provider || undefined;
  }

  async updateProviderEnergyData(id: number, currentProduction: number, availableEnergy: number): Promise<void> {
    await db.update(energyProviders)
      .set({
        currentProduction: currentProduction.toString(),
        availableEnergy: availableEnergy.toString(),
        lastUpdated: new Date()
      })
      .where(eq(energyProviders.id, id));
  }

  // Energy request operations
  async getEnergyRequest(id: number): Promise<EnergyRequest | undefined> {
    const [request] = await db.select().from(energyRequests).where(eq(energyRequests.id, id));
    return request || undefined;
  }

  async getEnergyRequestsByUser(userId: number): Promise<EnergyRequest[]> {
    return await db.select()
      .from(energyRequests)
      .where(eq(energyRequests.userId, userId))
      .orderBy(desc(energyRequests.createdAt));
  }

  async getPendingEnergyRequests(): Promise<EnergyRequest[]> {
    return await db.select()
      .from(energyRequests)
      .where(eq(energyRequests.status, "pending"))
      .orderBy(desc(energyRequests.createdAt));
  }

  async createEnergyRequest(request: InsertEnergyRequest): Promise<EnergyRequest> {
    const [newRequest] = await db.insert(energyRequests).values(request).returning();
    return newRequest;
  }

  async updateEnergyRequest(id: number, updates: Partial<EnergyRequest>): Promise<EnergyRequest | undefined> {
    const [request] = await db.update(energyRequests)
      .set(updates)
      .where(eq(energyRequests.id, id))
      .returning();
    return request || undefined;
  }

  // Transaction operations
  async getEnergyTransaction(id: number): Promise<EnergyTransaction | undefined> {
    const [transaction] = await db.select().from(energyTransactions).where(eq(energyTransactions.id, id));
    return transaction || undefined;
  }

  async getTransactionsByUser(userId: number): Promise<EnergyTransaction[]> {
    return await db.select()
      .from(energyTransactions)
      .where(eq(energyTransactions.consumerId, userId))
      .orderBy(desc(energyTransactions.createdAt));
  }

  async getRecentTransactions(limit: number): Promise<EnergyTransaction[]> {
    return await db.select()
      .from(energyTransactions)
      .orderBy(desc(energyTransactions.createdAt))
      .limit(limit);
  }

  async createEnergyTransaction(transaction: InsertEnergyTransaction): Promise<EnergyTransaction> {
    const [newTransaction] = await db.insert(energyTransactions).values(transaction).returning();
    return newTransaction;
  }

  async updateEnergyTransaction(id: number, updates: Partial<EnergyTransaction>): Promise<EnergyTransaction | undefined> {
    const [transaction] = await db.update(energyTransactions)
      .set(updates)
      .where(eq(energyTransactions.id, id))
      .returning();
    return transaction || undefined;
  }

  // Community stats operations
  async getCommunityStats(): Promise<CommunityStats | undefined> {
    const [stats] = await db.select().from(communityStats).limit(1);
    return stats || undefined;
  }

  async updateCommunityStats(stats: InsertCommunityStats): Promise<CommunityStats> {
    // Upsert logic - update if exists, insert if not
    const existing = await this.getCommunityStats();
    if (existing) {
      const [updated] = await db.update(communityStats)
        .set({ ...stats, updatedAt: new Date() })
        .where(eq(communityStats.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(communityStats).values(stats).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
