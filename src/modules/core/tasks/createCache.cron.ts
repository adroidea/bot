import { GuildModel } from '../../../models';
import { IGuild } from 'adroi.d.ea';
import cron from 'node-cron';

export let guildsCache: IGuild[] = [];

export default function (): cron.ScheduledTask {
    return cron.schedule('* * * * *', () => {
        (async () => {
            guildsCache = await GuildModel.find().exec();
        })();
    });
}
