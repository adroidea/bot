import { Guild } from 'discord.js';
import { Guilds } from '../../../utils/consts';
import Logger from '../../../utils/logger';
import client from '../../../client';
import cron from 'node-cron';

const dpp = {
    default: 'https://cdn.adan-ea.net/icone-discord.png',
    petitdej: 'https://cdn.adan-ea.net/ptitdej.png',
    dej: 'https://cdn.adan-ea.net/dej.png',
    gouter: 'https://cdn.adan-ea.net/gouter.png',
    diner: 'https://cdn.adan-ea.net/diner.png',
    dodo: 'https://cdn.adan-ea.net/dodo.png'
};

export default function (): cron.ScheduledTask {
    return cron.schedule('0 * * * *', () => {
        try {
            const responsePromise: Promise<string> = fetch(
                `https://decapi.me/twitch/uptime/adan_ea`
            ).then((response: any) => response.text());

            responsePromise.then(response => {
                if (response !== `adan_ea is offline`) return;
            });

            const currentHour = new Date().getHours();

            let newProfilePicture;
            switch (currentHour) {
                case 0:
                    newProfilePicture = dpp.dodo;
                    break;
                case 8:
                    newProfilePicture = dpp.petitdej;
                    break;
                case 12:
                    newProfilePicture = dpp.dej;
                    break;
                case 16:
                    newProfilePicture = dpp.gouter;
                    break;
                case 19:
                    newProfilePicture = dpp.diner;
                    break;
                case 9:
                case 14:
                case 17:
                case 20:
                    newProfilePicture = dpp.default;
                    break;
                default:
                    newProfilePicture = null;
            }

            const guild: Guild | undefined = client.guilds.cache.get(Guilds.adan_ea);
            if (!guild) return;
            if (newProfilePicture) guild.setIcon(newProfilePicture);
        } catch (error: any) {
            Logger.error('Error changing profile picture:', error);
        }
    });
}
