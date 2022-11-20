module.exports = async function (interaction, client, extraName = '') {
    user = interaction.options.getUser("user"+extraName);
    if (user === undefined) {return}
    guild = client.guilds.cache.get(interaction.guildId);
    member = guild.members.cache.get(user.id);
    username = member.nickname;
    if (username === null) {
      username = user.username;
    }
    return username
}