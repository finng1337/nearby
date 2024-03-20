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
import styles from "@/components/CategoryIcon.module.scss";

interface Props {
    category: CategoryTypeEnum | null;
    colored?: boolean;
    size?: number;
}
export default function CategoryIcon(props: Props) {
    const {category, size, colored} = props;

    switch (category) {
        case CategoryTypeEnum.EXHIBITION:
            return (
                <ExhibitionIcon
                    height={size}
                    className={colored ? styles.exhibitionIcon : ""}
                />
            );
        case CategoryTypeEnum.FILM:
            return (
                <FilmIcon
                    height={size}
                    className={colored ? styles.filmIcon : ""}
                />
            );
        case CategoryTypeEnum.CONCERT:
            return (
                <ConcertIcon
                    height={size}
                    className={colored ? styles.concertIcon : ""}
                />
            );
        case CategoryTypeEnum.FOR_CHILDREN:
            return (
                <ForChildrenIcon
                    height={size}
                    className={colored ? styles.forChildrenIcon : ""}
                />
            );
        case CategoryTypeEnum.SPORT:
            return (
                <SportIcon
                    height={size}
                    className={colored ? styles.sportIcon : ""}
                />
            );
        case CategoryTypeEnum.PLAY:
            return (
                <PlayIcon
                    height={size}
                    className={colored ? styles.playIcon : ""}
                />
            );
        case CategoryTypeEnum.CLUBBING:
            return (
                <ClubbingIcon
                    height={size}
                    className={colored ? styles.clubbingIcon : ""}
                />
            );
        case CategoryTypeEnum.FESTIVAL:
            return (
                <FestivalIcon
                    height={size}
                    className={colored ? styles.festivalIcon : ""}
                />
            );
        case CategoryTypeEnum.IN_CITY:
            return (
                <InCityIcon
                    height={size}
                    className={colored ? styles.inCityIcon : ""}
                />
            );
        case CategoryTypeEnum.CHARITY:
            return (
                <CharityIcon
                    height={size}
                    className={colored ? styles.charityIcon : ""}
                />
            );
        case CategoryTypeEnum.GASTRONOMY:
            return (
                <GastronomyIcon
                    height={size}
                    className={colored ? styles.gastronomyIcon : ""}
                />
            );
        default:
            return (
                <InCityIcon
                    height={size}
                    className={colored ? styles.inCityIcon : ""}
                />
            );
    }
}
