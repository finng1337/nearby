import Map from "@/components/Map";
import {getVenues} from "@/db/actions/venueActions";

export default async function Home() {
    const venues = await getVenues({active: true});

    return (
        <main>
            <Map venues={venues}/>
        </main>
    );
}
