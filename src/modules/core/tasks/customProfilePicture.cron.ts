import { Guild } from 'discord.js';
import { Guilds } from '../../../utils/consts';
import Logger from '../../../utils/logger';
import { client } from '../../../';
import cron from 'node-cron';

const dpp = {
    default:
        'https://cdn.discordapp.com/attachments/1131248804910338068/1211288421717385256/icone-discord.png?ex=65eda740&is=65db3240&hm=cffe7e217c166ac4ce3c74802ad7016331739bd29258730e403e9aeb5fbdbc7b&',
    petitdej:
        'https://cdn.discordapp.com/attachments/1131248804910338068/1211288422098935838/ptitdej.png?ex=65eda740&is=65db3240&hm=66c1bf846b1592a95076cb205ec11769914a6d6a85c2d4af335383f942afdfa6&',
    dej: 'https://cdn.discordapp.com/attachments/1131248804910338068/1211288422598312017/dej.png?ex=65eda740&is=65db3240&hm=458f72d1d1af55bfdfdf391ef1137df96ff48cec96a0c9cc29f92036f9efd277&',
    gouter: 'https://cdn.discordapp.com/attachments/1131248804910338068/1211288421302280192/gouter.png?ex=65eda740&is=65db3240&hm=de4df2f89e202e6bd6aec2b363588c182aa428557f54ee25b7a4bee5f399a609&',
    diner: 'https://cdn.discordapp.com/attachments/1131248804910338068/1211288423093108846/diner.png?ex=65eda740&is=65db3240&hm=a8984417d794f88437aba3554229583cd45484a5ca31ecbcebb0a9bdd6e750f9&',
    dodo: 'https://cdn.discordapp.com/attachments/1131248804910338068/1211288420949688340/dodo.png?ex=65eda740&is=65db3240&hm=69a13e94856a7e55d9e10e1d992bff8d99a4019a544c552459c31f01918b655c&'
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

            const guild: Guild = client.guilds.cache.get(Guilds.adan_ea);
            if (newProfilePicture) guild.setIcon(newProfilePicture);
        } catch (error: any) {
            Logger.error('Error changing profile picture:', error);
        }
    });
}
