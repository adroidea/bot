import { BaseTranslation } from '../i18n-types';
import { Emojis } from '../../utils/consts';

const en = {
    errors: {
        unknown:
            "You've got me puzzled there. Report this message to <@294916386072035328> (@adan_ea) and explain what you did to get it. It's not normal that you see this. But I still love you, you know <3",
        userPermissions: "Oh no, you don't have the permissions, too bad!",
        cooldown: 'This function is on cooldown. You can use it again <t:${cd:number}:R>.',
        botPermissions: "I don't have the permissions to do that, sorry!",
        toDo: "The error is raised, but you haven't written it yet, smart ass.",
        unknownCommand: "Hmm, it seems like I don't know this command.",
        guildNotFound: "Strange, strange, I don't know this server.",
        moduleDisabled: 'The {module:string} module is disabled on this server.'
    },
    modules: {
        auditLogs: {
            commands: {},
            events: {
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
                        footer: {
                            text: 'Role created'
                        },
                        unassigned: `${Emojis.cross} +{deniedCount: number} not granted`
                    }
                },
                guildRoleDelete: {
                    embed: {
                        title: 'Role __{roleName: string}__ deleted',
                        unassigned: `${Emojis.cross} +{deniedCount: number} not granted`,
                        footer: {
                            text: 'Role deleted'
                        }
                    }
                },
                guildRoleUpdate: {
                    embed: {
                        title: 'Role __{roleName: string}__ updated',
                        footer: {
                            text: 'Role modified'
                        },
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
                        footer: { text: 'Member joined' }
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
                        footer: {
                            text: 'Member left'
                        }
                    }
                },
                guildMemberUpdate: {
                    embed: {
                        description: '<@{username:string}> has a new look!',
                        footer: {
                            text: 'Member modified'
                        },
                        fields: {
                            nickname: {
                                old: 'Old nickname',
                                new: 'New nickname'
                            },
                            roles: {
                                old: 'Old roles',
                                new: 'New roles'
                            }
                        }
                    }
                },
                messageBulkDelete: {
                    messages: '> <@{id: string}>: {count: number} messages',
                    embed: {
                        description:
                            '{amount: number} messages deleted in <#{channelId: string}>\n{usersDeleted: string}',
                        footer: { text: 'Bulk deletion' }
                    }
                },
                messageDelete: {
                    embed: {
                        description:
                            'Message from <@{userId:string}> deleted in <#{channelId: string}>, [show channel]({url: string})',
                        fields: {
                            message: 'Deleted message'
                        },
                        footer: { text: 'Message deleted' }
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
                        footer: { text: 'Message edited' }
                    }
                }
            }
        }
    }
} satisfies BaseTranslation;

export default en;
