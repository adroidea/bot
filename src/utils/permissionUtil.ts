import { CustomErrors } from './errors';
import { IGuild } from '../models';
import guildService from '../services/guildService';

export const checkModuleState = async (
    moduleName: string,
    subModuleName: string,
    guildId: string
) => {
    const guildSettings: IGuild = await guildService.getorCreateGuild(guildId);

    if (
        !guildSettings.modules.notifications.enabled &&
        !guildSettings.modules.notifications.publicLogs.enabled
    )
        throw CustomErrors.ModuleDisabledError;
};
