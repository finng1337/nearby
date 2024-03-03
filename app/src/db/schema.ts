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
export const schedules = pgTable("schedules", {
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
export const tags = pgTable("tags", {
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
export const eventTags = pgTable("event_tags", {
    id: serial("id").primaryKey(),
    event: integer("id_event").references(() => event.id).notNull(),
    tags: integer("id_tags").references(() => tags.id).notNull(),
});
export const venueRelations = relations(venue, ({many}) => ({
    schedules: many(schedules),
}));
export const eventRelations = relations(event, ({many}) => ({
    schedules: many(schedules),
    categories: many(eventCategory),
    tags: many(eventTags),
}));
export const schedulesRelations = relations(schedules, ({one}) => ({
    venue: one(venue, {
        fields: [schedules.venue],
        references: [venue.id],
    }),
    event: one(event, {
        fields: [schedules.event],
        references: [event.id],
    }),
}));
export const categoryRelations = relations(category, ({many}) => ({
    events: many(eventCategory),
}));
export const tagsRelations = relations(tags, ({many}) => ({
    events: many(eventTags),
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
export const eventTagsRelations = relations(eventTags, ({one}) => ({
    event: one(event, {
        fields: [eventTags.event],
        references: [event.id],
    }),
    tags: one(tags, {
        fields: [eventTags.tags],
        references: [tags.id],
    }),
}));