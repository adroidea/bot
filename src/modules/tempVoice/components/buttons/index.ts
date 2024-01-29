import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { voiceBlacklistAddBtn } from './voiceBlacklistAddBtn';
import { voiceBlacklistRemoveBtn } from './voiceBlacklistRemoveBtn';
import { voiceDeleteBtn } from './voiceDeleteBtn';
import { voiceLimitBtn } from './voiceLimitBtn';
import { voiceOwnerTransferBtn } from './voiceOwnerTransferBtn';
import { voicePrivacyBtn } from './voicePrivacyBtn';
import { voiceSetRTCRegionBtn } from './voiceSetRTCRegionBtn';
import { voiceWhitelistAddBtn } from './voiceWhitelistAddBtn';
import { voiceWhitelistRemoveBtn } from './voiceWhitelistRemoveBtn';
import { voiceWhitelistTempAddBtn } from './voiceWhitelistTempAddBtn';

export const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    voiceLimitBtn,
    voiceOwnerTransferBtn,
    voicePrivacyBtn,
    voiceSetRTCRegionBtn,
    voiceDeleteBtn
);

export const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    voiceWhitelistAddBtn,
    voiceWhitelistTempAddBtn,
    voiceWhitelistRemoveBtn,
    voiceBlacklistAddBtn,
    voiceBlacklistRemoveBtn
);

export const tempVoiceComponents = [firstRow, secondRow];
