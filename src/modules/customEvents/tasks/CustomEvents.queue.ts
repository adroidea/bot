import { IEvent } from '../models';
import Logger from '../../../utils/logger';
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

const customEventsQueues = {
    start: new Queue('customEventsStart', redisConnectionOptions),
    fiveMinutes: new Queue('customEventsFiveMinutes', redisConnectionOptions),
    oneDay: new Queue('customEventsOneDay', redisConnectionOptions),
    oneWeek: new Queue('customEventsOneWeek', redisConnectionOptions)
};

export default function (): void {
    customEventsQueues.start;
    customEventsQueues.fiveMinutes;
    customEventsQueues.oneDay;
    customEventsQueues.oneWeek;
}

export const addToAppropriateQueue = async (eventId: IEvent | null, event: IEvent) => {
    const delay = Number(event.date) - Number(new Date());

    try {
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

        // Log successful additions to the queues
        Logger.info(`Event with ID ${eventId} added to the appropriate queue successfully.`);
    } catch (error: any) {
        // Log errors if any occurs during adding events to queues
        Logger.error(`Error adding event with ID ${eventId} to the queue: ${error.message}`, error);
    }
};
