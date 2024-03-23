import React, {memo, useCallback} from "react";
import useSWRImmutable from "swr/immutable";
import {getSchedule} from "@/db/actions/scheduleActions";
import styles from "@/components/schedules/ScheduleDetail.module.scss";
import CloseIcon from "@/icons/close.svg";
import {CategoryTypeEnum} from "@/db/types";
import {cx, formatDate} from "@/utils";
import Image from "next/image";
import GoOutIcon from "@/icons/goout.svg";
import KudyznudyIcon from "@/icons/kudyznudy.svg";
import TagLabel from "@/components/TagLabel";

interface Props {
    scheduleId: number;
    onDismiss?: (scheduleId: number) => void;
}
const getCategoryColor = (category: CategoryTypeEnum | null) => {
    switch (category) {
        case CategoryTypeEnum.GASTRONOMY:
            return "categoryGastronomy";
        case CategoryTypeEnum.FILM:
            return "categoryFilm";
        case CategoryTypeEnum.EXHIBITION:
            return "categoryExhibition";
        case CategoryTypeEnum.CHARITY:
            return "categoryCharity";
        case CategoryTypeEnum.CONCERT:
            return "categoryConcert";
        case CategoryTypeEnum.CLUBBING:
            return "categoryClubbing";
        case CategoryTypeEnum.FESTIVAL:
            return "categoryFestival";
        case CategoryTypeEnum.FOR_CHILDREN:
            return "categoryForChildren";
        case CategoryTypeEnum.IN_CITY:
            return "categoryInCity";
        case CategoryTypeEnum.PLAY:
            return "categoryPlay";
        case CategoryTypeEnum.SPORT:
            return "categorySport";
        default:
            return "categoryInCity";
    }
};
function ScheduleDetail(props: Props) {
    const {scheduleId, onDismiss} = props;
    const {data: schedule, isLoading} = useSWRImmutable(["schedule", scheduleId], () => getSchedule(scheduleId));

    const handleDismiss = useCallback(() => {
        onDismiss && onDismiss(scheduleId);
    }, [onDismiss, scheduleId]);

    if (isLoading || !schedule) {
        return (
            <>
                <div className={styles.overlay} onClick={handleDismiss} />
                <div className={styles.dialog}>Loading...</div>
            </>
        );
    }

    const {event} = schedule;
    const eventImg = (event.images as string[])[0];
    const categoryColor = getCategoryColor((event.category?.value as CategoryTypeEnum) || null);

    return (
        <>
            <div className={styles.overlay} onClick={handleDismiss} />
            <div className={styles.dialog}>
                <button className={styles.close} onClick={handleDismiss}>
                    <CloseIcon height={20} />
                </button>
                <div className="flex flex-col items-center">
                    <h1>{event.title}</h1>
                    {event.category?.title && (
                        <span
                            className={cx({
                                [`text-${categoryColor}`]: true,
                                [styles.category]: true,
                            })}
                        >
                            {event.category.title}
                        </span>
                    )}
                </div>
                <div className={styles.content}>
                    <div className={styles.imgContainer}>
                        <Image src={eventImg} alt={event.title} width={360} height={240} className={styles.eventImg} />
                        <div className={styles.tags}>
                            {event.tags.map(({tag}) => {
                                if (tag.title) {
                                    return <TagLabel key={tag.id} tag={tag.title} className={`bg-${categoryColor}`} />;
                                }
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className={styles.date}>{formatDate(schedule.startAt, schedule.endAt)}</div>
                        <div className={styles.venue}>{schedule.venue.title}</div>
                        <div className={styles.links}>
                            {schedule.urlGoout && (
                                <span className={styles.link}>
                                    <GoOutIcon height={12} />
                                    <a href={schedule.urlGoout} target="_blank">
                                        {schedule.urlGoout}
                                    </a>
                                </span>
                            )}
                            {schedule.urlKudyznudy && (
                                <span className={styles.link}>
                                    <KudyznudyIcon height={12} />
                                    <a href={schedule.urlKudyznudy} target="_blank">
                                        {schedule.urlKudyznudy}
                                    </a>
                                </span>
                            )}
                        </div>
                        {event.description && (
                            <div className={styles.description} dangerouslySetInnerHTML={{__html: event.description}} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default memo(ScheduleDetail);
