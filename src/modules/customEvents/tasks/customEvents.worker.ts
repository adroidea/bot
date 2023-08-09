import { Job, Worker, WorkerOptions } from 'bullmq';
import CustomEventService from '../services/customEventService';
import { IEvent } from '../models';
import { client } from '../../..';

const redisConnectionOptions: WorkerOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: 6379
    }
};

// Fonction pour traiter le Worker 'customEventsReminder'
const handleCustomEventsReminderWorker = async (job: Job) => {
    const event: IEvent | null = await CustomEventService.getEventById(job.name);
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
    const workerCustomEventsReminder = new Worker(
        'customEventsReminder',
        handleCustomEventsReminderWorker,
        redisConnectionOptions
    );

    workerCustomEventsReminder.on('failed', (job, err) => {
        console.log(`${job?.id} has failed with ${err.message} in 'customEventsFiveMinutes'`);
    });
}
