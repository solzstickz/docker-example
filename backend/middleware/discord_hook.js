const { Webhook, MessageBuilder } = require('discord-webhook-node');
require("dotenv").config();
function sendWebhookMessage(title,author_image) {
  const hook = new Webhook("https://discord.com/api/webhooks/1123501472143904768/pVdi-x0ZN5uvzyu_O7Qsu6Upks0lXb1N2nqiqYhea8NxZ8B6hkoCKEwK9J39Tx1NQyB0");
  const embed = new MessageBuilder()
    .setTitle(title)
    .setAuthor('9TAIL-MANGA', 'https://sv1.skz.app/thumnails/9TAILMANGA-B%20(2).png', process.env.WEB_FRONT)
    .setURL(process.env.WEB_BACKEND)
    .setColor('#6c2bd9')
    .setThumbnail(author_image)
    .setTimestamp();
  
  hook.send(embed);
}

module.exports = {
  sendWebhookMessage
};
