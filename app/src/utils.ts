export function cx(classes: Record<string, boolean>): string | undefined {
    const classList: string[] = [];

    for (const k in classes) {
        if (classes[k]) {
            classList.push(k);
        }
    }

    if (!classList.length) {
        return undefined;
    }

    return classList.join(" ");
}

export function formatDate(startDate: Date, endDate: Date) {
    if (startDate.getFullYear() === endDate.getFullYear()) {
        const startDayMonth = Intl.DateTimeFormat("cs-CZ", {
            day: "numeric",
            month: "numeric",
        }).format(startDate);
        const endDayMonth = Intl.DateTimeFormat("cs-CZ", {
            day: "numeric",
            month: "numeric",
        }).format(endDate);

        if (startDayMonth === endDayMonth) {
            const day = Intl.DateTimeFormat("cs-CZ", {weekday: "short"}).format(startDate);
            const time = Intl.DateTimeFormat("cs-CZ", {
                hour: "numeric",
                minute: "numeric",
            }).format(startDate);

            return `${day} ${startDayMonth} v ${time}`;
        }

        return `${startDayMonth} \u2014 ${endDayMonth}`;
    }

    const start = Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).format(startDate);
    const end = Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).format(endDate);

    return `${start} \u2014 ${end}`;
}

export type MarkerHandler = (
    marker: google.maps.marker.AdvancedMarkerElement | null,
    e: google.maps.MapMouseEvent
) => void;
