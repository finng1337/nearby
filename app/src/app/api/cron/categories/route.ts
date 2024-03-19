import {addCategory, getCategoryIds} from "@/db/actions/categoryActions";
import {InsertCategory} from "@/db/types";

export async function GET() {
    const data = await getCategoryIds();

    return Response.json(data, {status: 200});
}
export async function POST(request: Request) {
    const body = await request.json();

    const insertedData = await addCategory(body as InsertCategory);

    return Response.json(insertedData, { status: 201 });
}