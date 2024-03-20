import {InsertVenue} from "@/db/types";
import {addVenue, getVenuesIds} from "@/db/actions/venueActions";
export async function GET() {
    const data = await getVenuesIds();

    return Response.json(data, {status: 200});
}
export async function POST(request: Request) {
    const body = await request.json();

    if (!body.title || !body.lat || !body.lon) {
        return Response.json(
            {message: "Missing required values"},
            {status: 400}
        );
    }

    const insertedData = await addVenue(body as InsertVenue);

    return Response.json(insertedData, {status: 201});
}
