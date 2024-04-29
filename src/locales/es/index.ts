import { Emojis } from '../../utils/consts';
import { Translation } from '../i18n-types';

const es: Translation = {
    errors: {
        unknown:
            'Me has desconcertado ahí. Informa este mensaje a <@294916386072035328> (@adan_ea) y explica lo que hiciste para obtenerlo. No es normal que veas esto. Pero aún así te quiero, ¿sabes <3?',
        userPermissions: 'Oh no, no tienes los permisos, ¡cheh!',
        cooldown: ' <t:${cd}:R>.',
        botPermissions: 'No tengo los permisos para hacer eso. ¡lo siento!',
        toDo: 'El error está presente, pero aún no lo has escrito, astuto.',
        unknownCommand: 'Mmm, parece que no conozco este comando.',
        guildNotFound: 'Extraño, extraño, no conozco este servidor.',
        moduleDisabled: 'El módulo {module} está desactivado en este servidor.'
    },
    modules: {
        auditLogs: {
            commands: {},
            events: {
                guildBanAdd: {
                    embed: {
                        title: 'Usuario banneado',
                        fields: {
                            target: `${Emojis.snowflake} Víctima`,
                            executor: `${Emojis.snowflake} Executor`,
                            reason: `${Emojis.snowflake} Razón`
                        }
                    }
                },
                guildBanRemove: {
                    embed: {
                        title: 'Baneo revocado',
                        fields: {
                            target: `${Emojis.snowflake} Bendito`,
                            executor: `${Emojis.snowflake} Executor`,
                            reason: `${Emojis.snowflake} Razón`
                        }
                    }
                },
                guildRoleCreate: {
                    embed: {
                        title: 'Rol __{roleName}__ creado',
                        footer: {
                            text: 'Rol creado'
                        },
                        unassigned: `${Emojis.cross} +{deniedCount} sin asignar`
                    }
                },
                guildRoleDelete: {
                    embed: {
                        title: 'Rol __{roleName}__ eliminado',
                        unassigned: `${Emojis.cross} +{deniedCount} sin asignar`,
                        footer: {
                            text: 'Rol eliminado'
                        }
                    }
                },
                guildRoleUpdate: {
                    embed: {
                        title: 'Rol __{roleName}__ actualizado',
                        footer: {
                            text: 'Rol modificado'
                        },
                        fields: {
                            roleChanged: {
                                old: 'Antiguo nombre',
                                new: 'Nuevo nombre'
                            },
                            colorChanged: {
                                old: 'Antiguo color',
                                new: 'Nuevo color'
                            },
                            mentionable: 'Mencionable',
                            hoist: 'Mostrar por separado',
                            managed: 'Gestionado por Discord'
                        },
                        unassigned: `${Emojis.cross} +{deniedCount} sin asignar`
                    }
                },
                guildMemberAdd: {
                    embed: {
                        title: `${Emojis.pikaHi} ¡Bienvenido al servidor {username}!`,
                        description:
                            '¡Hola y bienvenido al servidor! ¡Esperamos que tengas un gran tiempo aquí! ¡Y haremos nuestro mejor esfuerzo para que así sea!',
                        fields: {
                            created: `${Emojis.snowflake} Cuenta creada`
                        },
                        footer: { text: 'Miembro unido' }
                    }
                },
                guildMemberRemove: {
                    embed: {
                        description: 'Los débiles mueren. Gran cosa.',
                        fields: {
                            member: `${Emojis.snowflake} Miembro`,
                            creation: `${Emojis.snowflake} Creación`,
                            joined: `${Emojis.snowflake} Unido`,
                            left: `${Emojis.snowflake} Salido`
                        },
                        footer: {
                            text: 'Usuario se fue'
                        }
                    }
                },
                guildMemberUpdate: {
                    embed: {
                        description: '<@{username}> tiene un nuevo aspecto!',
                        footer: {
                            text: 'Miembro modificado'
                        },
                        fields: {
                            nickname: {
                                old: 'Viejo apodo',
                                new: 'Nuevo apodo'
                            },
                            roles: {
                                old: 'Roles antiguos',
                                new: 'Nuevos roles'
                            }
                        }
                    }
                },
                messageBulkDelete: {
                    messages: '> <@{id}>: {count} mensajes',
                    embed: {
                        description:
                            '{amount} mensajes eliminados en <#{channelId}>\n{usersDeleted}',
                        footer: { text: 'Eliminación masiva' }
                    }
                },
                messageDelete: {
                    embed: {
                        description:
                            'Mensaje de <@{userId}> eliminado en <#{channelId}>, [mostrar canal]({url})',
                        fields: {
                            message: 'Mensaje eliminado'
                        },
                        footer: { text: 'Mensaje eliminado' }
                    }
                },
                messageUpdate: {
                    embed: {
                        description:
                            'Mensaje de <@{userId}> editado en <#{channelId}>, [mostrar mensaje]({url})',
                        fields: {
                            oldMessage: 'Mensaje antiguo',
                            newMessage: 'Nuevo mensaje'
                        },
                        footer: { text: 'Mensaje editado' }
                    }
                }
            },
            categories: {
                general: `${Emojis.cog} Generales`,
                membership: `${Emojis.members} Membresía`,
                events: `${Emojis.event} Eventos`,
                textChannel: `${Emojis.textChannel} Canal de Texto`,
                voiceChannel: `${Emojis.voiceChannel} Canal de Voz`,
                stageChannel: `${Emojis.stageChannel} Canal de Escenario`,
                advanced: `${Emojis.advanced} Avanzados`
            }
        },
        core: {
            commands: {
                helpea: {
                    description: '',
                    embed: {
                        title: '',
                        description: '',
                        footer: ''
                    }
                },
                pingea: {
                    description: 'Devuelve el ping del bot',
                    botLatency: 'Latencia del bot',
                    apiLatency: 'Latencia de la API'
                },
                reportea: {
                    desciption: '',
                    embed: {
                        description: ''
                    },
                    reply: 'Tu informe ha sido enviado. Puedes encontrarlo en {threadId} en este servidor: https://discord.gg/29URgah\n¡Gracias por tu opinión!'
                },
                roll: {
                    description: ''
                },
                changelog: {
                    description: ''
                },
                purge: {
                    description: 'Eliminación masiva de (1-100) mensajes en un canal',
                    amount: 'Número de mensajes a eliminar',
                    target: 'La víctima de esta eliminación masiva',
                    amountError: 'Por favor, elija un número entre 1 y 100',
                    embed: {
                        titleTarget: '¡{amount} mensajes eliminados de {target}!',
                        titleNoTarget: '¡{amount} mensajes eliminados!',
                        error: 'No se pudo eliminar ningún mensaje',
                        footer: 'Nota: Los mensajes con más de 14 días de antigüedad no pueden eliminarse en masa'
                    },
                    logEmbed: {
                        title: 'Eliminación masiva realizada'
                    }
                }
            }
        },
        qotd: {
            commands: {
                name: '',
                description: '',
                embeds: {
                    request: {
                        fields: {
                            name: ''
                        },
                        footer: ''
                    },
                    success: {
                        add: '',
                        request: '',
                        description: ''
                    },
                    question: {
                        title: '',
                        value: ''
                    }
                },
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
                }
            }
        }
    }
};

export default es;
