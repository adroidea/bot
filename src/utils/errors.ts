export class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const UnknownError = new CustomError(
  "Tu m'a posé une colle là. Signale ce message à <@294916386072035328> (Adan_ea#3000) et ce que t'as fais pour l'avoir. C'est pas normal que tu vois ceci. Mais je t'aime quand même hein <3"
);

export const ToDoError = new CustomError(
  "Alors, ca fonctionne, mais t'as pas setup d'erreur pour ce cas encore."
);

export const NoPermissionsError = new CustomError("Eh non, t'as pas les droits, cheh !");

export const UnknownCommandError = new CustomError(
  "Mmh, il semblerait que je ne connais pas cette commande."
);

export const ModuleNotEnabledError = new CustomError(
  "Le module n'est pas activé sur ce serveur, pense à l'activer ou demande à un admin."
);

////////////////////////////////////////////////////
//             Temp voice related err             //
////////////////////////////////////////////////////

export const NotVoiceChannelOwnerError = new CustomError(
  "Tu n'es pas dans un salon vocal, ou celui dans lequel tu es ne t'appartiens pas. Donc pas touche la mouche."
);

export const SelfBanError = new CustomError(
  "Tu ne peux pas te ban toi même. Peu importe à quel point tu te déteste."
);

////////////////////////////////////////////////////
//               Events related err               //
////////////////////////////////////////////////////

export const EventNotFoundError = new CustomError("L'évenement en question n'existe pas.");

export const AlreadyParticipantError = new CustomError(
  "Je sais que cet évènement est incroyable mais tu es déjà dans la liste des participants, prend ton mal en patience !"
);

export const ParticipantNotFoundError = new CustomError("Tu n'es pas un participant !");
