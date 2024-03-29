import {AdvancedMarker, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import {CategoryTypeEnum} from "@/db/types";
import styles from "@/components/markers/Markers.module.scss";
import CategoryIcon from "@/components/CategoryIcon";
import {cx, MarkerHandler} from "@/utils";
import {memo, useCallback} from "react";

type Props = {
    position: google.maps.LatLngLiteral;
    category: CategoryTypeEnum | null;
    onMarkerClick?: MarkerHandler;
};
function Marker(props: Props) {
    const {position, category, onMarkerClick} = props;
    const [markerRef, marker] = useAdvancedMarkerRef();

    const handleMarkerClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            onMarkerClick && onMarkerClick(marker, e);
        },
        [onMarkerClick, marker]
    );

    return (
        <AdvancedMarker
            className={cx({
                [styles.marker]: true,
                "bg-categoryExhibition": category === CategoryTypeEnum.EXHIBITION,
                "bg-categoryFilm": category === CategoryTypeEnum.FILM,
                "bg-categoryConcert": category === CategoryTypeEnum.CONCERT,
                "bg-categoryForChildren": category === CategoryTypeEnum.FOR_CHILDREN,
                "bg-categorySport": category === CategoryTypeEnum.SPORT,
                "bg-categoryPlay": category === CategoryTypeEnum.PLAY,
                "bg-categoryClubbing": category === CategoryTypeEnum.CLUBBING,
                "bg-categoryFestival": category === CategoryTypeEnum.FESTIVAL,
                "bg-categoryCharity": category === CategoryTypeEnum.CHARITY,
                "bg-categoryGastronomy": category === CategoryTypeEnum.GASTRONOMY,
                "bg-categoryInCity": !category || category === CategoryTypeEnum.IN_CITY,
            })}
            position={position}
            ref={markerRef}
            onClick={handleMarkerClick}
        >
            <CategoryIcon category={category} size={24} />
        </AdvancedMarker>
    );
}
export default memo(Marker);
