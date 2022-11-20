const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../useful/embed');
const { promise } = require('zod');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription('Creates a custom announcement')
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Give the title")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Give the description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ping")
        .setDescription("Select the ping")
        .setRequired(false)
        .addChoice("everyone", "here")
        .addChoice("here", "here")
    ),
    rolePerms: ['954815725585965077', '954815810650656899'],
    async execute(interaction, client) {
        const description = interaction.options.getString("description") || ''
        const title = interaction.options.getString("title") || ''
        const embd = await embed(title, description)

        if (interaction.options.getString('ping')) {
            client.channels.cache.get(interaction.channelId).send("@"+ interaction.options.getString('ping')).then(msg => {
                msg.delete()
              })
        }
        interaction.followUp({embeds: [embd], ephemeral: true})
    }
}
