import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { qotdAcceptButton } from './qotdAcceptBtn';
import { qotdAcceptStealButton } from './qotdAcceptStealBtn';
import { qotdBlacklistRejectButton } from './qotdBlacklistRejectBtn';
import { qotdRejectButton } from './qotdRejectBtn';

export { qotdAcceptButton, qotdAcceptStealButton, qotdBlacklistRejectButton, qotdRejectButton };

export const adminRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    qotdAcceptButton,
    qotdRejectButton,
    qotdBlacklistRejectButton
);

export const stealRow = new ActionRowBuilder<ButtonBuilder>().addComponents(qotdAcceptStealButton);
