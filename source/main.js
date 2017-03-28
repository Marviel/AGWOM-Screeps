/*TODO
    -Make transporters, such as claimer, wait for a decent number of energy to pop up before they go to the spawner
    -Implement queue structure for energy output sources like spawn1, etc. 
    -Make collectors same as storers, if there is a memory module on the map.
    -ice: Structure Layouts
    -Merge builders and repairmen, and switch between jobs depending on situation
    -maybe merge claimers with builders and repairmen too?
    -Make repairmen repair the right things...
    -ice: Make harvesters in rooms without extensions spawn with few attachments... same for collectors.
    -Make hash from body-part name to body-part cost
*/
// Your code goes here...
var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var claimer = require('claimer');
var elderly = require('elderly');
var storer = require('storer');
var repairman = require('repairman');
var collector = require('collector');

Memory.max_creep_count = 25;
Memory.min_harvester_count = 2;
Memory.min_claimer_count = 2;
Memory.min_builder_count = 2;
Memory.min_storer_count = 3;
Memory.min_repairman_count = 1;
Memory.min_collector_count = 2;

var guardpos = new RoomPosition(31, 28, 'W4S8');

var harvester_main_parts = [WORK, MOVE];
var guard_main_parts = [WORK, CARRY, MOVE];
var collector_main_parts = [CARRY, MOVE];

var harvesterparts = [WORK, WORK, WORK, WORK, MOVE];
var lightweightharvesterparts = [WORK, WORK, MOVE];
var guardparts = [WORK, WORK, CARRY, CARRY, MOVE];
var claimerparts = [WORK, WORK, CARRY, MOVE];
var builderparts = [WORK, WORK, CARRY,  MOVE];
var storerparts = [CARRY,CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
var repairmanparts = [WORK, CARRY, MOVE, MOVE];
var lightweight_repairman_parts = [WORK, CARRY, MOVE];
var collectorparts = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
var lightweight_collector_parts = [CARRY, CARRY, MOVE];

var buildpriority = STRUCTURE_ROAD;

var creepcount = 0;
var harvestercount = 0;
var guardcount = 0;
var claimercount = 0;
var buildercount = 0;
var elderlycount = 0;
var storercount = 0;
var repairmancount = 0;
var collectorcount = 0;
var mining = 0;
var maxminers = 4;

Memory.extensions = {};
Memory.nonfull_extensions = [];
Memory.damaged_structures = [];
Memory.keepers = {};
Memory.storage = [];

//Store data about structures
for(var s in Game.structures){
    if(Game.structures[s].structureType == STRUCTURE_EXTENSION){
        Memory.extensions[Game.structures[s].id] = Game.structures[s];
        if(Game.structures[s].energy < Game.structures[s].energyCapacity){
            Memory.nonfull_extensions.push(Game.structures[s]);
        }
    }
    if(Game.structures[s].structureType == STRUCTURE_ROAD){
    }
    if(Game.structures[s].hits < Game.structures[s].hitsMax){
        Memory.damaged_structures.push(Game.structures[s]);
    }
}

//Delete dead creeps from memory
for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}

//Make creeps do things
//construction.buildRoadToAllSources();

/////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------------------
//=-------------------------------ROLE ASSIGNMENT---------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////
for(var name in Game.creeps) {
  var creep = Game.creeps[name];

  if(creep.memory.role == 'harvester') {
    harvester(creep, Game.flags.room1); 
      harvestercount++;
  }

  if(creep.memory.role == 'builder') {
      builder(creep, Memory.damaged_structures[0], Game.flags.room1, 'road', Game.spawns.Spawn1);
      buildercount++;
  }
  if(creep.memory.role == 'guard') {
        guard(creep, guardpos);
        guardcount++;
  }
  if(creep.memory.role == 'storer') {
      var energyloc = Memory.nonfull_extensions[0];
      storer(creep, Game.spawns.Spawn1, energyloc);
        storercount++;
  }
  if(creep.memory.role == 'repairman') {
      repairman(creep, Memory.damaged_structures[0]);
        repairmancount++;
  }
  if(creep.memory.role == 'claimer') {
      claimer(creep, Game.flags.room1);
        claimercount++;
  }
  if(creep.memory.role == 'collector') {
      collector(creep, Game.flags.room1);
        collectorcount++;
  }
  if(creep.memory.role == 'elderly') { //Do this last so we can still move this turn if the unit is aged
      elderly(creep);
      elderlycount++;
  }
  creepcount++;
}

Memory.harvestercount = harvestercount;
Memory.collectorcount = collectorcount;

/////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------------------
//=-------------------------------SPAWNS -------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////

//Make spawns do things
for(var name in Game.spawns) {
    var spawn = Game.spawns[name];
    
    //TODO Logic here to determine weighting for each worker type. Below just takes weighting and produces each type in order.
    //...after that, weighting for each *need*
    //-----------------------
    var weight_harvester = 0;
    var weight_collector = 0;
    var weight_repairman = 0;
   
    weight_harvester = 2/harvestercount;
    weight_collector = 2/collectorcount;
    weight_repairman = 1/repairmancount;
    weight_builder = 1/buildercount;
    console.log("--SPAWN WEIGHTS--")
    console.log("weight_harvester: " + weight_harvester)
    console.log("weight_collector: " + weight_collector)
    console.log("weight_repairman: " + weight_repairman)

    if(weight_harvester >= weight_collector && 
       weight_harvester >= weight_repairman &&
       weight_harvester >= weight_builder){
      //TODO for loop with a low thresh.
      var ret = spawn.createCreep(lightweightharvesterparts, null, {role: 'harvester'});
    }
    else if (weight_collector >= weight_harvester && 
             weight_collector >= weight_repairman &&
             weight_collector >= weight_builder){
      var ret = spawn.createCreep(lightweight_collector_parts, null, {role: 'collector'});
    }
    else if (weight_repairman >= weight_harvester && 
             weight_repairman >= weight_collector &&
             weight_repairman >= weight_builder){
      var ret = spawn.createCreep(lightweight_repairman_parts, null, {role: 'repairman'});
    }
    else{
      var ret = spawn.createCreep(builderparts, null, {role: 'builder'});
    }

}
