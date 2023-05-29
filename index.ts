import { Collection, Partials } from "discord.js";
import { Queue, Worker } from "bullmq";
import DiscordClient from "./src/client";

import Logger from "./src/utils/logger";
import dotenv from "dotenv";

import mongoose from "mongoose";
import path from "node:path";
import { readdirSync } from "fs";

dotenv.config();
export const client: any = new DiscordClient({
  intents: 3276799,
  partials: [Partials.Channel]
});

const filePath = path.join(__dirname, __filename);
client.commands = new Collection();

const handlersPath = path.join(__dirname, "src/handlers");
const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith("Handler.js"));
handlerFiles.forEach((handlerFile: any) => {
  const filePath = path.join(handlersPath, handlerFile);
  import(filePath).then(handler => handler.default(client));
});

const compPath = path.join(__dirname, "src/components");
const componentFolders = readdirSync(compPath);

for (const folder of componentFolders) {
  const comps = path.join(compPath, folder);
  const componentFiles = readdirSync(comps).filter(file => file.endsWith(".js"));

  switch (folder) {
    case "buttons":
      for (const file of componentFiles) {
        const filePath = path.join(compPath, folder, file);
        const button = require(filePath);
        client.buttons.set(button.data.name, button);
      }
      break;
    case "modals":
      for (const file of componentFiles) {
        const filePath = path.join(compPath, folder, file);
        const modal = require(filePath);
        client.modals.set(modal.data.name, modal);
      }
      break;
    case "selectMenus":
      for (const file of componentFiles) {
        const filePath = path.join(compPath, folder, file);
        const selectmenu = require(filePath);
        client.selectMenus.set(selectmenu.data.name, selectmenu);
      }
      break;
    default:
      break;
  }
}

client.rest.on("rateLimited", (info: any) => {
  Logger.warn(`A rate limit has been hit: ${JSON.stringify(info)}`);
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI!, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  })
  .then(() => Logger.info("🍃 MongoDB connected"))
  .catch((err: any) => {
    Logger.error("Couldn't connect to database", err, filePath);
  });

const customEvents = new Queue("customEvents", {
  connection: {
    host: "localhost",
    port: 6379
  }
});

async function addJobs() {
  await customEvents.add("event instant", { foo: "bar" }, { removeOnComplete: true });
  await customEvents.add("event instant", { qux: "baz" }, { removeOnComplete: true });
  await customEvents.add("event 5 ", { delay: 5000 }, { removeOnComplete: true });
  await customEvents.add("event 7", { delay: 7000 }, { removeOnComplete: true });
  await customEvents.add("paint 10", { delay: 10000 }, { removeOnComplete: true });
  await customEvents.add("paint 15", { delay: 15000 }, { removeOnComplete: true });
}

addJobs();

const worker = new Worker("customEvents", async job => {}, {
  connection: {
    host: "localhost",
    port: 6379
  }
});

worker.on("completed", job => {
  console.log(`${job.data} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

client.login(process.env.TOKEN);
