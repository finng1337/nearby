import {venue, event, schedule, category, tag, eventCategory, eventTag} from "@/db/schema";

export type Venue = typeof venue.$inferSelect;
export type InsertVenue = typeof venue.$inferInsert;
export type Event = typeof event.$inferSelect;
export type InsertEvent = typeof event.$inferInsert;
export type Schedule = typeof schedule.$inferSelect;
export type InsertSchedule = typeof schedule.$inferInsert;
export type Category = typeof category.$inferSelect;
export type InsertCategory = typeof category.$inferInsert;
export type Tag = typeof tag.$inferSelect;
export type InsertTag = typeof tag.$inferInsert;
export type EventCategory = typeof eventCategory.$inferSelect;
export type InsertEventCategory = typeof eventCategory.$inferInsert;
export type EventTag = typeof eventTag.$inferSelect;
export type InsertEventTag = typeof eventTag.$inferInsert;