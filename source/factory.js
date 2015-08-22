//factory
var factory = {
   harvesters: {
        ratio: 0.50,
	    current: 0.00,
	    required: 0.00
    },
    
    builders: {
        ratio: 0.50,
	    current: 0.00,
	    required: 0.00
    },
    
    maxPopulation: 4,
    
    initialize: function() {
        var total = 0;
	    
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            
            total = total + 1;
            
            if(!creep.memory.role) {
                creep.memory.role = 'harvester';
            }
            
            if(creep.memory.role == 'harvester') {
                this.harvesters.current = this.harvesters.current + 1;
            }
            
            if(creep.memory.role == 'builder') {
                this.builders.current = this.builders.current + 1;
            }
        }
    },
    
    spawn: function()
	{
	    this.harvesters.required = this.maxPopulation * this.harvesters.ratio - this.harvesters.current;
	    this.builders.required = this.maxPopulation * this.builders.ratio - this.builders.current;
	    
	    if(this.harvesters.required > 0) {
	        var id = 0;
	        var name = null;
	        while(name != null) {
	            name = "harvester" + id;
	            if(Game.creeps[name] != undefined) {
	                name = null;
	                id = id + 1;
	            }
	        }
	        
	        if(this.canSpawn(Game.spawns.Spawn1, [WORK, WORK, WORK, CARRY, MOVE])) {
	            Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, CARRY, MOVE], name, { role: 'harvester' } );
	        }
	    }
	    
	    if(this.builders.required > 0) {
	        var id = 0;
	        var name = null;
	        while(name != null) {
	            name = "builder" + id;
	            if(Game.creeps[name] != undefined) {
	                name = null;
	                id = id + 1;
	            }
	        }
	        
	        if(this.canSpawn(Game.spawns.Spawn1, [WORK, WORK, CARRY, MOVE])) {
	            Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], name, { role: 'builder' } );
	        }
	    }
	},
    
    canSpawn: function(spawn, roles) {
	    return (spawn.spawning == null || spawn.spawning == undefined) && spawn.energy >= this.spawnCost(roles);
	},
	
	spawnCost: function(roles) {
	    var total = 0;
	    for(var role in roles) {
	        if(role == MOVE) {
	            total += 50;
	        }
	        if(role == WORK) {
	            total += 20;
	        }
	        if(role == CARRY) {
	            total += 50;
	        }
	        if(role == ATTACK) {
	            total += 100;
	        }
	        if(role == RANGED_ATTACK) {
	            total += 150;
	        }
	        if(role == HEAL) {
	            total += 200;
	        }
	        if(role == TOUGH) {
	            total += 5;
	        }
	    }
	    return total;
	}
};

module.exports = factory;