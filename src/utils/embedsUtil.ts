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

/**
 * Formats a custom list of items based on the specified type.
 * @param list The list of items to format.
 * @param type The type of items in the list ('role', 'user', or 'channel').
 * @param customListLength The optional length of the custom list to display.
 * @returns The formatted custom list as a string.
 */
export const formatCustomList = (
    list: string[],
    type: 'role' | 'user' | 'channel',
    customListLength?: number
): string => {
    if (list.length === 0) {
        return `> Aucun ${type === 'user' ? 'utilisateur' : type === 'role' ? 'rôle' : 'salon'}`;
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

/**
 * Formats the fields of an embed by replacing or adding a custom field at a specified index.
 * @param fields - The array of existing fields.
 * @param customField - The custom field to replace or add.
 * @param replaceIndex - The index at which to replace the field. If greater than the length of the fields array, the custom field will be added at the end.
 * @returns The formatted array of fields.
 */
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
