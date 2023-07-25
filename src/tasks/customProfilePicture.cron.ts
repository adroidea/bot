import Logger from '../utils/logger';
import { OWNER_SERVER_ID } from '../utils/consts';
import { client } from '../index';
import cron from 'node-cron';

const PROFILE_PICTURES = [
    {
        name: 'default',
        url: 'https://cdn.discordapp.com/attachments/1050382523261276210/1050382808645894164/icone-discord.png'
    },
    { name: 'petitdej', url: 'URL_OF_PETITDEJ_IMAGE' },
    { name: 'dej', url: 'URL_OF_DEJ_IMAGE' },
    { name: 'gouter', url: 'URL_OF_GOUTER_IMAGE' },
    { name: 'diner', url: 'URL_OF_DINER_IMAGE' },
    { name: 'dodo', url: 'URL_OF_DODO_IMAGE' }
];

export default function (): void {
    cron.schedule('0 * * * *', async () => {
        try {
            const guild = await client.guilds.fetch(OWNER_SERVER_ID);
            const currentHour = new Date().getHours();

            let newProfilePicture;
            switch (currentHour) {
                case 8:
                    newProfilePicture = PROFILE_PICTURES.find(
                        picture => picture.name === 'petitdej'
                    );
                    break;
                case 9:
                    newProfilePicture = PROFILE_PICTURES.find(
                        picture => picture.name === 'default'
                    );
                    break;
                case 12:
                    newProfilePicture = PROFILE_PICTURES.find(picture => picture.name === 'dej');
                    break;
                case 14:
                    newProfilePicture = PROFILE_PICTURES.find(
                        picture => picture.name === 'default'
                    );
                    break;
                case 16:
                    newProfilePicture = PROFILE_PICTURES.find(picture => picture.name === 'gouter');
                    break;
                case 18:
                    newProfilePicture = PROFILE_PICTURES.find(
                        picture => picture.name === 'default'
                    );
                    break;
                default:
                    newProfilePicture = null;
            }

            if (newProfilePicture) await guild.setIcon(newProfilePicture.url);
        } catch (error: any) {
            Logger.error('Error changing profile picture:', error);
        }
    });
}
