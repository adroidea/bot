import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { IGuild } from '../../../../models';
import { buildVoiceBlacklistRemoveRow } from '../selectMenus';
import { getorCreateUserSettings } from '../../../../utils/modulesUil';

export const voiceBlacklistRemoveBtn = new ButtonBuilder()
    .setCustomId('voiceBlacklistRemoveBtn')
    .setEmoji('📤')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceBlacklistRemoveBtn`
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        getorCreateUserSettings(interaction.user.id, guildSettings);
        const { blockedUsers } =
            guildSettings.modules.temporaryVoice.userSettings[interaction.user.id];

        if (blockedUsers.length === 0) {
            return interaction.reply({
                content: `Vous n'avez aucun utilisateur dans votre blacklist`,
                ephemeral: true
            });
        } else {
            return interaction.reply({
                components: [buildVoiceBlacklistRemoveRow(blockedUsers)],
                ephemeral: true
            });
        }
    }
};
