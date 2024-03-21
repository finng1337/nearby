import {CategoryTypeEnum, GetScheduleResponse} from "@/db/types";
import {memo, useEffect, useState} from "react";
import {getSchedule} from "@/db/actions/scheduleActions";
import styles from "@/components/ScheduleDetailSmall.module.scss";
import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";
import {InfoWindow} from "@vis.gl/react-google-maps";
import {cx} from "@/utils";

interface Props {
    scheduleId: number;
    markerRef: google.maps.marker.AdvancedMarkerElement;
}

const formatDate = (date: Date) => {
    const day = Intl.DateTimeFormat("cs-CZ", {weekday: "short"}).format(date);
    const dayMonth = Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "numeric",
    }).format(date);
    const time = Intl.DateTimeFormat("cs-CZ", {
        hour: "numeric",
        minute: "numeric",
    }).format(date);

    return `${day} ${dayMonth} v ${time}`;
};

const htmlToText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

function ScheduleDetailSmall(props: Props) {
    const {scheduleId, markerRef} = props;
    const [schedule, setSchedule] = useState<GetScheduleResponse>(undefined);

    useEffect(() => {
        const data = getSchedule(scheduleId);
        data.then((res) => setSchedule(res));
    }, [scheduleId]);

    if (!schedule || schedule.id !== scheduleId) {
        return (
            <InfoWindow anchor={markerRef}>
                <div className={cx({[styles.container]: true, [styles.skeleton]: true})}>
                    <div className="flex items-center justify-center">
                        <div className={styles.eventImg} />
                    </div>
                    <div className={styles.mainContent}>
                        <div className={styles.eventMeta}>
                            <span className={styles.date} />
                            <div className={styles.title} />
                            <div className={styles.venue} />
                        </div>
                        <div className={styles.description} />
                        <div className={styles.btnsContainer}>
                            <button className={styles.toggleDetail}>Zobrazit více</button>
                        </div>
                    </div>
                </div>
            </InfoWindow>
        );
    }

    const {event} = schedule;
    const {venue} = schedule;
    const eventImg = (event.images as string[])[0];

    return (
        <InfoWindow anchor={markerRef}>
            <div className={styles.container}>
                <div className="flex items-center justify-center">
                    <Image src={eventImg} alt={event.title} width={180} height={120} className={styles.eventImg} />
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.icon}>
                        <CategoryIcon
                            category={(event.category?.value as CategoryTypeEnum) || null}
                            colored
                            size={24}
                        />
                    </div>
                    <div className={styles.eventMeta}>
                        <span className={styles.date}>{formatDate(schedule.startAt)}</span>
                        <h2 className={styles.title}>{event.title}</h2>
                        <span className={styles.venue}>{venue.title}</span>
                    </div>
                    {event.description && <p className={styles.description}>{htmlToText(event.description)}</p>}
                    <div className={styles.btnsContainer}>
                        <button className={styles.toggleDetail}>Zobrazit více</button>
                    </div>
                </div>
            </div>
        </InfoWindow>
    );
}

export default memo(ScheduleDetailSmall);
