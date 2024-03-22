import {CategoryTypeEnum} from "@/db/types";
import ExhibitionIcon from "@/icons/exhibition.svg";
import FilmIcon from "@/icons/film.svg";
import ConcertIcon from "@/icons/concert.svg";
import ForChildrenIcon from "@/icons/for_children.svg";
import SportIcon from "@/icons/sport.svg";
import PlayIcon from "@/icons/play.svg";
import ClubbingIcon from "@/icons/clubbing.svg";
import FestivalIcon from "@/icons/festival.svg";
import InCityIcon from "@/icons/in_city.svg";
import CharityIcon from "@/icons/charity.svg";
import GastronomyIcon from "@/icons/gastronomy.svg";
import {memo} from "react";

interface Props {
    category: CategoryTypeEnum | null;
    colored?: boolean;
    size?: number;
}
function CategoryIcon(props: Props) {
    const {category, size, colored} = props;

    switch (category) {
        case CategoryTypeEnum.EXHIBITION:
            return <ExhibitionIcon height={size} className={colored ? "text-categoryExhibition" : ""} />;
        case CategoryTypeEnum.FILM:
            return <FilmIcon height={size} className={colored ? "text-categoryFilm" : ""} />;
        case CategoryTypeEnum.CONCERT:
            return <ConcertIcon height={size} className={colored ? "text-categoryConcert" : ""} />;
        case CategoryTypeEnum.FOR_CHILDREN:
            return <ForChildrenIcon height={size} className={colored ? "text-categoryForChildren" : ""} />;
        case CategoryTypeEnum.SPORT:
            return <SportIcon height={size} className={colored ? "text-categorySport" : ""} />;
        case CategoryTypeEnum.PLAY:
            return <PlayIcon height={size} className={colored ? "text-categoryPlay" : ""} />;
        case CategoryTypeEnum.CLUBBING:
            return <ClubbingIcon height={size} className={colored ? "text-categoryClubbing" : ""} />;
        case CategoryTypeEnum.FESTIVAL:
            return <FestivalIcon height={size} className={colored ? "text-categoryFestival" : ""} />;
        case CategoryTypeEnum.IN_CITY:
            return <InCityIcon height={size} className={colored ? "text-categoryInCity" : ""} />;
        case CategoryTypeEnum.CHARITY:
            return <CharityIcon height={size} className={colored ? "text-categoryCharity" : ""} />;
        case CategoryTypeEnum.GASTRONOMY:
            return <GastronomyIcon height={size} className={colored ? "text-categoryGastronomy" : ""} />;
        default:
            return <InCityIcon height={size} className={colored ? "text-categoryInCity" : ""} />;
    }
}
export default memo(CategoryIcon);
