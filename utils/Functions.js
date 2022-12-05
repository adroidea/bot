const { Guild } = require('../models');
const guild = require('../models/guild');
const Logger = require('../utils/Logger');

module.exports = client => {
    client.getGuild = async guild => {
        const guildData = await Guild.findOne({ id: guild.id });
        return guildData;
    };
    client.createGuild = async guild => {
        const createGuild = new Guild({ id: guild.id });
        createGuild
            .save()
            .then(r => Logger.info(`Nouveau serveur ajouté : ${r.id}`));
    };
    client.updateGuild = async (guild, settings) => {
        let guildData = await client.getGuild(guild);
        if (typeof guildData !== 'object') {
            guildData = {};
        }
        for (const key in settings) {
            if (guildData[key] !== settings[key]) {
                guildData[key] = settings[key];
            }
        }
        return guildData.updateOne(settings);
    };
};
