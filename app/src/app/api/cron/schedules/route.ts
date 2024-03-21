import {addSchedule, getScheduleIds} from "@/db/actions/scheduleActions";
import {InsertSchedule} from "@/db/types";

export async function GET() {
    const data = await getScheduleIds();

    return Response.json(data, {status: 200});
}
export async function POST(request: Request) {
    const body = await request.json();

    if (!body.venue || !body.event || !body.startAt || !body.endAt) {
        return Response.json({message: "Missing required values"}, {status: 400});
    }

    const insertedData = await addSchedule({
        ...body,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
    } as InsertSchedule);

    return Response.json(insertedData, {status: 201});
}
