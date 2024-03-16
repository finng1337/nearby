import {AdvancedMarker, AdvancedMarkerProps} from "@vis.gl/react-google-maps";
import {GetVenuesResponse} from "@/db/types";
import styles from "@/components/markers/Markers.module.scss";

type Props = {
    position: google.maps.LatLngLiteral;
    venue: GetVenuesResponse[0];
} & AdvancedMarkerProps;
export default function Marker(props: Props) {
    const {position, venue, ...rest} = props;

    const getSchedulesCount = (): string => {
        return venue.schedules.length > 999 ?
            `${Math.floor(venue.schedules.length / 100) / 10}k` :
            venue.schedules.length.toString();
    }

    return (
        <AdvancedMarker
            className={styles.cluster}
            position={position}
            {...rest}
        >
            <span>{getSchedulesCount()}</span>
        </AdvancedMarker>
    )
}