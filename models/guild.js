const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    publicLogChannel: {type: String, default: null},
    privateLogChannel: {type: String, default: null},
    protectedChannels:[String],
    hostChannels: [String],
    notLoggedChannels: [String],
});

module.exports = mongoose.model('Guild', guildSchema);