"use server";

import db from "@/db/drizzle";
import {schedule} from "@/db/schema";
import {Schedule, InsertSchedule, GetScheduleResponse} from "@/db/types";
import {eq} from "drizzle-orm";

export const getScheduleIds = async (): Promise<{id: number, idGoout: number | null, idKudyznudy: string | null}[]> => {
    return db.select({
        id: schedule.id,
        idGoout: schedule.idGoout,
        idKudyznudy: schedule.idKudyznudy
    }).from(schedule);
};
export const getSchedule = async (id: number): Promise<GetScheduleResponse> => {
    return db.query.schedule.findFirst({
        where: eq(schedule.id, id),
        columns: {
            id: true,
            urlGoout: true,
            urlKudyznudy: true,
            startAt: true,
            endAt: true
        },
        with: {
            event: {
                columns: {
                    id: true,
                    title: true,
                    description: true,
                    images: true,
                },
                with: {
                    category: {
                        columns: {
                            id: true,
                            value: true,
                            title: true
                        }
                    },
                    tags: {
                        columns: {
                            id: true,
                        },
                        with: {
                            tag: {
                                columns: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    }
                },
            },
            venue: {
                columns: {
                    id: true,
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