import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { IGuild } from '../../../../models';
import { Modules } from '../../../../utils/consts';

export default {
    data: {
        name: `modulesMenu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const moduleName = interaction.values[0];
        console.log(moduleName);

        return interaction.reply({
            content: `Mais bien sûr avec plaisir.`
        });
    }
};

export const buildSelectMenu = (
    guildSettings: IGuild
): ActionRowBuilder<StringSelectMenuBuilder> => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('modulesMenu')
        .setPlaceholder('Choisir le module à configurer')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(Modules.core.label)
                .setValue(Modules.core.name)
                .setDescription(`${Modules.core.description}`)
                .setEmoji(Modules.core.emoji),

            new StringSelectMenuOptionBuilder()
                .setLabel(Modules.party.label)
                .setValue(Modules.party.name)
                .setDescription(`[WIP] ${Modules.party.description}`)
                .setEmoji(Modules.party.emoji),

            new StringSelectMenuOptionBuilder()
                .setLabel(Modules.qotd.label)
                .setValue(Modules.qotd.name)
                .setDescription(
                    `[${guildSettings.modules.qotd.enabled ? 'ON' : 'OFF'}] ${
                        Modules.qotd.description
                    }`
                )
                .setEmoji(Modules.qotd.emoji),

            new StringSelectMenuOptionBuilder()
                .setLabel(Modules.scheduledEvents.label)
                .setValue(Modules.scheduledEvents.name)
                .setDescription(
                    `[${guildSettings.modules.eventManagement.enabled ? 'ON' : 'OFF'}] ${
                        Modules.scheduledEvents.description
                    }`
                )
                .setEmoji(Modules.scheduledEvents.emoji),

            new StringSelectMenuOptionBuilder()
                .setLabel(Modules.tempVoice.label)
                .setValue(Modules.tempVoice.name)
                .setDescription(
                    `[${guildSettings.modules.temporaryVoice.enabled ? 'ON' : 'OFF'}] ${
                        Modules.tempVoice.description
                    }`
                )
                .setEmoji(Modules.tempVoice.emoji),

            new StringSelectMenuOptionBuilder()
                .setLabel(Modules.twitch.label)
                .setValue(Modules.twitch.name)
                .setDescription(
                    `[${guildSettings.modules.twitchLive.enabled ? 'ON' : 'OFF'}] ${
                        Modules.twitch.description
                    }`
                )
                .setEmoji(Modules.twitch.emoji)
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    return row;
};
