import { GuildModel, IGuild } from '../../../models';
import cron from 'node-cron';

export let guildsCache: IGuild[] = [];

export default function (): cron.ScheduledTask {
    return cron.schedule('* * * * *', async () => {
        return (guildsCache = await GuildModel.find().exec());
    });
}
