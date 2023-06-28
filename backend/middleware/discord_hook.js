const { WebhookClient } = require('discord.js');
const axios = require('axios');

const webhookClient = new WebhookClient({ id: '1123501472143904768', token: 'pVdi-x0ZN5uvzyu_O7Qsu6Upks0lXb1N2nqiqYhea8NxZ8B6hkoCKEwK9J39Tx1NQyB0' });

function sendWebhookMessage(message) {
  axios.post(webhookClient.url, {
    content: message
  })
    .then(response => {
      console.log('Webhook message sent:', response.data);
    })
    .catch(error => {
      console.error('Error sending webhook message:', error);
    });
}


module.exports = {
  sendWebhookMessage
};