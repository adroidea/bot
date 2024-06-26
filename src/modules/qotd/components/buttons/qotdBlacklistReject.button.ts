import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    userMention
} from 'discord.js';
import { Embed, addAuthor } from '../../../../utils/embeds.util';
import { CustomErrors } from '../../../../utils/errors';
import qotddService from '../../services/qotd.service';

export const qotdBlacklistRejectButton = new ButtonBuilder()
    .setCustomId('qotdBlacklistRejectBtn')
    .setEmoji('🔨')
    .setLabel('Blacklister utilisateur')
    .setStyle(ButtonStyle.Danger);

export default {
    data: {
        name: 'qotdBlacklistRejectBtn'
    },
    async execute(interaction: ButtonInteraction) {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages))
            throw CustomErrors.UserNoPermissionsError;

        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author!.name.split('(')[1].slice(0, -1);

        await qotddService.addToQotdBlacklist(interaction.guildId!, authorId);

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: 'Auteur',
                    value: '[BLACKLISTÉ] ' + userMention(authorId),
                    inline: true
                },
                {
                    name: 'Statut',
                    value: `🔨 Rejetée et blacklisté par ${userMention(interaction.user.id)}`,
                    inline: true
                }
            )
            .setFooter({
                text: oldEmbed.footer?.text!
            });

        addAuthor(newEmbed, interaction.user);

        interaction.message.edit({
            embeds: [newEmbed],
            components: []
        });

        const embed = Embed.success("La QdJ a été rejetée et l'utilisateur blacklisté.");
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
