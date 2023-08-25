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
import { CustomErrors } from '../../../../utils/errors';
import { Embed } from '../../../../utils/embedsUtil';
import { IGuild } from '../../../../models';
import { checkBotPermission } from '../../../../utils/botUtil';
import { isNotifSMEnabled } from '../../../../utils/modulesUil';

module.exports = {
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
        if (!checkBotPermission(interaction.guild!, PermissionsBitField.Flags.ManageMessages))
            throw CustomErrors.SelfNoPermissionsError;

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

        const { notifications } = guildSettings.modules;
        if (!isNotifSMEnabled(notifications, 'privateLogs')) return;
        const { privateLogChannel } = notifications.privateLogs;

        if (privateLogChannel) {
            const logChannel = client.channels.cache.get(privateLogChannel);
            if (!logChannel?.isTextBased()) return;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()!
                })
                .setDescription(
                    `Suppression de masse (Bulk Delete) de ${amountDeleted} messages effectuée dans <#${channel.id}>`
                )
                .setFooter({ text: `Suppression de masse.` })
                .setColor(
                    interaction.user.hexAccentColor ? interaction.user.hexAccentColor : '#0FF0FF'
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    }
};

const handleBulkDelete = async (
    channel: TextChannel,
    amountToDelete: number,
    target?: GuildMember
) => {
    const messagesToDelete = await channel.messages.fetch();
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
