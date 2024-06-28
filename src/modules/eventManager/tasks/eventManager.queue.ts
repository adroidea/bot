import { IEvent } from '../models';
import Logger from '../../../utils/logger';
import { Queue } from 'bullmq';
import { connection } from '../../../..';

const connectionOptions = {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
};

const reminderQueue = new Queue('eventManagerQueue', connectionOptions);

export const addToAppropriateQueue = async (eventId: string, event: IEvent) => {
    const delay = Number(event.date) - Number(new Date());

    // Time intervals in milliseconds
    const timeIntervals: { name: string; delay: number }[] = [
        { name: 'fiveMinutes', delay: 300000 },
        { name: 'oneAndHalfHours', delay: 5400000 },
        { name: 'oneDay', delay: 86400000 },
        { name: 'oneWeek', delay: 604800000 }
    ];

    try {
        timeIntervals.forEach(interval => {
            if (delay > interval.delay) {
                reminderQueue.add(eventId, { event }, { delay: delay - interval.delay });
            }
        });
    } catch (error: any) {
        Logger.error(`Error adding event with ID ${eventId} to the queue: ${error.message}`, error);
    }
};
