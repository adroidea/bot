function isMoved(oldState, newState) {
    return (
        oldState.channel !== null &&
        newState.channel !== null &&
        oldState.channel !== newState.channel
    );
}

async function createNewChannel(newState) {
    if (isHostChannel(newState)) {
        newState.guild.channels
            .create(`🔊Vocal ${newState.member.user.username}`, {
                type: 'GUILD_VOICE'
            })
            .then(channel => {
                channel.setParent(newState.channel.parentId);
                newState.member.voice.setChannel(channel.id);
            });
    }
}

async function deleteEmptyChannel(oldState) {
    if (!isProtectedVoiceChannel(oldState)) {
        if (oldState.channel.members.size === 0) {
            oldState.channel.delete();
        }
    }
}

let isHostChannel = (state) => {
    const hostChannels = [
        '986602974476394546',
        '891306696528506961', //Créer vocal dans VOCAUX
    ];

    if (hostChannels.includes(state.channel.id)) {
        return true;
    }
    return false;
}

function isProtectedVoiceChannel(state) {
    const protectedChannels = [
        '940511315938648064',
        '940510575253921832',
        '940510503824937021'
    ];
    if (isHostChannel(state)) {
        return true;
    }
    
    if (protectedChannels.includes(state.channel.id)) {
        return true;
    }
    return false;
}

module.exports = {
    name: 'voiceStateUpdate',
    once: false,

    async execute(client, oldState, newState) {
        if (oldState.channel === null && newState.channel !== null) {
            await createNewChannel(newState);
        } else if (oldState.channel !== null && newState.channel === null) {
            await deleteEmptyChannel(oldState);
        } else if (isMoved(oldState, newState)) {
            await deleteEmptyChannel(oldState);
            await createNewChannel(newState);
        }
    }
};
