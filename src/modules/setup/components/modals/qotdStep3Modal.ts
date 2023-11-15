import {
    ActionRowBuilder,
    EmbedBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalMessageModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

export const qotdStep3Modal = new ModalBuilder()
    .setCustomId('qotdStep3Modal')
    .setTitle('3️⃣ Seuil de questions avant notification')
    .addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('questionsThresholdInput')
                .setLabel('Nombre de questions')
                .setPlaceholder('0 ou vide pour désactiver')
                .setMaxLength(5)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
        )
    );

export default {
    data: {
        name: `qotdStep3Modal`
    },
    async execute(interaction: ModalMessageModalSubmitInteraction) {
        const questionsThreshold = interaction.fields.getTextInputValue('questionsThresholdInput');
        let questionsThresholdNumber = 0;
        if (questionsThreshold !== '') {
            questionsThresholdNumber = parseInt(questionsThreshold);
            if (isNaN(questionsThresholdNumber)) {
                questionsThresholdNumber = 0;
            }
        }
        const oldEmbed = interaction.message!.embeds[0];
        let oldChannel = oldEmbed?.fields[3].value;

        if (oldChannel.includes(' => '))
            oldChannel = oldChannel.slice(0, oldChannel.indexOf(' => '));

        const newThreshold = oldChannel + ' => ' + questionsThresholdNumber + ' questions';

        const newEmbed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setColor(oldEmbed.color)
            .addFields(
                {
                    name: oldEmbed.fields[0].name,
                    value: oldEmbed.fields[0].value,
                    inline: true
                },
                {
                    name: oldEmbed.fields[1].name,
                    value: oldEmbed.fields[1].value,
                    inline: true
                },
                {
                    name: oldEmbed.fields[2].name,
                    value: oldEmbed.fields[2].value,
                    inline: true
                },
                {
                    name: oldEmbed.fields[3].name,
                    value: newThreshold,
                    inline: true
                },
                ...oldEmbed.fields.slice(4)
            )
            .setFooter({ text: oldEmbed.footer?.text! });

        return interaction.update({
            embeds: [newEmbed]
        });
    }
};
