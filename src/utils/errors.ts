export class CustomError extends Error {}

export const CustomErrors = {
    UnknownError: new CustomError(
        "Tu m'a posé une colle là. Signale ce message à <@294916386072035328> (@adan_ea) et ce que t'as fais pour l'avoir. C'est pas normal que tu vois ceci. Mais je t'aime quand même hein <3"
    ),
    CooldownError: (cooldownTime: number) =>
        new CustomError(
            `Comme dirait Orel San, ça va trop vite. Cette commande est en cooldown. tu pourras l'utiliser <t:${cooldownTime}:R>.`
        ),
    UserNoPermissionsError: new CustomError("Eh non, t'as pas les droits, cheh !"),
    SelfNoPermissionsError: new CustomError("Peux pas faire ça, j'ai pas les droits."),
    ToDoError: new CustomError("Ca fonctionne, mais t'as pas setup d'erreur pour ce cas encore."),
    UnknownCommandError: new CustomError(
        'Mmh, il semblerait que je ne connais pas cette commande.'
    ),
    ModuleDisabledError: new CustomError("Le module n'est pas activé sur ce serveur."),
    GuildNotFoundError: new CustomError("Le serveur n'a pas été trouvé."),

    ////////////////////////////////////////////////////
    //             Temp voice related err             //
    ////////////////////////////////////////////////////
    CreateNewTempChannelError: new CustomError("J'ai eu un souci lors de la création du salon."),
    NotVoiceOwnerError: new CustomError(
        "Si t'es dans un salon vocal, il ne t'appartient pas. Pas touche la mouche."
    ),

    SelfBanError: new CustomError(
        'Tu ne peux pas te ban toi même. Peu importe à quel point tu te déteste.'
    ),

    SwitchVoiceOwnerError: new CustomError(
        "Trop de responsabilité pour moi.. je n'ai pas réussi à changer de propriétaire."
    ),

    SwitchVoicePrivacyError: new CustomError("Whoops, j'ai pas réussi à switch l'état du salon."),

    ////////////////////////////////////////////////////
    //               Events related err               //
    ////////////////////////////////////////////////////
    EventNotFoundError: new CustomError("L'évenement en question n'existe pas."),

    AlreadyParticipantError: new CustomError(
        'Je sais que cet évènement est incroyable mais tu es déjà dans la liste des participants, prend ton mal en patience !'
    ),

    ParticipantNotFoundError: new CustomError("Tu n'es pas un participant !"),

    ////////////////////////////////////////////////////
    //                QOtD related err                //
    ////////////////////////////////////////////////////
    BlacklistedUserError: new CustomError('Tu es blacklisté, tu ne peux pas envoyer de question.')
};
