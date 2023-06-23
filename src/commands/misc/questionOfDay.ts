import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  GuildMember,
  MessageType,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";
import { Colors } from "../../utils/consts";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qdj")
    .setDescription("Envoie la question du jour et l'épingle")
    .addStringOption(option =>
      option.setName("question").setDescription("question du jour").setRequired(true)
    )
    .addUserOption(option =>
      option.setName("auteur").setDescription("Auteur de la question").setRequired(false)
    ),
  category: "misc",
  permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
  usage: "qdj [question] <auteur>",
  examples: ["qdj Pâtes ou riz ?", "qdj pain au chocolat ou croissant ? @Adan_ea#3000"],

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("question");
    const author = interaction.options.getUser("auteur");
    const user = (interaction.member as GuildMember).user;

    const questionEmbed = new EmbedBuilder()
      .setTitle(question)
      .setColor(Colors.random)
      .setFooter({ text: "Question du jour" })
      .setTimestamp();

    if (author) {
      questionEmbed.setAuthor({
        name: `${author.username}`,
        iconURL: author.displayAvatarURL()
      });
    } else {
      questionEmbed.setAuthor({
        name: `${user.username}`,
        iconURL: user.displayAvatarURL()
      });
    }

    await interaction.reply({
      content: "Question du jour envoyée !",
      ephemeral: true
    });

    const pinnedMessages = await interaction.channel!.messages.fetchPinned();
    pinnedMessages.forEach(async msg => {
      if (msg.author.bot === true) {
        await msg.unpin();
      }
    });

    const sentMessage = await interaction.channel!.send({
      embeds: [questionEmbed]
    });
    await sentMessage.pin();

    const pinMessages = await interaction.channel!.messages.fetch({ limit: 5 });
    pinMessages.forEach(async msg => {
      if (msg.type === MessageType.ChannelPinnedMessage && msg.id !== sentMessage.id) {
        await msg.delete();
      }
    });
  }
};
