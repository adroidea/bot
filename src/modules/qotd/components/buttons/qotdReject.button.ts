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
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../i18n/i18n-types';

export const qotdRejectButton = new ButtonBuilder()
    .setCustomId('qotdRejectBtn')
    .setEmoji('👎')
    .setLabel('Rejeter')
    .setStyle(ButtonStyle.Danger);

export default {
    data: {
        name: 'qotdRejectBtn'
    },
    async execute(interaction: ButtonInteraction, _: IGuild, LL: TranslationFunctions) {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages))
            throw CustomErrors.UserNoPermissionsError;

        const locale = LL.modules.qotd;
        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author!.name.split('(')[1].slice(0, -1);

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: locale.embeds.fields.author(),
                    value: userMention(authorId),
                    inline: true
                },
                {
                    name: locale.embeds.fields.status(),
                    value: locale.status.rejected({ modId: interaction.user.id }),
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

        const embed = Embed.success(locale.embeds.success.rejected());
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
