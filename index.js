const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { getMutableGuildAndPrivateChannels } = getModule(['getChannel'], false);
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

   pluginWillUnload() {
      powercord.api.commands.unregisterCommand('read');
   }

   async executor() {
      let channels = Object.keys(getMutableGuildAndPrivateChannels());
      const unreads = channels.map(c => ({
         channelId: c,
         messageId: messageStore.lastMessageId(c)
      }));
      return await unreadAcks.bulkAck(unreads);
   }
};

