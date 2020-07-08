import Command, { deleteMessage, sendMessage } from '../command';
import { Message } from 'discord.js';
import * as Settings from '../../utils/settings';

const SetOffTopicChannel: Command = {
  format: /^((?<command>(setofftopicchannel))\s<#(?<channel>\d+)>)$/,
  execute: async (message: Message, params: { [key: string]: string }) => {
    try {
      if (!message.guild || !message.member) {
        return;
      }

      const devRole: string | null = (await Settings.getByName('developer_role'))?.value || null;
      if (!message.member.hasPermission('ADMINISTRATOR') || (devRole && !message.member.roles.cache.has(devRole))) {
        return;
      }

      await message.delete();

      const channel = message.guild.channels.cache.get(params.channel);
      if (!channel) {
        await deleteMessage(await sendMessage(message, 'el canal no es válido.', params.command));
        return;
      }

      if (await Settings.hasByName('off_topic_channel')) {
        await Settings.update('off_topic_channel', channel.id);
      } else {
        await Settings.create('off_topic_channel', channel.id);
      }

      await deleteMessage(await sendMessage(message, `ahora ${channel} es el canal off-topic.`, params.command));
    } catch (error) {
      console.error('Set off-topic Channel', error);
    }
  },
};

export default SetOffTopicChannel;