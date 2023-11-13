import { APIEmbedField, EmbedBuilder } from 'discord.js';
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
        if (field.name === '' && field.value === '') {
            return { name: '\u200B', value: '\u200B' };
        }
        return field;
    });

    return [
        ...fields.slice(0, numFieldsBeforeCustom).map((field: any) => ({
            name: field.name,
            value: field.value,
            inline: true
        })),
        customField,
        ...fields.slice(numFieldsBeforeCustom + 1)
    ];
};
