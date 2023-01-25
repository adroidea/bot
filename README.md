# 📖 Introduction

This is a discord bot primarly made for my discord server (this is why some values are hard coded) but feel free to use the code for yourself.

# ✨ Features

- Uses slash (/) commands
- Log certain important events like GuildMemberJoin/Leave
- Auto manage voice channels, deletes and creates channels so only one is visible
![image](/assets/voice-channel-feature.gif)

- Some memes stuff like "hello there" and some private jokes
![image](/assets/hello_there.png)

- Sends a message whenever the (mine) twitch channel **Adan_ea** is live or when i change game mid-stream
- help command
- if used with pm2 the /reload command will reload the bot when it crashs
- purge command 

# 🏗 Development

env: 
```
MONGO_URI
DISCORD_TOKEN
DISCORD_DEV_GUILD
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
npm run build
npm run start
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
docker pull adanea/adroid_ea:<version>
```

For the full command list please view the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/cli/).

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
