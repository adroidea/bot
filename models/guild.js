const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    prefix: {'type': String, 'default': '!'},
    logChannel: {'type': String},
    welcomeChannel: {'type': String},


});
module.exports = mongoose.model('Guild', guildSchema);
