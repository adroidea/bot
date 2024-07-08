import { GuildMember, PermissionFlagsBits, PermissionsBitField, Role } from 'discord.js';
import { hasBotPermission } from './bot.util';

/**
 * Adds a role to a guild member if the bot has the necessary permissions.
 * @param member - The guild member to add the role to.
 * @param memberRole - The role to be added to the guild member.
 */
export const addRole = (member: GuildMember, memberRole: Role | undefined) => {
    if (hasBotPermission(member.guild, [PermissionFlagsBits.ManageRoles])) {
        const hasRole = hasMemberRole(member, memberRole);

        if (!hasRole && memberRole) {
            member.roles.add(memberRole).catch(console.error);
        }
    }
};

/**
 * Removes a role from a guild member if the bot has the necessary permissions.
 * @param member The guild member to remove the role from.
 * @param memberRole The role to be removed.
 */
export const removeRole = (member: GuildMember, memberRole: Role) => {
    if (hasBotPermission(member.guild, [PermissionFlagsBits.ManageRoles])) {
        const hasRole = hasMemberRole(member, memberRole);

        if (hasRole) {
            member.roles.remove(memberRole).catch(console.error);
        }
    }
};

/**
 * Checks if a member has a specific role.
 * @param member - The guild member to check.
 * @param targetRole - The role to check against.
 * @returns True if the member has the role, false otherwise.
 */
const hasMemberRole = (member: GuildMember, targetRole: Role | undefined) => {
    return (
        member &&
        targetRole &&
        member.roles.cache.some(memberRoles => memberRoles.id === targetRole.id)
    );
};

/**
 * Checks if a member has a specific permission.
 * @param memberPermissions - The permissions of the member.
 * @param targetPermission - The permission flag to check.
 * @returns True if the member has the permission, false otherwise.
 */
export const hasMemberPermission = (
    memberPermissions: PermissionsBitField,
    targetPermission: PermissionsBitField[]
) => {
    return memberPermissions.has(targetPermission);
};
