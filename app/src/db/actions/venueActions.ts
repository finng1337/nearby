import {InsertVenue, Venue} from "@/db/types";
import db from "@/db/drizzle";
import {venue} from "@/db/schema";

export const getVenuesIds = async (): Promise<{id: number, idGoout: number | null, idKudyznudy: string | null}[]> => {
    return await db.select({
        id: venue.id,
        idGoout: venue.idGoout,
        idKudyznudy: venue.idKudyznudy
    }).from(venue);
};
export const addVenue = async (insertVenue: InsertVenue): Promise<Venue> => {
    const insertedData = await db.insert(venue).values(insertVenue).returning();

    return insertedData[0];
};