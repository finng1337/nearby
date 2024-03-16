import {AdvancedMarker, AdvancedMarkerProps} from "@vis.gl/react-google-maps";

type Props = {
    position: google.maps.LatLngLiteral;
    isClustered?: boolean;
} & AdvancedMarkerProps;
export default function Marker(props: Props) {
    const {position, ...rest} = props;

    return (
        <AdvancedMarker
            position={position}
            {...rest}
        />
    )
}