import Map from "@/components/Map";
import {getVenues} from "@/db/actions/venueActions";

export default async function Home() {
    const venues = await getVenues();

    return (
        <main>
            <Map venues={venues}/>
        </main>
    );
}
