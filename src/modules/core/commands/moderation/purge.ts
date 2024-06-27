import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    Message,
    PermissionsBitField,
    TextChannel
} from 'discord.js';
import { Embed, addAuthor } from '../../../../utils/embeds.util';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from 'adroi.d.ea';
import { hasBotPermission } from '../../../../utils/bot.util';

export default {
    data: {
        name: 'purge',
        description:
            "Suppression de masse d'un certain nombre de messages dans un salon ou d'un utilisateur",
        options: [
            {
                name: 'montant',
                description: 'Nombre de messages à supprimer',
                type: ApplicationCommandOptionType.Number,
                required: true
            },
            {
                name: 'cible',
                description: 'La victime de cette suppression de masse',
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    category: 'moderation',
    guildOnly: false,
    permissions: [PermissionsBitField.Flags.ManageMessages],
    usage: 'purge [montant] <@cible>',
    examples: ['purge 10', 'purge 100 @adan_ea'],

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildSettings: IGuild) {
        const permissions = [PermissionsBitField.Flags.ManageMessages];
        if (!hasBotPermission(interaction.guild!, permissions))
            throw CustomErrors.SelfNoPermissionsError(interaction.guild!, permissions);

        const amountToDelete = interaction.options.getNumber('montant', true);
        if (amountToDelete > 100 || amountToDelete < 0) {
            return interaction.reply('Merci de choisir un nombre entre 1 et 100');
        }

        const target = interaction.options.getMember('cible') as GuildMember;
        const channel = interaction.channel as TextChannel;
        if (!channel) return;

        const amountDeleted = await handleBulkDelete(channel, amountToDelete, target);

        let replyContent = target
            ? Embed.success(`${amountDeleted} messages supprimés de ${target.user?.username}!`)
            : Embed.success(`${amountDeleted} messages supprimés !`);

        if (amountDeleted === 0) replyContent = Embed.error("Aucun message n'a pu êter supprimé");

        replyContent.setFooter({
            text: `NB: Tout message de plus de 14j sont impossible à supprimer pour moi lors d'un Bulk. Discord est pas cool sur ça`
        });

        interaction.reply({
            embeds: [replyContent],
            ephemeral: true
        });

        const { messageBulkDelete } = guildSettings.modules.auditLogs;
        if (!messageBulkDelete.enabled) return;
        const { channelId } = messageBulkDelete;

        if (channelId) {
            const logChannel = client.channels.cache.get(channelId);
            if (!logChannel?.isTextBased()) return;

            const embed = new EmbedBuilder()
                .setTitle(`Suppression de masse (Bulk Delete) effectuée`)
                .setColor([45, 249, 250]);

            addAuthor(embed, interaction.user);

            await logChannel.send({ embeds: [embed] });
        }
    }
};

/**
 * Handles bulk deletion of messages in a text channel.
 * @param channel - The text channel where the messages will be deleted.
 * @param amountToDelete - The number of messages to delete.
 * @param target - Optional. The target user whose messages will be deleted.
 * @returns The number of messages that were successfully deleted.
 */
const handleBulkDelete = async (
    channel: TextChannel,
    amountToDelete: number,
    target?: GuildMember
) => {
    const messagesToDelete = await channel.messages.fetch({ limit: amountToDelete });
    const filteredMessages: Message[] = [];
    if (target) {
        let i = 0;
        messagesToDelete.filter((msg: Message) => {
            if (msg.author.id === target.id && i < amountToDelete) {
                filteredMessages.push(msg);
                i++;
            }
        });
        if (filteredMessages.length === 0) return 0;
    } else {
        filteredMessages.push(...messagesToDelete.first(amountToDelete));
    }
    if (filteredMessages.length === 0) return 0;
    await channel.bulkDelete(filteredMessages, true);
    return filteredMessages.length;
};
