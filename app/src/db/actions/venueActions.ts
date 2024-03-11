import {GetVenuesResponse, InsertVenue, Venue} from "@/db/types";
import db from "@/db/drizzle";
import {venue} from "@/db/schema";

export const getVenuesIds = async (): Promise<{id: number, idGoout: number | null, idKudyznudy: string | null}[]> => {
    return await db.select({
        id: venue.id,
        idGoout: venue.idGoout,
        idKudyznudy: venue.idKudyznudy
    }).from(venue);
};
export const getVenues = async (): Promise<GetVenuesResponse> => {
    return await db.select({
        id: venue.id,
        title: venue.title,
        lat: venue.lat,
        lon: venue.lon,
    }).from(venue);
};
export const addVenue = async (insertVenue: InsertVenue): Promise<Venue> => {
    const insertedData = await db.insert(venue).values(insertVenue).returning();

    return insertedData[0];
};