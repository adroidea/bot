import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { IGuild } from '../../../../models';
import { buildVoiceWhitelistRemoveRow } from '../selectMenus';
export const voiceWhitelistRemoveBtn = new ButtonBuilder()
    .setCustomId('voiceWhitelistRemoveBtn')
    .setEmoji('<:untrust:1176809428981391380>')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceWhitelistRemoveBtn`
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        const trustedUsers =
            guildSettings.modules.temporaryVoice.userSettings[interaction.user.id].trustedUsers;

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
