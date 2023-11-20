import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { voiceBlockBtn } from './voiceBlockBtn';
import { voiceDeleteBtn } from './voiceDeleteBtn';
import { voiceLimitBtn } from './voiceLimitBtn';
//import { voiceOwnerTransferBtn } from './voiceOwnerTransferBtn';
import { voicePrivacyBtn } from './voicePrivacyBtn';
import { voiceTrustBtn } from './voiceTrustBtn';
import { voiceUnblockBtn } from './voiceUnblockBtn';
import { voiceUntrustBtn } from './voiceUntrustBtn';

const voiceOwnerTransferBtn = new ButtonBuilder()
    .setCustomId('voiceOwnerTransferBtn')
    .setEmoji('♻')
    .setStyle(ButtonStyle.Secondary);

export const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    voiceLimitBtn,
    voicePrivacyBtn,
    voiceOwnerTransferBtn,
    voiceDeleteBtn
);

export const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    voiceTrustBtn,
    voiceUntrustBtn,
    voiceBlockBtn,
    voiceUnblockBtn
);

export const tempVoiceComponents = [firstRow, secondRow];
