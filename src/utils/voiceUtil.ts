import {
    BaseGuildVoiceChannel,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Guild,
    GuildMember,
    ModalMessageModalSubmitInteraction,
    OverwriteResolvable,
    PermissionsBitField,
    VoiceBasedChannel,
    VoiceState
} from 'discord.js';
import { CustomError, CustomErrors } from './errors';
import { Colors } from './consts';
import { Embed } from './embedsUtil';
import { ITempVoiceModule } from 'adroi.d.ea';
import Logger from './logger';
import { client } from '..';
import { handleCooldown } from '../modules/core/events/client/interactionCreate';
import path from 'path';
import { tempVoiceComponents } from '../modules/tempVoice/components/buttons';

const filePath = path.join(__dirname, __filename);

/**
 * Creates a new temporary voice channel.
 * @param newState - The new state of the voice channel.
 * @param tempVoice - The temporary voice settings.
 * @returns A Promise that resolves when the new channel is created.
 * @throws {CustomError} If an error occurs while creating the channel.
 */
export const createNewTempChannel = async (newState: VoiceState, tempVoice: ITempVoiceModule) => {
    try {
        handleCooldown(newState.member!.user.id, 'voiceCreate', 60 * 1000);
        const member = newState.member as GuildMember;
        const username = member.user.username;
        const { userSettings, nameModel } = tempVoice;
        const isPrivate = userSettings[member.id]?.isPrivate ?? false;
        const permOverwrite = setPerms(userSettings, member.id, newState.guild, isPrivate);

        const vc = await newState.guild.channels
            .create({
                name: nameModel[isPrivate ? 'locked' : 'unlocked'].replace('{USERNAME}', username),
                type: ChannelType.GuildVoice,
                topic: member.user.id,
                permissionOverwrites: permOverwrite,
                parent: newState.channel!.parentId
            })
            .then(channel => {
                client.tempVoice.set(channel.id, {
                    ownerId: member.user.id,
                    isPrivate
                });
                channel.send(buildVoiceEmbed(member.user.id));
                return channel;
            });

        await member.voice.setChannel(vc.id).catch(err => {
            if (err.message === 'Target user is not connected to voice.') {
                vc.delete();
            }
        });
    } catch (err: any) {
        if (err instanceof CustomError) {
            const embed = Embed.error(err.message);
            newState.member?.voice.disconnect();
            newState.member?.send({ embeds: [embed] });
        } else {
            Logger.error(`An error occurred while creating a voice channel`, err, filePath);
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
    nameModel: ITempVoiceModule['nameModel']
) => {
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return;

    try {
        const isPrivate = isVoicePrivate(voiceChannel.id);
        const permissions = {
            ViewChannel: isPrivate ? null : false,
            Connect: isPrivate ? null : false,
            Speak: isPrivate ? null : false,
            ReadMessageHistory: isPrivate ? null : false
        };

        await voiceChannel.permissionOverwrites.edit(member.guild.roles.everyone, permissions);

        const name = nameModel[isPrivate ? 'unlocked' : 'locked'].replace(
            '{USERNAME}',
            member.user.username
        );
        await voiceChannel.setName(name);
        client.tempVoice.set(voiceChannel.id, {
            ownerId: member.id,
            isPrivate: !isPrivate
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
 * @param user - The user who wants to switch the owner of the voice channel.
 * @param target - The user to whom the ownership of the voice channel will be switched.
 * @param tempVoice - The temporary voice channel settings.
 * @throws {CustomErrors.SwitchVoiceOwnerError} If an error occurs while changing the owner of the voice channel.
 */
export const switchVoiceOwner = async (
    user: GuildMember,
    target: GuildMember,
    tempVoice: ITempVoiceModule
) => {
    try {
        const voiceChannel = target.voice.channel;
        if (!voiceChannel) return;

        const ownerId = client.tempVoice.get(voiceChannel.id)?.ownerId;
        if (ownerId !== user.id) return;

        const isPrivate = isVoicePrivate(voiceChannel.id);
        const permOverwrite = setPerms(tempVoice.userSettings, target.id, target.guild, isPrivate);

        const name = tempVoice.nameModel[isPrivate ? 'locked' : 'unlocked'].replace(
            '{USERNAME}',
            target.user.username
        );
        await voiceChannel.setName(name);
        await voiceChannel.permissionOverwrites.set(permOverwrite);
        client.tempVoice.set(voiceChannel.id, {
            ownerId: target.id,
            isPrivate
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
export const isVoicePrivate = (voiceId: string): boolean => {
    return client.tempVoice.get(voiceId)?.isPrivate;
};

/**
 * Checks if a member is the owner of a voice channel.
 * @param voiceId - The ID of the voice channel.
 * @param memberId - The ID of the member.
 * @returns A boolean indicating whether the member is the owner of the voice channel.
 */
export const isMemberVoiceOwner = (memberId: string, voiceId: string) => {
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
 * Builds a voice embed object with a welcome message and options for managing a temporary voice channel.
 * @param memberId - The ID of the member for whom the embed is being built.
 * @returns The voice embed object containing the welcome message, embed, and components.
 */
export const buildVoiceEmbed = (memberId: string) => {
    const embed = new EmbedBuilder()
        .setTitle(`**Tableau de bord**`)
        .setDescription(
            `Bienvenue dans ton salon vocal temporaire ! Tu peux tout gérer depuis ici.
- 📶 Limite d'utilisateurs 
- 👑 Transfert de propriété
- 🔐 Visibilité
- 🌍 Région
- 🚮 Supprimer

- 📗 Whitelist
- <:tempWL:1177705708628746250> Whitelist Temporairement
- <:untrust:1177755536679251978> Retirer de la Whitelist
- 📕 Blacklist
- 📤 Retirer de la Blacklist`
        )
        .setColor(Colors.random)
        .setFooter({ text: "bonus: Tu peux déco quelqu'un avec un clic droit sur leur nom" });

    return {
        embeds: [embed],
        components: tempVoiceComponents
    };
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

/**
 * Sets the permissions for a user in a voice channel.
 *
 * @param userSettings - The user settings object.
 * @param userId - The ID of the user.
 * @param guild - The guild object.
 * @param isPrivate - Indicates whether the voice channel is public or not. Default is true.
 * @returns An array of permission overwrites for the voice channel.
 */
const setPerms = (
    userSettings: ITempVoiceModule['userSettings'],
    userId: string,
    guild: Guild,
    isPrivate = false
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

    if (!isPrivate) {
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
