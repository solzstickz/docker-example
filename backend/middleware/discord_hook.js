const { Webhook, MessageBuilder } = require('discord-webhook-node');
const os = require('os');
require("dotenv").config();
function sendWebhookMessage(title,author_image) {
  const hook = new Webhook("https://discord.com/api/webhooks/1123501472143904768/pVdi-x0ZN5uvzyu_O7Qsu6Upks0lXb1N2nqiqYhea8NxZ8B6hkoCKEwK9J39Tx1NQyB0");
  const embed = new MessageBuilder()
    .setTitle(title)
    .setAuthor('9TAIL-MANGA', 'https://sv3.9tailmanga.com/thumnails/9TAILMANGA-B%20(2).png', process.env.WEB_FRONT)
    .setURL(process.env.WEB_BACKEND)
    .setColor('#6c2bd9')
    .setThumbnail(author_image)
    .setTimestamp();
  
  hook.send(embed);
}

function sendWebhookMessageServer() {

  const totalMemoryBytes = os.totalmem();
  const freeMemoryBytes = os.freemem();
  const usedMemoryBytes = totalMemoryBytes - freeMemoryBytes;
  const usedMemoryPercentage = (usedMemoryBytes / totalMemoryBytes) * 100;
  const cpuModel = os.cpus()[0].model;
const cpuCores = os.cpus().length;

console.log(`CPU Model: ${cpuModel}`);
console.log(`CPU Cores: ${cpuCores}`);
  
  
  const cpuUsagePercentage = getCPUUsagePercentage();
  console.log(`Used Memory: ${cpuUsagePercentage.toFixed(2)}%`);
  console.log(`CPU Usage: ${cpuUsagePercentage.toFixed(2)}%`);
  if (cpuUsagePercentage >= 70 || usedMemoryPercentage >= 70 ) {
    DiscordRes(cpuUsagePercentage,usedMemoryPercentage)
  }
  
  function getCPUUsagePercentage() {
    const cpuUsage = os.cpus().reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((1 - idle / total) * 100);
    }, 0);
    return cpuUsage / cpuCores;
  }
  function DiscordRes(cpuUsagePercentage,usedMemoryPercentage){
    const hook = new Webhook("https://discord.com/api/webhooks/1127920239418548264/zvJTMetCabmXkEPL8DPVgjdC5Sc4TiyNb_dJwaCa65V_CLb6kDk3PJxbuAZaD82l9clV");
  const embed = new MessageBuilder()
    .setTitle(`CPU Model: ${cpuModel}\nCPU Usage: ${cpuUsagePercentage.toFixed(2)}%\nRAM usage: ${usedMemoryPercentage.toFixed(2)}%`)
    .setAuthor('9TAIL-MANGA', 'https://sv3.9tailmanga.com/thumnails/9TAILMANGA-B%20(2).png', process.env.WEB_FRONT)
    .setURL(process.env.WEB_BACKEND)
    .setColor('#6c2bd9')
    .setTimestamp();
  
  hook.send(embed);
  }
}

module.exports = {
  sendWebhookMessage,
  sendWebhookMessageServer
};
