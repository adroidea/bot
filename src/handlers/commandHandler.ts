import Logger from "../utils/logger";
import path from "path";
import { readdirSync } from "fs";

let nbCmd = 0;
let nbFailedCmd = 0;

export default async (client: any) => {
  // This gets the command modules from the command folders
  const cmdPath = path.resolve(__dirname, "../commands");
  const cmdFolders = readdirSync(cmdPath);

  for (const folder of cmdFolders) {
    const cmds = path.join(cmdPath, folder);
    const commandFiles = readdirSync(cmds).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      let hasError = false;
      const errorList: string[] = [];
      const filePath = path.join(cmdPath, folder, file);
      const cmd = require(filePath);

      // Checks if the command has a name.
      if (!cmd.data.name) {
        errorList.push("NAME");
        hasError = true;
      }

      // Checks if the command has a category.
      if (!cmd.category) {
        errorList.push("CATEGORY");
        hasError = true;
      }

      // Checks if the command has examples.
      if (!cmd.examples && cmd.type !== "USER") {
        errorList.push("EXAMPLES");
        hasError = true;
      }

      // Checks if the command has a description.
      if (!cmd.data.description && cmd.type !== "USER") {
        errorList.push("DESCRIPTION");
        hasError = true;
      }

      // Checks if the command has permissions.
      if (!cmd.permissions) {
        errorList.push("PERMISSIONS");
        hasError = true;
      }

      if (!cmd.usage && cmd.type !== "USER") {
        errorList.push("USAGE");
        hasError = true;
      }

      if (!hasError && "execute" in cmd) {
        client.commands.set(cmd.data.name, cmd);
        nbCmd++;
      } else {
        nbFailedCmd++;
        Logger.warn(
          `Not initialised Command: ${errorList.join(
            ", "
          )} required.\nFile : ${filePath}`
        );
      }
    }
  }
  if (nbFailedCmd !== 0) Logger.warn(`${nbFailedCmd} commands not loaded.`);
  if (nbCmd !== 0) Logger.info(`${nbCmd} commands loaded.`);
};
