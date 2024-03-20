import {integer, json, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
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
    category: integer("id_category").references(() => category.id),
    images: json("images").default([]),
});
export const schedule = pgTable("schedule", {
    id: serial("id").primaryKey(),
    idGoout: integer("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    venue: integer("id_venue").references(() => venue.id).notNull(),
    event: integer("id_event").references(() => event.id).notNull(),
    urlGoout: text("url_goout"),
    urlKudyznudy: text("url_kudyznudy"),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
});
export const category = pgTable("category", {
    id: serial("id").primaryKey(),
    idGoout: text("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    value: text("value").unique(),
    title: text("title"),
});
export const tag = pgTable("tag", {
    id: serial("id").primaryKey(),
    idGoout: text("id_goout").unique(),
    idKudyznudy: text("id_kudyznudy").unique(),
    title: text("title"),
});
export const eventTag = pgTable("event_tag", {
    id: serial("id").primaryKey(),
    event: integer("id_event").references(() => event.id).notNull(),
    tag: integer("id_tags").references(() => tag.id).notNull(),
});
export const venueRelations = relations(venue, ({many}) => ({
    schedules: many(schedule),
}));
export const eventRelations = relations(event, ({one, many}) => ({
    schedules: many(schedule),
    category: one(category, {
        fields: [event.category],
        references: [category.id],
    }),
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
    events: many(event),
}));
export const tagsRelations = relations(tag, ({many}) => ({
    events: many(eventTag),
}));
export const eventTagsRelations = relations(eventTag, ({one}) => ({
    event: one(event, {
        fields: [eventTag.event],
        references: [event.id],
    }),
    tag: one(tag, {
        fields: [eventTag.tag],
        references: [tag.id],
    }),
}));