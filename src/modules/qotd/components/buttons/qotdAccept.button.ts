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
import { IQuestions } from '../../models';
import { TranslationFunctions } from '../../../../i18n/i18n-types';
import qotddService from '../../services/qotd.service';

export const qotdAcceptButton = new ButtonBuilder()
    .setCustomId('qotdAcceptBtn')
    .setEmoji('👍')
    .setLabel('Accepter')
    .setStyle(ButtonStyle.Success);

export default {
    data: {
        name: 'qotdAcceptBtn'
    },
    async execute(interaction: ButtonInteraction, _: IGuild, LL: TranslationFunctions) {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages))
            throw CustomErrors.UserNoPermissionsError;

        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author!.name.split('(')[1].slice(0, -1);

        const questionBuilder: IQuestions = {
            question: oldEmbed.title!,
            authorId: authorId,
            guildId: interaction.guild!.id
        };

        const qotdId = await qotddService.createQOtD(questionBuilder);
        const locale = LL.modules.qotd;

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
                    value: locale.status.accepted({ userId: interaction.user.id }),
                    inline: true
                },
                {
                    name: 'ID',
                    value: qotdId,
                    inline: false
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

        const embed = Embed.success(locale.embeds.success.accepted());
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
