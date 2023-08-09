import { Colors } from './consts';
import { EmbedBuilder } from 'discord.js';

export const Embed = {
    error: (text: string): EmbedBuilder => new EmbedBuilder().setTitle(text).setColor(Colors.error),
    success: (text: string): EmbedBuilder =>
        new EmbedBuilder().setTitle(text).setColor(Colors.success)
};
