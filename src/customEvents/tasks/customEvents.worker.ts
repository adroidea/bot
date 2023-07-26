import { Worker, WorkerOptions } from 'bullmq';
import { Colors } from '../../utils/consts';
import { EmbedBuilder } from 'discord.js';
import { IEvent } from '../models';
import { client } from '../../index';
import eventService from '../../services/eventModuleService';

const redisConnectionOptions: WorkerOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: 6379
    },
    autorun: false
};

const handleCustomEventsStartWorker = async (job: any) => {
    const event: IEvent | null = await eventService.getEventById(job.name);
    if (!event) return;

    const channel = client.channels.cache.get(event.channelId);
    const embed = new EmbedBuilder()
        .setTitle("Début de l'événement " + event.title)
        .setDescription(event.description)
        .setColor(Colors.random)
        .setTimestamp();

    if (event.duration) {
        embed.addFields([{ name: '**Durée**', value: `${event.duration}` }]);
    }

    if (event.imageURL) {
        embed.setImage(event.imageURL);
    }

    await channel.send({ embeds: [embed] });
};

// Fonction pour traiter le Worker 'customEventsReminder'
const handleCustomEventsReminderWorker = async (job: any) => {
    const event: IEvent | null = await eventService.getEventById(job.name);
    if (!event) return;

    const { participantsId } = event;
    if (!participantsId) return;

    await Promise.all(
        participantsId.map(async participantId => {
            try {
                const user = await client.users.fetch(participantId);
                await user.send(`Salut ! L'événement "${event.title}" commence bientôt !`);
            } catch (error) {
                console.error(error);
            }
        })
    );
};

export default function (): void {
    const workerCustomEventsStart = new Worker(
        'customEventsStart',
        handleCustomEventsStartWorker,
        redisConnectionOptions
    );

    const workerCustomEventsReminder = new Worker(
        'customEventsReminder',
        handleCustomEventsReminderWorker,
        redisConnectionOptions
    );

    workerCustomEventsStart.on('failed', (job, err) => {
        console.log(`${job?.id} has failed with ${err.message} in 'customEventsStart'`);
    });

    workerCustomEventsReminder.on('failed', (job, err) => {
        console.log(`${job?.id} has failed with ${err.message} in 'customEventsFiveMinutes'`);
    });
}
