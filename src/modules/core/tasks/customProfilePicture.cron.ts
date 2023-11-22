import { Guild } from 'discord.js';
import { Guilds } from '../../../utils/consts';
import Logger from '../../../utils/logger';
import { client } from '../../../';
import cron from 'node-cron';

const dpp = {
    default:
        'https://cdn.discordapp.com/attachments/1050382523261276210/1050382808645894164/icone-discord.png',
    petitdej:
        'https://cdn.discordapp.com/attachments/1050382523261276210/1149031651867897918/ptitdej.png',
    dej: 'https://cdn.discordapp.com/attachments/1050382523261276210/1149030238546821120/dej.png',
    gouter: 'https://cdn.discordapp.com/attachments/1050382523261276210/1149031573522497586/gouter.png',
    diner: 'https://cdn.discordapp.com/attachments/1050382523261276210/1149030250467049512/diner.png',
    dodo: 'https://cdn.discordapp.com/attachments/1050382523261276210/1149030268544491609/dodo.png'
};

export default function (): cron.ScheduledTask {
    return cron.schedule('0 * * * *', () => {
        try {
            // @ts-ignore
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

            const guild: Guild = client.guilds.cache.get(Guilds.adan_ea);
            if (newProfilePicture) guild.setIcon(newProfilePicture);
        } catch (error: any) {
            Logger.error('Error changing profile picture:', error);
        }
    });
}
