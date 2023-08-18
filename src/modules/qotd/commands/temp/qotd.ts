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
    userMention
} from 'discord.js';
import { Colors, OWNER_SERVER_ID } from '../../../../utils/consts';
import { IQOtD, IQuestions } from '../../models';
import { CustomErrors } from '../../../../utils/errors';
import { Embed } from '../../../../utils/embedsUtil';
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

const stealRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('qotd_accept_steal_button')
        .setEmoji('👍')
        .setStyle(ButtonStyle.Success)
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

        const questionEmbed = new EmbedBuilder()
            .setTitle(question)
            .setColor(Colors.random)
            .addFields([
                {
                    name: 'Auteur',
                    value: userMention(user.id),
                    inline: true
                }
            ])
            .setFooter({ text: 'Requête de QdJ' })
            .setTimestamp();

        questionEmbed.setAuthor({
            name: `${user.username} (${user.id})`,
            iconURL: user.displayAvatarURL()
        });

        if (
            qotd.trustedUsers?.includes(interaction.user.id) ||
            interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            qotddService.createQOtD(questionBuilder);
            const successEmbed = Embed.success('Question ajoutée !');
            if (interaction.guildId !== OWNER_SERVER_ID) {
                await interaction.reply({
                    embeds: [
                        questionEmbed,
                        successEmbed.setDescription(
                            "Est ce que tu es d'accord pour que ta question soit aussi proposée sur le serveur d'Adan ? (Tu peux ignorer le message si tu ne veux pas)"
                        )
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
            questionEmbed
                .addFields([
                    {
                        name: 'Statut',
                        value: '⏳ En attente',
                        inline: true
                    }
                ])
                .setAuthor({
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
            const successEmbed = Embed.success('Requête envoyée !');
            if (interaction.guildId !== OWNER_SERVER_ID) {
                await interaction.reply({
                    embeds: [
                        questionEmbed,
                        successEmbed.setDescription(
                            "Est ce que tu es d'accord pour que ta question soit aussi proposée sur le serveur d'Adan ? (Tu peux ignorer le message si tu ne veux pas)"
                        )
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
