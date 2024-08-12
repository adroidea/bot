import {
    ApplicationCommandOptionType,
    Channel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    userMention
} from 'discord.js';
import { Colors, Guilds } from '../../../utils/consts';
import { Embed, addAuthor } from '../../../utils/embeds.util';
import { IGuild, IQOTDModule } from 'adroi.d.ea';
import { adminRow, stealRow } from '../components/buttons';
import { CustomErrors } from '../../../utils/errors';
import { IQuestions } from '../models';
import { TranslationFunctions } from '../../../i18n/i18n-types';
import { isQOtDModuleEnabled } from '../../../utils/modules.uil';
import qotddService from '../services/qotd.service';

export default {
    data: {
        name: 'qdj',
        description: "Envoie une demande d'ajout de la question du jour (auto accepté pour admins)",
        options: [
            {
                name: 'question',
                description: 'question du jour',
                type: ApplicationCommandOptionType.String,
                required: true,
                max_length: 256
            },
            {
                name: 'auteur',
                description: '[ADMIN] Auteur de la question',
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    category: 'misc',
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'qdj [question] <auteur>',
    examples: ['qdj Pâtes ou riz ?', 'qdj pain au chocolat ou croissant ? @Adan_ea#3000'],
    guildOnly: false,

    async execute(
        client: Client,
        interaction: ChatInputCommandInteraction,
        guildData: IGuild,
        LL: TranslationFunctions
    ) {
        const locale = LL.modules.qotd;
        const { qotd }: { qotd: IQOTDModule } = guildData.modules;
        if (!isQOtDModuleEnabled(guildData, true)) return;
        if (qotd.blacklist?.includes(interaction.user.id)) throw CustomErrors.BlacklistedUserError;

        const question = interaction.options.getString('question', true);

        if (qotd.bannedWords?.some(word => new RegExp(word, 'i').test(question)))
            throw CustomErrors.BannedWordError;

        const author = interaction.options.getUser('auteur');
        const user = (interaction.member as GuildMember).user;

        const questionBuilder: IQuestions = {
            question: question,
            authorId: author ? author.id : user.id,
            guildId: interaction.guild!.id
        };

        const questionEmbed = new EmbedBuilder()
            .setTitle(question)
            .setColor(Colors.random)
            .addFields([
                {
                    name: locale.embeds.fields.author(),
                    value: userMention(user.id),
                    inline: true
                }
            ])
            .setFooter({ text: locale.embeds.request.footer() })
            .setTimestamp();

        addAuthor(questionEmbed, user);

        if (
            qotd.whitelist?.includes(interaction.user.id) ||
            interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            qotddService.createQOtD(questionBuilder);
            const successEmbed = Embed.success(locale.embeds.success.add());
            if (interaction.guildId !== Guilds.adan_ea) {
                await interaction.reply({
                    embeds: [
                        questionEmbed,
                        successEmbed.setDescription(locale.embeds.success.description())
                    ],
                    components: [stealRow],
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                });
            }
        } else {
            questionEmbed.addFields([
                {
                    name: locale.embeds.fields.status(),
                    value: locale.status.pending(),
                    inline: true
                }
            ]);

            addAuthor(questionEmbed, user);

            const requestChannel: Channel | undefined = client.channels.cache.get(
                qotd.proposedChannelId
            );

            if (!requestChannel?.isTextBased()) return;
            requestChannel.send({
                embeds: [questionEmbed],
                components: [adminRow]
            });
            const successEmbed = Embed.success(locale.embeds.success.request());
            if (interaction.guildId !== Guilds.adan_ea) {
                await interaction.reply({
                    embeds: [
                        questionEmbed,
                        successEmbed.setDescription(locale.embeds.success.description())
                    ],
                    components: [stealRow],
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                });
            }
        }
    }
};
