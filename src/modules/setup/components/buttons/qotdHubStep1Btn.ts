import { qotdHubButtons, qotdHubSaveBtn } from '.';
import { ButtonInteraction } from 'discord.js';
import { IGuild } from '../../../../models';
import { buildQotdStep1Menu } from '../selectMenus';

export default {
    data: {
        name: 'qotdHubStep1Btn'
    },
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        interaction.update({
            components: [
                qotdHubButtons(1),
                buildQotdStep1Menu(guildSettings.modules.qotd.channelId),
                qotdHubSaveBtn
            ]
        });
    }
};
