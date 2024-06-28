import { Worker as BullWorker, Job } from 'bullmq';
import EventManagerService from '../services/eventManager.service';
import { IEvent } from '../models';
import client from '../../../client';
import { connection } from '../../../..';
import logger from '../../../utils/logger';

const connectionOptions = {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
};

const worker = new BullWorker(
    'eventManagerQueue',
    async (job: Job) => {
        const event: IEvent | null = await EventManagerService.getEventById(job.name);
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
    },
    connectionOptions
);

worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed with error ${err.message}`, err, 'jail.worker.js');
});
