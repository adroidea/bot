import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';

export default {
    data: {
        name: 'qotdHubStep4Btn'
    },
    async execute(interaction: ButtonInteraction) {
        interaction.update({
            components: [qotdHubButtons(4), qotdHubSaveBtn]
        });
    }
};
