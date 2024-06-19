import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Channel,
    EmbedBuilder,
    TextBasedChannel,
    userMention
} from 'discord.js';
import { Embed, addAuthor } from '../../../../utils/embedsUtil';
import { Channels } from '../../../../utils/consts';
import { adminRow } from '.';
import { client } from '../../../../..';

export const qotdAcceptStealButton = new ButtonBuilder()
    .setCustomId('qotdAcceptStealBtn')
    .setEmoji('👍')
    .setStyle(ButtonStyle.Success);

export default {
    data: {
        name: 'qotdAcceptStealBtn'
    },
    async execute(interaction: ButtonInteraction) {
        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author!.name.split('(')[1].slice(0, -1);

        const questionEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: 'Auteur',
                    value: userMention(authorId),
                    inline: true
                },
                {
                    name: 'Serveur',
                    value: `${interaction.guild!.name} (${interaction.guild!.id})`,
                    inline: true
                },
                {
                    name: 'Statut',
                    value: '⏳ En attente',
                    inline: true
                }
            )
            .setFooter({
                text: oldEmbed.footer?.text!
            });

        addAuthor(questionEmbed, interaction.user);

        const ownerRequestChannel: Channel | undefined = client.channels.cache.get(
            Channels.stealQDJ
        );
        (ownerRequestChannel as TextBasedChannel).send({
            embeds: [questionEmbed],
            components: [adminRow]
        });

        const embed = Embed.success('La QdJ a été envoyé sur les serveurs, merci à toi !');
        return interaction.update({
            embeds: [embed],
            components: []
        });
    }
};
