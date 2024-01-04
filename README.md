# 📖 Introduction

This is a discord bot primarly made for my discord server (this is why some values are hard coded) but feel free to use the code for yourself.

I self-host the bot but my code isn't yet strong enough to give an invitation link. But feel free to contribute !

<p align="center">
  <a href="https://discord.gg/BUQ8qPfSJY">
    <img src="./assets/adroid_ea.png"  alt="Discord bot icon" width="50%" style="border-radius:100%"/>
  </a>
</p>

<div align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/adan-ea/adroid_ea?style=flat-square">
  <a href="https://github.com/adan-ea/adroid_ea/issues">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/adan-ea/adroid_ea?style=flat-square">
  </a>
  <a href="https://discord.gg/BUQ8qPfSJY">
    <img alt="Invite Discord" src="https://img.shields.io/badge/Discord-5865F2?style=flat-square?style=for-the-badge&logo=discord&logoColor=white">
  </a>

</div>

# ✨ Features

## Modules 

### 📅 Events management

- Create and delete events (administrator)
- Join created events (you can unRSVP)
- Waiting list available (max participants)
> Sooo much TODO (event scheduling otw, with alerts 1 week, 1 day and 1 hour prior to the event)

### Moderation 

- Purge channel

### Audit Logs

- Guild Messages
   - Update / Delete / Bulk Delete

- Guild Member
   - Join / Nickname update / Leave

 - Guild
   - Ban Add / Remove
   - Role Create / Update (WIP) / Delete

### 🎉 Party Mode

>🚧 WIP, it will come back... soon enough

### ❓ QotD (Question of the Day)

- Everyday, sends a new question in the channel of your choice and pin it. (Provided there are questions in the database)

![qotd](/assets/qotd/qotd.png)

- People can give their own questions

![qotd](/assets/qotd/request.png)


### 🎤 TempVoice

- Auto manage voice channels, deletes and creates channels so only one is needed
![create](/assets/tempVoice/create.gif)

The voice owner can : 
- Lock the channel to everyone
![lock](/assets/tempVoice/lock.gif)

- Transfer ownership
![transfer-ownership](/assets/tempVoice/transfer-ownership.gif)

- Ban someone in particular (will kick them out)
![voice-ban](/assets/tempVoice/voice-ban.gif)

- Set a user limit to the channel
![limit](/assets/tempVoice/limit.gif)

### 📺 Twitch

- Alerts for a Twitch Streamer when going live or changing category 
![alert](/assets/twitch/alert.png)

- Add a custom role when a friend goes live and removes it once they stop.


## Misc

- Some memes stuff like "hello there" and some private jokes
![hello_there](/assets/hello_there.png)

# 🏗️ Development

env: 
```
DISCORD_APP_ID
DISCORD_TOKEN
MONGO_URI
NODE_ENV # will push the commands to your server if set to production
REDIS_HOST
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
WEBHOOK_LOG_URL
```

```
npm i
npm start
```

# 💻 Production

```
npm install --omit=dev
npm start
```

# 🐋 Docker

To start your application:

```
docker-compose up -d
```

To shut down your application:

```
docker-compose down
```

To view your application's logs:

```
docker-compose logs
```

From Dockerhub:
```sh
docker pull adanea/adroid_ea:latest
```

For the full command list please view the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/cli/).

# 📜 Documentation

- [discord.js](https://old.discordjs.dev/#/docs/discord.js/14.11.0/general/welcome)
