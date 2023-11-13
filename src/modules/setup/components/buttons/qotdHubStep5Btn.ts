import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';

export default {
    data: {
        name: 'qotdHubStep5Btn'
    },
    async execute(interaction: ButtonInteraction) {
        interaction.update({
            components: [qotdHubButtons(5), qotdHubSaveBtn]
        });
    }
};
