import { APIEmbedField, channelMention, roleMention, userMention } from 'discord.js';
import { formatCustomList, formatFields } from '../../../src/utils/embedsUtil';

jest.mock('discord.js', () => ({
    roleMention: jest.fn((id: string) => `<@&${id}>`),
    userMention: jest.fn((id: string) => `<@${id}>`),
    channelMention: jest.fn((id: string) => `<#${id}>`),
    quote: jest.fn((text: string) => `> ${text}`)
}));

describe('formatCustomList', () => {
    it('should return correct message for an empty list', () => {
        const emptyRoleList: string[] = [];
        const emptyUserList: string[] = [];
        const emptyChannelList: string[] = [];
        const customListLength = 5;

        const resultRole = formatCustomList(emptyRoleList, 'role');
        const resultUser = formatCustomList(emptyUserList, 'user');
        const resultChannel = formatCustomList(emptyChannelList, 'channel', customListLength);

        expect(resultRole).toEqual('> Aucun rôle');
        expect(resultUser).toEqual('> Aucun utilisateur');
        expect(resultChannel).toEqual('> Aucun salon');
    });

    it('should mention roles correctly', () => {
        const roles: string[] = ['role1', 'role2', 'role3'];
        const expectedRoles = '> <@&role1>\n> <@&role2>\n> <@&role3>';

        const result = formatCustomList(roles, 'role');

        expect(result).toEqual(expectedRoles);
        expect(roleMention).toHaveBeenCalledWith(roles[0]);
        expect(roleMention).toHaveBeenCalledWith(roles[1]);
        expect(roleMention).toHaveBeenCalledWith(roles[2]);
    });

    it('should mention users correctly', () => {
        const users: string[] = ['user1', 'user2', 'user3', 'user4', 'user5'];
        const expectedUsers = '> <@user1>\n> <@user2>\n> <@user3>\n> <@user4>\n> <@user5>';

        const result = formatCustomList(users, 'user');

        expect(result).toEqual(expectedUsers);
        expect(userMention).toHaveBeenCalledWith(users[0]);
        expect(userMention).toHaveBeenCalledWith(users[1]);
        expect(userMention).toHaveBeenCalledWith(users[2]);
        expect(userMention).toHaveBeenCalledWith(users[3]);
        expect(userMention).toHaveBeenCalledWith(users[4]);
    });

    it('should mention channels correctly', () => {
        const channels: string[] = ['channel1', 'channel2'];
        const expectedChannels = '> <#channel1>\n> <#channel2>';

        const result = formatCustomList(channels, 'channel');

        expect(result).toEqual(expectedChannels);
        expect(channelMention).toHaveBeenCalledWith(channels[0]);
        expect(channelMention).toHaveBeenCalledWith(channels[1]);
    });

    it('should mention custom list length correctly', () => {
        const users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'];
        const expectedUsers =
            '> <@user1>\n> <@user2>\n> <@user3>\n> <@user4>\n> <@user5>\n> +3 autres';

        const result = formatCustomList(users, 'user', 5);

        expect(result).toEqual(expectedUsers);
        expect(userMention).toHaveBeenCalledWith(users[0]);
        expect(userMention).toHaveBeenCalledWith(users[1]);
        expect(userMention).toHaveBeenCalledWith(users[2]);
        expect(userMention).toHaveBeenCalledWith(users[3]);
        expect(userMention).toHaveBeenCalledWith(users[4]);
        expect(userMention).not.toHaveBeenCalledWith(users[5]);
        expect(userMention).not.toHaveBeenCalledWith(users[6]);
        expect(userMention).not.toHaveBeenCalledWith(users[7]);
    });

    it('should handle custom list length of 0 correctly', () => {
        const users = ['user1', 'user2', 'user3'];
        const expectedUsers = '> +3 autres';

        const result = formatCustomList(users, 'user', 0);

        expect(result).toEqual(expectedUsers);
        expect(userMention).not.toHaveBeenCalled();
    });
});

describe('formatFields', () => {
    it('should correctly format fields with custom field', () => {
        const fields: APIEmbedField[] = [
            { name: 'Field 1', value: 'Value 1', inline: true },
            { name: 'Field 2', value: 'Value 2', inline: false },
            { name: 'Field 3', value: 'Value 3', inline: true }
        ];
        const customField: APIEmbedField = {
            name: 'Custom Field',
            value: 'Custom Value',
            inline: true
        };
        const numFieldsBeforeCustom = 2;
        const expectedResult = [
            { name: 'Field 1', value: 'Value 1', inline: true },
            { name: 'Field 2', value: 'Value 2', inline: false },
            { name: 'Custom Field', value: 'Custom Value', inline: true }
        ];

        const result = formatFields(fields, customField, numFieldsBeforeCustom);

        expect(result).toHaveLength(expectedResult.length);
        expect(result[numFieldsBeforeCustom]).toEqual(customField);
        expect(result).toEqual(expectedResult);
    });

    it('should handle empty fields correctly', () => {
        const fields: APIEmbedField[] = [];
        const customField: APIEmbedField = {
            name: 'Custom Field',
            value: 'Custom Value',
            inline: true
        };
        const numFieldsBeforeCustom = 0;
        const expectedResult = [{ name: 'Custom Field', value: 'Custom Value', inline: true }];

        const result = formatFields(fields, customField, numFieldsBeforeCustom);

        expect(result).toHaveLength(expectedResult.length);
        expect(result).toEqual(expectedResult);
    });

    it('should handle custom field with value higher than nbFields correctly', () => {
        const fields: APIEmbedField[] = [
            { name: 'Field 1', value: 'Value 1', inline: true },
            { name: 'Field 2', value: 'Value 2', inline: false },
            { name: 'Field 3', value: 'Value 3', inline: true }
        ];
        const customField: APIEmbedField = {
            name: 'Custom Field',
            value: 'Custom Value',
            inline: true
        };
        const numFieldsBeforeCustom = 5;
        const expectedResult = [
            { name: 'Field 1', value: 'Value 1', inline: true },
            { name: 'Field 2', value: 'Value 2', inline: false },
            { name: 'Field 3', value: 'Value 3', inline: true },
            { name: 'Custom Field', value: 'Custom Value', inline: true }
        ];

        const result = formatFields(fields, customField, numFieldsBeforeCustom);

        expect(result).toHaveLength(expectedResult.length);
        expect(result).toEqual(expectedResult);
    });
});
