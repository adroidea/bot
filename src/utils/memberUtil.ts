import { GuildMember, PermissionFlagsBits, PermissionsBitField, Role } from 'discord.js';
import { checkBotPermission } from './botUtil';

export const addRole = (member: GuildMember, memberRole: Role | undefined) => {
    if (checkBotPermission(member.guild, [PermissionFlagsBits.ManageRoles])) {
        const hasRole = checkMemberRole(member, memberRole);

        if (!hasRole && memberRole) {
            member.roles.add(memberRole).catch(console.error);
        }
    }
};

export const removeRole = (member: GuildMember, memberRole: Role) => {
    if (checkBotPermission(member.guild, [PermissionFlagsBits.ManageRoles])) {
        const hasRole = checkMemberRole(member, memberRole);

        if (hasRole) {
            member.roles.remove(memberRole).catch(console.error);
        }
    }
};

const checkMemberRole = (member: GuildMember, role: Role | undefined) => {
    return member && role && member.roles.cache.some(memberRoles => memberRoles.id === role.id);
};

export const checkMemberPermission = (
    memberPermissions: PermissionsBitField,
    permissionFlag: PermissionsBitField[]
) => {
    return memberPermissions.has(permissionFlag);
};
