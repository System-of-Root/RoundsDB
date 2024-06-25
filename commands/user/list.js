const {
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require('discord.js')
const settings = require('../../utils/settings.js');
const database = require('../../utils/database.js');
const embeds = require('../../utils/Embeds.js');
const {waitUntil} = require('async-wait-until');


module.exports = {
  name: 'list',
  description: 'Get a list of all cards from a mod',
  options: [
          {
                  name: 'mod',
                  description: 'The name of the mod',
                  type: ApplicationCommandOptionType.String,
                  required: false,
          }
  ],

  callback: async (client, interaction) => {
	  await interaction.deferReply({ ephemeral: settings.ephemeral(interaction.guildId) });
	  var mod = interaction.options.get("mod");
	  if(mod == null || mod == undefined){
		await interaction.editReply(embeds.list({title: "Card mods avalible in the database:"}, await database.mods()));
	  }else{
		var cards = await database.list(mod.value);
		if(cards.length){
			var data = {};
			var ready = false;
			database.get("SELECT * FROM Mods WHERE Mod = $MOD", {$MOD: mod.value}, (e,r)=>{
				data.title = r.Mod;
				data.url = r.Url==""?null:r.Url;
				data.image = `./database/modicons/${r.Mod}.png`;
				ready = true;
			});
			await waitUntil(()=>ready);
			await interaction.editReply(embeds.list(data, cards));
		}else{
			await interaction.editReply(embeds.list({title: "Mod not found. \nCard mods avalible in the database:"}, await database.mods()));
		}
	  }
  }

};


