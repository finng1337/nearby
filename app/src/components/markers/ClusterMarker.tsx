import {AdvancedMarker, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import styles from "@/components/markers/Markers.module.scss";

type Props = {
    position: google.maps.LatLngLiteral;
    count: number;
    onClusterClick?: (marker: google.maps.marker.AdvancedMarkerElement | null, e: google.maps.MapMouseEvent) => void;
};
export default function ClusterMarker(props: Props) {
    const {position, count, onClusterClick} = props;
    const [clusterRef, cluster] = useAdvancedMarkerRef();

    return (
        <AdvancedMarker
            className={styles.cluster}
            position={position}
            ref={clusterRef}
            onClick={onClusterClick?.bind(null, cluster)}
        >
            <span>{count > 999 ? `${Math.floor(count / 100) / 10}k` : count.toString()}</span>
        </AdvancedMarker>
    );
}
