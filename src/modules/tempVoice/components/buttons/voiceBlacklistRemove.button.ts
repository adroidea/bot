import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import { IGuild } from 'adroi.d.ea';
import { buildVoiceBlacklistRemoveRow } from '../selectMenus';
import { getorCreateUserSettings } from '../../../../utils/modules.uil';

export const voiceBlacklistRemoveBtn = new ButtonBuilder()
    .setCustomId('voiceBlacklistRemoveBtn')
    .setEmoji('📤')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceBlacklistRemoveBtn`
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        getorCreateUserSettings(interaction.member as GuildMember, guildSettings);
        const { blockedUsers } = guildSettings.modules.tempVoice.userSettings[interaction.user.id];

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
