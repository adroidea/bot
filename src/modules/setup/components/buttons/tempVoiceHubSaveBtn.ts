import { EmbedBuilder, StringSelectMenuInteraction, channelMention, quote } from 'discord.js';
import { ITemporaryVoice } from '../../../tempVoice/models';
import { Modules } from '../../../../utils/consts';
import guildService from '../../../../services/guildService';

export const buildTempVoiceHubEmbed = (d: ITemporaryVoice): EmbedBuilder => {
    const maxChannelsToShow = 20;

    return new EmbedBuilder()
        .setTitle(`${Modules.tempVoice.emoji} Configuration de ${Modules.tempVoice.label}`)
        .addFields([
            {
                name: 'Salons host',
                value: formatChannelList(d.hostChannels),
                inline: true
            }
        ])
        .setFooter({
            text: d.enabled ? '✅ Module Activé' : '❌ Module Désactivé'
        });

    function formatChannelList(channels: string[]): string {
        if (channels.length === 0) return 'Aucun salon';
        const displayedChannels = channels
            .slice(0, maxChannelsToShow)
            .map(id => quote(channelMention(id)))
            .join('\n');

        if (channels.length > maxChannelsToShow) {
            return displayedChannels + `\n> +${channels.length - maxChannelsToShow} autres`;
        }

        return displayedChannels;
    }
};

export default {
    data: {
        name: `tempVoicedHubMenu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const channelId = interaction.values[0];
        const guildData = await guildService.getOrCreateGuild(interaction.guildId!);
        const qotd = guildData.modules.qotd;
        const updatedGuild = await guildService.updateGuild({
            id: interaction.guildId!,
            modules: {
                ...guildData.modules,
                qotd: {
                    enabled: qotd.enabled,
                    channelId: channelId!,
                    requestChannelId: qotd.requestChannelId,
                    blacklistUsers: qotd.blacklistUsers,
                    trustedUsers: qotd.trustedUsers,
                    questionsThreshold: qotd.questionsThreshold
                }
            }
        });

        return interaction.update({
            content: `Nouveau salon ${channelMention(updatedGuild?.modules.qotd.channelId!)}`
        });
    }
};
