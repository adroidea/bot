/**
 * Checks if the user is moved from a channel to another
 * @param {*} oldState Represents the voice state for a Guild Member before the event.
 * @param {*} newState Represents the voice state for a Guild Member.
 * @returns {boolean} true if the user is moved from a channel to another
 */
let isMoved = (oldState, newState) => {
    return (
        oldState.channel !== null &&
        newState.channel !== null &&
        oldState.channel !== newState.channel
    );
};

/**
 * Creates a new voice channel when a user joins the hosting one
 * @param {ClientOptions} client The main hub for interacting with the Discord API, and the starting point for the bot.
 * @param {*} newState Represents the voice state for a Guild Member.
 */
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

/**
 * Deletes a voice channel once there is nobody in it.
 * @param {ClientOptions} client The main hub for interacting with the Discord API, and the starting point for the bot.
 * @param {*} state Represents the voice state for a Guild Member.
 */
let deleteEmptyChannel = async (client, state) => {
    if (!(await isProtectedVoiceChannel(client, state))) {
        if (state.channel.members.size === 0) {
            state.channel.delete();
        }
    }
};

/**
 * Checks if a channel is considered as a host. (If you join it, it will create a new one)
 * @param {ClientOptions} client The main hub for interacting with the Discord API, and the starting point for the bot.
 * @param {*} state Represents the voice state for a Guild Member.
 * @returns {boolean}
 */
let isHostChannel = async (client, state) => {
    const fetchGuild = await client.getGuild(state.guild);
    const hostChannels = fetchGuild.hostChannels;
    return hostChannels.includes(state.channel.id);
};

/**
 * Checks if a channel is considered protected. (Won't be deleted when no one is in it)
 * @param {ClientOptions} client The main hub for interacting with the Discord API, and the starting point for the bot.
 * @param {*} state Represents the voice state for a Guild Member.
 * @returns {boolean}
 */
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
    /**
     * manages a new state from a member. Used to create or delete a voice channel.
     * @param {*} client The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} oldState Represents the previous voice state after the event trigger for a Guild Member.
     * @param {*} newState Represents the new voice state after the event trigger for a Guild Member.
     */
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
