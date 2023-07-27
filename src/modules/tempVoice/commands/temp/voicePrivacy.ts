import {
    ApplicationCommandOptionType,
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    CommandInteraction,
    GuildChannel,
    GuildMember,
    PermissionsBitField
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from '../../../../models';
import { checkTemporaryVoiceModule } from '../../../../utils/botUtil';

module.exports = {
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
                name: 'limite',
                description: 'Limiter le nombre de membres dans ton salon',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'limite',
                        description: '1 à 99, 0 retire la limite',
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            }
        ]
    },
    category: 'voice',
    cooldown: 30,
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'voice [commande] [member] ou [option]',
    examples: 'voice ban @adan_ea#3945',

    async execute(client: Client, interaction: CommandInteraction, guildSettings: IGuild) {
        if (!checkTemporaryVoiceModule(guildSettings)) throw CustomErrors.ModuleDisabledError;

        const member = interaction.member as GuildMember;

        const memberVoiceChannel = member.voice.channel;

        if (!memberVoiceChannel) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        const voiceChannel = await interaction.guild!.channels.fetch(memberVoiceChannel.id);

        const subcommand = (interaction as ChatInputCommandInteraction).options.getSubcommand();

        switch (subcommand) {
            case 'ban': {
                const target = interaction.options.getMember('membre') as GuildMember;

                if (isMembersInSameVoice(member, target)) {
                    await target.voice.disconnect();
                }

                await (voiceChannel as GuildChannel).permissionOverwrites.edit(target.id, {
                    ViewChannel: false,
                    Connect: false
                });

                return interaction.reply({
                    content: `${target} a été banni du salon.`,
                    ephemeral: true
                });
            }

            case 'unban': {
                const target = interaction.options.getMember('membre') as GuildMember;
                await (voiceChannel as GuildChannel).permissionOverwrites.edit(target.id, {
                    ViewChannel: null,
                    Connect: null
                });

                return interaction.reply({
                    content: `${target} a été débanni du salon.`,
                    ephemeral: true
                });
            }

            case 'limite': {
                const userLimit = (interaction as ChatInputCommandInteraction).options.getNumber(
                    'limite',
                    true
                );

                if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
                    await voiceChannel.setUserLimit(userLimit);
                    if (userLimit > 0) {
                        return interaction.reply({
                            content: `Le nombre de place dans le salon est maintenant limité à ${userLimit}.`,
                            ephemeral: true
                        });
                    } else {
                        return interaction.reply({
                            content: `La limite d'utilisateurs a été supprimée.`,
                            ephemeral: true
                        });
                    }
                }

                break;
            }

            default: {
                throw CustomErrors.UnknownCommandError;
            }
        }
    }
};

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
