import {GetVenuesFilters, GetVenuesResponse, InsertVenue, Venue} from "@/db/types";
import db from "@/db/drizzle";
import {venue} from "@/db/schema";

export const getVenuesIds = async (): Promise<{id: number, idGoout: number | null, idKudyznudy: string | null}[]> => {
    return db.select({
        id: venue.id,
        idGoout: venue.idGoout,
        idKudyznudy: venue.idKudyznudy
    }).from(venue);
};
export const getVenues = async (filters: GetVenuesFilters): Promise<GetVenuesResponse> => {
    const data = await db.query.venue.findMany({
        columns: {
            id: true,
            lat: true,
            lon: true,
        },
        with: {
            schedules: {
                columns: {
                    id: true,
                },
                where: filters.active ?
                    (schedule, {gt}) => gt(schedule.endAt, new Date())
                    : undefined,
                with: {
                    event: {
                        columns: {
                            id: true,
                            category: true,
                        },
                    },
                },
            },
        },
    });

    return filters.active ? data.filter(({schedules}) => schedules.length > 0) : data;
};
export const addVenue = async (insertVenue: InsertVenue): Promise<Venue> => {
    const insertedData = await db.insert(venue).values(insertVenue).returning();

    return insertedData[0];
};