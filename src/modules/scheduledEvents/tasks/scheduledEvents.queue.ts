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
    }
};

const scheduledEventsQueues = {
    reminderQueue: new Queue('scheduledEventsReminder', redisConnectionOptions)
};

export default function (): void {
    scheduledEventsQueues.reminderQueue;
}

export const addToAppropriateQueue = async (eventId: string, event: IEvent) => {
    const delay = Number(event.date) - Number(new Date());

    // Définition des délais en millisecondes
    const timeIntervals: { name: string; delay: number }[] = [
        { name: 'oneHourHalf', delay: 5400000 },
        { name: 'oneDay', delay: 86400000 },
        { name: 'oneWeek', delay: 604800000 }
    ];

    try {
        timeIntervals.forEach(interval => {
            if (delay > interval.delay) {
                scheduledEventsQueues.reminderQueue.add(
                    eventId,
                    { event },
                    { delay: delay - interval.delay }
                );
            }
        });

        Logger.info(`Event with ID ${eventId} added to the appropriate queue successfully.`);
    } catch (error: any) {
        Logger.error(`Error adding event with ID ${eventId} to the queue: ${error.message}`, error);
    }
};
