import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';
import { buildQotdStep4Menu } from '../selectMenus';

export default {
    data: {
        name: 'qotdHubStep4Btn'
    },
    async execute(interaction: ButtonInteraction) {
        interaction.update({
            components: [qotdHubButtons(4), buildQotdStep4Menu(), qotdHubSaveBtn]
        });
    }
};
