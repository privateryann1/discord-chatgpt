const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    // Setup Slash Command
    data: new SlashCommandBuilder()
        .setName('chat-gpt')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Ask ChatGPT a prompt')
                .setRequired(true))
        .setDescription('Asks ChatGPT the given prompt.'),
    // Interaction Function
    async execute(interaction) {
        // Error if no prompt was given
        const prompt = interaction.options.getString('prompt') ?? 'No prompt was provided';
        // Vars
        const { ChatGPTAPI } = await import('chatgpt');
        const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });
        const randomNum = Math.floor(Math.random() * 1000);
        let res;
        let replyText;
        let creator_button;
        let chatgpt_button;
        let followUp = true;
        // Create Thread
        const thread = await interaction.channel.threads.create({
            name: `ChatGPT-${randomNum}`,
            autoArchiveDuration: 60,
            reason: 'ChatGPT conversation',
        });
        await interaction.reply({ content: 'Thread created.' });
        // Join Thread
        if (thread.joinable) await thread.join();
        // Create 'end-conversation' Button
        const end_button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('end-conversation')
            .setLabel('End Conversation')
            .setStyle(ButtonStyle.Danger),
            );
            // Handle 'end-conversation' button interaction
            const filter = i => i.customId === 'end-conversation' && i.user.id === interaction.user.id;
            const collector = thread.createMessageComponentCollector({ filter, time: 180000 });
            collector.on('collect', async i => {
                await i.update({components: [creator_button, chatgpt_button]})
                thread.send('Thanks for chatting.');
                await thread.leave();
                thread.setLocked(true);
                followUp = false;
            });
            collector.on('end', collected => console.log(`Collected ${collected.size} items`));
            // Create 'creator' Button
            creator_button = new ActionRowBuilder()
		    .addComponents(
                new ButtonBuilder()
                .setLabel('Bot Creator')
                .setStyle(ButtonStyle.Link)
                .setURL('https://privateryan.me')
		        );
            // Create 'chatgpt' Button
            chatgpt_button = new ActionRowBuilder()
		    .addComponents(
                new ButtonBuilder()
                .setLabel('ChatGPT')
                .setStyle(ButtonStyle.Link)
                .setURL('https://openai.com/blog/chatgpt/')
		        );
        thread.send({content: 'Hi, allow me a moment to process your request. You can reply with a follow up prompt by simply typing your question.\n\nThe conversation will auto-timeout in 60 seconds if no activity has occurred.\n\n', components: [end_button, creator_button, chatgpt_button]});
                // Call API after thread creation for <3 sec rule
        try {
            res = await api.sendMessage(prompt);
            replyText = `**Prompt:** ${prompt}\n\n**Response:** ${res.text}`;
            thread.send(replyText);
        } catch (error) {
            console.error('Error sending message to ChatGPT API:', error);
            thread.send('Error sending message to ChatGPT API');
        }
        // Follow Up Loop
        while (followUp) {
            const filter = (m) => {
                if (!followUp) {
                    return false;
                }
                return m.author.id === interaction.user.id;
            };
            const messages = await thread.awaitMessages({ filter, max: 1, time: 60000 });
            if (!messages.size && followUp) {
                followUp = false;
                thread.send('Auto timeout, thanks for chatting.');
                continue;
            }
            let message = messages.first();
            let followUpPrompt = message.content;
            try {
                res = await api.sendMessage(followUpPrompt, {
                    conversationId: res.conversationId,
                    parentMessageId: res.id
                });
                replyText = `**Prompt:** ${followUpPrompt}\n\n**Response:** ${res.text}`;
                thread.send(replyText);
            } catch (error) {
                console.error('Error sending message to ChatGPT API:', error);
                thread.send('Error sending message to ChatGPT API');
            }   
        }
    }
}