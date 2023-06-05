import { IEvent } from "../models";
import { Queue } from "bullmq";

const redisConnection = {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000
  }
};

export const customEventsStart = new Queue("customEventsStart", redisConnection);
export const customEventsFiveMinutes = new Queue("customEventsFiveMinutes", redisConnection);
export const customEventsOneDay = new Queue("customEventsOneDay", redisConnection);
export const customEventsOneWeek = new Queue("customEventsOneWeek", redisConnection);

export default function (): void {
  customEventsStart;
  customEventsFiveMinutes;
  customEventsOneDay;
  customEventsOneWeek;
}

export function addToAppropriateQueue(eventId: IEvent | null, event: IEvent) {
  const delay = Number(event.date) - Number(new Date());

  customEventsStart.add(`${eventId}`, { event }, { delay });

  if (delay >= 5 * 60 * 1000) {
    // L'événement se produit dans les 5 minutes à venir, on l'ajoute à la queue 'customEventsFiveMinutes'
    customEventsFiveMinutes.add(`${eventId}`, { event }, { delay });
  }

  if (delay >= 24 * 60 * 60 * 1000) {
    // L'événement se produit dans les 24 heures à venir, on l'ajoute à la queue 'customEventsOneDay'
    customEventsOneDay.add(`${eventId}`, { event }, { delay });
  }

  if (delay >= 7 * 24 * 60 * 60 * 1000) {
    // L'événement se produit dans la semaine à venir, on l'ajoute à la queue 'customEventsOneWeek'
    customEventsOneWeek.add(`${eventId}`, { event }, { delay });
  }
}
