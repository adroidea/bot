import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuInteraction,
    UserSelectMenuBuilder
} from 'discord.js';
import { formatFields } from '../../../../utils/embedsUtil';

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
    async execute(interaction: StringSelectMenuInteraction) {
        const oldEmbed = interaction.message.embeds[0];
        console.log(oldEmbed.fields);

        const customField = {
            name: oldEmbed.fields[5].name,
            value: 'tea',
            inline: true
        };

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(...formatFields(oldEmbed.fields, customField, 5))
            .setFooter({ text: oldEmbed.footer?.text! });

        return interaction.update({
            embeds: [newEmbed]
        });
    }
};
