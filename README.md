# Twitch LOGGER
## Requirements
- Node.js
- NPM
- tmi.js
- discord.js
## Features
- Chat log
- Subscription log
- Resub log
- Hosting log
- Hosted log
- Sub gift log
## Installation
- `$ npm install`
>
- **Edit conf.json file**
```
{
    "channel": "cfyt", //your twitch channel
    "log_channel_chat": "discord channel id for chat log", //discord channel id
    "log_channel_oth": "discord channel id for host, subs (etc) log", //discord channel id
    "token": "discord_token" //discord bot token
}
```


- `$ node main.js`
