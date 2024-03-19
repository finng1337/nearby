import {addTag, getTagIds} from "@/db/actions/tagActions";
import {InsertTag} from "@/db/types";

export async function GET() {
    const data = await getTagIds();

    return Response.json(data, {status: 200});
}
export async function POST(request: Request) {
    const body = await request.json();

    const insertedData = await addTag(body as InsertTag);

    return Response.json(insertedData, { status: 201 });
}