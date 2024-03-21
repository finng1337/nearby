import {addTag} from "@/db/actions/eventActions";

export async function POST(request: Request, {params}: {params: {id: string}}) {
    const body = await request.json();

    if (!body.id) {
        return Response.json({message: "Missing required values"}, {status: 400});
    }
    const insertedData = await addTag(+params.id, body.id);

    return Response.json(insertedData, {status: 201});
}
