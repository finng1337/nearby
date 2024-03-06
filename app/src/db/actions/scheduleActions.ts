import db from "@/db/drizzle";
import {schedule} from "@/db/schema";
import {Schedule, InsertSchedule} from "@/db/types";

export const getScheduleIds = async (): Promise<{id: number, idGoout: number | null, idKudyznudy: string | null}[]> => {
    return await db.select({
        id: schedule.id,
        idGoout: schedule.idGoout,
        idKudyznudy: schedule.idKudyznudy
    }).from(schedule);
};
export const addSchedule = async (insertSchedule: InsertSchedule): Promise<Schedule> => {
    const insertedData = await db.insert(schedule).values(insertSchedule).returning();

    return insertedData[0];
};