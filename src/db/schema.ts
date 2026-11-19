import { pgTable, uuid, varchar, text, integer, boolean, date, timestamp, index } from "drizzle-orm/pg-core";

export const travelRequests = pgTable("ayiffa_travel_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestKey: uuid("request_key").notNull().unique(),
  reference: varchar("reference",{length:20}).notNull().unique(),
  firstName: varchar("first_name",{length:80}).notNull(),
  lastName: varchar("last_name",{length:80}).notNull(),
  email: varchar("email",{length:254}).notNull(),
  phone: varchar("phone",{length:32}),
  destination: varchar("destination",{length:80}).notNull(),
  circuit: varchar("circuit",{length:80}),
  startDate: date("start_date"),
  travellers: integer("travellers").notNull(),
  message: text("message"),
  consent: boolean("consent").notNull(),
  status: varchar("status",{length:30}).notNull().default("new"),
  createdAt: timestamp("created_at",{withTimezone:true}).notNull().defaultNow(),
}, table=>[index("ayiffa_requests_email_created_idx").on(table.email,table.createdAt)]);

// Independent client-presentation preferences; never mixed with travel requests.
export const designPreferences = pgTable("ayiffa_design_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewerHash: varchar("reviewer_hash", { length: 64 }).notNull().unique(),
  direction: varchar("direction", { length: 32 }).notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
