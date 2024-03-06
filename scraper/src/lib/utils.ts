import {GOUT_API_URL} from "./constants.ts";

export const gooutURL = (scrollId: string | null) => scrollId ? GOUT_API_URL + `&scrollId=${scrollId}` : GOUT_API_URL;