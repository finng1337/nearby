import {sql} from "@vercel/postgres";
import * as schema from "@/db/schema";
import {drizzle} from "drizzle-orm/vercel-postgres";

const db = drizzle(sql, {schema});
export default db;
