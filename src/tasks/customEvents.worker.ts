import { Colors } from "../utils/consts";
import { EmbedBuilder } from "discord.js";
import { IEvent } from "../models";
import { Worker } from "bullmq";
import { client } from "../../index";
import eventService from "../services/eventModuleService";

const connection = {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379
  }
};

export default function (): void {
  new Worker(
    "customEventsStart",
    async job => {
      const event: IEvent | null = await eventService.getEventById(job.name);
      if (!event) return;

      const channel = client.channels.cache.get(event.channelId);
      const embed = new EmbedBuilder()
        .setTitle("Début de l'évenement " + event.title)
        .setDescription(event.description)
        .setColor(Colors.random)
        .setTimestamp();

      if (event.duration) {
        embed.addFields([{ name: "**Durée**", value: `${event.duration}` }]);
      }

      if (event.imageURL) {
        embed.setImage(event.imageURL);
      }

      await channel.send({ embeds: [embed] });
    },
    connection
  );

  new Worker(
    "customEventsFiveMinutes",
    async job => {
      const event: IEvent | null = await eventService.getEventById(job.name);
      if (!event) return;

      const { participantsId } = event;
      if (!participantsId) return;

      await Promise.all(
        participantsId.map(async participantId => {
          try {
            const user = await client.users.fetch(participantId);
            await user.send(`Salut ! L'événement "${event.title}" commence bientot !`);
          } catch (error) {
            console.error(error);
          }
        })
      );
    },
    connection
  );
}
