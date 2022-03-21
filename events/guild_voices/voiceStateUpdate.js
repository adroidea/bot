module.exports = {
    name: 'voiceStateUpdate',
    once: false,

    isMoved(oldState, newState) {
        return oldState.channel !== null && newState.channel !== null && oldState.channel !== newState.channel;
    },

    async createNewChannel(newState) {
        if (this.isHostChannel(newState)) {
            newState.guild.channels.create(`🔊Vocal ${newState.member.user.username}`, {type: 'GUILD_VOICE'})
                .then(channel => {
                    channel.setParent(newState.channel.parentId);
                    newState.member.voice.setChannel(channel.id);
                });
        }
    },

    async deleteEmptyChannel(oldState) {
        if (!this.isProtectedVoiceChannel(oldState)) {
            if (oldState.channel.members.size === 0) {
                oldState.channel.delete();
            }
        }
    },

    isHostChannel(state) {
//gez
        if (state.channel.id === '951395573133639741') {
            return true;
        }
        //Créer vocal in VOCAUX
        if (state.channel.id === '891306696528506961') {
            return true;
        }

        //Voc Apex
        else if (state.channel.id === '936981199551881237') {
            return true;
        }

        //Voc Ark
        else if (state.channel.id === '936981994179551242') {
            return true;
        }

        //Voc DBD
        else if (state.channel.id === '936981382624841748') {
            return true;
        }

        //Voc Fall Guys
        else if (state.channel.id === '936981410844131348') {
            return true;
        }

        //Voc Propnight
        else if (state.channel.id === '936981454792036472') {
            return true;
        }
        return false;
    },
    isProtectedVoiceChannel(state) {
        if (this.isHostChannel(state)) {
            return true;
        }
        //modération
        if (state.channel.id === '940511315938648064') {
            return true;
        }
        //En Live
        else if (state.channel.id === '940510575253921832') {
            return true;
        }

        //En Attente
        else if (state.channel.id === '940510503824937021') {
            return true;
        }
        return false;
    },
    async execute(client, oldState, newState) {
        if (oldState.channel === null && newState.channel !== null) {
            await this.createNewChannel(newState);
        } else if (oldState.channel !== null && newState.channel === null) {
            await this.deleteEmptyChannel(oldState);
        } else if (this.isMoved(oldState, newState)) {
            await this.deleteEmptyChannel(oldState);
            await this.createNewChannel(newState);
        }
    }
};
