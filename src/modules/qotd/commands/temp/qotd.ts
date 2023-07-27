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
    PermissionsBitField
} from 'discord.js';
import { IQOtD, IQuestions } from '../../models';
import { Colors } from '../../../../utils/consts';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from '../../../../models';
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
        .setEmoji('❌')
        .setLabel("Rejeter & Blacklister l'utilisateur")
        .setStyle(ButtonStyle.Danger)
);

const userRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('qotd_edit_button')
        .setEmoji('👍')
        .setLabel('Modifier')
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId('Annuler')
        .setEmoji('👎')
        .setLabel('Annuler')
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
                description: 'Auteur de la question',
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    category: 'misc',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
    usage: 'qdj [question] <auteur>',
    examples: ['qdj Pâtes ou riz ?', 'qdj pain au chocolat ou croissant ? @Adan_ea#3000'],

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildData: IGuild) {
        const { qotd }: { qotd: IQOtD } = guildData.modules;
        if (!qotd.enabled) throw CustomErrors.ModuleDisabledError;

        if (qotd.blacklistUsers?.includes(interaction.user.id))
            throw CustomErrors.BlacklistedUserError;

        const question = interaction.options.getString('question');
        const author = interaction.options.getUser('auteur');
        const user = (interaction.member as GuildMember).user;

        if (qotd.trustedUsers?.includes(interaction.user.id)) {
            const questionBuilder: IQuestions = {
                question: question!,
                authorId: author ? author.id : user.id,
                guildId: interaction.guild!.id
            };
            qotddService.addQOtDToDatabase(questionBuilder);

            return interaction.reply({
                content: 'Question ajoutée !',
                ephemeral: true
            });
        } else {
            const questionEmbed = new EmbedBuilder()
                .setTitle(question)
                .setColor(Colors.random)
                .setFooter({ text: `Requête de QdJ envoyée par ${user.username} (${user.id})` })
                .setTimestamp();

            if (author) {
                questionEmbed.setAuthor({
                    name: `${author.username} (${author.id})`,
                    iconURL: author.displayAvatarURL()
                });
            } else {
                questionEmbed.setAuthor({
                    name: `${user.username}(${user.id})`,
                    iconURL: user.displayAvatarURL()
                });

                user.send({
                    content: 'Ta question a bien été envoyée aux modérateurs !',
                    embeds: [questionEmbed],
                    components: [userRow]
                });

                const requestChannel: Channel | undefined = client.channels.cache.get(
                    qotd.requestChannelId
                );

                if (!requestChannel?.isTextBased()) return;
                requestChannel.send({
                    embeds: [questionEmbed],
                    components: [adminRow]
                });

                await interaction.reply({
                    content: 'Requête envoyée !',
                    ephemeral: true
                });
            }
        }
    }
};
