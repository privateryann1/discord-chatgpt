module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // When using pterodactyl NodeJS egg, a message is usually required to tell the daemon that the bot is ready.
        console.log(`BOT STARTED`)
        client.pickPresence()
        setInterval(client.pickPresence, 180 * 1000)
    }
}