import {AdvancedMarker, AdvancedMarkerProps} from "@vis.gl/react-google-maps";
import styles from "@/components/markers/Markers.module.scss";

type Props = {
    position: google.maps.LatLngLiteral;
    count: number;
} & AdvancedMarkerProps;
export default function ClusterMarker(props: Props) {
    const {position, count, ...rest} = props;

    return (
        <AdvancedMarker
            className={styles.cluster}
            position={position}
            {...rest}
        >
            <span>
                {count > 999
                    ? `${Math.floor(count / 100) / 10}k`
                    : count.toString()}
            </span>
        </AdvancedMarker>
    );
}
