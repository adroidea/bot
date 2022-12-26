const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    publicLogChannel: { type: String, default: null },
    privateLogChannel: { type: String, default: null },
    defaultProfilePicture: {
        type: String,
        default:
            'https://cdn.discordapp.com/attachments/1050382523261276210/1050382808645894164/icone-discord.png'
    },
    liveProfilePicture: {
        type: String,
        default:
            'https://cdn.discordapp.com/attachments/1050382523261276210/1050382816514428998/icone-discord-live.png'
    },
    protectedChannels: [String],
    hostChannels: [String],
    notLoggedChannels: [String]
});

module.exports = mongoose.model('Guild', guildSchema);
