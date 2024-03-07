import {API_URL, GOUT_API_URL} from "./constants.ts";

export const gooutURL = (scrollId: string | null) => scrollId ? GOUT_API_URL + `&scrollId=${scrollId}` : GOUT_API_URL;

export const addVenue = async (venue: object): Promise<number> => {
    const response = await fetch(API_URL + "/venues", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(venue),
    });

    const responseJSON = await response.json();

    return responseJSON.id;
}
export const addEvent = async (event: object): Promise<number> => {
    const response = await fetch(API_URL + "/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
    });

    const responseJSON = await response.json();

    return responseJSON.id;
}
export const addCategory = async (category: object): Promise<number> => {
    const response = await fetch(API_URL + "/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });

    const responseJSON = await response.json();

    return responseJSON.id;
}
export const addTag = async (tag: object): Promise<number> => {
    const response = await fetch(API_URL + "/tags", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tag),
    });

    const responseJSON = await response.json();

    return responseJSON.id;
}
export const addSchedule = async (schedule: object): Promise<number> => {
    const response = await fetch(API_URL + "/schedules", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(schedule),
    });

    const responseJSON = await response.json();

    return responseJSON.id;
}
export const addEventTag = async (eventId: number, tagId: number): Promise<number> => {
    const response = await fetch(API_URL + "/events/" + eventId + "/tags", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id: tagId}),
    });

    const responseJSON = await response.json();

    return responseJSON.id;
}