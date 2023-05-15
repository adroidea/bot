import Logger from "./utils/logger";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export const deleteCMD = (clientId: string) => {
  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);

  rest
    .put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => Logger.info(`Successfully deleted all application commands.`))
    .catch(console.error);
};
