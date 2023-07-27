import { EmbedBuilder, Guild, MessageType, TextBasedChannel, User } from 'discord.js';
import { IQOtD, IQuestions, QuestionsModel } from '../models';
import { Colors } from '../../../utils/consts';
import { GuildModel } from '../../../models';
import Logger from '../../../utils/logger';
import { client } from '../../..';
import cron from 'node-cron';

export default function (): void {
    cron.schedule('0 9 * * *', async () => {
        const guilds = await GuildModel.find().exec();
        for (const guildData of guilds) {
            const guild: Guild = client.guilds.cache.get(guildData.id);
            if (!guild) continue;

            const { qotd }: { qotd: IQOtD } = guildData.modules;
            if (!qotd.enabled) continue;

            try {
                const randomQuestion: IQuestions[] = await QuestionsModel.aggregate([
                    { $match: { guildId: guild.id } },
                    { $sample: { size: 1 } }
                ]);

                if (!randomQuestion || randomQuestion.length <= 0) continue;

                const { question, authorId } = randomQuestion[0];

                const channel = guild.channels.cache.get(qotd.channelId);
                if (!channel?.isTextBased()) continue;

                const questionEmbed = new EmbedBuilder()
                    .setTitle(question)
                    .setColor(Colors.random)
                    .setFooter({
                        text: 'Question du jour'
                    });

                const author: User = await client.users.fetch(authorId);
                if (author) {
                    questionEmbed.setAuthor({
                        name: `${author.username}`,
                        iconURL: author.displayAvatarURL()
                    });
                }

                await deletePinnedMessages(channel);

                const sentMessage = await channel.send({
                    content: qotd.pingedRoleId ? `<@&${qotd.pingedRoleId}>` : '',
                    embeds: [questionEmbed]
                });
                await sentMessage.pin();

                await deletePinNotification(channel, sentMessage.id);
            } catch (error: any) {
                Logger.error('Error sending question:', error);
            }
        }
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
