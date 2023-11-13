import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';
import { buildQotdStep1Menu } from '../selectMenus';

export default {
    data: {
        name: 'qotdHubStep1Btn'
    },
    async execute(interaction: ButtonInteraction) {
        interaction.update({
            components: [qotdHubButtons(1), buildQotdStep1Menu(), qotdHubSaveBtn]
        });
    }
};
