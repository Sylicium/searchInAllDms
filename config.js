module.exports = {
    DiscordToken: "", // here your discord account token (no token grab i promess you uwu)
    sleepBetween: 2000, // defaults 2000ms | Time to wait between channel searching
    wait_X_every_Y: {
        X: 182*1000, // milliseconds to wait. Recommended: 182000ms (3min) | 429 Rate limited: up this value
        Y: 30, // every how many steps it should wait. Recommended: 30 | One step = Searching messages in 1 dm channel | 429 Rate limited: down this value
    },
    searchParams: {
        content: "hello man" // content to search in messages
    },
    discordURI: "https://cdn.discord.com" // https://cdn.discord.com | https://ptb.discord.com | https://canary.discord.com
}