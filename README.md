# 📖 Introduction

This is a discord bot primarly made for my discord server (this is why some values are hard coded) but feel free to use the code for yourself.

<p align="center">
  <a href="#">
    <img src="https://media.discordapp.net/attachments/763373898779197481/887428474766229574/worldbot.png"  alt="Discord bot icon" width="50%" style="border-radius:5000px"/>
  </a>
</p>


<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  
</div>
<div align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/adan-ea/adroid_ea?style=flat-square">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/adan-ea/adroid_ea?style=flat-square">
  
</div>

# ✨ Features

## Modules 

### Events management
> Sooo much TODO

### Moderation 
> TODO
>- Purge channel

### Notifications
- Twitch Alert for a Twitch Streamer when going live or changing category 
> TODO 
>- custom role for streamers 
>- Private logs
>   - Message update, delete
>   - Nickname update
>- Public logs
>   - Member arrival, departure

### Voices
> TODO : Update this screenshot. It's better now
- Auto manage voice channels, deletes and creates channels so only one is needed
![image](/assets/voice-channel-feature.gif)


### Misc

- Some memes stuff like "hello there" and some private jokes
![image](/assets/hello_there.png)

# To-Do
- EVERYTHING FFS

# 🏗 Development

env: 
```
MONGO_URI
DISCORD_TOKEN
DISCORD_CLIENT_ID
# You will get an error but these are not required
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
```

```
npm install
npm run dev
```

# 💻 Production

```
npm install --production
npm start
```

# 🐋 Docker

To start your application:
> Not actually working, but i intend on setting it up :')
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
