# Adroid_ea

## Introduction 

This is a discord bot primarly made for my discord server (this is why some values are hard coded) but feel free to use the code for yourself.

## Features

- Uses slash (/) commands
- Log certain important events like GuildMemberJoin/Leave
- Auto manage voice channels, deletes and creates channels so only one is visible
- Some memes stuff like "hello there" and some private jokes
- Sends a message whenever the (mine) twitch channel **Adan_ea** is live
- help command
- if used with pm2 the /reload command will reload the bot when it crashs
- purge command 

## Config

discord.js: v13 (not up to date)

env: 
```
MONGO_URI
DISCORD_TOKEN
DISCORD_DEV_GUILD
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
```

## Run with Docker
From this project : 
```sh
docker build . -t adanea/adroid_ea:<version>
```

From Dockerhub:
```sh
docker pull adanea/adroid_ea:<version>
```

## Run from source

clone or download this repository

```sh
npm start
```