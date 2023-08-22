import { Colors } from './consts';
import { EmbedBuilder } from 'discord.js';

export const Embed = {
    error: (title: string): EmbedBuilder =>
        new EmbedBuilder().setTitle(title).setColor(Colors.error),
    success: (title: string): EmbedBuilder =>
        new EmbedBuilder().setTitle(title).setColor(Colors.success)
};
