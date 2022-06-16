let isMoved = (oldState, newState) => {
    return (
        oldState.channel !== null &&
        newState.channel !== null &&
        oldState.channel !== newState.channel
    );
};

let createNewChannel = async newState => {
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
};

let deleteEmptyChannel = async oldState => {
    if (!isProtectedVoiceChannel(oldState)) {
        if (oldState.channel.members.size === 0) {
            oldState.channel.delete();
        }
    }
};

let isHostChannel = state => {
    const hostChannels = [
        '986602974476394546',
        '891306696528506961'
    ];

    return hostChannels.includes(state.channel.id);
};

let isProtectedVoiceChannel = state => {
    const protectedChannels = [
        '940511315938648064',
        '940510575253921832',
        '940510503824937021'
    ];
    if (isHostChannel(state)) {
        return true;
    }

    return protectedChannels.includes(state.channel.id);
};

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
