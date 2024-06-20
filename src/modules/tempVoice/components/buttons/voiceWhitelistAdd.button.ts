import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import { IGuild } from 'adroi.d.ea';
import { getorCreateUserSettings } from '../../../../utils/modules.uil';
import { voiceWhitelistAddRow } from '../selectMenus';

export const voiceWhitelistAddBtn = new ButtonBuilder()
    .setCustomId('voiceWhitelistAddBtn')
    .setEmoji('📗')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceWhitelistAddBtn`
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        getorCreateUserSettings(interaction.member as GuildMember, guildSettings);
        return interaction.reply({
            components: [voiceWhitelistAddRow],
            ephemeral: true
        });
    }
};
