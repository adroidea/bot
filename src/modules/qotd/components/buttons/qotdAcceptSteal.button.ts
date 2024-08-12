import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Channel,
    EmbedBuilder,
    TextBasedChannel,
    userMention
} from 'discord.js';
import { Embed, addAuthor } from '../../../../utils/embeds.util';
import { Channels } from '../../../../utils/consts';
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../i18n/i18n-types';
import { adminRow } from '.';
import client from '../../../../client';

export const qotdAcceptStealButton = new ButtonBuilder()
    .setCustomId('qotdAcceptStealBtn')
    .setEmoji('👍')
    .setStyle(ButtonStyle.Success);

export default {
    data: {
        name: 'qotdAcceptStealBtn'
    },
    async execute(interaction: ButtonInteraction, _: IGuild, LL: TranslationFunctions) {
        const oldEmbed = interaction.message.embeds[0];
        const authorId = oldEmbed.author!.name.split('(')[1].slice(0, -1);

        const locale = LL.modules.qotd;

        const questionEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: locale.embeds.fields.author(),
                    value: userMention(authorId),
                    inline: true
                },
                {
                    name: locale.embeds.fields.server(),
                    value: `${interaction.guild!.name} (${interaction.guild!.id})`,
                    inline: true
                },
                {
                    name: locale.embeds.fields.status(),
                    value: locale.status.pending(),
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

        const embed = Embed.success(locale.embeds.success.stealed());
        return interaction.update({
            embeds: [embed],
            components: []
        });
    }
};
