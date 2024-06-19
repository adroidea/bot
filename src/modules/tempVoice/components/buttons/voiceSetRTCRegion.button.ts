import { ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, VoiceRegion } from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { buildVoiceSetRTCRegionActionRow } from '../selectMenus';
import { client } from '../../../../..';

export const voiceSetRTCRegionBtn = new ButtonBuilder()
    .setCustomId('voiceSetRTCRegionBtn')
    .setEmoji('🌍')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceSetRTCRegionBtn`
    },
    cooldown: 60,
    async execute(interaction: ButtonInteraction) {
        const ownerId = client.tempVoice.get(interaction.channelId!)?.ownerId;
        if (ownerId !== interaction.user.id) throw CustomErrors.NotVoiceOwnerError;

        const regions: Collection<string, VoiceRegion> = await client.fetchVoiceRegions();
        interaction.reply({
            components: [buildVoiceSetRTCRegionActionRow(regions)],
            ephemeral: true
        });
    }
};
