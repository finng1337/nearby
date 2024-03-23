import React, {memo} from "react";
import useSWRImmutable from "swr/immutable";
import {getSchedules} from "@/db/actions/scheduleActions";
import {InfoWindow} from "@vis.gl/react-google-maps";
import styles from "@/components/schedules/ScheduleList.module.scss";
import ScheduleListItem from "@/components/schedules/ScheduleListItem";

interface Props {
    venueIds: number[];
    scheduleSkeletonsCount?: number;
    markerRef: google.maps.marker.AdvancedMarkerElement;
    onDetailToggle?: (scheduleId: number) => void;
}

function ScheduleList(props: Props) {
    const {venueIds, scheduleSkeletonsCount, markerRef, onDetailToggle} = props;
    const {data: schedules, isLoading} = useSWRImmutable(["schedules", venueIds], () =>
        getSchedules({active: true, venueIds})
    );

    if (isLoading || !schedules) {
        let scheduleSkeletons = [];

        for (let i = 1; i <= (scheduleSkeletonsCount || 4); i++) {
            scheduleSkeletons.push(
                <React.Fragment key={i}>
                    <ScheduleListItem schedule={null} />
                    {i < (scheduleSkeletonsCount || 4) && <hr className={styles.divider} />}
                </React.Fragment>
            );
        }

        return (
            <InfoWindow anchor={markerRef}>
                <div className={styles.list}>
                    <div className={styles.schedulesWrapper}>{scheduleSkeletons}</div>
                </div>
                <div className={styles.arrow} />
            </InfoWindow>
        );
    }

    return (
        <InfoWindow anchor={markerRef}>
            <div className={styles.list}>
                <div className={styles.schedulesWrapper}>
                    {schedules.map((schedule, index) => (
                        <React.Fragment key={schedule.id}>
                            <ScheduleListItem schedule={schedule} onDetailToggle={onDetailToggle} />
                            {index < schedules.length - 1 && <hr className={styles.divider} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className={styles.arrow} />
        </InfoWindow>
    );
}

export default memo(ScheduleList);
