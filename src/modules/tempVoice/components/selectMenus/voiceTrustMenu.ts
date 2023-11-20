import {
    ActionRowBuilder,
    EmbedBuilder,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IGuild } from '../../../../models';
import { formatCustomList } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guildService';

const selectMenu = new UserSelectMenuBuilder()
    .setCustomId('voiceTrustMenu')
    .setPlaceholder('Ces utilisateurs seront autorisés à rejoindre')
    .setMinValues(0)
    .setMaxValues(25);

export const voiceTrustRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
    selectMenu
);

export default {
    data: {
        name: `voiceTrustMenu`
    },
    async execute(interaction: UserSelectMenuInteraction, guildSettings: IGuild) {
        const { trustedUsers, blockedUsers } =
            guildSettings.modules.temporaryVoice.userSettings[interaction.user.id];
        const newTrustedUsers = interaction.users
            .filter(user => user.id !== interaction.user.id)
            .map(user => user.id);

        for (const userId of newTrustedUsers) {
            if (!trustedUsers.includes(userId)) {
                trustedUsers.push(userId);
                if (blockedUsers.includes(userId)) {
                    blockedUsers.splice(blockedUsers.indexOf(userId), 1);
                }
            }
        }

        guildService.updateGuild(interaction.guild!.id, {
            [`modules.temporaryVoice.userSettings.${interaction.user.id}.trustedUsers`]:
                newTrustedUsers,
            [`modules.temporaryVoice.userSettings.${interaction.user.id}.blockedUsers`]:
                blockedUsers
        });

        const newEmbed = new EmbedBuilder()
            .setTitle('Utilisateurs ajoutés')
            .setDescription(formatCustomList(newTrustedUsers, 'user'))
            .setColor(Colors.random);

        return interaction.update({
            embeds: [newEmbed],
            components: []
        });
    }
};
