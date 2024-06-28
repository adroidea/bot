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

        const { qotd } = guild.modules;

        if (qotd.blacklist && !qotd.blacklist.includes(userId)) {
            qotd.blacklist.push(userId);
        }

        if (qotd.whitelist?.includes(userId)) {
            qotd.whitelist = qotd.whitelist.filter(id => id !== userId);
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

const addToQotdWhiteList = async (guildId: string, userId: string): Promise<void> => {
    try {
        const guild = await GuildModel.findOne({ id: guildId });

        if (!guild) {
            throw CustomErrors.GuildNotFoundError;
        }

        const { qotd } = guild.modules;

        if (qotd.whitelist && !qotd.whitelist.includes(userId)) {
            qotd.whitelist.push(userId);
        }

        if (qotd.blacklist?.includes(userId)) {
            qotd.blacklist = qotd.blacklist.filter(id => id !== userId);
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
    whiteListUser: addToQotdWhiteList
};

export default qotddService;
