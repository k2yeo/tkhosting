const profileschema = require('../schemas/profile-schema')
const { SlashCommandBuilder } = require('@discordjs/builders');
const mongo = require('../mongo');
const embed = require('../useful/embed');
const roblox = require('noblox.js')
const getUserName = require('../useful/getUserName');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("addflight")
    .setDescription('Adds attendance to a Personnel Profile')
    .addIntegerOption(option => option.setName('flights').setDescription('Amount of flights').setRequired(true))
    .addUserOption(option => option.setName('user0').setDescription('Select a user').setRequired(true))
    .addUserOption(option => option.setName('user1').setDescription('Select a user'))
    .addUserOption(option => option.setName('user2').setDescription('Select a user'))
    .addUserOption(option => option.setName('user3').setDescription('Select a user'))
    .addUserOption(option => option.setName('user4').setDescription('Select a user'))
    .addUserOption(option => option.setName('user5').setDescription('Select a user'))
    .addUserOption(option => option.setName('user6').setDescription('Select a user'))
    .addUserOption(option => option.setName('user7').setDescription('Select a user'))
    .addUserOption(option => option.setName('user8').setDescription('Select a user'))
    .addUserOption(option => option.setName('user9').setDescription('Select a user'))
    .addUserOption(option => option.setName('user10').setDescription('Select a user'))
    .addUserOption(option => option.setName('user11').setDescription('Select a user'))
    .addUserOption(option => option.setName('user12').setDescription('Select a user'))
    .addUserOption(option => option.setName('user13').setDescription('Select a user'))
    .addUserOption(option => option.setName('user14').setDescription('Select a user'))
    .addUserOption(option => option.setName('user15').setDescription('Select a user'))
    .addUserOption(option => option.setName('user16').setDescription('Select a user'))
    .addUserOption(option => option.setName('user17').setDescription('Select a user'))
    .addUserOption(option => option.setName('user18').setDescription('Select a user'))
    .addUserOption(option => option.setName('user19').setDescription('Select a user'))
    .addUserOption(option => option.setName('user20').setDescription('Select a user'))
    ,
    rolePerms: ['954815725585965077', '954815810650656899'],
    async execute(interaction, client) {
        let username;
        for(var i = 0; i < 21; i++){
            let id;
            try {
            user = interaction.options.getUser('user'+i);
            if (!user) {continue}
            username = await getUserName(interaction, client, i)
            if (username) {
            id = await roblox.getIdFromUsername(username);
            }
        } catch (e) {
            console.log(e)
            const usernameembd = await embed('Error!', username + ' is not a valid ROBLOX username!')
            interaction.followUp({ embeds: [usernameembd], ephemeral: true})
            continue
        }
        let times = interaction.options.getInteger('flights')
    await mongo().then(async (mongoose) => {
  try {
const result = await profileschema.findOne({ _id: id })
let FlightsAttended;
let Balance;
if (!result) {
     FlightsAttended = 1*times;
    Balance = 30*times;
    Snapshots = 'N/A';
    Activity = 'Active';
}else {
     FlightsAttended = result.FlightsAttended + 1*times;
     Balance = result.Balance + 30*times;
     Snapshots = result.Snapshots;
     Activity = result.Activity;
}

 await profileschema.findOneAndUpdate({
     _id: id,
 },{
    _id: id,
    FlightsAttended,
    Balance,
    Snapshots,
    Activity,
 },{
     upsert: true
 })
 const userembd = await embed('Success!', username + ' gained '+times+' flight(s)!')
 interaction.followUp({embeds: [userembd], ephemeral: true})
  } finally {
     mongoose.connection.close()
  } 
})
    }
    
}}
