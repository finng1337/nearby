import {AdvancedMarker, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import styles from "@/components/markers/Markers.module.scss";
import {MarkerHandler} from "@/utils";
import {useCallback} from "react";

type Props = {
    position: google.maps.LatLngLiteral;
    count: number;
    onClusterClick?: MarkerHandler;
};
export default function ClusterMarker(props: Props) {
    const {position, count, onClusterClick} = props;
    const [clusterRef, cluster] = useAdvancedMarkerRef();

    const handleClusterClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            onClusterClick && onClusterClick(cluster, e);
        },
        [onClusterClick, cluster]
    );

    return (
        <AdvancedMarker className={styles.cluster} position={position} ref={clusterRef} onClick={handleClusterClick}>
            <span>{count > 999 ? `${Math.floor(count / 100) / 10}k` : count.toString()}</span>
        </AdvancedMarker>
    );
}
