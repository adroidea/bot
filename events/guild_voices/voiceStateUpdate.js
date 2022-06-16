let isMoved = (oldState, newState) => {
    return (
        oldState.channel !== null &&
        newState.channel !== null &&
        oldState.channel !== newState.channel
    );
};

let createNewChannel = async (client, newState) => {
    if (await isHostChannel(client, newState)) {
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

let deleteEmptyChannel = async (client, state) => {
    if (!(await isProtectedVoiceChannel(client, state))) {
        if (state.channel.members.size === 0) {
            state.channel.delete();
        }
    }
};

let isHostChannel = async (client, state) => {
    const fetchGuild = await client.getGuild(state.guild);
    const hostChannels = fetchGuild.hostChannels;
    return hostChannels.includes(state.channel.id);
};

let isProtectedVoiceChannel = async (client, state) => {
    const fetchGuild = await client.getGuild(state.guild);
    const protectedChannels = fetchGuild.protectedChannels;

    if (await isHostChannel(client, state)) {
        return true;
    }

    return protectedChannels.includes(state.channel.id);
};

module.exports = {
    name: 'voiceStateUpdate',
    once: false,

    async execute(client, oldState, newState) {
        if (oldState.channel === null && newState.channel !== null) {
            await createNewChannel(client, newState);
        } else if (oldState.channel !== null && newState.channel === null) {
            await deleteEmptyChannel(client, oldState);
        } else if (isMoved(oldState, newState)) {
            await deleteEmptyChannel(client, oldState);
            await createNewChannel(client, newState);
        }
    }
};
