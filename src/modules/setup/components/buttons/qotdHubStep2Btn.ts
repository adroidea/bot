import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';
import { IGuild } from '../../../../models';
import { buildQotdStep2Menu } from '../selectMenus';

export default {
    data: {
        name: 'qotdHubStep2Btn'
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        interaction.update({
            components: [
                qotdHubButtons(2),
                buildQotdStep2Menu(guildSettings.modules.qotd.requestChannelId),
                qotdHubSaveBtn
            ]
        });
    }
};
