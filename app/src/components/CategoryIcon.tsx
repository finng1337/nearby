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

interface Props {
    category: CategoryTypeEnum | null;
    size?: number;
}
export default function CategoryIcon(props: Props) {
    const {category, size} = props;

    switch (category) {
        case CategoryTypeEnum.EXHIBITION:
            return <ExhibitionIcon height={size} />;
        case CategoryTypeEnum.FILM:
            return <FilmIcon height={size} />;
        case CategoryTypeEnum.CONCERT:
            return <ConcertIcon height={size} />;
        case CategoryTypeEnum.FOR_CHILDREN:
            return <ForChildrenIcon height={size} />;
        case CategoryTypeEnum.SPORT:
            return <SportIcon height={size} />;
        case CategoryTypeEnum.PLAY:
            return <PlayIcon height={size} />;
        case CategoryTypeEnum.CLUBBING:
            return <ClubbingIcon height={size} />;
        case CategoryTypeEnum.FESTIVAL:
            return <FestivalIcon height={size} />;
        case CategoryTypeEnum.IN_CITY:
            return <InCityIcon height={size} />;
        case CategoryTypeEnum.CHARITY:
            return <CharityIcon height={size} />;
        case CategoryTypeEnum.GASTRONOMY:
            return <GastronomyIcon height={size} />;
        default:
            return <InCityIcon height={size} />;
    }
}