const {
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require('discord.js');
const settings = require('../../utils/settings.js');
const database = require('../../utils/database.js');
const embeds = require('../../utils/Embeds.js');
const {waitUntil} = require('async-wait-until');

module.exports = {
  name: 'card-full',
  description: "Replies with data about the card using it's FULL name",
  options: [
          {
                  name: 'name',
                  description: 'The name of the card',
                  type: ApplicationCommandOptionType.String,
                  required: true,
          }
  ],

  callback: async (client, interaction) => {
	  await interaction.deferReply({ ephemeral: settings.ephemeral(interaction.guildId) });
	  var id = interaction.options.get("name").value;
	  console.log(id);
	  var valid;
	  database.get("SELECT ID from Cards Where ID=$ID",{$ID: id}, (e,r)=>valid = r != undefined);
	  await waitUntil(() => valid != undefined);
	  if(valid){
		  await interaction.editReply(embeds.card(await(database.card(id))));

	  }else{
		  await interaction.editReply(`\`${id}\` is not a valid card object name`);
	  }
  }
};


