import { Guild, GuildMember } from 'discord.js';
import { client, connection } from '../../../..';
import { Worker as BullWorker } from 'bullmq';
import logger from '../../../utils/logger';

const connectionOptions = {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
};

const worker = new BullWorker(
    'jailQueue',
    async job => {
        const { targetId, guildId, initialChannelId, jailChannelId, messageId } = job.data;

        const guild: Guild = await client.guilds.fetch(guildId);
        const target: GuildMember = await guild.members.fetch(targetId);

        const initialChannel = guild.channels.cache.get(initialChannelId);
        const jailChannel = guild.channels.cache.get(jailChannelId);

        // check if the original channel still exists
        if (!initialChannel) {
            target.voice.disconnect();
        } else if (target.voice.channel) {
            await target.edit({ mute: false, deaf: false });
            await target.voice.setChannel(initialChannelId);
        }

        if (!jailChannel) return;
        if ('messages' in jailChannel && messageId) {
            try {
                const message = await jailChannel.messages.fetch(messageId);

                if (message.deletable) await message.delete();
            } catch (error) {
                return;
            }
        }
    },
    connectionOptions
);

worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed with error ${err.message}`, err, 'jail.worker.js');
});
