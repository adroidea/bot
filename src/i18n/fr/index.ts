import { Emojis } from '../../utils/consts';
import type { Translation } from '../i18n-types';

const fr: Translation = {
    errors: {
        unknown:
            "Tu m'a posé une colle là. Signale ce message à <@294916386072035328> (@adan_ea) et ce que t'as fais pour l'avoir. C'est pas normal que tu vois ceci. Mais je t'aime quand même hein <3",
        userPermissions: "Eh non, t'as pas les droits, cheh !",
        cooldown:
            "Comme dirait Orel San, ça va trop vite. Cette fonction est en cooldown. tu pourras l'utiliser <t:${cd}:R>.",
        botPermissions: "Je n'ai pas les droits pour faire ça, désolé !",
        toDo: "L'erreur est bien levée mais tu l'as pas encore écrite gros malin.",
        unknownCommand: 'Mmh, il semblerait que je ne connais pas cette commande.',
        guildNotFound: 'Bizarre, bizarre, je ne connais pas ce serveur.',
        moduleDisabled: 'Le module {module} est désactivé sur ce serveur.'
    },
    common: {
        noDescription: 'Aucune description'
    },
    modules: {
        auditLogs: {
            commands: {},
            events: {
                guildBanAdd: {
                    embed: {
                        title: 'Membre banni',
                        fields: {
                            target: `${Emojis.snowflake} Victime`,
                            executor: `${Emojis.snowflake} Exécuteur`,
                            reason: `${Emojis.snowflake} Raison`
                        }
                    }
                },
                guildBanRemove: {
                    embed: {
                        title: 'Utilisateur débanni',
                        fields: {
                            target: `${Emojis.snowflake} Béni`,
                            executor: `${Emojis.snowflake} Exécuteur`,
                            reason: `${Emojis.snowflake} Raison`
                        }
                    }
                },
                guildRoleCreate: {
                    embed: {
                        title: 'Rôle __{roleName}__ créé',
                        footer: {
                            text: 'Rôle créé'
                        },
                        unassigned: `${Emojis.cross} +{deniedCount} non attribuées`
                    }
                },
                guildRoleDelete: {
                    embed: {
                        title: 'Rôle __{roleName}__ supprimé',
                        unassigned: `${Emojis.cross} +{deniedCount} non attribuées`,
                        footer: {
                            text: 'Rôle supprimé'
                        }
                    }
                },
                guildRoleUpdate: {
                    embed: {
                        title: 'Rôle __{roleName}__ mis à jour',
                        footer: {
                            text: 'Rôle modifié'
                        },
                        fields: {
                            roleChanged: {
                                old: 'Ancien nom',
                                new: 'Nouveau nom'
                            },
                            colorChanged: {
                                old: 'Ancienne couleur',
                                new: 'Nouvelle couleur'
                            },
                            mentionable: 'Mentionnable',
                            hoist: 'Afficher séparément',
                            managed: 'Géré par Discord'
                        },
                        unassigned: `${Emojis.cross} +{deniedCount} non attribuées`
                    }
                },
                guildMemberAdd: {
                    embed: {
                        title: `${Emojis.pikaHi} Bienvenue sur le serveur {username} !`,
                        description:
                            'Bonjour et bienvenue sur le serveur ! Nous espérons que vous passerez un bon moment ici ! Et nous ferons de notre mieux pour que cela soit le cas !',
                        fields: {
                            created: `${Emojis.snowflake} Création`
                        },
                        footer: { text: 'Utilisateur rejoint' }
                    }
                },
                guildMemberRemove: {
                    embed: {
                        description: 'Weaklings Die. Big Deal.',
                        fields: {
                            member: `${Emojis.snowflake} Membre`,
                            creation: `${Emojis.snowflake} Création`,
                            joined: `${Emojis.snowflake} Rejoint`,
                            left: `${Emojis.snowflake} Parti`
                        },
                        footer: {
                            text: 'Membre parti'
                        }
                    }
                },
                guildMemberUpdate: {
                    embed: {
                        description: '<@{username}> a un nouveau look !',
                        footer: {
                            text: 'Membre modifié'
                        },
                        fields: {
                            nickname: {
                                old: 'Ancien surnom',
                                new: 'Nouveau surnom'
                            },
                            roles: {
                                old: 'Anciens rôles',
                                new: 'Nouveaux rôles'
                            }
                        }
                    }
                },

                messageBulkDelete: {
                    messages: '> <@{id}> : {count} messages',
                    embed: {
                        description:
                            '{amount} messages supprimés dans <#{channelId}>\n{usersDeleted}',
                        footer: { text: 'Suppression de masse' }
                    }
                },
                messageDelete: {
                    embed: {
                        description:
                            'Message de <@{userId}> supprimé dans <#{channelId}>, [afficher le salon]({url})',
                        fields: {
                            message: 'Message supprimé'
                        },
                        footer: { text: 'Message supprimé' }
                    }
                },
                messageUpdate: {
                    embed: {
                        description:
                            'Message de <@{userId}> édité dans <#{channelId}>, [afficher le message]({url})',
                        fields: {
                            oldMessage: 'Ancien message',
                            newMessage: 'Nouveau message'
                        },
                        footer: { text: 'Message édité' }
                    }
                }
            },
            categories: {
                general: `${Emojis.cog} Générales`,
                membership: `${Emojis.members} Membres`,
                events: `${Emojis.event} Evènements`,
                textChannel: `${Emojis.textChannel} Salon Textuel`,
                voiceChannel: `${Emojis.voiceChannel} Salon Vocal`,
                stageChannel: `${Emojis.stageChannel} Salon de Conférence`,
                advanced: `${Emojis.advanced} Avancées`
            }
        },
        core: {
            commands: {
                pingea: {
                    pong: '🏓 Pong !',
                    description: 'Renvoie le ping du bot',
                    botLatency: 'Latence du bot',
                    apiLatency: "Latence de l'API"
                },
                helpea: {
                    data: {
                        name: 'helpea',
                        description: 'Envoie un message avec toutes les commandes du bot'
                    },
                    options: {
                        command: {
                            name: 'commande',
                            description: 'La commande qui te pose problème'
                        }
                    },
                    embed: {
                        title: `${Emojis.aSnowflake} Voici toutes les commandes du bot !`,
                        description: 'Envoie un message avec toutes les commandes du bot',
                        footer: '[ ] = obligatoire | < > = facultatif | (Ne pas inclure dans les commandes)'
                    }
                },
                reportea: {
                    data: {
                        name: 'reportea',
                        desciption: "Informe le propriétaire du bot d'un bug ou d'une suggestion."
                    },
                    reply: 'Ton signalement a bien été envoyé. Tu pourras le retrouver dans {threadId} sur ce serveur : https://discord.gg/29URgah\nMerci pour ton retour !'
                },
                roll: {
                    description: 'Lance des dés',
                    invalidDice: 'Dé invalide'
                },
                changelog: {
                    description: ''
                },
                purge: {
                    description: 'Suppression massive de (1-100) messages dans un canal',
                    amount: 'Nombre de messages à supprimer',
                    target: 'La victime de cette suppression massive',
                    amountError: 'Veuillez choisir un nombre entre 1 et 100',
                    embed: {
                        titleTarget: '{amount} messages supprimés de {target} !',
                        titleNoTarget: '{amount} messages supprimés !',
                        error: "Aucun message n'a pu être supprimé",
                        footer: 'Remarque : Les messages datant de plus de 14 jours ne peuvent pas être supprimés en masse'
                    },
                    logEmbed: {
                        title: 'Suppression de masse (Bulk Delete) effectuée'
                    }
                }
            }
        },
        jail: {
            reply: '**{target}** a été envoyé en prison pour **{jailTime}** secondes.'
        },
        qotd: {
            name: 'qdj',
            description: '',
            usage: '',
            options: {
                question: {
                    name: '',
                    description: ''
                },
                author: {
                    name: '',
                    description: ''
                }
            },

            embeds: {
                fields: {
                    author: 'Auteur',
                    authorBlacklist: '[BLACKLISTÉ] <@{authorId}>',
                    server: 'Serveur',
                    status: 'Statut'
                },
                request: {
                    footer: 'Requête de QdJ'
                },
                success: {
                    add: 'Question ajoutée !',
                    accepted: 'La question a été ajoutée à la base !',
                    blacklisted: "La question a été rejetée et l'utilisateur blacklisté.",
                    rejected: 'La question a été rejetée.',
                    request: 'Requête envoyée !',
                    stealed:
                        "La question a été envoyée, merci à toi de m'aider dans mon manque de créativité !",
                    description:
                        "Est ce que tu es d'accord pour que ta question soit aussi proposée sur le serveur d'Adan ? (Tu peux ignorer le message si tu ne veux pas)"
                }
            },
            status: {
                accepted: '✅ Acceptée par <@{userId}>',
                pending: '⏳ En attente',
                blacklisted: '🔨 Rejetée et blacklisté par <@{modId}>',
                rejected: `${Emojis.cross} Rejetée par <@{modId}>`
            }
        }
    }
};

export default fr;
