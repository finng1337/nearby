import {BasicCrawlingContext, createBasicRouter} from "crawlee";
import {GooutResponseType} from "../definitions.ts";
import {gooutURL} from "../utils.ts";
import {API_URL} from "../constants.js";

export default class GooutRouter {
    private schedules: Record<number, number> = {};
    private events: Record<number, number> = {};
    private venues: Record<number, number> = {};
    private categories: Record<string, number> = {};
    private tags: Record<string, number> = {};
    gooutRouter = createBasicRouter();

    constructor() {
        this.gooutRouter.addDefaultHandler(this.handler);
    }

    init = async () => {
        const schedules = fetch(API_URL + "/schedules");
        const venues = fetch(API_URL + "/venues");
        const events = fetch(API_URL + "/events");
        const categories = fetch(API_URL + "/categories");
        const tags = fetch(API_URL + "/tags");
        const schedulesJSON = await schedules.then((response) => response.json());
        const venuesJSON = await venues.then((response) => response.json());
        const eventsJSON = await events.then((response) => response.json());
        const categoriesJSON = await categories.then((response) => response.json());
        const tagsJSON = await tags.then((response) => response.json());
        schedulesJSON.map((schedule: any) => {
            if (schedule.idGoout) {
                this.schedules[schedule.idGoout] = schedule.id;
            }
        });
        venuesJSON.map((venue: any) => {
            if (venue.idGoout) {
                this.venues[venue.idGoout] = venue.id;
            }
        });
        eventsJSON.map((event: any) => {
            if (event.idGoout) {
                this.events[event.idGoout] = event.id;
            }
        });
        categoriesJSON.map((category: any) => {
            if (category.idGoout) {
                this.categories[category.idGoout] = category.id;
            }
        });
        tagsJSON.map((tag: any) => {
            if (tag.idGoout) {
                this.tags[tag.idGoout] = tag.id;
            }
        });
    };

    private handler = async (context: BasicCrawlingContext) => {
        const response = await context.sendRequest();
        const responseBody = JSON.parse(response.body);
        const responseJSON = responseBody as GooutResponseType;
        const scrollId = responseJSON.meta.nextScrollId;
        const images: Record<number, string> = {};

        if (scrollId) {
            await context.addRequests([gooutURL(scrollId)]);
        }

        const startTime = performance.now();

        for (const image of responseJSON.included.images) {
            images[image.id] = image.attributes.url;
        }

        for (const event of responseJSON.included.events) {
            if (this.events[event.id] === undefined && !!event.locales.cs.name) {
                if (this.categories[event.attributes.mainCategory] === undefined) {
                    this.categories[event.attributes.mainCategory] = await this.addCategory({
                        idGoout: event.attributes.mainCategory,
                    });

                    console.log("Category " + event.attributes.mainCategory + " added");
                }

                this.events[event.id] = await this.addEvent({
                    idGoout: event.id,
                    title: event.locales.cs.name,
                    description: event.locales.cs.descriptionHtml,
                    category: this.categories[event.attributes.mainCategory],
                    images: event.relationships.images.map(({id}) => images[id])
                });

                console.log("Event " + event.locales.cs.name + " added");

                for (const tag of event.attributes.tags) {
                    if (this.tags[tag] === undefined) {
                        this.tags[tag] = await this.addTag({
                            idGoout: tag,
                        });

                        console.log("Tag " + tag + " added");
                    }

                    await this.addEventTag(this.events[event.id], this.tags[tag]);

                    console.log("Tag " + tag + " added to event " + event.locales.cs.name);
                }
            }
        }

        for (const venue of responseJSON.included.venues) {
            if (this.venues[venue.id] === undefined) {
                if (!venue.locales.cs.name || !venue.attributes.longitude || !venue.attributes.latitude) {
                    continue;
                }
                this.venues[venue.id] = await this.addVenue({
                    idGoout: venue.id,
                    title: venue.locales.cs.name,
                    lon: venue.attributes.longitude,
                    lat: venue.attributes.latitude,
                });

                console.log("Venue " + venue.locales.cs.name + " added");
            }
        }

        for (const schedule of responseJSON.schedules) {
            if (
                schedule.attributes.tags.includes("cancelled") ||
                !this.venues[schedule.relationships.venue.id] ||
                !this.events[schedule.relationships.event.id] ||
                !schedule.attributes.startAt ||
                !schedule.attributes.endAt ||
                !schedule.locales.cs.siteUrl
            ) {
                continue;
            }

            if (this.schedules[schedule.id] === undefined) {
                this.schedules[schedule.id] = await this.addSchedule({
                    idGoout: schedule.id,
                    venue: this.venues[schedule.relationships.venue.id],
                    event: this.events[schedule.relationships.event.id],
                    startAt: schedule.attributes.startAt,
                    endAt: schedule.attributes.endAt,
                    urlGoout: schedule.locales.cs.siteUrl,
                });

                console.log("Schedule " + schedule.id + " added");
            }
        }

        const endTime = performance.now();
        const runTime = Math.floor(endTime - startTime);

        if (runTime < 1000) {
            console.log("Waiting for " + (1000 - runTime) + "ms");
            await new Promise(r => setTimeout(r, 1000 - runTime));
        }

        console.log("Page processed");
    };

    private addVenue = async (venue: object): Promise<number> => {
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
    private addEvent = async (event: object): Promise<number> => {
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
    private addCategory = async (category: object): Promise<number> => {
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
    private addTag = async (tag: object): Promise<number> => {
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
    private addSchedule = async (schedule: object): Promise<number> => {
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
    private addEventTag = async (eventId: number, tagId: number): Promise<number> => {
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
}