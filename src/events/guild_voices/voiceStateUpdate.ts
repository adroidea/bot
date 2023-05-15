import { Client, Events, VoiceState } from "discord.js";
import {
  createNewTempChannel,
  deleteEmptyChannel,
  switchVoiceOwner
} from "../../utils/voiceUtil";
import { IGuild } from "../../models";
import guildService from "../../services/guildService";

const isProtectedVoice = async (
  hostChannels: string[] | undefined,
  protectedChannels: string[] | undefined,
  state: VoiceState
): Promise<boolean> => {
  if (await isHostVoice(hostChannels, state)) {
    return true;
  }
  if (!protectedChannels) return false;
  return protectedChannels.includes(state.channel!.id);
};

const isHostVoice = async (
  hostChannels: string[] | undefined,
  state: VoiceState
): Promise<boolean> => {
  if (!hostChannels) return false;
  if (!state.channel) return false;
  return hostChannels.includes(state.channel.id);
};

const getVoiceUpdateType = (
  oldState: VoiceState,
  newState: VoiceState
): string => {
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;

  if (oldChannel === null && newChannel !== null) {
    return "JOINED_VOICE";
  } else if (oldChannel !== null && newChannel === null) {
    return "LEFT_VOICE";
  } else if (
    oldChannel !== null &&
    newChannel !== null &&
    oldChannel !== newChannel
  ) {
    return "MOVED_VOICE";
  }
  return "";
};

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(client: Client, oldState: VoiceState, newState: VoiceState) {
    let guildSettings: IGuild | null = await guildService.getGuildById(
      newState.guild.id!
    );
    if (!guildSettings) {
      guildSettings = await guildService.createGuild(newState.guild.id!);
    }

    if (!guildSettings.modules.temporaryVoice.enabled) return;

    const hostChannels = guildSettings.modules.temporaryVoice.hostChannels;
    const protectedChannels =
      guildSettings.modules.temporaryVoice.protectedChannels;

    const voiceUpdateType = getVoiceUpdateType(oldState, newState);

    switch (voiceUpdateType) {
      case "JOINED_VOICE": {
        if (await isHostVoice(hostChannels, newState)) {
          await createNewTempChannel(newState);
        }
        break;
      }
      case "LEFT_VOICE": {
        if (
          !(await isProtectedVoice(hostChannels, protectedChannels, oldState))
        ) {
          await deleteEmptyChannel(oldState);
          const member = oldState.channel?.members.first();
          if (member) await switchVoiceOwner(oldState.member!, member);
        }
        break;
      }
      case "MOVED_VOICE": {
        if (
          !(await isProtectedVoice(hostChannels, protectedChannels, oldState))
        ) {
          await deleteEmptyChannel(oldState);
          const member = oldState.channel?.members.first();
          if (member) await switchVoiceOwner(oldState.member!, member);
        }
        if (await isHostVoice(hostChannels, newState)) {
          await createNewTempChannel(newState);
        }
        break;
      }
    }
  }
};
