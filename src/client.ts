import { Client, ClientOptions, Collection } from 'discord.js';

interface ItempVoiceSettings {
    ownerId: string;
    isPublic: boolean;
}

export interface IDiscordClient {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
    modals: Collection<string, any>;
    selectMenus: Collection<string, any>;
    cooldowns: Collection<string, any>;
    tempVoice: Collection<string, ItempVoiceSettings>;
}

export default class DiscordClient extends Client implements IDiscordClient {
    public commands: Collection<string, any>;
    public buttons: Collection<string, any>;
    public modals: Collection<string, any>;
    public selectMenus: Collection<string, any>;
    public cooldowns: Collection<string, any>;
    public tempVoice: Collection<string, ItempVoiceSettings>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.buttons = new Collection();
        this.modals = new Collection();
        this.selectMenus = new Collection();
        this.cooldowns = new Collection();
        this.tempVoice = new Collection();
    }
}
