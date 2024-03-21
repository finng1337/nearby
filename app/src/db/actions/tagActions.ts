"use server";

import db from "@/db/drizzle";
import {tag} from "@/db/schema";
import {Tag, InsertTag} from "@/db/types";

export const getTagIds = async (): Promise<{id: number; idGoout: string | null; idKudyznudy: string | null}[]> => {
    return db
        .select({
            id: tag.id,
            idGoout: tag.idGoout,
            idKudyznudy: tag.idKudyznudy,
        })
        .from(tag);
};
export const addTag = async (insertCategory: InsertTag): Promise<Tag> => {
    const insertedData = await db.insert(tag).values(insertCategory).returning();

    return insertedData[0];
};
