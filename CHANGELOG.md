# Changelog

All notable changes to this project will be documented in this file.

## 🏗️ [Unreleased]

### ✨ Added
❄️ Twitch: Now can disable Category Change notification [[#75](https://github.com/adroidea/bot/issues/75)]

❄️ Twitch: Now can ignore some categories for the Category Change notification [[#75](https://github.com/adroidea/bot/issues/75)]

### 🧱 Changed

### 🚮 Removed

### 🐛 Fixed
❄️ Twitch: Auto role not auto roling properly

❄️ Twitch: Text with markdown sensible characters will now be escaped

## 🚀 [4.0.0] - 2024-01-12

### ✨ Added

❄️ AuditLogs: guildBan Add/Remove; GuildRole Create/Update/Delete; Message Bulk Delete - [[#67](https://github.com/adroidea/bot/issues/67)]

❄️ AuditLogs: Message Bulk Delete now indicates how many messages were deleted and from whom

### 🧱 Changed

❄️ AuditLogs: message Update/Delete; guildMember Add/Update/Remove - [[#67](https://github.com/adroidea/bot/issues/67)]

❄️ Twitch: separate Alerts and auto role

### 🚮 Removed

❄️ `/r` Never used

### 🐛 Fixed
❄️ Twitch: Reworked, will refresh token by itself and no longer use [node-twitch](https://github.com/Plazide/node-twitch)

## 🚀 [3.7.0] - 2023-11-25

### ✨ Added

❄️ A beautiful changelog via discord (I promise it won't be spammed) - [[#64](https://github.com/adroidea/bot/issues/64)]

❄️ `/report` to report a bug or suggest a great new feature

❄️ `/roll` for our RPG-loving pals. (Don't let anyone tell you that I recycled that from another project.)

❄️ The tempVoice module is getting a hell of a boost:

  - New control interface

  - White and black lists, now in memory bliss. No more repetitive "Live, live, die!" scenarios - [[#60](https://github.com/adroidea/bot/issues/60)]

  - Do you want your voice channel to be set private automatically? It's possible now! - [[#65](https://github.com/adroidea/bot/issues/65)]

  - Channel names can be customized by the server owner - [[#65](https://github.com/adroidea/bot/issues/65)]

### 🚮 Removed

❄️ The bot's reaction to the JPPFC term (was only available for one server)


## 🚀 [3.6.0] - [0.0.1]

### ✨ Added

❄️ A lot of stuff i don't remember. And i'm too lazy to check every commit :')

[Unreleased]: https://github.com/adroidea/bot
[4.0.0]: https://github.com/adroidea/bot/releases/tag/v4.0.0
[3.7.0]: https://github.com/adroidea/bot/releases/tag/v3.7.0
[3.6.0]: https://github.com/adroidea/bot/releases/tag/v3.6.0
[0.2.0]: https://github.com/adroidea/bot/releases/tag/v0.2.0
[0.1.1]: https://github.com/adroidea/bot/releases/tag/v0.1.1
[0.1.0]: https://github.com/adroidea/bot/releases/tag/v0.1.0
[0.0.1]: https://github.com/adroidea/bot/releases/tag/v0.0.1
