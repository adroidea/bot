import { CustomErrors } from './errors';
import { IGuild } from '../models';
import guildService from '../services/guildService';

export const checkModuleState = async (
    moduleName: string,
    subModuleName: string,
    guildId: string
) => {
    let guildSettings: IGuild | null = await guildService.getGuildById(guildId);
    if (!guildSettings) {
        guildSettings = await guildService.createGuild(guildId);
    }

    if (
        !guildSettings.modules.notifications.enabled &&
        !guildSettings.modules.notifications.publicLogs.enabled
    )
        throw CustomErrors.ModuleNotEnabledError;
};
