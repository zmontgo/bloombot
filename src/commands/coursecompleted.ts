import config from "../config";

export const execute = async (client, message) => {
  const guild = client.guilds.cache.get("244917432383176705");
  const member = guild.members.cache.get(message.author.id);

  if (await member.roles.cache.find(r => r.id === config.roles.courseEnrolled)) {
    var role = await guild.roles.cache.find(role => role.id === config.roles.courseCompleted);
    if (!role) return await message.channel.send(":x: An error occured. Couldn't find the course completed role.");
    await member.roles.add(role);

    return await message.channel.send(":white_check_mark: Congrats! You have the course completed role.")
  }

  return await message.channel.send(":x: You aren't enrolled in the course. Make sure you have the proper role.")
};

export const architecture = {
  name: 'coursecompleted',
  aliases: ['cc'],
  module: 'Hidden',
  description: 'Mark that you\'re done with the course. It\'s on the honor system, so make sure you\'re actually done with it!',
  usage: ['coursecompleted']
};
