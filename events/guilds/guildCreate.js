const {Guild} = require('../../models/index');
module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        const guildCreate = await new Guild({id: guild.id});
        guildCreate.save().then(g => console.log(`New guild added with id ${g.id}`))
    }
};
