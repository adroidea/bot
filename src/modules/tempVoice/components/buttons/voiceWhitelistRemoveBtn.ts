import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { IGuild } from '../../../../models';
import { buildVoiceWhitelistRemoveRow } from '../selectMenus';
import { getorCreateUserSettings } from '../../../../utils/modulesUil';
export const voiceWhitelistRemoveBtn = new ButtonBuilder()
    .setCustomId('voiceWhitelistRemoveBtn')
    .setEmoji('<:untrust:1177755536679251978>')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceWhitelistRemoveBtn`
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        const { trustedUsers } = await getorCreateUserSettings(interaction.user.id, guildSettings);

        if (trustedUsers.length === 0) {
            return interaction.reply({
                content: `Vous n'avez aucun utilisateur dans votre whitelist`,
                ephemeral: true
            });
        } else {
            return interaction.reply({
                components: [buildVoiceWhitelistRemoveRow(trustedUsers)],
                ephemeral: true
            });
        }
    }
};
