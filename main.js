const { MessageEmbed, Client } = require('discord.js');
const log = new Client();
const config = require('./conf.json');
const tmi = require('tmi.js');
const tw = new tmi.Client({
    channels: [config.channel],
    options: { debug: true, /*messagesLogLevel: "trace"*/ },
    //if u dont want to logging messages add to options -> messagesLogLevel: "trace"
    connection: {
        secure: true,
        reconnect: true
    },
});
tw.connect()
log.on('ready', () => {
    console.log(`${log.user.username} connected`)
})
const othch = log.channels.cache.get(config.log_channel_oth) //others channel
const chatch = log.channels.cache.get(config.log_channel_chat) //chat channel

tw.on('submysterygift', (channel, username, numbOfSubs, methods, userstate) => {
    othch.send(`${username}, gifting ${numbOfSubs} subscriptions!`);
});
tw.on('subgift', (channel, username, streakMonths, recipient, methods, tags) => {
    othch.send(`${username}, gifted subscriptions to ${recipient}`)
});
tw.on('clearchat', (channel) => {
    othch.send('den')
})
tw.on('subscription', (channel, username, methods, message, userstate) => {
    othch.send(`**${userstate['display-name']}** has just subscribed to ${channel.slice(1)}!`)
})
tw.on('resub', (channel, username, months, message, userstate, methods) => {
    const month = userstate['msg-param-streak-months'];
    //sometimes months returning null or true not number
    if (month === undefined || month === true) {
        othch.send(`**${userstate['display-name']}** has subscribed to ${channel.slice(1)} for **${userstate['msg-param-cumulative-months']}** months in a row!`)
    } else {
        othch.send(`**${userstate['display-name']}** has subscribed to ${channel.slice(1)} for **${month}** months in a row!`)
    }
})
tw.on('hosting', (channel, target, viewers) => {
    othch.send(`${channel.slice(1)}, hosting to **${target}** ${viewers ? 'with '+viewers : ''}!`)
})
tw.on('hosted', (channel, username, viewers, autohost) => {
    othch.send(`${username}, hosting to **${channel.slice(1)}** ${viewers ? 'with '+viewers : ''}!`)
})

tw.on('message', (channel, userstate, message, self, tags) => {
    function msg(name, mesa, color, photo) {
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle('Join Chat')
            .setURL('https://twitch.tv/' + channel.slice(1))
            .setAuthor(name, photo, 'https://twitch.tv/' + name)
            .setDescription("**" + mesa + "**")
            .setFooter(Date());
        chatch.send(embed);
    }

    if (userstate['id'] === userstate['room-id']) {
        msg(userstate['display-name'], message, "#fc0303", "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3")
    } else if (userstate['mod']) {
        msg(userstate['display-name'], message, "#04d43c", "https://i.imgur.com/q2kH9j0.png")
    } else if (!userstate['mod'] && userstate['subscriber']) {
        msg(userstate['display-name'], message, "#5f1b9e", "https://i.imgur.com/HvIbqj0.png")
    } else {
        msg(userstate['display-name'], message, "#608068", "https://static-cdn.jtvnw.net/user-default-pictures-uv/ebe4cd89-b4f4-4cd9-adac-2f30151b4209-profile_image-70x70.png")
    }


})
log.login(config.token)
