import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuInteraction,
    channelMention,
    quote,
    userMention
} from 'discord.js';
import { IQOtD } from '../../../qotd/models';
import { Modules } from '../../../../utils/consts';
import guildService from '../../../../services/guildService';

export const buildQotdHubEmbed = (d: IQOtD): EmbedBuilder => {
    return new EmbedBuilder()
        .setTitle(`${Modules.qotd.emoji} Configuration de ${Modules.qotd.label}`)
        .addFields([
            {
                name: '1️⃣ Salon QdJ',
                value: d.channelId ? channelMention(d.channelId) : 'Salon non défini',
                inline: true
            },
            {
                name: '2️⃣ Salon propositions',
                value: d.requestChannelId ? channelMention(d.requestChannelId) : 'Salon non défini',
                inline: true
            },
            { name: '\u200B', value: '\u200B' },
            {
                name: '3️⃣ Seuil de questions avant notification (0 = désactivé)',
                value: `${d.questionsThreshold} questions`,
                inline: true
            },
            { name: '\u200B', value: '\u200B' },
            {
                name: '4️⃣ Utilisateurs blacklistés',
                value: formatUserList(d.blacklistUsers),
                inline: true
            },
            {
                name: '5️⃣ Utilisateurs de confiance',
                value: formatUserList(d.trustedUsers),
                inline: true
            }
        ])
        .setFooter({
            text: d.enabled ? '✅ Module Activé' : '❌ Module Désactivé'
        });

    function formatUserList(users: string[]): string {
        if (users.length === 0) return '> Aucun utilisateur';
        const displayUsers = users
            .slice(0, 5)
            .map(id => quote(userMention(id)))
            .join('\n');
        if (users.length > 5) {
            return displayUsers + `\n> +${users.length - 5} autres`;
        }
        return displayUsers;
    }
};

export const qotdHubButtons = (primaryButtonIndex: number): ActionRowBuilder<ButtonBuilder> => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        createButton('qotdHubStep1Btn', '1️⃣', primaryButtonIndex === 1),
        createButton('qotdHubStep2Btn', '2️⃣', primaryButtonIndex === 2),
        createButton('qotdHubStep3Btn', '3️⃣', primaryButtonIndex === 3),
        createButton('qotdHubStep4Btn', '4️⃣', primaryButtonIndex === 4),
        createButton('qotdHubStep5Btn', '5️⃣', primaryButtonIndex === 5)
    );

    function createButton(customId: string, emoji: string, isPrimary: boolean): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId(customId)
            .setEmoji(emoji)
            .setStyle(isPrimary ? ButtonStyle.Primary : ButtonStyle.Secondary);
    }
};

export const qotdHubSaveBtn: ActionRowBuilder<ButtonBuilder> =
    new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('qotdHubSaveBtn')
            .setEmoji('✅')
            .setLabel('Sauvegarder')
            .setStyle(ButtonStyle.Success)
    );

export default {
    data: {
        name: `qotdHubSaveBtn`
    },
    async execute(interaction: StringSelectMenuInteraction) {
        const channelId = interaction.values[0];
        const guildData = await guildService.getOrCreateGuild(interaction.guildId!);
        const qotd = guildData.modules.qotd;
        const updatedGuild = await guildService.updateGuild({
            id: interaction.guildId!,
            modules: {
                ...guildData.modules,
                qotd: {
                    enabled: qotd.enabled,
                    channelId: channelId!,
                    requestChannelId: qotd.requestChannelId,
                    blacklistUsers: qotd.blacklistUsers,
                    trustedUsers: qotd.trustedUsers,
                    questionsThreshold: qotd.questionsThreshold
                }
            }
        });

        return interaction.update({
            content: `Nouveau salon ${channelMention(updatedGuild?.modules.qotd.channelId!)}`
        });
    }
};
