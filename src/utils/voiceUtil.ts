import {
    ActionRowBuilder,
    BaseGuildVoiceChannel,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    GuildMember,
    PermissionsBitField,
    VoiceState,
    userMention
} from 'discord.js';
import { CustomErrors } from './errors';
import Logger from './logger';
import { client } from '..';
import path from 'path';

const filePath = path.join(__dirname, __filename);

export const createNewTempChannel = async (newState: VoiceState) => {
    try {
        const username = newState.member!.user.username;
        await newState.guild.channels
            .create({
                name: `🔊Voc ${username}`,
                type: ChannelType.GuildVoice,
                topic: newState.member!.user.id,
                permissionOverwrites: [
                    {
                        id: newState.member!.user.id,
                        allow: [
                            PermissionsBitField.Flags.MoveMembers,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Connect,
                            PermissionsBitField.Flags.Speak,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    },
                    {
                        id: client.user.id,
                        allow: [
                            PermissionsBitField.Flags.MoveMembers,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Connect,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    }
                ]
            })
            .then(channel => {
                channel.setParent(newState.channel!.parentId, {
                    lockPermissions: false
                });
                newState.member!.voice.setChannel(channel.id);
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId('voicePrivacyBtn')
                        .setLabel('Vérouiller')
                        .setEmoji('🔒')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('voiceOwnerTransferBtn')
                        .setLabel('Transférer la propriété')
                        .setEmoji('🤝')
                        .setStyle(ButtonStyle.Danger)
                );
                channel.send({
                    content: `Hey ${userMention(newState.member!.id)} !
          \nTu peux gérer ton salon vocal depuis ici ! Il te suffit de faire : \`/voice\` pour avoir toutes les options 
          \n(bonus: Tu peux déco quelqu'un avec un clic droit sur leur nom)`,
                    components: [row]
                });
            });
    } catch (err: any) {
        Logger.error(`An error occurred while creating a voice channel`, err, filePath);
        throw CustomErrors.CreateNewTempChannelError;
    }
};

export const switchVoicePrivacy = async (member: GuildMember) => {
    try {
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return;

        const isPublic: boolean = await checkVoicePrivacy(voiceChannel);

        await voiceChannel.permissionOverwrites.edit(member.guild.roles.everyone, {
            ViewChannel: isPublic ? false : null,
            Connect: isPublic ? false : null
        });
    } catch (err: any) {
        Logger.error(
            `An error occurred while changing the privacy of a voice channel`,
            err,
            filePath
        );
        throw CustomErrors.SwitchVoicePrivacyError;
    }
};

export const switchVoiceOwner = async (user: GuildMember, target: GuildMember) => {
    try {
        const voiceChannel = target.voice.channel;
        if (!voiceChannel) return;

        const isUserOwner = voiceChannel.name === '🔊Voc ' + user.user.username;
        if (!isUserOwner) return;

        await voiceChannel.setName(`🔊Voc ${target.user.username}`);

        await voiceChannel.permissionOverwrites.delete(user.id);
        await voiceChannel.permissionOverwrites.edit(target.id, {
            MoveMembers: true,
            ViewChannel: true,
            Connect: true
        });
    } catch (err: any) {
        Logger.error(
            `An error occurred while changing the owner of a voice channel`,
            err,
            filePath
        );
        throw CustomErrors.SwitchVoiceOwnerError;
    }
};

export const checkVoicePrivacy = async (voiceC: BaseGuildVoiceChannel) => {
    const permissions = voiceC.permissionsFor(voiceC.guild.roles.everyone);
    if (!permissions) return false;

    return permissions.has([
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.ViewChannel
    ]);
};

export const checkVoiceOwnership = async (voiceC: BaseGuildVoiceChannel, member: GuildMember) => {
    return voiceC.permissionsFor(member)?.has(PermissionsBitField.Flags.MoveMembers);
};

export const deleteEmptyChannel = async (voiceC: BaseGuildVoiceChannel) => {
    try {
        if (voiceC.members.size > 0) return;
        await voiceC.delete();
    } catch (err: any) {
        Logger.error(`An error occurred while deleting a voice channel`, err, filePath);
    }
};
