import { BaseTranslation } from '../i18n-types';

const en = {
    errors: {
        unknown:
            "You've got me puzzled there. Report this message to <@294916386072035328> (@adan_ea) and explain what you did to get it. It's not normal that you see this. But I still love you, you know <3",
        userPermissions: "Oh no, you don't have the permissions, too bad!",
        cooldown: "As Orel San would say, it's too fast. This function is on cooldown. You can use it again <t:${cd:number}:R>.",
        botPermissions: "I don't have the permissions to do that, sorry!",
        toDo: "The error is raised, but you haven't written it yet, smarty.",
        unknownCommand: "Hmm, it seems like I don't know this command.",
        guildNotFound: "Strange, strange, I don't know this server.",
        moduleDisabled: 'The {module:string} module is disabled on this server.'
    }
} satisfies BaseTranslation;

export default en;
