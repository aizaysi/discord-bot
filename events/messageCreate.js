const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return; // Ignore messages from bots

    // Help command
    if (message.content === '!help') {
      message.channel.send('Commands:!ask [your question] - Ask anything to GPT-4 !ping - To check if the bot is online');
      return;
    }

    // !ping Command
    if (message.content === '!ping') {
      message.channel.send('Pong!');
      return;
    }

    // !ask Command
    if (message.content.startsWith('!ask')) {
      const userQuestion = message.content.replace('!ask', '').trim();
      if (userQuestion.length === 0) {
        message.channel.send('Please ask a question after the `!ask` command.');
        return;
      }

      try {
        const response = await axios.post('https://api.openai.com/v1/engines/gpt-4/completions', { // Adjust endpoint if using GPT-3
          prompt: userQuestion,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.7,
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
  },
};