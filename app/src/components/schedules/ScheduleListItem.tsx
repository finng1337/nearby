import React, {memo, useCallback} from "react";
import {CategoryTypeEnum, GetSchedulesResponse} from "@/db/types";
import styles from "@/components/schedules/ScheduleListItem.module.scss";
import Image from "next/image";
import {cx, formatDate} from "@/utils";
import CategoryIcon from "@/components/CategoryIcon";

interface Props {
    schedule: GetSchedulesResponse[0] | null;
    onDetailToggle?: (scheduleId: number) => void;
}

function ScheduleListItem(props: Props) {
    const {schedule, onDetailToggle} = props;

    const handleDetailToggle = useCallback(() => {
        onDetailToggle && schedule && onDetailToggle(schedule.id);
    }, [onDetailToggle, schedule]);

    if (!schedule) {
        return (
            <div className={cx({[styles.schedule]: true, [styles.skeleton]: true})}>
                <div className={styles.eventImg} />
                <div className="flex flex-col gap-0.5 w-full">
                    <div className={styles.date} />
                    <div className={styles.title} />
                    <div className={styles.venue} />
                </div>
            </div>
        );
    }

    const {event} = schedule;
    const eventImg = (event.images as string[])[0];

    return (
        <div onClick={handleDetailToggle} className={styles.schedule}>
            <div className={styles.categoryIcon}>
                <CategoryIcon category={(event.category?.value as CategoryTypeEnum) || null} size={20} colored />
            </div>
            <Image src={eventImg} alt={event.title} width={128} height={128} className={styles.eventImg} />
            <div className="flex flex-col gap-0.5 w-full">
                <div className={styles.date}>{formatDate(schedule.startAt, schedule.endAt)}</div>
                <h2 className={styles.title}>{event.title}</h2>
                <span className={styles.venue}>{schedule.venue.title}</span>
            </div>
        </div>
    );
}

export default memo(ScheduleListItem);
