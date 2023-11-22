import {
    BaseGuildVoiceChannel,
    ChannelType,
    ChatInputCommandInteraction,
    Guild,
    GuildMember,
    ModalMessageModalSubmitInteraction,
    OverwriteResolvable,
    PermissionsBitField,
    VoiceBasedChannel,
    VoiceState,
    userMention
} from 'discord.js';
import { CustomError, CustomErrors } from './errors';
import { Embed } from './embedsUtil';
import { ITemporaryVoice } from '../models';
import Logger from './logger';
import { client } from '..';
import { handleCooldown } from '../modules/core/events/client/interactionCreate';
import path from 'path';
import { tempVoiceComponents } from '../modules/tempVoice/components/buttons';

const filePath = path.join(__dirname, __filename);

/**
 * Creates a new temporary voice channel.
 * 
 * @param newState - The new state of the voice channel.
 * @param tempVoice - The temporary voice settings.
 * @returns A Promise that resolves when the new channel is created.
 * @throws {CustomError} If an error occurs while creating the channel.
 */
export const createNewTempChannel = async (newState: VoiceState, tempVoice: ITemporaryVoice) => {
    try {
        handleCooldown(newState.member!.user.id, 'voiceCreate', 60 * 1000);
        const member = newState.member as GuildMember;
        const username = member.user.username;
        const { userSettings, nameModel } = tempVoice;
        const isPublic = userSettings[member.id]?.isPublic ?? true;
        const permOverwrite = setPerms(userSettings, member.id, newState.guild, isPublic);

        await newState.guild.channels
            .create({
                name: nameModel[isPublic ? 'unlocked' : 'locked'].replace('{USERNAME}', username),
                type: ChannelType.GuildVoice,
                topic: member.user.id,
                permissionOverwrites: permOverwrite
            })
            .then(channel => {
                channel.setParent(newState.channel!.parentId, {
                    lockPermissions: false
                });

                member.voice.setChannel(channel.id);

                client.tempVoice.set(channel.id, {
                    ownerId: member.user.id,
                    isPublic
                });

                channel.send({
                    content: `Hey ${userMention(member.id)} !
          \nTu peux gérer ton salon vocal depuis ici ! Il te suffit de faire : \`/voice\` pour avoir toutes les options 
          \n(bonus: Tu peux déco quelqu'un avec un clic droit sur leur nom)`,
                    components: tempVoiceComponents
                });
            });
    } catch (err: any) {
        if (err instanceof CustomError) {
            const embed = Embed.error(err.message);
            newState.member?.voice.disconnect();
            newState.member?.send({ embeds: [embed] });
        } else {
            Logger.error(`An error occurred while creating a voice channel`, err, filePath);
            throw CustomErrors.CreateNewTempChannelError;
        }
    }
};


/**
 * Switches the voice privacy of a member in a voice channel.
 * @param member The guild member whose voice privacy is being switched.
 * @param nameModel The name model used to generate the new voice channel name.
 * @throws {CustomErrors.SwitchVoicePrivacyError} If an error occurs while changing the privacy of the voice channel.
 */
