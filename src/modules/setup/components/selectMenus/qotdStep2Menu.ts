import {
    ActionRowBuilder,
    Collection,
    EmbedBuilder,
    GuildBasedChannel,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder,
    channelMention
} from 'discord.js';

export const buildQotdStep2Menu = (
    textChannelList: Collection<string, GuildBasedChannel> | undefined,
    defaultChannel?: string | undefined
): ActionRowBuilder<StringSelectMenuBuilder> => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('qotdStep2Menu')
        .setPlaceholder('Salon pour propositions de QdJ');

    if (textChannelList)
        for (const channel of textChannelList) {
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(channel[1].name)
                .setValue(channel[0]);
            if (channel[0] === defaultChannel) option.setDefault(true);
            selectMenu.addOptions(option);
        }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    return row;
};

export default {
    data: {
        name: `qotdStep2Menu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const oldEmbed = interaction.message.embeds[0];
        let oldChannel = oldEmbed?.fields[1].value;

        if (oldChannel.includes(' => '))
            oldChannel = oldChannel.slice(0, oldChannel.indexOf(' => '));

        const newChannel = oldChannel + ' => ' + channelMention(interaction.values[0]);

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: oldEmbed.fields[0].name,
                    value: oldEmbed.fields[0].value,
                    inline: true
                },
                {
                    name: oldEmbed.fields[1].name,
                    value: newChannel,
                    inline: true
                },
                ...oldEmbed.fields.slice(2)
            )
            .setFooter({ text: oldEmbed.footer?.text! });

        return interaction.update({
            embeds: [newEmbed]
        });
    }
};
