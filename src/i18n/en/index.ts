import { BaseTranslation } from '../i18n-types';
import { Emojis } from '../../utils/consts';

const en = {
    errors: {
        unknown:
            "You've got me puzzled there. Report this message to <@294916386072035328> (@adan_ea) and explain what you did to get it. It's not normal that you see this. But I still love you, you know <3",
        userPermissions: "Oh no, you don't have the permissions, too bad!",
        cooldown: 'This function is on cooldown. You can use it again <t:{cd:number}:R>.',
        botPermissions: "I don't have the permissions to do that, sorry!",
        toDo: "The error is raised, but you haven't written it yet, smart ass.",
        unknownCommand: "Hmm, it seems like I don't know this command.",
        guildNotFound: "Strange, strange, I don't know this server.",
        moduleDisabled: 'The {module:string} module is disabled on this server.'
    },
    common: {
        noDescription: 'No description'
    },
    modules: {
        auditLogs: {
            guildBanAdd: {
                embed: {
                    title: 'User banned',
                    fields: {
                        target: `${Emojis.snowflake} Victim`,
                        executor: `${Emojis.snowflake} Executor`,
                        reason: `${Emojis.snowflake} Reason`
                    }
                }
            },
            guildBanRemove: {
                embed: {
                    title: 'User unbanned',
                    fields: {
                        target: `${Emojis.snowflake} Blessed`,
                        executor: `${Emojis.snowflake} Executor`,
                        reason: `${Emojis.snowflake} Reason`
                    }
                }
            },
            guildRoleCreate: {
                embed: {
                    title: 'Role __{roleName: string}__ created',
                    footer: 'Role created',
                    unassigned: `${Emojis.cross} +{deniedCount: number} not granted`
                }
            },
            guildRoleDelete: {
                embed: {
                    title: 'Role __{roleName: string}__ deleted',
                    unassigned: `${Emojis.cross} +{deniedCount: number} not granted`,
                    footer: 'Role deleted'
                }
            },
            guildRoleUpdate: {
                embed: {
                    title: 'Role __{roleName: string}__ updated',
                    footer: 'Role modified',
                    fields: {
                        roleChanged: {
                            old: 'Old name',
                            new: 'New name'
                        },
                        colorChanged: {
                            old: 'Old color',
                            new: 'New color'
                        },
                        mentionable: 'Mentionnable',
                        hoist: 'Show separately',
                        managed: 'Managed by Discord'
                    },
                    unassigned: `${Emojis.cross} +{deniedCount: number} not granted`
                }
            },
            guildMemberAdd: {
                embed: {
                    title: `${Emojis.pikaHi} Welcome to the server {username:string}!`,
                    description:
                        'Hello and welcome to the server! We hope you will have a great time here! And we will do our best to make it so!',
                    fields: {
                        created: `${Emojis.snowflake} Account created`
                    },
                    footer: 'Member joined'
                }
            },
            guildMemberRemove: {
                embed: {
                    description: 'Weaklings Die. Big Deal.',
                    fields: {
                        member: `${Emojis.snowflake} Member`,
                        creation: `${Emojis.snowflake} Creation`,
                        joined: `${Emojis.snowflake} Joined`,
                        left: `${Emojis.snowflake} Left`
                    },
                    footer: 'Member left'
                }
            },
            guildMemberUpdate: {
                embed: {
                    description: '<@{username:string}> has a new look!',
                    fields: {
                        nickname: {
                            old: 'Old nickname',
                            new: 'New nickname'
                        },
                        roles: {
                            old: 'Old roles',
                            new: 'New roles'
                        }
                    },
                    footer: 'Member modified'
                }
            },
            messageBulkDelete: {
                messages: '> <@{id: string}>: {count: number} messages',
                embed: {
                    description:
                        '{amount: number} messages deleted in <#{channelId: string}>\n{usersDeleted: string}',
                    footer: 'Bulk deletion'
                }
            },
            messageDelete: {
                embed: {
                    description:
                        'Message from <@{userId:string}> deleted in <#{channelId: string}>, [show channel]({url: string})',
                    fields: {
                        message: 'Deleted message'
                    },
                    footer: 'Message deleted'
                }
            },
            messageUpdate: {
                embed: {
                    description:
                        'Message from <@{userId:string}> edited in <#{channelId: string}>, [show message]({url: string})',
                    fields: {
                        oldMessage: 'Old message',
                        newMessage: 'New message'
                    },
                    footer: 'Message edited'
                }
            },
            categories: {
                general: `${Emojis.cog} General`,
                membership: `${Emojis.members} Membership`,
                events: `${Emojis.event} Events`,
                textChannel: `${Emojis.textChannel} Text Channel`,
                voiceChannel: `${Emojis.voiceChannel} Voice Channel`,
                stageChannel: `${Emojis.stageChannel} Stage Channel`,
                advanced: `${Emojis.advanced} Advanced`
            }
        },
        core: {
            commands: {
                helpea: {
                    data: {
                        name: 'helpea',
                        description: "Send a message with all the bot's commands"
                    },
                    options: {
                        command: {
                            name: 'command',
                            description: 'The command that is causing you problems'
                        }
                    },
                    embed: {
                        title: `${Emojis.aSnowflake} Here are all the bot's commands!`,
                        description: `Send a message with all the bot's commands`,
                        footer: `[ ] = required | < > = optional | (Do not include in commands)`
                    }
                },
                pingea: {
                    pong: '🏓 Pong!',
                    description: "Returns the bot's ping",
                    botLatency: 'Bot latency',
                    apiLatency: 'API latency'
                },
                reportea: {
                    data: {
                        name: 'reportea',
                        desciption: "Notifies the bot's owner of a bug or a suggestion"
                    },
                    reply: 'Your report has been sent. You can find it in {threadId: string} on this server: https://discord.gg/29URgahg\nThank you for your feedback!'
                },
                roll: {
                    description: 'Rolls dices',
                    invalidDice: 'Invalid dice'
                },
                changelog: {
                    description: '[owner only] Sends a message to all servers'
                },
                purge: {
                    description: 'Mass deletion of (1-100) messages in a channel',
                    amount: 'Number of messages to delete',
                    target: 'The victim of this mass deletion',
                    amountError: 'Please choose a number between 1 and 100',
                    embed: {
                        titleTarget: '{amount: number} messages deleted from {target:string}!',
                        titleNoTarget: '{amount: number} messages deleted!',
                        error: 'No message could be deleted',
                        footer: 'NB: Messages older than 14 days cannot be deleted in bulk'
                    },
                    logEmbed: {
                        title: 'Bulk delete done'
                    }
                }
            }
        },
        jail: {
            reply: '**{target:string}** has been sent to prison for **{jailTime:number}** seconds.'
        },
        qotd: {
            name: 'qotd',
            description: 'Sends a request to add the question of the day (auto added for admins)',
            usage: '/qotd [question] <author>',
            options: {
                question: {
                    name: 'question',
                    description: 'The question you want to propose'
                },
                author: {
                    name: 'author',
                    description: '[ADMIN] The author of the question'
                }
            },
            embeds: {
                fields: {
                    author: 'Author',
                    authorBlacklist: '[BLACKLISTED] <@{authorId:string}>',
                    server: 'Guild',
                    status: 'Status'
                },
                request: {
                    footer: 'QoTD Request'
                },
                success: {
                    accepted: 'The question has been added to the database!',
                    add: 'Question added!',
                    blacklisted: 'The question was rejected and the user blacklisted.',
                    description:
                        "Do you allow me to also send this question to the bot owner? (You can safely ignore this message if you don't)",
                    rejected: 'The question was rejected',
                    request: 'Request sent!',
                    stealed:
                        'The question has been sent, thank you for helping me with my lack of creativity!'
                }
            },
            status: {
                accepted: '✅ Accepted by <@{userId:string}>',
                blacklisted: '🔨 Rejected and blacklisted by <@{modId:string}>',
                pending: '⏳ Pending',
                rejected: `${Emojis.cross} Rejected by <@{modId:string}>`
            }
        }
    }
} satisfies BaseTranslation;

export default en;
