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
        }
    };

    const displayListLength = customListLength ?? list.length;
    const displayUsers = list
        .slice(0, displayListLength)
        .map(id => quote(mention(id)))
        .join('\n');

    if (list.length > displayListLength) {
        return displayUsers
            ? displayUsers + `\n> +${list.length - displayListLength} autres`
            : `> +${list.length - displayListLength} autres`;
    }

    return displayUsers;
};

export const formatFields = (
    fields: APIEmbedField[],
    customField: APIEmbedField,
    replaceIndex: number
) => {
    if (fields.length === 0) {
        return [customField];
    }

    if (replaceIndex >= fields.length) {
        return [...fields, customField];
    }

    return fields.map((field, index) => {
        if (index === replaceIndex) {
            return {
                name: customField.name,
                value: customField.value,
                inline: customField.inline
            };
        } else {
            return {
                name: field.name,
                value: field.value,
                inline: field.inline
            };
        }
    });
};
