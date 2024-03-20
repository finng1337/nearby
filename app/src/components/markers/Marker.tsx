import {
    AdvancedMarker,
    AdvancedMarkerProps,
    InfoWindow,
    useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import {CategoryTypeEnum} from "@/db/types";
import styles from "@/components/markers/Markers.module.scss";
import CategoryIcon from "@/components/CategoryIcon";
import {cx} from "@/utils";
import ScheduleDetailSmall from "@/components/ScheduleDetailSmall";
import {memo} from "react";

type Props = {
    position: google.maps.LatLngLiteral;
    category: CategoryTypeEnum | null;
    scheduleId: number;
    selected?: boolean;
} & AdvancedMarkerProps;
function Marker(props: Props) {
    const {position, category, scheduleId, selected, ...rest} = props;
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <>
            {selected && (
                <InfoWindow
                    anchor={marker}
                    pixelOffset={new google.maps.Size(0, 0)}
                    disableAutoPan
                >
                    <ScheduleDetailSmall scheduleId={scheduleId} />
                </InfoWindow>
            )}
            <AdvancedMarker
                className={cx({
                    [styles.marker]: true,
                    [styles.exhibitionMarker]:
                        category === CategoryTypeEnum.EXHIBITION,
                    [styles.filmMarker]: category === CategoryTypeEnum.FILM,
                    [styles.concertMarker]:
                        category === CategoryTypeEnum.CONCERT,
                    [styles.forChildrenMarker]:
                        category === CategoryTypeEnum.FOR_CHILDREN,
                    [styles.sportMarker]: category === CategoryTypeEnum.SPORT,
                    [styles.playMarker]: category === CategoryTypeEnum.PLAY,
                    [styles.clubbingMarker]:
                        category === CategoryTypeEnum.CLUBBING,
                    [styles.festivalMarker]:
                        category === CategoryTypeEnum.FESTIVAL,
                    [styles.charityMarker]:
                        category === CategoryTypeEnum.CHARITY,
                    [styles.gastronomyMarker]:
                        category === CategoryTypeEnum.GASTRONOMY,
                    [styles.inCityMarker]:
                        !category || category === CategoryTypeEnum.IN_CITY,
                })}
                position={position}
                ref={markerRef}
                {...rest}
            >
                <CategoryIcon category={category} size={24} />
            </AdvancedMarker>
        </>
    );
}
export default memo(Marker);
