const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('/home/r00t/RoundsDB/database/data.db');
const {waitUntil} = require('async-wait-until');

module.exports = {
	
	get: (request,param = {},callback = (e,r)=>{return;}) =>{
		db.get(request,param,callback)
	},

	run: (request,param = {},callback = (e)=>{return;}) =>{
		db.run(request,param,callback)
	},

	all: (request,param = {},callback = (e)=>{return;}) =>{
		db.all(request,param,callback)
	},

	card: async (name) =>{
		var card;
		db.get("SELECT * FROM Cards WHERE Cards.ID=$NAME",{$NAME : name}, (error,row)=>{
			card = row;
		});
		await waitUntil(() => card != undefined);
		db.get("SELECT Mod as Name, URL From Mods Where Mod=$MOD",{$MOD : card.Mod}, (error, row) => {
			card.Mod = row;
		});
		db.get("SELECT Name, Color From Themes where Name=$THEME",{$THEME : card.Theme}, (error, row) => {
			card.Theme = row;
		});
		db.all("SELECT Idex, Amount, Stat, Card FROM Stats WHERE Stats.Card=$NAME",{$NAME : name}, (error,rows)=>{
			card.stats = rows;
		});
		await waitUntil(() => card.stats != undefined && card.Mod.Name != undefined && card.Theme.Name != undefined);
		return card;

	},

	map: async (name) => {
		var data = {}
		db.get("SELECT * from Maps WHERE Name like $NAMEA ORDER by Name != $NAME, Name like $NAMEB DESC",{$NAME: name, $NAMEA: "%"+name+"%", $NAMEB: name+"%"},(error,row) => {
			data.Name = row.Name;
			data.Mod = row.Name;
			data.ID = row.ID
		});
		await waitUntil(() => data != {});
		return data;
	},

	list: async (mod) => {
		var cards = [];
		done = false;
		console.log(mod)
		db.all("SELECT ID from Cards where Mod = $MOD", {$MOD: mod}, (error, rows) => {
			if(rows == undefined){ done = true; return;}
			rows.forEach(r => {
				if(r.ID != undefined)
					cards.push(r.ID);
			});
			console.log(rows);
			console.log(cards);
			done = true;
		});
		await waitUntil(() => done);
		return cards;
	},
	
	mods: async () => {
		var mods = [];
		var done = false;
		db.all("SELECT Mod from Mods ORDER by Mod == 'Vanilla' DESC, Mod == 'unknown', Mod",{},(error, rows)=>{
			if(rows == undefined){ done = true; return;}
			rows.forEach(r => {
				if(r.Mod != undefined)
					mods.push(r.Mod);
			});
			done = true;
		});
		await waitUntil(() => done);
		return mods;
	}

};
