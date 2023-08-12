import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    Channel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    TextBasedChannel,
    userMention
} from 'discord.js';
import { Colors, LOG_CHANNEL_ID, OWNER_SERVER_ID } from '../../../../utils/consts';
import { IQOtD, IQuestions } from '../../models';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from '../../../../models';
import { isQOtDModuleEnabled } from '../../../../utils/modulesUil';
import qotddService from '../../services/qotdService';

const adminRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('qotd_accept_button')
        .setEmoji('👍')
        .setLabel('Accepter')
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId('qotd_reject_button')
        .setEmoji('👎')
        .setLabel('Rejeter')
        .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
        .setCustomId('qotd_blacklist_reject_button')
        .setEmoji('🔨')
        .setLabel('Blacklister utilisateur')
        .setStyle(ButtonStyle.Danger)
);

module.exports = {
    data: {
        name: 'qdj',
        description: "Envoie une demande d'ajout de la question du jour (auto accepté pour admins)",
        options: [
            {
                name: 'question',
                description: 'question du jour',
                type: ApplicationCommandOptionType.String,
                required: true
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

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildData: IGuild) {
        const { qotd }: { qotd: IQOtD } = guildData.modules;
        if (!isQOtDModuleEnabled(guildData, true)) return;

        if (qotd.blacklistUsers?.includes(interaction.user.id))
            throw CustomErrors.BlacklistedUserError;

        const question = interaction.options.getString('question');
        const author = interaction.options.getUser('auteur');
        const user = (interaction.member as GuildMember).user;

        const questionBuilder: IQuestions = {
            question: question!,
            authorId: author ? author.id : user.id,
            guildId: interaction.guild!.id
        };

        if (
            qotd.trustedUsers?.includes(interaction.user.id) ||
            interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            qotddService.createQOtD(questionBuilder);

            return interaction.reply({
                content: 'Question ajoutée !',
                ephemeral: true
            });
        } else {
            const questionEmbed = new EmbedBuilder()
                .setTitle(question)
                .setColor(Colors.random)
                .addFields(
                    {
                        name: 'Auteur',
                        value: userMention(user.id),
                        inline: true
                    },
                    {
                        name: 'Statut',
                        value: '⏳ En attente',
                        inline: true
                    }
                )
                .setFooter({ text: 'Requête de QdJ' })
                .setTimestamp();

            questionEmbed.setAuthor({
                name: `${user.username} (${user.id})`,
                iconURL: user.displayAvatarURL()
            });

            const requestChannel: Channel | undefined = client.channels.cache.get(
                qotd.requestChannelId
            );

            if (!requestChannel?.isTextBased()) return;
            requestChannel.send({
                embeds: [questionEmbed],
                components: [adminRow]
            });

            if (interaction.guildId !== OWNER_SERVER_ID) {
                const ownerRequestChannel: Channel | undefined =
                    client.channels.cache.get(LOG_CHANNEL_ID);
                (ownerRequestChannel as TextBasedChannel).send({
                    embeds: [questionEmbed],
                    components: [adminRow]
                });
            }

            await interaction.reply({
                content: 'Requête envoyée !',
                ephemeral: true
            });
        }
    }
};
