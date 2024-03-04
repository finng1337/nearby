import {addEvent, getEventsIds} from "@/db/actions/eventActions";
import {InsertEvent} from "@/db/types";

export async function GET(request: Request) {
    const data = await getEventsIds();

    return Response.json(data, {status: 200});
}
export async function POST(request: Request) {
    const body = await request.json();

    if (!body.title) {
        return Response.json({ message: "Missing required values" }, { status: 400 });
    }

    const insertedData = await addEvent(body as InsertEvent);

    return Response.json(insertedData, { status: 201 });
}