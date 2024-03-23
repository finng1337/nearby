"use server";

import db from "@/db/drizzle";
import {schedule} from "@/db/schema";
import {Schedule, InsertSchedule, GetScheduleResponse, GetSchedulesResponse, GetSchedulesFilters} from "@/db/types";
import {and, asc, eq, gt, inArray} from "drizzle-orm";

export const getScheduleIds = async (): Promise<{id: number; idGoout: number | null; idKudyznudy: string | null}[]> => {
    return db
        .select({
            id: schedule.id,
            idGoout: schedule.idGoout,
            idKudyznudy: schedule.idKudyznudy,
        })
        .from(schedule);
};
export const getSchedules = async (filters: GetSchedulesFilters): Promise<GetSchedulesResponse> => {
    let filtersArray = [];

    if (filters.active) {
        filtersArray.push(gt(schedule.endAt, new Date()));
    }
    if (filters.venueIds) {
        filtersArray.push(inArray(schedule.venue, filters.venueIds));
    }

    let filter = undefined;
    if (filtersArray.length === 1) {
        filter = filtersArray[0];
    } else if (filtersArray.length > 1) {
        filter = and(...filtersArray);
    }

    return db.query.schedule.findMany({
        where: filter,
        columns: {
            id: true,
            startAt: true,
            endAt: true,
        },
        with: {
            event: {
                columns: {
                    title: true,
                    images: true,
                },
                with: {
                    category: {
                        columns: {
                            value: true,
                        },
                    },
                },
            },
            venue: {
                columns: {
                    title: true,
                },
            },
        },
        orderBy: [asc(schedule.startAt)],
    });
};
export const getSchedule = async (id: number): Promise<GetScheduleResponse> => {
    return db.query.schedule.findFirst({
        where: eq(schedule.id, id),
        columns: {
            id: true,
            urlGoout: true,
            urlKudyznudy: true,
            startAt: true,
            endAt: true,
        },
        with: {
            event: {
                columns: {
                    title: true,
                    description: true,
                    images: true,
                },
                with: {
                    category: {
                        columns: {
                            value: true,
                            title: true,
                        },
                    },
                    tags: {
                        with: {
                            tag: {
                                columns: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            },
            venue: {
                columns: {
                    title: true,
                },
            },
        },
    });
};
export const addSchedule = async (insertSchedule: InsertSchedule): Promise<Schedule> => {
    const insertedData = await db.insert(schedule).values(insertSchedule).returning();

    return insertedData[0];
};
