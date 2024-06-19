import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { qotdAcceptButton } from './qotdAccept.button';
import { qotdAcceptStealButton } from './qotdAcceptSteal.button';
import { qotdBlacklistRejectButton } from './qotdBlacklistReject.button';
import { qotdRejectButton } from './qotdReject.button';

export { qotdAcceptButton, qotdAcceptStealButton, qotdBlacklistRejectButton, qotdRejectButton };

export const adminRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    qotdAcceptButton,
    qotdRejectButton,
    qotdBlacklistRejectButton
);

export const stealRow = new ActionRowBuilder<ButtonBuilder>().addComponents(qotdAcceptStealButton);
