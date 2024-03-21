import {CategoryTypeEnum, GetScheduleResponse} from "@/db/types";
import React, {memo, useEffect, useRef, useState} from "react";
import {getSchedule} from "@/db/actions/scheduleActions";
import styles from "@/components/ScheduleDetailSmall.module.scss";
import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";
import {InfoWindow} from "@vis.gl/react-google-maps";
import {cx} from "@/utils";
import useSWRImmutable from "swr/immutable";

interface Props {
    scheduleId: number;
    markerRef: google.maps.marker.AdvancedMarkerElement;
    onDetailDismiss?: () => void;
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
    const {scheduleId, markerRef, onDetailDismiss} = props;
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const {data: schedule} = useSWRImmutable<GetScheduleResponse>(["schedule", scheduleId], () =>
        getSchedule(scheduleId)
    );
    const mouseMove = useRef<boolean>(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleDialogDismiss = (e: MouseEvent) => {
        if (mouseMove.current) {
            mouseMove.current = false;
            return;
        }
        dialogRef.current && !dialogRef.current.contains(e.target as Node) && onDetailDismiss!();
    };

    useEffect(() => {
        if (onDetailDismiss) {
            document.addEventListener("mousedown", () => (mouseMove.current = false));
            document.addEventListener("mousemove", () => (mouseMove.current = true));
            document.addEventListener("click", handleDialogDismiss);
            return () => {
                document.removeEventListener("mousedown", () => (mouseMove.current = false));
                document.removeEventListener("mousemove", () => (mouseMove.current = true));
                document.removeEventListener("click", handleDialogDismiss);
            };
        }
    }, []);

    useEffect(() => {
        setImgLoaded(false);
    }, [scheduleId]);

    if (!schedule || schedule.id !== scheduleId) {
        return (
            <InfoWindow anchor={markerRef}>
                <div className={cx({[styles.container]: true, [styles.skeleton]: true})} ref={dialogRef}>
                    <div className="flex items-center justify-center">
                        <div className={styles.eventImgSkeleton} />
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
            <div className={styles.container} ref={dialogRef}>
                <div className="flex items-center justify-center">
                    <Image
                        src={eventImg}
                        alt={event.title}
                        width={180}
                        height={120}
                        onLoad={() => setImgLoaded(true)}
                        className={cx({[styles.eventImg]: true, "absolute opacity-0": !imgLoaded})}
                    />
                    {!imgLoaded && <div className={styles.eventImgSkeleton} />}
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
