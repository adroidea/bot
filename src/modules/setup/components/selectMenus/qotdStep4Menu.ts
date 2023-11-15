import {
    ActionRowBuilder,
    EmbedBuilder,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from 'discord.js';
import { formatCustomList, formatFields } from '../../../../utils/embedsUtil';

export const buildQotdStep4Menu = (): ActionRowBuilder<UserSelectMenuBuilder> => {
    const selectMenu = new UserSelectMenuBuilder()
        .setCustomId('qotdStep4Menu')
        .setPlaceholder('Utilisateurs interdits de QdJ')
        .setMinValues(0)
        .setMaxValues(25);
    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(selectMenu);
    return row;
};

export default {
    data: {
        name: `qotdStep4Menu`
    },
    async execute(interaction: UserSelectMenuInteraction) {
        const oldEmbed = interaction.message.embeds[0];

        const customField = {
            name: oldEmbed.fields[5].name,
            value:
                '=>\n' +
                formatCustomList(
                    interaction.users.map(user => user.id),
                    'user'
                ),
            inline: true
        };

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(formatFields(oldEmbed.fields, customField, 5))
            .setFooter({ text: oldEmbed.footer?.text! });

        return interaction.update({
            embeds: [newEmbed]
        });
    }
};
