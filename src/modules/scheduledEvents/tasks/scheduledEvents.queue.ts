import { IEvent } from '../models';
import Logger from '../../../utils/logger';
import { Queue } from 'bullmq';
import { connection } from '../../..';

const connectionOptions = {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
};

if (connection.status !== 'ready') {
    throw new Error('Redis connection is undefined.');
}

const scheduledEventsQueues = {
    reminderQueue: new Queue('scheduledEventsReminder', connectionOptions)
};

export default function (): void {
    console.log('Scheduled events queues initialized.');
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
