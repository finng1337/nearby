export type GooutResponseType = {
    meta: {
        nextScrollId: string,
    },
    schedules: {
        id: number,
        attributes: {
            startAt: string,
            endAt: string,
            isPermanent: boolean,
            tags: string[],
        },
        locales: {
            cs: {
                siteUrl: string,
            },
        },
        relationships: {
            venue: {
                id: number,
            },
            event: {
                id: number,
            },
        },
    }[],
    included: {
        events: {
            id: number,
            attributes: {
                mainCategory: string,
                categories: string[],
                tags: string[],
            },
            locales: {
                cs: {
                    name: string,
                    descriptionHtml: string,
                },
            },
            relationships: {
                images: {
                    id: number,
                }[],

            },
        }[],
        venues: {
            id: number,
            attributes: {
                latitude: number,
                longitude: number,
            },
            locales: {
                cs: {
                    name: string,
                },
            },
        }[],
        images: {
            id: number,
            attributes: {
                url: string,
            },
        }[],
    }
}

export type Event = {
    id: number,
    idGoout: number,
    idKudyznudy: string,
    title: string,
    descriptionHtml: string,
    mainCategory: string,
    categories: string[],
    tags: string[],
    images: string[],
}