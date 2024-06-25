const {
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require('discord.js');
const settings = require('../../utils/settings.js');
const database = require('../../utils/database.js');
const embeds = require('../../utils/Embeds.js');
const {waitUntil} = require('async-wait-until');


module.exports = {
  name: 'card',
  description: 'Replies with data about the card',
  options: [
	  {
		  name: 'name',
		  description: 'The name of the card (Can be a partial name)',
		  type: ApplicationCommandOptionType.String,
		  required: true,
	  },
	  {
		  name: 'mod',
		  description: 'The name of the mod (Must be exact if used)',
		  type: ApplicationCommandOptionType.String,
		  required: false,

	  }
  ],

  callback: async (client, interaction) => {
	  await interaction.deferReply({ ephemeral: settings.ephemeral(interaction.guildId) });
	  var cardName = interaction.options.get("name").value.toUpperCase();
	  var mod = interaction.options.get("mod");
	  var id = undefined;
	  if(mod == null || mod == undefined){
		  database.get("SELECT ID from Cards WHERE Name like $NAMEA ORDER BY Name LIKE $NAMEB DESC",{$NAMEA: "%"+cardName+"%", $NAMEB: cardName+"%"},(e,r) =>{console.log(e);if(r == undefined) id = ""; else id = r.ID; console.log(r);});
	  }else{
		  database.get("SELECT ID from Cards Where Name like $NAMEA AND Mod = $MOD ORDER BY Name LIKE $NAMEB DESC",{$NAMEA: "%"+cardName+"%", $NAMEB: cardName+"%", $MOD: mod.value},(e,r) =>{console.log(e);if(r == undefined) id = ""; else id = r.ID; console.log(r);});
	  }


          await waitUntil(() => id != undefined);
	  console.log(id);
          if(id != ""){
                  await interaction.editReply(embeds.card(await(database.card(id))));

          }else{
                  await interaction.editReply(`Could not find the specified card`);
          }

  }

};


