import {BasicCrawler, Configuration} from "crawlee";
import GooutRouter from "./lib/routers/GooutRouter.ts";
import {gooutURL} from "./lib/utils.ts";
import {API_URL} from "./lib/constants.js";

const crawlerConfig = new Configuration({persistStorage: false});
const gooutRouter = new GooutRouter();
await gooutRouter.init();
const crawler = new BasicCrawler({
        maxRequestsPerMinute: 60,
        maxConcurrency: 1,
        maxRequestsPerCrawl: 120,
        requestHandler: gooutRouter.gooutRouter,
    },
    crawlerConfig
);

await crawler.run([gooutURL(null)]);
await fetch(API_URL);
