import { Embed, addAuthor } from '../../../utils/embeds.util';
import { EmbedBuilder, Guild, MessageType, TextBasedChannel, User } from 'discord.js';
import { IQuestions, QuestionsModel } from '../models';
import { Colors } from '../../../utils/consts';
import { IQOTDModule } from 'adroi.d.ea';
import Logger from '../../../utils/logger';
import { client } from '../../../..';
import cron from 'node-cron';
import { getGuildsCache } from '../../core/tasks/createCache.cron';
import qotddService from '../services/qotd.service';

export default function (): cron.ScheduledTask {
    return cron.schedule('0 7 * * *', () => {
        (async () => {
            const guildsCache = getGuildsCache();
        for (const guildData of guildsCache) {
                const guild: Guild = client.guilds.cache.get(guildData.id);
                if (!guild) continue;

                const { qotd }: { qotd: IQOTDModule } = guildData.modules;
                if (!qotd.enabled) continue;

                try {
                    const randomQuestion: IQuestions[] = await QuestionsModel.aggregate([
                        { $match: { guildId: guild.id } },
                        { $sample: { size: 1 } }
                    ]);

                    if (randomQuestion?.length <= 0) continue;

                    handleLowQuestionsCount(guild, qotd);
                    const { question, authorId } = randomQuestion[0];

                    const channel = guild.channels.cache.get(qotd.channelId);
                    if (!channel?.isTextBased()) continue;

                    const questionEmbed = new EmbedBuilder()
                        .setTitle(question)
                        .setColor(Colors.random)
                        .setFooter({
                            text: 'Question du jour • /qdj pour ajouter une question'
                        });

                    const author: User = await client.users.fetch(authorId);
                    if (author) addAuthor(questionEmbed, author);

                    await deletePinnedMessages(channel);

                    const sentMessage = await channel.send({
                        content: qotd.pingedRoleId ? `<@&${qotd.pingedRoleId}>` : '',
                        embeds: [questionEmbed]
                    });
                    await sentMessage.pin();

                    await deletePinNotification(channel, sentMessage.id);
                    await qotddService.deleteQOtDById(randomQuestion[0]._id!);
                } catch (error: any) {
                    Logger.error('Error sending question:', error);
                }
            }
        })();
    });
}

const deletePinnedMessages = async (channel: TextBasedChannel): Promise<void> => {
    const pinnedMessages = await channel.messages.fetchPinned();

    for (const pinnedMessage of pinnedMessages) {
        if (pinnedMessage[1].author.bot === true) await pinnedMessage[1].unpin();
    }
};

const deletePinNotification = async (chan: TextBasedChannel, sentMsgId: string): Promise<void> => {
    const pinMessages = await chan.messages.fetch({ limit: 5 });
    for (const pinMessage of pinMessages) {
        if (
            pinMessage[1].type === MessageType.ChannelPinnedMessage &&
            pinMessage[1].id !== sentMsgId
        )
            pinMessage[1].delete();
    }
};

const handleLowQuestionsCount = async (guild: Guild, qotd: IQOTDModule): Promise<void> => {
    const totalQuestions: number = await QuestionsModel.countDocuments({
        guildId: guild.id
    });

    if (totalQuestions <= qotd.questionsThreshold && qotd.questionsThreshold !== 0) {
        let channel = guild.channels.cache.get(qotd.proposedChannelId);
        if (!channel?.isTextBased()) return;

        channel.send({
            embeds: [
                Embed.rc(
                    `Il ne reste plus que ${totalQuestions} questions du jour ! Pensez à en ajouter avec la commande /qdj`
                )
            ]
        });
    }
};
