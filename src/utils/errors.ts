import L from '../locales/i18n-node';

export class CustomError extends Error {}

export const CustomErrors = {
    UnknownError: new CustomError(
        "Tu m'a posé une colle là. Signale ce message à <@294916386072035328> (@adan_ea) et ce que t'as fais pour l'avoir. C'est pas normal que tu vois ceci. Mais je t'aime quand même hein <3"
    ),
    CooldownError: (cooldownTime: number) =>
        new CustomError(L.en.errors.cooldown({ cd: cooldownTime })),
    UserNoPermissionsError: new CustomError("Eh non, t'as pas les droits, cheh !"),
    SelfNoPermissionsError: new CustomError("Peux pas faire ça, j'ai pas les droits."),
    ToDoError: new CustomError("Ca fonctionne, mais t'as pas setup d'erreur pour ce cas encore."),
    UnknownCommandError: new CustomError(
        'Mmh, il semblerait que je ne connais pas cette commande.'
    ),
    GuildNotFoundError: new CustomError("Le serveur n'a pas été trouvé."),

    ////////////////////////////////////////////////////
    //             Temp voice related err             //
    ////////////////////////////////////////////////////
    TempVoiceDisabledError: new CustomError("Le module TempVoice n'est pas activé sur ce serveur."),
    CreateNewTempChannelError: new CustomError("J'ai eu un souci lors de la création du salon."),
    NotVoiceOwnerError: new CustomError(
        "Si t'es dans un salon vocal, il ne t'appartient pas. Pas touche la mouche."
    ),

    SelfBanError: new CustomError(
        'Tu ne peux pas te ban toi même. Peu importe à quel point tu te déteste.'
    ),
    BotBanError: new CustomError(
        'Tu ne peux pas me ban de ce salon. Peu importe à quel point tu me déteste, il faut que je puisse le gérer.'
    ),

    NotVoiceChannelError: new CustomError(
        "Je n'arrive pas à accéder au salon vocal dans lequel tu es."
    ),

    SwitchVoiceOwnerError: new CustomError(
        "Trop de responsabilité pour moi.. je n'ai pas réussi à changer de propriétaire."
    ),

    SwitchVoicePrivacyError: new CustomError("Whoops, j'ai pas réussi à switch l'état du salon."),

    ////////////////////////////////////////////////////
    //               Events related err               //
    ////////////////////////////////////////////////////
    ScheduledEventDisabledError: new CustomError(
        "Le module ScheduledEvent n'est pas activé sur ce serveur."
    ),
    EventNotFoundError: new CustomError(
        "L'évenement en question n'existe pas ou je n'y ai pas accès."
    ),
    EventAlreadyExistsError: new CustomError("L'évenement existe déjà en base."),

    ////////////////////////////////////////////////////
    //                QOtD related err                //
    ////////////////////////////////////////////////////
    QOtDeDisabledError: new CustomError('Les QdJ ne sont pas activées sur ce serveur.'),
    BlacklistedUserError: new CustomError('Tu es blacklisté, tu ne peux pas proposer de question.'),
    BannedWordError: new CustomError('Ta question contient un mot interdit.'),

    ////////////////////////////////////////////////////
    //               Twitch related err               //
    ////////////////////////////////////////////////////
    TwitchDisabledError: new CustomError("Le module Twitch n'est pas activé sur ce serveur."),

    ////////////////////////////////////////////////////
    //               Logs related err                 //
    ////////////////////////////////////////////////////
    LogsDisabledError: new CustomError("Le module Logs n'est pas activé sur ce serveur.")
};
