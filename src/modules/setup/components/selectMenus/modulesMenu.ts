import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { buildQotdHubEmbed, qotdHubButtons, qotdHubSaveBtn } from '../buttons';
import {
    buildQotdStep1Menu,
    buildTempVoiceDeleteMenu,
    buildTempVoiceHubEmbed,
    tempVoiceAddMenu
} from '.';
import { Modules } from '../../../../utils/consts';
import guildService from '../../../../services/guildService';

export default {
    data: {
        name: `modulesMenu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const moduleName = interaction.values[0];
        const guildData = await guildService.getOrCreateGuild(interaction.guildId!);
        const { hostChannels } = guildData.modules.temporaryVoice;

        switch (moduleName) {
            case Modules.qotd.name:
                return interaction.update({
                    embeds: [buildQotdHubEmbed(guildData.modules.qotd)],
                    components: [qotdHubButtons(1), buildQotdStep1Menu(guildData.modules.qotd.channelId), qotdHubSaveBtn]
                });
            case Modules.tempVoice.name: {
                const components: ActionRowBuilder<
                    ChannelSelectMenuBuilder | StringSelectMenuBuilder
                >[] = [tempVoiceAddMenu];

                if (hostChannels.length > 0) {
                    components.push(buildTempVoiceDeleteMenu(hostChannels));
                }

                return interaction.update({
                    embeds: [buildTempVoiceHubEmbed(guildData.modules.temporaryVoice)],
                    components
                });
            }

            default:
                break;
        }
    }
};

export const buildSelectMenu = (): ActionRowBuilder<StringSelectMenuBuilder> => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('modulesMenu')
        .setPlaceholder('Choisir le module à configurer')
        .addOptions(
            ...Object.values(Modules).map(module => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(module.label)
                    .setValue(module.name)
                    .setDescription(module.description)
                    .setEmoji(module.emoji);
            })
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    return row;
};
