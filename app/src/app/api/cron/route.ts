import {revalidateTag} from "next/cache";

export async function GET() {
    revalidateTag("query");

    return Response.json({revalidated: true}, {status: 200});
}
