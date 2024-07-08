import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { voiceBlacklistAddBtn } from './voiceBlacklistAdd.button';
import { voiceBlacklistRemoveBtn } from './voiceBlacklistRemove.button';
import { voiceDeleteBtn } from './voiceDelete.button';
import { voiceLimitBtn } from './voiceLimit.button';
import { voiceOwnerTransferBtn } from './voiceOwnerTransfer.button';
import { voicePrivacyBtn } from './voicePrivacy.button';
import { voiceSetRTCRegionBtn } from './voiceSetRTCRegion.button';
import { voiceWhitelistAddBtn } from './voiceWhitelistAdd.button';
import { voiceWhitelistRemoveBtn } from './voiceWhitelistRemove.button';
import { voiceWhitelistTempAddBtn } from './voiceWhitelistTempAdd.button';

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
