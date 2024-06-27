import {
    ActionRowBuilder,
    Collection,
    EmbedBuilder,
    GuildMember,
    StringSelectMenuBuilder,
    UserSelectMenuInteraction,
    VoiceRegion
} from 'discord.js';
import { Colors } from '../../../../utils/consts';

const buildSelectMenu = (regions: Collection<string, VoiceRegion>) => {
    return new StringSelectMenuBuilder()
        .setCustomId('voiceSetRTCRegionMenu')
        .setPlaceholder('Change la région de ton serveur')
        .addOptions([
            {
                label: 'Auto',
                value: 'null',
                emoji: '🌍'
            },
            ...regions.map((region: VoiceRegion) => ({
                label: region.name,
                value: region.id,
                emoji: '🌍'
            }))
        ]);
};

export const buildVoiceSetRTCRegionActionRow = (regions: Collection<string, VoiceRegion>) => {
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(buildSelectMenu(regions));
};

export default {
    data: {
        name: `voiceSetRTCRegionMenu`
    },
    async execute(interaction: UserSelectMenuInteraction) {
        await interaction.deferUpdate();
        const region: string = interaction.values[0];
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (voiceChannel) {
            if (region === 'null') await voiceChannel.setRTCRegion(null);
            else await voiceChannel.setRTCRegion(region);
        }

        const newEmbed = new EmbedBuilder()
            .setTitle(
                `La région du salon vocal a été changée avec succès. Nouvelle région: ${region}`
            )
            .setColor(Colors.random);

        return interaction.editReply({
            embeds: [newEmbed],
            components: []
        });
    }
};
