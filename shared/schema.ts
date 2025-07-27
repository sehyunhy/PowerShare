import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  userType: varchar("user_type", { length: 20 }).notNull().default("consumer"), // provider, consumer, both
  location: text("location"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const energyProviders = pgTable("energy_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  providerName: text("provider_name").notNull(),
  energyType: varchar("energy_type", { length: 50 }).notNull(), // solar, wind, battery
  maxCapacity: decimal("max_capacity", { precision: 10, scale: 2 }).notNull(),
  currentProduction: decimal("current_production", { precision: 10, scale: 2 }).default("0"),
  availableEnergy: decimal("available_energy", { precision: 10, scale: 2 }).default("0"),
  pricePerKwh: decimal("price_per_kwh", { precision: 8, scale: 4 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const energyRequests = pgTable("energy_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  energyAmount: decimal("energy_amount", { precision: 10, scale: 2 }).notNull(),
  urgencyLevel: varchar("urgency_level", { length: 20 }).notNull().default("normal"), // immediate, urgent, normal, scheduled
  preferredTimeSlot: text("preferred_time_slot"),
  maxPrice: decimal("max_price", { precision: 8, scale: 4 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, matched, fulfilled, cancelled
  matchedProviderId: integer("matched_provider_id").references(() => energyProviders.id),
  createdAt: timestamp("created_at").defaultNow(),
  requestedFor: timestamp("requested_for"),
});

export const energyTransactions = pgTable("energy_transactions", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => energyRequests.id),
  providerId: integer("provider_id").notNull().references(() => energyProviders.id),
  consumerId: integer("consumer_id").notNull().references(() => users.id),
  energyAmount: decimal("energy_amount", { precision: 10, scale: 2 }).notNull(),
  pricePerKwh: decimal("price_per_kwh", { precision: 8, scale: 4 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, active, completed, failed
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityStats = pgTable("community_stats", {
  id: serial("id").primaryKey(),
  totalProduction: decimal("total_production", { precision: 12, scale: 2 }).default("0"),
  totalConsumption: decimal("total_consumption", { precision: 12, scale: 2 }).default("0"),
  activeProviders: integer("active_providers").default(0),
  activeConsumers: integer("active_consumers").default(0),
  currentFlowRate: decimal("current_flow_rate", { precision: 10, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  energyProviders: many(energyProviders),
  energyRequests: many(energyRequests),
  transactions: many(energyTransactions),
}));

export const energyProvidersRelations = relations(energyProviders, ({ one, many }) => ({
  user: one(users, {
    fields: [energyProviders.userId],
    references: [users.id],
  }),
  transactions: many(energyTransactions),
  matchedRequests: many(energyRequests),
}));

export const energyRequestsRelations = relations(energyRequests, ({ one, many }) => ({
  user: one(users, {
    fields: [energyRequests.userId],
    references: [users.id],
  }),
  matchedProvider: one(energyProviders, {
    fields: [energyRequests.matchedProviderId],
    references: [energyProviders.id],
  }),
  transactions: many(energyTransactions),
}));

export const energyTransactionsRelations = relations(energyTransactions, ({ one }) => ({
  request: one(energyRequests, {
    fields: [energyTransactions.requestId],
    references: [energyRequests.id],
  }),
  provider: one(energyProviders, {
    fields: [energyTransactions.providerId],
    references: [energyProviders.id],
  }),
  consumer: one(users, {
    fields: [energyTransactions.consumerId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEnergyProviderSchema = createInsertSchema(energyProviders).omit({
  id: true,
  lastUpdated: true,
});

export const insertEnergyRequestSchema = createInsertSchema(energyRequests).omit({
  id: true,
  createdAt: true,
  status: true,
  matchedProviderId: true,
});

export const insertEnergyTransactionSchema = createInsertSchema(energyTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityStatsSchema = createInsertSchema(communityStats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type EnergyProvider = typeof energyProviders.$inferSelect;
export type InsertEnergyProvider = z.infer<typeof insertEnergyProviderSchema>;
export type EnergyRequest = typeof energyRequests.$inferSelect;
export type InsertEnergyRequest = z.infer<typeof insertEnergyRequestSchema>;
export type EnergyTransaction = typeof energyTransactions.$inferSelect;
export type InsertEnergyTransaction = z.infer<typeof insertEnergyTransactionSchema>;
export type CommunityStats = typeof communityStats.$inferSelect;
export type InsertCommunityStats = z.infer<typeof insertCommunityStatsSchema>;
