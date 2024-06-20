import { client, connection } from '../../../..';
import { Worker as BullWorker } from 'bullmq';

const connectionOptions = {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
    }
};

const worker = new BullWorker(
    'jailQueue',
    async job => {
        const { targetId, guildId, initialChannelId, jailChannelId, messageId } = job.data;

        const guild = await client.guilds.fetch(guildId);
        const target = await guild.members.fetch(targetId);

        await target.voice.setMute(false);
        await target.voice.setDeaf(false);

        if (!target.voice.channel) return;
        const jailChannel = guild.channels.cache.get(jailChannelId);
        const message = await jailChannel.messages.fetch(messageId);

        await target.voice.setChannel(initialChannelId);

        if (message.deletable) {
            await message.delete();
        }
    },
    connectionOptions
);

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error ${err.message}`);
});
