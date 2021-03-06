import { prisma } from '../databaseFiles/connect';
import { reactionCheckAction } from '../eventActions/reactions';
import { Permissions } from 'discord.js';
import config from '../config';

export = async (client, message) => {
  if (message.author.bot) return;

  const args = message.content.split(/\s+/g); // Return the message content and split the prefix.

  var prefix;

  try {
    prefix = await prisma.serverSetup.findUnique({ where: { guild: message.guild.id }});
    prefix = prefix.prefix; // Get the 'prefix' string from the JSON object if found. If not will return error for trying to get null
  } catch {
    prefix = '.';
  }

  if (
    args[0] === `<@!${client.user.id}>` ||
    message.content.startsWith(`<@!${client.user.id}>`)
  ) {
    prefix = `<@!${client.user.id}>`;
    if (args[0] === prefix) {
      args.shift();
      args[0] = prefix + args[0]; // Dirty fix
    }
  }

  const command =
    message.content.startsWith(prefix) && args.shift().slice(prefix.length);

  if (command) {
    const commandfile =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));

    if (commandfile && commandfile.architecture.module !== "Hidden") {
      message.channel.sendTyping();

      var global_admins;
      
      if (message.guild) {
        global_admins = await prisma.serverSetup.findUnique({
          where: {
            guild: message.guild.id,
          }
        });
      }

      const adminCommand: boolean = !!(commandfile.architecture.admin && commandfile.architecture.admin === true);
      const modCommand: boolean = !!(commandfile.architecture.moderator && commandfile.architecture.moderator === true);

      const isPrivilegedCommand = adminCommand || modCommand;

      const isGlobalAdmin: boolean = !!(global_admins && global_admins.admins && global_admins.admins.indexOf(message.author.id) !== -1);
      const isNormalAdmin: boolean = !!(message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR));
      const isMod: boolean = !!(message.member.roles.cache.has(config.roles.moderator));

      const isPrivilegedUser = isGlobalAdmin || isNormalAdmin || isMod;

      // Check if user has Discord admin permissions or is in global admin database
      if (message.guild && isPrivilegedCommand && !isPrivilegedUser) {
        await message.channel.send(
          ":x: You don't have permission to run this command."
        );
      } else if (isPrivilegedCommand && !message.guild) {
        await message.channel.send(
          ":x: You can't run privileged commands in DMs."
        );
      } else {
        await commandfile.execute(client, message, args); // Execute found command
      }
    } else if (commandfile && commandfile.architecture.module === "Hidden" && message.channel.type === "DM") {
      message.channel.sendTyping();

      await commandfile.execute(client, message, args); // Execute found command
    }
  }

  reactionCheckAction.checkIfCorrect(message);
};
