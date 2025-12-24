import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { adminRouter } from '~/server/api/routers/admin';
import { carouselRouter } from './routers/carousel';
import { committeeRouter } from './routers/committee';
import { animeCardsRouter } from './routers/animecard';
import { eventRouter } from './routers/event';
import { imageRouter } from './routers/image';
import { mangaRouter } from './routers/manga';
import { animeRouter } from './routers/anime';
import { studioRouter } from './routers/studio';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	admin: adminRouter,
	carousel: carouselRouter,
	committee: committeeRouter,
	animecard: animeCardsRouter,
	event: eventRouter,
	image: imageRouter,
	manga: mangaRouter,
	anime: animeRouter,
	studio: studioRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.carousel.getFullData();
 *       ^? { data: Carousel[] }
 */
export const createCaller = createCallerFactory(appRouter);
