import {
    APIEmbedField,
    EmbedBuilder,
    channelMention,
    quote,
    roleMention,
    userMention
} from 'discord.js';
import { Colors } from './consts';

export const Embed = {
    error: (title: string): EmbedBuilder =>
        new EmbedBuilder().setTitle(title).setColor(Colors.error),
    success: (title: string): EmbedBuilder =>
        new EmbedBuilder().setTitle(title).setColor(Colors.success),
    rc: (title: string): EmbedBuilder => new EmbedBuilder().setTitle(title).setColor(Colors.random)
};

export const formatFields = (
    fields: APIEmbedField[],
    customField: APIEmbedField,
    numFieldsBeforeCustom: number
) => {
    fields = fields.map(field => {
        return field;
    });

    return [
        ...fields.slice(0, numFieldsBeforeCustom).map((field: any) => ({
            name: field.name,
            value: field.value,
            inline: field.inline
        })),
        customField,
        ...fields.slice(numFieldsBeforeCustom + 1)
    ];
};
export const formatCustomList = (
    list: string[],
    type: 'role' | 'user' | 'channel',
    customListLength?: number
): string => {
    if (list.length === 0) {
        switch (type) {
            case 'role':
                return '> Aucun rôle';
            case 'user':
                return '> Aucun utilisateur';
            case 'channel':
                return '> Aucun salon';
            default:
                throw new Error('Invalid type');
        }
    }

    const mention = (id: string) => {
        switch (type) {
            case 'role':
                return roleMention(id);
            case 'user':
                return userMention(id);
            case 'channel':
                return channelMention(id);
            default:
                throw new Error('Invalid type');
        }
    };

    const displayListLength = customListLength ?? list.length; 
    const displayUsers = list
        .slice(0, displayListLength)
        .map(id => quote(mention(id)))
        .join('\n');

    if (list.length > displayListLength) {
        return displayUsers + `\n> +${list.length - displayListLength} autres`;
    }

    return displayUsers;
};
