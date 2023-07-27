import { GuildModel, IQuestions, QuestionsModel } from '../../../models';
import { CustomErrors } from '../../../utils/errors';
import Logger from '../../../utils/logger';

const addToQotdBlacklist = async (guildId: string, userId: string): Promise<void> => {
    try {
        const guild = await GuildModel.findOne({ id: guildId });

        if (!guild) {
            throw CustomErrors.GuildNotFoundError;
        }

        if (
            guild.modules.qotd.blacklistUsers &&
            !guild.modules.qotd.blacklistUsers.includes(userId)
        ) {
            guild.modules.qotd.blacklistUsers.push(userId);
        }

        await guild.save();
    } catch (error: any) {
        Logger.error(
            `Une erreur est survenue lors de l'ajout de l'utilisateur ${userId} à la blacklist QOTD :`,
            error
        );
        throw CustomErrors.UnknownError;
    }
};

async function createQOtD(qotd: IQuestions): Promise<void> {
    try {
        await QuestionsModel.create(qotd);
    } catch (error: any) {
        Logger.error("Une erreur est survenue lors de l'ajout d'une qdj :", error);
        throw CustomErrors.UnknownError;
    }
}

const qotddService = {
    addToQotdBlacklist,
    addQOtDToDatabase: createQOtD
};

export default qotddService;
