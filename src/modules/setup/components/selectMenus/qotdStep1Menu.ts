import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder,
    StringSelectMenuInteraction,
    channelMention
} from 'discord.js';

export const buildQotdStep1Menu = (
    channelId: string
): ActionRowBuilder<ChannelSelectMenuBuilder> => {
    const selectMenu = new ChannelSelectMenuBuilder()
        .setCustomId('qotdStep1Menu')
        .setPlaceholder('Salon où la QdJ sera envoyée')
        .addChannelTypes(ChannelType.GuildText)
        .setMinValues(0)
        .setMaxValues(1);

    if (channelId !== '') selectMenu.addDefaultChannels(channelId);

    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(selectMenu);
    return row;
};

export default {
    data: {
        name: `qotdStep1Menu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const oldEmbed = interaction.message.embeds[0];
        let oldChannel = oldEmbed?.fields[0].value;

        if (oldChannel.includes(' => '))
            oldChannel = oldChannel.slice(0, oldChannel.indexOf(' => '));

        const newChannel = oldChannel + ' => ' + channelMention(interaction.values[0]);

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: oldEmbed.fields[0].name,
                    value: newChannel,
                    inline: true
                },
                ...oldEmbed.fields.slice(1)
            )
            .setFooter({ text: oldEmbed.footer?.text! });

        return interaction.update({
            embeds: [newEmbed]
        });
    }
};
