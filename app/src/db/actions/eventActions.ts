"use server";

import db from "@/db/drizzle";
import {event, eventTag} from "@/db/schema";
import {InsertEvent, Event, EventTag} from "@/db/types";

export const getEventsIds = async (): Promise<
    {id: number; idGoout: number | null; idKudyznudy: string | null}[]
> => {
    return db
        .select({
            id: event.id,
            idGoout: event.idGoout,
            idKudyznudy: event.idKudyznudy,
        })
        .from(event);
};
export const addEvent = async (insertEvent: InsertEvent): Promise<Event> => {
    const insertedData = await db.insert(event).values(insertEvent).returning();

    return insertedData[0];
};
export const addTag = async (
    eventId: number,
    tagId: number
): Promise<EventTag> => {
    const insertedData = await db
        .insert(eventTag)
        .values({
            event: eventId,
            tag: tagId,
        })
        .returning();

    return insertedData[0];
};
