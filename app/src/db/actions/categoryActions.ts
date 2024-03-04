import db from "@/db/drizzle";
import {category} from "@/db/schema";
import {Category, InsertCategory} from "@/db/types";

export const getCategoryIds = async (): Promise<{id: number, idGoout: string | null, idKudyznudy: string | null}[]> => {
    return await db.select({
        id: category.id,
        idGoout: category.idGoout,
        idKudyznudy: category.idKudyznudy
    }).from(category);
};
export const addCategory = async (insertCategory: InsertCategory): Promise<Category> => {
    const insertedData = await db.insert(category).values(insertCategory).returning();

    return insertedData[0];
};