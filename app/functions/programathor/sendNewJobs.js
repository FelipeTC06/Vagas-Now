require('dotenv').config();
const { sendMessageToChat } = require('../telegram/bot-integration');
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendNewJobs(newJobs) {
    console.log('chatId', CHAT_ID);
    if (newJobs.length === 0) {
        sendMessageToChat(CHAT_ID, 'Nenhuma nova vaga encontrada.');
    }
    const message = newJobs.map(({ link, nome, pay, tags }) => `
        ${nome}
        Link: https://programathor.com.br${link}
        Pagamento: ${pay || 'Não especificado'}
        Stacks: ${tags.join(', ')}
    `);

    message.forEach(jobMessage => sendMessageToChat(CHAT_ID, jobMessage));
}

module.exports = sendNewJobs;