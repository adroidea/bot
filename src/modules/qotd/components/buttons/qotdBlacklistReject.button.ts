import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField
} from 'discord.js';
import { Embed, addAuthor } from '../../../../utils/embeds.util';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../i18n/i18n-types';
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
    async execute(interaction: ButtonInteraction, _: IGuild, LL: TranslationFunctions) {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages))
            throw CustomErrors.UserNoPermissionsError;

        const locale = LL.modules.qotd;
        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author!.name.split('(')[1].slice(0, -1);

        await qotddService.addToQotdBlacklist(interaction.guildId!, authorId);

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: locale.embeds.fields.author(),
                    value: locale.embeds.fields.authorBlacklist({ authorId }),
                    inline: true
                },
                {
                    name: locale.embeds.fields.status(),
                    value: locale.status.blacklisted({ modId: interaction.user.id }),
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

        const embed = Embed.success(locale.embeds.success.blacklisted());
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
