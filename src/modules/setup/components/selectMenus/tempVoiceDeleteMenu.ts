import {
    ActionRowBuilder,
    Collection,
    GuildBasedChannel,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { buildTempVoiceHubEmbed } from '../buttons/tempVoiceHubSaveBtn';
import { client } from '../../../..';
import guildService from '../../../../services/guildService';

export const buildTempVoiceDeleteMenu = (
    VCHostList?: string[] | undefined
): ActionRowBuilder<StringSelectMenuBuilder> => {
    let VCList: Collection<string, GuildBasedChannel> = new Collection();

    VCHostList?.forEach(VC => {
        const voice: GuildBasedChannel = client.channels.cache.get(VC);
        if (voice) {
            VCList.set(VC, voice);
        }
    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('tempVoiceDeleteMenu')
        .setPlaceholder('Supprimer des salons host')
        .setMinValues(1)
        .setMaxValues(VCList.size);

    if (VCList)
        for (const channel of VCList) {
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(channel[1].name)
                .setValue(channel[0]);
            selectMenu.addOptions(option);
        }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    return row;
};

export default {
    data: {
        name: `tempVoiceDeleteMenu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const guildData = await guildService.getOrCreateGuild(interaction.guildId!);
        const tempVoice = guildData.modules.temporaryVoice;
        return interaction.update({
            embeds: [buildTempVoiceHubEmbed(tempVoice)]
        });
    }
};
