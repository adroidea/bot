import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';
import { buildQotdStep2Menu } from '../selectMenus';

export default {
    data: {
        name: 'qotdHubStep2Btn'
    },
    async execute(interaction: ButtonInteraction) {
        interaction.update({
            components: [qotdHubButtons(2), buildQotdStep2Menu(), qotdHubSaveBtn]
        });
    }
};
