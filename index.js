const { token, openaiApiKey } = require('./config.json');

const { Client, Events, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Replace with your Discord Bot Token and OpenAI API Key in the .env file.

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        // GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages, // Add any other intents required by your bot
    ]
});

client.once(Events.ClientReady, () => {
    console.log('Bot is Online!');
});

client.on("message", async message => {
  console.log("--------", message);
    if (message.author.bot) return; // Ignore bot messages

    if (message.content.startsWith('!ask')) {
        const userQuestion = message.content.replace('!ask', '').trim();
        if (userQuestion.length === 0) {
            message.channel.send('Please ask a question after the `!ask` command.');
            return;
        }

        try {
            const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
                prompt: userQuestion,
                max_tokens: 150, // Adjust the token limit as needed
                n: 1,
                stop: null,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`
                }
            });

            const gptResponse = response.data.choices[0].text.trim();
            message.channel.send(gptResponse);
        } catch (error) {
            console.error('Error with OpenAI API:', error);
            message.channel.send('There was an error processing your request.');
        }
    }
});

client.login(token);