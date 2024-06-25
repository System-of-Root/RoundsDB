const config = require('../../config.json');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');//'../../database/setings.sqlite');
const { waitUntil } = require('async-wait-until');

db.run("CREATE TABLE Settings (serverID int, ephemeral bool)");

module.exports = {
	ephemeral: async (id) => {
		var ret = undefined;
		db.get("SELECT ephemeral FROM Settings WHERE serverID=$ID",{$ID : id},(err,row)=>{
			if(row == undefined){
				ret = true; 
				db.run("INSERT INTO Settings VALUES ($ID,1)",{$ID : id})
			}else{
				ret = row.ephemeral;
			}
		});
		await waitUntil(()=>ret != undefined);
		return ret;
	},
	set: (id,val,interaction) => {
		db.run("INSERT INTO Settings VALUES ($ID,$VAL)",{$ID : id, $VAL : val},()=>{interaction.editReply(val?"Bot set to use ephermeral replies":"Bot set to use message replies")});
	}
};
