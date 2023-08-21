import { Job, Worker, WorkerOptions } from 'bullmq';
import { IEvent } from '../models';
import ScheduledEventService from '../services/scheduledEventService';
import { client } from '../../..';

const redisConnectionOptions: WorkerOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: 6379
    }
};

// Fonction pour traiter le Worker 'scheduledEventsReminder'
const handleScheduledEventsReminderWorker = async (job: Job) => {
    const event: IEvent | null = await ScheduledEventService.getEventById(job.name);
    if (!event) return;

    const { participantsId } = event;
    if (!participantsId) return;

    await Promise.all(
        participantsId.map(async participantId => {
            try {
                const user = await client.users.fetch(participantId);
                await user.send(`Salut ! L'événement "${event.name}" commence bientôt !`);
            } catch (error) {
                console.error(error);
            }
        })
    );
};

export default function (): void {
    const workerScheduledEventsReminder = new Worker(
        'scheduledEventsReminder',
        handleScheduledEventsReminderWorker,
        redisConnectionOptions
    );

    workerScheduledEventsReminder.on('failed', (job, err) => {
        console.log(`${job?.id} has failed with ${err.message} in 'ScheduledEventsFiveMinutes'`);
    });
}
