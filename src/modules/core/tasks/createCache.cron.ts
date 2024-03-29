import { GuildModel } from '../../../models';
import { IGuild } from 'adroi.d.ea';
import cron from 'node-cron';

let guildsCache: IGuild[] = [];

const updateGuildsCache = async (): Promise<void> => {
    const newGuildsCache = await GuildModel.find().exec();
    guildsCache = newGuildsCache;
};

export const getGuildsCache = (): IGuild[] => {
    return guildsCache;
};

export default function (): cron.ScheduledTask {
    updateGuildsCache();

    return cron.schedule('* * * * *', updateGuildsCache);
}
