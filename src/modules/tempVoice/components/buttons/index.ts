import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { voiceBlacklistAddBtn } from './voiceBlacklistAddBtn';
import { voiceBlacklistRemoveBtn } from './voiceBlacklistRemoveBtn';
import { voiceDeleteBtn } from './voiceDeleteBtn';
import { voiceLimitBtn } from './voiceLimitBtn';
//import { voiceOwnerTransferBtn } from './voiceOwnerTransferBtn';
import { voicePrivacyBtn } from './voicePrivacyBtn';
import { voiceWhitelistAddBtn } from './voiceWhitelistAddBtn';
import { voiceWhitelistRemoveBtn } from './voiceWhitelistRemoveBtn';

const voiceOwnerTransferBtn = new ButtonBuilder()
    .setCustomId('voiceOwnerTransferBtn')
    .setEmoji('👑')
    .setStyle(ButtonStyle.Secondary);

export const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    voiceLimitBtn,
    voicePrivacyBtn,
    voiceOwnerTransferBtn,
    voiceDeleteBtn
);

export const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    voiceWhitelistAddBtn,
    voiceWhitelistRemoveBtn,
    voiceBlacklistAddBtn,
    voiceBlacklistRemoveBtn
);

export const tempVoiceComponents = [firstRow, secondRow];
