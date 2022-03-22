const {MessageEmbed} = require('discord.js');
const {readdirSync} = require('fs');
const cmdFolder = readdirSync('./commands');
const prefix = '!';
const contextDescription = {
    userInfo: 'Shows informations about a user'
};

module.exports = {
    name: 'helpea',
    description: 'Create a help command with everything to know about this bot',
    category: 'utils',
    usage: 'help',
    exemples: ['help', 'help'],
    run(client, message, args) {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        if (!args.length) {
            const noArgsEmbed = new MessageEmbed()
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setThumbnail('https://cdn.discordapp.com/attachments/763373898779197481/887604870578843668/Zw.png')
                .setTitle(`❄ Here is a list of all the commands available !`)
                .setDescription('----------------------')
                .setColor(randomColor);
            for (const category of cmdFolder) {
                noArgsEmbed.addField(`❄ ${category.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} :`,
                    ` \`\`${client.commands.filter(cmd => cmd.category === category.toLowerCase()).map(cmd => cmd.name).join(' | ')}\`\``);
            }
            noArgsEmbed.addField('----------------------', `**\`${prefix}help <command>\` For more informations.**`)
                .setFooter({
                    text: `( ) = alias | < > = optionnel | [ ] = requis | (Il ne faut pas les inclure dans vos commandes)`
                });


            return message.reply({embeds: [noArgsEmbed]});

        }

        const cmd = client.commands.get(args[0]);
        if (!cmd) return message.reply('This command does not exist or you typed it wrong, please try again.');

        return message.channel.send(`
\`\`\`makefile
[Help: Command: -> ${cmd.name}]

${cmd.description ? cmd.description : contextDescription[`${cmd.name}`]}

How to : ${prefix}${cmd.usage}
Exemples : ${prefix}${cmd.exemples.join(` | ${prefix}`)}

------------
( ) = alias | < > = optional | [ ] = required | (Don't include them in your commands)
\`\`\`
        `);


    },
    options: [{
        name: 'command',
        description: 'The command you need help with',
        type: 'STRING',
        required: false
    }],
    async runInteraction(client, interaction) {
        const cmdName = interaction.options.getString('command');
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        if (!cmdName) {
            const noArgsEmbed = new MessageEmbed()
                .setAuthor({
                    name: `${interaction.member.user.username}`,
                    iconURL: interaction.member.user.displayAvatarURL()
                })
                .setThumbnail('https://cdn.discordapp.com/attachments/763373898779197481/887604870578843668/Zw.png')
                .setTitle(`❄ Here is a list of all the commands available !`)
                .setDescription('----------------------')
                .setColor(randomColor);
            for (const category of cmdFolder) {
                noArgsEmbed.addField(`❄ ${category.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} :`,
                    ` \`\`${client.commands.filter(cmd => cmd.category === category.toLowerCase()).map(cmd => cmd.name).join(' | ')}\`\``);
            }
            noArgsEmbed.addField('----------------------', `**\`${prefix}help <commande>\` For more informations.**`)
                .setFooter({
                    text: `( ) = alias | < > = optionnel | [ ] = requis | (Il ne faut pas les inclure dans vos commandes)`
                });
            return interaction.reply({embeds: [noArgsEmbed], ephemeral: true});
        }
        const cmd = client.commands.get(cmdName);
        if (!cmd) return interaction.reply({
            content: 'This command does not exist or you typed it wrong, please try again.',
            ephemeral: true
        });
        return interaction.reply({content: `
\`\`\`makefile
[Help: Command: -> ${cmd.name}]

${cmd.description ? cmd.description : contextDescription[`${cmd.name}`]}

How to : ${prefix}${cmd.usage}
Exemples : ${prefix}${cmd.exemples.join(` | ${prefix}`)}

------------
( ) = alias | < > = optional | [ ] = required | (Don't include them in your commands)
Most commands also have /commands included, prefer using them.
\`\`\`
        `, ephemeral: true});
    }
};
