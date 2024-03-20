import {venue, event, schedule, category, tag, eventTag} from "@/db/schema";

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
export type EventTag = typeof eventTag.$inferSelect;
export type InsertEventTag = typeof eventTag.$inferInsert;
export type GetVenuesResponse = {
    id: number;
    lat: string;
    lon: string;
    schedules: {
        id: number;
        event: {
            id: number;
            category: {
                id: number;
                value: string | null;
            } | null;
        }
    }[];
}[];
export type GetVenuesFilters = {
    active?: boolean;
}
export type GetScheduleResponse = {
    id: number;
    urlGoout: string | null;
    urlKudyznudy: string | null;
    startAt: Date;
    endAt: Date;
    event: {
        id: number;
        title: string;
        description: string | null;
        images: any;
        category: {
            id: number;
            value: string | null;
            title: string | null;
        } | null;
        tags: {
            id: number;
            tag: {
                id: number;
                title: string | null;
            };
        }[];
    };
    venue: {
        id: number;
        title: string;
    };
} | undefined;
export enum CategoryTypeEnum {
    FESTIVAL = "festival",
    SPORT = "sport",
    FILM = "film",
    GASTRONOMY = "gastronomy",
    IN_CITY = "in_city",
    FOR_CHILDREN = "for_children",
    PLAY = "play",
    CHARITY = "charity",
    CLUBBING = "clubbing",
    CONCERT = "concert",
    EXHIBITION = "exhibition",
}