import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    channelMention
} from 'discord.js';
import { IGuild } from '../../../../models';
import { IQOtD } from '../../../qotd/models';
import { Modules } from '../../../../utils/consts';
import { formatCustomList } from '../../../../utils/embedsUtil';
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
                value: formatCustomList(d.blacklistUsers, 'user', 5),
                inline: true
            },
            {
                name: '5️⃣ Utilisateurs de confiance',
                value: formatCustomList(d.trustedUsers, 'user', 5),
                inline: true
            }
        ])
        .setFooter({
            text: d.enabled ? '✅ Module Activé' : '❌ Module Désactivé'
        });
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
            .setStyle(isPrimary ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setDisabled(isPrimary);
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
    async execute(interaction: ButtonInteraction) {
        const embed = interaction.message.embeds[0];

        const cField = embed.fields[0].value;
        const channel = cField.includes('=>')
            ? cField.slice(cField.lastIndexOf('<#') + 2, cField.lastIndexOf('>'))
            : undefined;

        const cRField = embed.fields[1].value;
        const requestChannel = cRField.includes('=>')
            ? cRField.slice(cRField.lastIndexOf('<#') + 2, cRField.lastIndexOf('>'))
            : undefined;

        const updatedGuild = await guildService.updateGuild(interaction.guildId!, {
            'modules.qotd.channelId': channel,
            'modules.qotd.requestChannelId': requestChannel
        } as Partial<IGuild>);

        return interaction.update({
            content: `Nouveau salon ${channelMention(updatedGuild?.modules.qotd.channelId!)}`,
            embeds: [buildQotdHubEmbed(updatedGuild!.modules.qotd)]
        });
    }
};
