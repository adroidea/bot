import { ButtonInteraction, EmbedBuilder, PermissionsBitField, userMention } from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { Embed } from '../../../../utils/embedsUtil';

module.exports = {
    data: {
        name: 'qotd_reject_button'
    },
    async execute(interaction: ButtonInteraction) {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages))
            throw CustomErrors.UserNoPermissionsError;

        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author?.name.split('(')[1].slice(0, -1);

        const newEmbed = new EmbedBuilder()
            .setAuthor({
                name: oldEmbed.author?.name!,
                iconURL: oldEmbed.author?.iconURL
            })
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: 'Auteur',
                    value: userMention(authorId!),
                    inline: true
                },
                {
                    name: 'Statut',
                    value: `❌ Rejetée par ${userMention(interaction.user.id)}`,
                    inline: true
                }
            )

            .setFooter({
                text: oldEmbed.footer?.text!
            });

        interaction.message.edit({
            embeds: [newEmbed],
            components: []
        });

        const embed = Embed.success('La QdJ a été rejetée.');
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