export const switchVoicePrivacy = async (
    member: GuildMember,
    nameModel: ITemporaryVoice['nameModel']
) => {
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return;

    try {
        const isPublic = checkVoicePrivacy(voiceChannel.id);
        const permissions = {
            ViewChannel: isPublic ? false : null,
            Connect: isPublic ? false : null,
            Speak: isPublic ? false : null,
            ReadMessageHistory: isPublic ? false : null
        };

        await voiceChannel.permissionOverwrites.edit(member.guild.roles.everyone, permissions);

        const name = nameModel[isPublic ? 'locked' : 'unlocked'].replace(
            '{USERNAME}',
            member.user.username
        );
        await voiceChannel.setName(name);
        client.tempVoice.set(voiceChannel.id, {
            ownerId: member.id,
            isPublic: !isPublic
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

/**
 * Switches the owner of a voice channel to the specified user.
 * 
 * @param user - The user who wants to switch the owner of the voice channel.
 * @param target - The user to whom the ownership of the voice channel will be switched.
 * @param tempVoice - The temporary voice channel settings.
 * @throws {CustomErrors.SwitchVoiceOwnerError} If an error occurs while changing the owner of the voice channel.
 */
export const switchVoiceOwner = async (
    user: GuildMember,
    target: GuildMember,
    tempVoice: ITemporaryVoice
) => {
    try {
        const voiceChannel = target.voice.channel;
        if (!voiceChannel) return;

        const ownerId = client.tempVoice.get(voiceChannel.id)?.ownerId;
        if (ownerId !== user.id) return;

        const isPublic = checkVoicePrivacy(voiceChannel.id);
        const permOverwrite = setPerms(tempVoice.userSettings, target.id, target.guild, isPublic);

        const name = tempVoice.nameModel[isPublic ? 'unlocked' : 'locked'].replace(
            '{USERNAME}',
            target.user.username
        );
        await voiceChannel.setName(name);
        await voiceChannel.permissionOverwrites.set(permOverwrite);
        client.tempVoice.set(voiceChannel.id, {
            ownerId: target.id,
            isPublic
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

/**
 * Checks the privacy status of a voice channel.
 * @param voiceId - The ID of the voice to check.
 * @returns A boolean indicating whether the voice is public or not.
 */
export const checkVoicePrivacy = (voiceId: string): boolean => {
    return client.tempVoice.get(voiceId)?.isPublic;
};

/**
 * Checks if a member is the owner of a voice channel.
 * @param voiceId - The ID of the voice channel.
 * @param memberId - The ID of the member.
 * @returns A boolean indicating whether the member is the owner of the voice channel.
 */
export const checkVoiceOwnership = async (voiceId: string, memberId: string) => {
    return client.tempVoice.get(voiceId)?.ownerId === memberId;
};

/**
 * Deletes a voice channel if it is empty.
 * @param voiceC - The voice channel to delete.
 */
export const deleteEmptyChannel = async (voiceC: BaseGuildVoiceChannel) => {
    try {
        if (voiceC.members.size > 0) return;
        client.tempVoice.delete(voiceC.id);
        await voiceC.delete();
    } catch (err: any) {
        Logger.error(`An error occurred while deleting a voice channel`, err, filePath);
    }
};


/**
 * Sets the user limit for a voice channel.
 * 
 * @param interaction - The interaction object representing the command or modal submit interaction.
 * @param voiceChannel - The voice channel to set the user limit for.
 * @returns A Promise that resolves when the user limit is set.
 */
export async function setVoiceLimit(
    interaction: ChatInputCommandInteraction | ModalMessageModalSubmitInteraction,
    voiceChannel: VoiceBasedChannel
) {
    let userLimit;

    if (interaction instanceof ChatInputCommandInteraction) {
        userLimit = interaction.options.getNumber('limite', true);
    } else {
        userLimit = parseInt(interaction.fields.getTextInputValue('LimitThresholdInput'));
    }
    if (isNaN(userLimit)) userLimit = 0;

    if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
        await voiceChannel.setUserLimit(userLimit);
        if (userLimit > 0) {
            return interaction.reply({
                content: `Le nombre de places dans le salon est maintenant limité à ${userLimit}.`,
                ephemeral: true
            });
        } else {
            return interaction.reply({
                content: `La limite d'utilisateurs a été supprimée.`,
                ephemeral: true
            });
        }
    }
}

const permissions = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.ReadMessageHistory
];

const setPerms = (
    userSettings: ITemporaryVoice['userSettings'],
    userId: string,
    guild: Guild,
    isPublic = true
) => {
    const trustedUsers = userSettings[userId]?.trustedUsers || [];
    const blockedUsers = userSettings[userId]?.blockedUsers || [];

    const permissionsOverwrites: OverwriteResolvable[] = [
        {
            id: userId,
            allow: permissions.concat([PermissionsBitField.Flags.MoveMembers])
        },
        {
            id: client.user.id,
            allow: permissions.concat([PermissionsBitField.Flags.MoveMembers])
        }
    ];

    trustedUsers.forEach(user => {
        if (guild.members.cache.has(user))
            permissionsOverwrites.push({
                id: user,
                allow: permissions
            });
    });

    blockedUsers.forEach(user => {
        if (guild.members.cache.has(user))
            permissionsOverwrites.push({
                id: user,
                deny: permissions
            });
    });

    if (isPublic) {
        permissionsOverwrites.push({
            id: guild.roles.everyone,
            allow: permissions
        });
    } else {
        permissionsOverwrites.push({
            id: guild.roles.everyone,
            deny: permissions
        });
    }

    return permissionsOverwrites;
};
