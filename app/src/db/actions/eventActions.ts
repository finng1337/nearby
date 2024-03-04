import db from "@/db/drizzle";
import {event} from "@/db/schema";
import {InsertEvent, Event} from "@/db/types";

export const getEventsIds = async (): Promise<{id: number, idGoout: number | null, idKudyznudy: string | null}[]> => {
    return await db.select({
        id: event.id,
        idGoout: event.idGoout,
        idKudyznudy: event.idKudyznudy
    }).from(event);
};
export const addEvent = async (insertEvent: InsertEvent): Promise<Event> => {
    const insertedData = await db.insert(event).values(insertEvent).returning();

    return insertedData[0];
};