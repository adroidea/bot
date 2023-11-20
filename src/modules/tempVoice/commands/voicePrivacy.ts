import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    GuildMember,
    PermissionsBitField,
    VoiceBasedChannel
} from 'discord.js';
import { CustomErrors } from '../../../utils/errors';
import { IGuild } from '../../../models';
import { setVoiceLimit } from '../../../utils/voiceUtil';
import { isTemporaryVoiceModuleEnabled } from '../../../utils/modulesUil';

export default {
    data: {
        name: 'voice',
        description: 'Gère ton salon vocal temporaire',
        options: [
            {
                name: 'ban',
                description: 'Bannir un membre de ton salon',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'membre',
                        description: 'Le membre à bannir',
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            },
            {
                name: 'unban',
                description: 'Débannir un utilisateur de ton salon',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'membre',
                        description: 'Le membre à débannir',
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            },
            {
                name: 'whitelist',
                description:
                    'autorise un utilisateur à rejoindre malgré les permissions du serveur',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'membre',
                        description: 'Le membre à whitelist',
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            },
            {
                name: 'limite',
                description: 'Limiter le nombre de membres dans ton salon',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'limite',
                        description: '0 à 99, 0 retire la limite',
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            }
        ]
    },
    category: 'voice',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'voice [commande] [member] ou [option]',
    examples: 'voice ban @adan_ea',
    guildOnly: false,

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildSettings: IGuild) {
        if (!isTemporaryVoiceModuleEnabled(guildSettings, true)) return;

        const member = interaction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;

        if (!memberVoiceChannel) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        const voiceChannel = await interaction.guild!.channels.fetch(memberVoiceChannel.id);
        if (!voiceChannel!.isVoiceBased()) throw CustomErrors.NotVoiceChannelError;

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'ban':
                await handleBanCommand(client, interaction, member, voiceChannel);
                break;

            case 'unban':
                await handleUnbanCommand(interaction, member, voiceChannel);
                break;

            case 'whitelist':
                await handleWhitelistCommand(interaction, member, voiceChannel);
                break;

            case 'limite':
                await setVoiceLimit(interaction, voiceChannel);
                break;

            default:
                throw CustomErrors.UnknownCommandError;
        }
    }
};

async function handleBanCommand(
    client: Client,
    interaction: ChatInputCommandInteraction,
    member: GuildMember,
    voiceChannel: VoiceBasedChannel
) {
    const target = interaction.options.getMember('membre') as GuildMember;

    if (target.user.id === client.user!.id) throw CustomErrors.BotBanError;

    if (isMembersInSameVoice(member, target)) {
        await target.voice.disconnect();
    }

    await voiceChannel.permissionOverwrites.edit(target.id, {
        ViewChannel: false,
        Connect: false
    });

    return interaction.reply({
        content: `${target} a été banni du salon.`,
        ephemeral: true
    });
}

async function handleUnbanCommand(
    interaction: ChatInputCommandInteraction,
    member: GuildMember,
    voiceChannel: VoiceBasedChannel
) {
    const target = interaction.options.getMember('membre') as GuildMember;
    const isBanned = voiceChannel.permissionOverwrites.cache
        .get(target.id)
        ?.deny.has(PermissionsBitField.Flags.Connect);

    if (isBanned) {
        await voiceChannel.permissionOverwrites.delete(target.id);

        return interaction.reply({
            content: `${target} a été débanni du salon.`,
            ephemeral: true
        });
    } else {
        return interaction.reply({
            content: `${target} n'est pas banni de ce salon. Aucune modification effectuée.`,
            ephemeral: true
        });
    }
}

async function handleWhitelistCommand(
    interaction: ChatInputCommandInteraction,
    member: GuildMember,
    voiceChannel: VoiceBasedChannel
) {
    const target = interaction.options.getMember('membre') as GuildMember;
    const isWhitelisted = voiceChannel.permissionOverwrites.cache
        .get(target.id)
        ?.allow.has([PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel]);

    if (!isWhitelisted) {
        await voiceChannel.permissionOverwrites.edit(target.id, {
            ViewChannel: true,
            Connect: true,
            Speak: true
        });

        return interaction.reply({
            content: `${target} a été whitelist.`,
            ephemeral: true
        });
    } else {
        return interaction.reply({
            content: `${target} est déjà whitelist. Aucune modification effectuée.`,
            ephemeral: true
        });
    }
}

const isMembersInSameVoice = (member: GuildMember, target: GuildMember) => {
    const memberVoiceChannel = member.voice.channel;
    const targetVoiceChannel = target.voice.channel;

    if (member.id === target.id) {
        throw CustomErrors.SelfBanError;
    }

    if (!memberVoiceChannel || !targetVoiceChannel) {
        return false;
    }

    if (memberVoiceChannel.id !== targetVoiceChannel.id) {
        return false;
    }

    const isAdmin = target.permissions.has(PermissionsBitField.Flags.Administrator);
    if (isAdmin) {
        throw CustomErrors.ToDoError;
    }

    return true;
};
