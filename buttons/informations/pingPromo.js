module.exports = {
    name: 'pingPromo',
    async runInteraction(client, interaction) {
        let role = await interaction.member.roles.cache.get('956467697439350794');
        if(role === undefined){
            console.log('ca ajoute')
            await interaction.member.roles.add('956467697439350794');
            await interaction.reply({content: `role <@956467697439350794> successfuly added.`, ephemeral: true});
        } else {
            await interaction.member.roles.remove('956467697439350794');
            await interaction.reply({content: `role <@956467697439350794> successfuly added.`, ephemeral: true});
        }
    }
};
