import { Client, ClientOptions, Collection, Partials } from 'discord.js';

interface ItempVoiceSettings {
    ownerId: string;
    isPrivate: boolean;
}

export interface IDiscordClient {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
    modals: Collection<string, any>;
    selectMenus: Collection<string, any>;
    contextMenus: Collection<string, any>;
    cooldowns: Collection<string, any>;
    warnedOwner: Collection<string, any>;
    tempVoice: Collection<string, ItempVoiceSettings>;
}

class DiscordClient extends Client implements IDiscordClient {
    public commands: Collection<string, any>;
    public buttons: Collection<string, any>;
    public modals: Collection<string, any>;
    public selectMenus: Collection<string, any>;
    public contextMenus: Collection<string, any>;
    public cooldowns: Collection<string, any>;
    public warnedOwner: Collection<string, any>;
    public tempVoice: Collection<string, ItempVoiceSettings>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.buttons = new Collection();
        this.modals = new Collection();
        this.selectMenus = new Collection();
        this.contextMenus = new Collection();
        this.cooldowns = new Collection();
        this.warnedOwner = new Collection();
        this.tempVoice = new Collection();
    }
}

export default new DiscordClient({
    intents: 3276799,
    partials: [Partials.Channel]
});
