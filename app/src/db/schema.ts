import {date, integer, json, pgTable, serial, text} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const venue = pgTable("venue", {
    id: serial("id").primaryKey(),
    idGoout: integer("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    title: text("title").notNull(),
    lat: text("lat").notNull(),
    lon: text("lon").notNull(),
});
export const event = pgTable("event", {
    id: serial("id").primaryKey(),
    idGoout: integer("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    title: text("title").notNull(),
    description: text("description"),
    images: json("images").default([]),
});
export const schedule = pgTable("schedules", {
    id: serial("id").primaryKey(),
    idGoout: integer("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    venue: integer("id_venue").references(() => venue.id).notNull(),
    event: integer("id_event").references(() => event.id).notNull(),
    urlGoout: text("url_goout"),
    urlKudyznudy: text("url_kudyznudy"),
    startAt: date("start_at"),
    endAt: date("end_at"),
});
export const category = pgTable("category", {
    id: serial("id").primaryKey(),
    idGoout: integer("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    title: text("title"),
});
export const tag = pgTable("tags", {
    id: serial("id").primaryKey(),
    idGoout: integer("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    title: text("title"),
});
export const eventCategory = pgTable("event_category", {
    id: serial("id").primaryKey(),
    event: integer("id_event").references(() => event.id).notNull(),
    category: integer("id_category").references(() => category.id).notNull(),
});
export const eventTag = pgTable("event_tags", {
    id: serial("id").primaryKey(),
    event: integer("id_event").references(() => event.id).notNull(),
    tags: integer("id_tags").references(() => tag.id).notNull(),
});
export const venueRelations = relations(venue, ({many}) => ({
    schedules: many(schedule),
}));
export const eventRelations = relations(event, ({many}) => ({
    schedules: many(schedule),
    categories: many(eventCategory),
    tags: many(eventTag),
}));
export const schedulesRelations = relations(schedule, ({one}) => ({
    venue: one(venue, {
        fields: [schedule.venue],
        references: [venue.id],
    }),
    event: one(event, {
        fields: [schedule.event],
        references: [event.id],
    }),
}));
export const categoryRelations = relations(category, ({many}) => ({
    events: many(eventCategory),
}));
export const tagsRelations = relations(tag, ({many}) => ({
    events: many(eventTag),
}));
export const eventCategoryRelations = relations(eventCategory, ({one}) => ({
    event: one(event, {
        fields: [eventCategory.event],
        references: [event.id],
    }),
    category: one(category, {
        fields: [eventCategory.category],
        references: [category.id],
    }),
}));
export const eventTagsRelations = relations(eventTag, ({one}) => ({
    event: one(event, {
        fields: [eventTag.event],
        references: [event.id],
    }),
    tags: one(tag, {
        fields: [eventTag.tags],
        references: [tag.id],
    }),
}));