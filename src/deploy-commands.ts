import Logger from "./utils/logger";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import fs from "fs";
import path from "node:path";

dotenv.config();
export const regCMD = (clientId: string) => {
  // Gets slash commands
  const commands: any[] = [];
  const cmdPath = path.join(__dirname, "commands");

  function readCommands(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.lstatSync(filePath);

      if (stat.isDirectory()) {
        readCommands(filePath);
      } else if (file.endsWith(".js")) {
        const command = require(filePath);
        commands.push(command.data.toJSON());
      }
    }
  }

  readCommands(cmdPath);

  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);

  rest
    .put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => Logger.info(`Successfully registered ${commands.length} application commands.`))
    .catch(console.error);
};
