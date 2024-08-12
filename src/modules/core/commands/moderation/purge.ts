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
import { getTextChannel, hasBotPermission } from '../../../../utils/bot.util';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../i18n/i18n-types';

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

    async execute(
        _: Client,
        interaction: ChatInputCommandInteraction,
        guildSettings: IGuild,
        LL: TranslationFunctions
    ) {
        const locale = LL.modules.core.commands.purge;
        const permissions = [PermissionsBitField.Flags.ManageMessages];
        if (!hasBotPermission(interaction.guild!, permissions))
            throw CustomErrors.SelfNoPermissionsError(interaction.guild!, permissions);

        const amountToDelete = interaction.options.getNumber('montant', true);
        if (amountToDelete > 100 || amountToDelete < 0) {
            return interaction.reply(locale.amountError());
        }

        const target = interaction.options.getMember('cible') as GuildMember;
        const targetstr = target.user?.username;
        const channel = interaction.channel as TextChannel;
        if (!channel) return;

        const amountDeleted = await handleBulkDelete(channel, amountToDelete, target);

        let replyContent = target
            ? Embed.success(locale.embed.titleTarget({ amount: amountDeleted, target: targetstr }))
            : Embed.success(locale.embed.titleNoTarget({ amount: amountDeleted }));

        if (amountDeleted === 0) replyContent = Embed.error(locale.embed.error());

        replyContent.setFooter({ text: locale.embed.footer() });

        interaction.reply({
            embeds: [replyContent],
            ephemeral: true
        });

        const { messageBulkDelete } = guildSettings.modules.auditLogs;
        if (!messageBulkDelete.enabled) return;
        const { channelId } = messageBulkDelete;

        if (channelId) {
            const logChannel = getTextChannel(interaction.guild!, channelId);

            const embed = new EmbedBuilder()
                .setTitle(locale.logEmbed.title())
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
