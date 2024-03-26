import {revalidateTag} from "next/cache";

export async function POST(request: Request) {
    const body = await request.json();
    const tags = body.tags as string[];

    for (const tag of tags) {
        revalidateTag(tag);
    }

    return Response.json({revalidated: true}, {status: 200});
}
