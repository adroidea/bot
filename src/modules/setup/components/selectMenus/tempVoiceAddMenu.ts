import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from 'discord.js';
import { buildTempVoiceHubEmbed } from '../buttons/tempVoiceHubSaveBtn';
import guildService from '../../../../services/guildService';

export const tempVoiceAddMenu: ActionRowBuilder<ChannelSelectMenuBuilder> =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
            .setCustomId('tempVoiceAddMenu')
            .setPlaceholder('Ajouter salons host')
            .setChannelTypes(ChannelType.GuildVoice)
            .setMinValues(1)
            .setMaxValues(25)
    );

export default {
    data: {
        name: `tempVoiceAddMenu`
    },
    async execute(interaction: ChannelSelectMenuInteraction) {

        const selectedVC = interaction.values;
        console.log(selectedVC);
        const guildData = await guildService.getOrCreateGuild(interaction.guildId!);

        
        const tempVoice = guildData.modules.temporaryVoice;
        return interaction.update({
            embeds: [buildTempVoiceHubEmbed(tempVoice)]
        });
    }
};
