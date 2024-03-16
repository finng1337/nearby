import {AdvancedMarker, AdvancedMarkerProps} from "@vis.gl/react-google-maps";
import {GetVenuesResponse} from "@/db/types";
import styles from "@/components/markers/Markers.module.scss";

type Props = {
    position: google.maps.LatLngLiteral;
    venues: GetVenuesResponse;
} & AdvancedMarkerProps;
export default function ClusterMarker(props: Props) {
    const {position, ...rest} = props;

    const getSchedulesCount = (): string => {
        const {venues} = props;

        const count = venues.reduce((acc, venue) => {
            return acc + venue.schedules.length;
        }, 0);

        return count > 999 ? `${Math.floor(count / 100) / 10}k` : count.toString();
    }

    return (
        <AdvancedMarker
            className={styles.cluster}
            position={position}
            {...rest}
        >
            <span>
                {getSchedulesCount()}
            </span>
        </AdvancedMarker>
    )
}