import { GuildModel, IQuestions, QuestionsModel } from '../../../models';
import { CustomErrors } from '../../../utils/errors';
import Logger from '../../../utils/logger';
import mongoose from 'mongoose';

const addToQotdBlacklist = async (guildId: string, userId: string): Promise<void> => {
    try {
        const guild = await GuildModel.findOne({ id: guildId });

        if (!guild) {
            throw CustomErrors.GuildNotFoundError;
        }

        if (guild.modules.qotd.blacklist && !guild.modules.qotd.blacklist.includes(userId)) {
            guild.modules.qotd.blacklist.push(userId);
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

const whiteListUser = async (guildId: string, userId: string): Promise<void> => {
    try {
        const guild = await GuildModel.findOne({ id: guildId });

        if (!guild) {
            throw CustomErrors.GuildNotFoundError;
        }

        if (guild.modules.qotd.whitelist && !guild.modules.qotd.whitelist.includes(userId)) {
            guild.modules.qotd.whitelist.push(userId);
        }

        await guild.save();
    } catch (error: any) {
        Logger.error(
            `Une erreur est survenue lors de l'ajout de l'utilisateur ${userId} à la whitelist QOTD :`,
            error
        );
        throw CustomErrors.UnknownError;
    }
};

const createQOtD = async (qotd: IQuestions): Promise<string> => {
    try {
        const newQotd = await QuestionsModel.create(qotd);
        return newQotd._id.toString();
    } catch (error: any) {
        Logger.error("Une erreur est survenue lors de l'ajout d'une qdj :", error);
        throw CustomErrors.UnknownError;
    }
};

const deleteQOtDById = async (qotdId: string): Promise<void> => {
    try {
        await QuestionsModel.findByIdAndDelete(new mongoose.Types.ObjectId(qotdId));
    } catch (error: any) {
        Logger.error("Une erreur est survenue lors de la suppression d'une qdj :", error);
    }
};

const qotddService = {
    addToQotdBlacklist,
    createQOtD,
    deleteQOtDById,
    whiteListUser
};

export default qotddService;
