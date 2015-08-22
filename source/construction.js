module.exports = {
	buildRoads: function(from, to)
	{
		var path = Game.spawns.Spawn1.room.findPath(from, to, { ignoreCreeps: true });
		console.log(path.length);
		for(var i in path)
		{
			var result = Game.spawns.Spawn1.room.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
			if(result == ERR_INVALID_TARGET) {
			    //console.log("invalid target.");
			} else if(result == ERR_INVALID_ARGS) {
			    //console.log("invalid args.");
			} else if(result == ERR_RCL_NOT_ENOUGH) {
			    //console.log("RCL not enough.");
			}
		}
	},

	buildRoadToAllSources: function()
	{
		var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);

        console.log(sources.length);
		for(var i in sources)
		{
		    console.log(sources[i].pos);
		    console.log(Game.spawns.Spawn1.pos);
			this.buildRoads(Game.spawns.Spawn1.pos, sources[i].pos);
		}
	}
};