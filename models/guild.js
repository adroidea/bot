const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    publicLogChannel: String,
    privateLogChannel: String,
    protectedChannels:[String],
    hostedChannels: [String],
});

module.exports = mongoose.model('Guild', guildSchema);