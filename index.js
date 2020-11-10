const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const channelStore = getModule(['getAllChannels'], false);
const unreadAcks = getModule(['ack', 'ackCategory'], false);
const messageStore = getModule(['hasUnread', 'lastMessageId'], false);

module.exports = class MarkAllRead extends Plugin {
   startPlugin() {
      powercord.api.commands.registerCommand({
         command: 'read',
         aliases: ['markread', 'ack'],
         description: 'Marks everything as read.',
         usage: '{c}',
         executor: this.executor
      });
   }

   async executor() {
      const unreads = Object.values(channelStore.getAllChannels()).map(c => ({
         channelId: c.id,
         messageId: messageStore.lastMessageId(c.id)
      }))
      return await unreadAcks.bulkAck(unreads);
   }
}

