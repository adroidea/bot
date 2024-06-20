import { Worker as BullWorker, Job } from 'bullmq';
import { client, connection } from '../../../..';
import { IEvent } from '../models';
import ScheduledEventService from '../services/scheduledEvent.service';

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
    const connectionOptions = {
        connection
    };

    if (connection.status !== 'ready') {
        throw new Error('Redis connection is undefined.');
    }
    const workerScheduledEventsReminder = new BullWorker(
        'scheduledEventsReminder',
        handleScheduledEventsReminderWorker,
        connectionOptions
    );

    workerScheduledEventsReminder.on('failed', (job, err) => {
        console.error(`${job?.id} has failed with ${err.message} in 'ScheduledEventsFiveMinutes'`);
    });
}
