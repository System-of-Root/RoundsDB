
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	card: (data) => {
		console.log(data);
		var files = [new AttachmentBuilder(`./database/modicons/${data.Mod.Name}.png`).setName("mod.png"), new AttachmentBuilder(`./database/cards/${data.art}.png`).setName("art.png")]
		var embed = new EmbedBuilder()
			.setTitle(data.Name+" ")
			.setDescription(data.Description+" ")
			.setAuthor({ name: data.Mod.Name, iconURL:"attachment://mod.png" , url: data.Mod.Url == ""?null:data.Mod.Url })
			.setColor(`#${data.Theme.Color}`)
			.setImage("attachment://art.png")
			.setFooter({text: data.ID});
		for (let x in data.stats){
			var stat = data.stats[x];
			embed.addFields({name: stat.Amount+" ", value: stat.Stat+" ", inline:false});
		}
		embed.addFields({name: "Rarity", value: data.Rarity, inline:true},
				{name: "Theme", value: data.Theme.Name, inline:true},
				{name: "IsCurse?", value: data.IsCurse == 1?"true":"false", inline:true},
				{name: "AllowMultiple?", value: data.Multiple == 1?"true":"false", inline:true},
				{name: "Hidden?", value: data.Hidden == 1?"true":"false", inline:true},
				{name: "Class", value: data.Class, inline:true}
		);
		if(data.Dependencies != "" && data.Dependencies != null && data.Dependencies != undefined){
			var depensring="{`";
			var depens = [];
			data.Dependencies.split("//").forEach(s=>depens.push(s.split("/").join("`, `")));
			depensring += depens.join("`}{`") + "`}";
			
			embed.addFields({name: "Prerequisit cards:", value: depensring, inline: false});
		}

		return {embeds:[embed],files:files};
	},

	map: (data) => {
		var files = [new AttachmentBuilder(`./database/LevelImages/${data.ID}.png`).setName("map.png")]
		var embed = new EmbedBuilder()
			.setTitle(data.Mod)
			.setDescription(data.Name)
			.setFooter({text: data.ID})
			.setImage("attachment://map.png");
		return {embeds:[embed],files:files};
	},

	list: ({title = null, image = null, url = null}, list) => {
		var embed = new EmbedBuilder()
		var files = []
		if(image){
			files.push(new AttachmentBuilder(image).setName('image.png'))
			embed.setThumbnail("attachment://image.png")
		}
		embed.setTitle(title);
		embed.setURL(url)
		embed.setDescription('```\n'+list.join('\n')+'```')
		return {embeds:[embed],files:files};

	}
}
