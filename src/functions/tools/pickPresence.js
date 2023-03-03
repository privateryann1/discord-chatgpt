const { ActivityType } = require('discord.js')

module.exports = (client) => {
    client.pickPresence = async () => {
        const options = [
            {
                type: ActivityType.Watching,
                text: 'Numbers',
                status: 'dnd'
            },
            {
                type: ActivityType.Listening,
                text: `My Favorite Songs`,
                status: 'dnd'
            },
            {
                type: ActivityType.Playing,
                text: 'Code',
                status: 'dnd'
            }
        ]

        const option = Math.floor(Math.random() * options.length)

        client.user.setPresence({
            activities: [{
                name: options[option].text,
                type: options[option].type,
            }],
            status: options[option].status,
        })
    }
}