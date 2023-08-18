import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Channel,
    EmbedBuilder,
    TextBasedChannel,
    userMention
} from 'discord.js';
import { Embed } from '../../../../utils/embedsUtil';
import { LOG_CHANNEL_ID } from '../../../../utils/consts';
import { client } from '../../../..';

const adminRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('qotd_accept_button')
        .setEmoji('👍')
        .setLabel('Accepter')
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId('qotd_reject_button')
        .setEmoji('👎')
        .setLabel('Rejeter')
        .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
        .setCustomId('qotd_blacklist_reject_button')
        .setEmoji('🔨')
        .setLabel('Blacklister utilisateur')
        .setStyle(ButtonStyle.Danger)
);

module.exports = {
    data: {
        name: 'qotd_accept_steal_button'
    },
    async execute(interaction: ButtonInteraction) {
        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author?.name.split('(')[1].slice(0, -1);

        const questionEmbed = new EmbedBuilder()
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
        const ownerRequestChannel: Channel | undefined =
            client.channels.cache.get(LOG_CHANNEL_ID);
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
