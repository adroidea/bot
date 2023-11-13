import { ButtonInteraction, GuildBasedChannel } from 'discord.js';
import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { buildQotdStep2Menu } from '../selectMenus';

export default {
    data: {
        name: 'qotdHubStep2Btn'
    },
    async execute(interaction: ButtonInteraction) {
        const field = interaction.message.embeds[0].fields[1].value;
        let defaultChannel = undefined;
        if (field !== 'Salon non défini') {
            const startIndex = field.indexOf('<#');
            const endIndex = field.indexOf('>');
            defaultChannel = field.slice(startIndex + 2, endIndex);
        }
        interaction.update({
            components: [
                qotdHubButtons(2),
                buildQotdStep2Menu(
                    interaction.guild?.channels.cache.filter((ch: GuildBasedChannel) =>
                        ch.isTextBased()
                    ),
                    defaultChannel
                ),
                qotdHubSaveBtn
            ]
        });
    }
};
