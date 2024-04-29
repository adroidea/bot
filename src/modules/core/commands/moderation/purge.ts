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
import { Embed, addAuthor } from '../../../../utils/embedsUtil';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../locales/i18n-types';
import { hasBotPermission } from '../../../../utils/botUtil';

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
        client: Client,
        interaction: ChatInputCommandInteraction,
        guildSettings: IGuild,
        LL: TranslationFunctions
    ) {
        if (!hasBotPermission(interaction.guild!, [PermissionsBitField.Flags.ManageMessages]))
            throw CustomErrors.SelfNoPermissionsError;

        const locale = LL.modules.core.commands.purge;
        const amountToDelete = interaction.options.getNumber('montant', true);
        if (amountToDelete > 100 || amountToDelete < 0) {
            return interaction.reply(locale.amountError());
        }

        const target = interaction.options.getMember('cible') as GuildMember;
        const channel = interaction.channel as TextChannel;
        if (!channel) return;

        const amountDeleted = await handleBulkDelete(channel, amountToDelete, target);

        let replyContent = target
            ? Embed.success(
                  locale.embed.titleTarget({ amount: amountDeleted, target: target.user.username })
              )
            : Embed.success(locale.embed.titleNoTarget({ amount: amountDeleted }));

        if (amountDeleted === 0) replyContent = Embed.error(locale.embed.error());

        replyContent.setFooter({
            text: locale.embed.footer()
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
    const messagesToDelete = await channel.messages.fetch({limit: amountToDelete});
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
