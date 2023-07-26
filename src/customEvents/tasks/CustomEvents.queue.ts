import { IEvent } from '../../models';
import { Queue } from 'bullmq';

const redisConnectionOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: 6379
    },
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    },
    autorun: false
};

export const customEventsQueues = {
    start: new Queue('customEventsStart', redisConnectionOptions),
    fiveMinutes: new Queue('customEventsFiveMinutes', redisConnectionOptions),
    oneDay: new Queue('customEventsOneDay', redisConnectionOptions),
    oneWeek: new Queue('customEventsOneWeek', redisConnectionOptions)
};

export async function addToAppropriateQueue(eventId: IEvent | null, event: IEvent) {
    const delay = Number(event.date) - Number(new Date());

    await customEventsQueues.start.add(`${eventId}`, { event }, { delay });

    if (delay >= 5 * 60 * 1000) {
        await customEventsQueues.fiveMinutes.add(`${eventId}`, { event }, { delay });
    }

    if (delay >= 24 * 60 * 60 * 1000) {
        await customEventsQueues.oneDay.add(`${eventId}`, { event }, { delay });
    }

    if (delay >= 7 * 24 * 60 * 60 * 1000) {
        await customEventsQueues.oneWeek.add(`${eventId}`, { event }, { delay });
    }
}
