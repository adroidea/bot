import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    GuildTextBasedChannel
} from 'discord.js';
import { IGuild } from '../../../../models';
import { client } from '../../../..';
import { guildsCache } from '../../tasks/createCache.cron';

const sendChangelogBtn = new ButtonBuilder()
    .setCustomId('sendChangelogBtn')
    .setEmoji('🚀')
    .setStyle(ButtonStyle.Primary);

export const sendChangeLogRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    sendChangelogBtn
);

export default {
    data: {
        name: `sendChangelogBtn`
    },
    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const failedGuilds: string[] = [];

        const sendMessages = guildsCache.map(async (guild: IGuild) => {
            const { privateLogChannel } = guild.modules.notifications.privateLogs;

            if (!privateLogChannel || privateLogChannel === '') return failedGuilds.push(guild.id);

            const channel = (await client.channels.fetch(
                privateLogChannel
            )) as GuildTextBasedChannel;

            if (!channel) return failedGuilds.push(guild.id);

            await channel
                .send({ embeds: [interaction.message.embeds[0]] })
                .catch(() => failedGuilds.push(guild.id));
        });

        await Promise.all(sendMessages);

        if (failedGuilds.length > 0) {
            return interaction.editReply({
                content: `Envoyé sur ${guildsCache.length - failedGuilds.length}/${
                    guildsCache.length
                } serveurs.\n${
                    failedGuilds.length
                } serveurs n'ont pas reçu le message.\nServeurs: ${failedGuilds.join(', ')}`
            });
        } else {
            return interaction.editReply({
                content: `Envoyé sur ${guildsCache.length} serveurs.`
            });
        }
    }
};
