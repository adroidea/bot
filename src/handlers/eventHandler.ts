import { Client } from "discord.js";
import Logger from "../utils/logger";
import path from "path";
import { readdirSync } from "fs";

let nbEvents = 0;
let nbFailedEvents = 0;

export default async (client: Client) => {
  const eventPath = path.resolve(__dirname, "../events");
  const eventFolders = readdirSync(eventPath);

  for (const folder of eventFolders) {
    const events = path.join(eventPath, folder);
    const eventFiles = readdirSync(events).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
      let hasError = false;
      const errorList: string[] = [];
      const filePath = path.join(eventPath, folder, file);
      const event = require(filePath);

      if (!event.name) {
        errorList.push("NAME required");
        hasError = true;
      }

      if (!eventList.includes(event.name)) {
        errorList.push(`${event.name} unknown`);
        hasError = true;
      }

      if (!hasError) {
        if (event.once) {
          client.once(event.name, (...args: any) =>
            event.execute(client, ...args)
          );
        } else {
          try {
            client.on(event.name, async (...args: any) =>
              event.execute(client, ...args)
            );
          } catch (err) {
            console.error(err);
          }
        }
        nbEvents++;
      } else {
        nbFailedEvents++;
        Logger.warn(
          `Not initialised Command: ${errorList.join(
            ", "
          )}.\nFile : ${filePath}`
        );
      }
    }
  }

  if (nbFailedEvents !== 0) Logger.warn(`${nbFailedEvents} events not loaded.`);
  if (nbEvents !== 0) Logger.info(`${nbEvents} events loaded.`);
};

const eventList = [
  "applicationCommandPermissionsUpdate",
  "cacheSweep",
  "channelCreate",
  "channelDelete",
  "channelPinsUpdate",
  "channelUpdate",
  "ready",
  "debug",
  "error",
  "guildAuditLogEntryCreate",
  "guildBanAdd",
  "guildBanRemove",
  "guildCreate",
  "guildDelete",
  "emojiCreate",
  "emojiDelete",
  "emojiUpdate",
  "guildIntegrationsUpdate",
  "guildMemberAdd",
  "guildMemberAvailable",
  "guildMemberRemove",
  "guildMembersChunk",
  "guildMemberUpdate",
  "roleCreate",
  "roleDelete",
  "roleUpdate",
  "guildScheduledEventCreate",
  "guildScheduledEventDelete",
  "guildScheduledEventUpdate",
  "guildScheduledEventUserAdd",
  "guildScheduledEventUserRemove",
  "stickerCreate",
  "stickerDelete",
  "stickerUpdate",
  "guildUnavailable",
  "guildUpdate",
  "interactionCreate",
  "invalidated",
  "inviteCreate",
  "inviteDelete",
  "messageDeleteBulk",
  "messageCreate",
  "messageDelete",
  "messageReactionAdd",
  "messageReactionRemove",
  "messageReactionRemoveAll",
  "messageReactionRemoveEmoji",
  "messageUpdate",
  "presenceUpdate",
  "shardDisconnect",
  "shardError",
  "shardReady",
  "shardReconnecting",
  "shardResume",
  "stageInstanceCreate",
  "stageInstanceDelete",
  "stageInstanceUpdate",
  "threadCreate",
  "threadDelete",
  "threadListSync",
  "threadMembersUpdate",
  "threadMemberUpdate",
  "threadUpdate",
  "typingStart",
  "userUpdate",
  "voiceServerUpdate",
  "voiceStateUpdate",
  "warn",
  "webhookUpdate"
];
