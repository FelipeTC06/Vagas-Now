require('dotenv').config(); 
const token = process.env.TELEGRAM_BOT_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  bot.sendMessage(chatId, `${messageText}`);
});

function sendMessageToChat(chatId, message) {
    bot.sendMessage(chatId, message);
}

module.exports = {bot, sendMessageToChat};
