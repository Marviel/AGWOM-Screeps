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

/* creeptypes = {'name': {'spawn_weight': float, 
 *                        cur_count: int,
 *                        min_count: int or undefined,
 *                        max_count: int or undefined,
 *                        
 *                        basic_parts: [WORK, ...]}, 
 *                        part_weights: [1, 2, ...],
 *                        work_function: function(),
 *
 *                        
 *                        ...}*/


// Your code goes here...
var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var claimer = require('claimer');
var elderly = require('elderly');
var storer = require('storer');
var repairman = require('repairman');
var collector = require('collector');
var firstroomflag = Game.flags.ROOM1;

Memory.max_creep_count = 25;
Memory.min_harvester_count = 2;
Memory.min_claimer_count = 2;
Memory.min_builder_count = 2;
Memory.min_storer_count = 3;
Memory.min_repairman_count = 1;
Memory.min_collector_count = 2;
MAX_HARVESTERS = 3;

var min_spawn_energy = 300;
var spawnInterval = 200;
var guardpos = new RoomPosition(31, 28, 'W4S8');

var harvester_main_parts = [WORK, MOVE];
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

//Weights

for(var name in Game.creeps) {
  var creep = Game.creeps[name];
  switch(creep.memory.role) {
    case 'harvester':
      harvestercount++;
      break;
    case 'repairman':
      repairmancount++;
      break;
    case 'storer':
      storercount++;
      break;
    case 'guard':
      guardcount++;
      break;
    case 'builder':
      buildercount++;
      break;
    case 'repairman':
      repairmancount++;
      break;
    case 'claimer':
      claimercount++;
      break;
    case 'collector':
      collectorcount++;
      break;
    case 'elderly':
      elderlycount++;
      break;
    default:
      break;
  }
}

var total_normal_workers = buildercount + claimercount + repairmancount; 
var builder_percent = buildercount/total_normal_workers;
var claimer_percent = claimercount/total_normal_workers;
var repairman_percent = repairmancount/total_normal_workers;
function update_percents(){
  builder_percent = buildercount/total_normal_workers;
  claimer_percent = claimercount/total_normal_workers;
  repairman_percent = repairmancount/total_normal_workers;
}

var builder_weight_now = 1/3;
var claimer_weight_now = 1/3;
var repairman_weight_now = 1/3;
extra_build_weight = 1/(firstroomflag.room.energyCapacityAvailable);
builder_weight_now += extra_build_weight;
claimer_weight_now -= extra_build_weight/2;
repairman_weight_now -= extra_build_weight/2;

if(Memory.last_conversion_timestep == undefined){ Memory.last_conversion_timestep = Game.time }
if(Game.time - Memory.last_conversion_timestep > 200){
  Memory.last_conversion_timestep = Game.time;
  //Convert creeps to approximate our new weights
  for(var name in Game.creeps){
    var creep = Game.creeps[name];
    
    //If the weight of the builder isn't satisfied, satisfy that first.
    if(builder_weight_now > builder_percent 
        && (creep.memory.role == "claimer" || creep.memory.role == "repairman")){
      if(creep.memory.role == "claimer"){
        claimercount -= 1;
      }
      else if(creep.memory.role == "repairman"){
        repairmancount -= 1;
      }
      
      creep.memory.role = "builder";
      buildercount += 1;
      update_percents();
    }
    else if(claimer_weight_now - claimer_percent > .1
              && (creep.memory.role == "repairman" || creep.memory.role == "builder")){
      if(creep.memory.role == "builder"){
        buildercount -= 1;
      }
      else if(creep.memory.role == "repairman"){
        repairmancount -= 1;
      }
      
      creep.memory.role = "claimer";
      claimercount += 1;
      update_percents();
    }
    else if(repairman_weight_now - repairman_percent > .1 &&
            (creep.memory.role == "claimer" || creep.memory.role == "builder")){
      if(creep.memory.role == "claimer"){
        claimercount -= 1;
      }
      else if(creep.memory.role == "builder"){
        buildercount -= 1;
      }

      
      creep.memory.role = "repairman";
      repairmancount += 1;
      update_percents();
    }
  } 
}

for(var name in Game.creeps) {
  var creep = Game.creeps[name];

  if(creep.memory.role == 'harvester') {
    harvester(creep, firstroomflag); 
  }

  else if(creep.memory.role == 'builder') {
      builder(creep, Memory.damaged_structures[0], firstroomflag, 'road', Game.spawns.Spawn1);
  }
  else if(creep.memory.role == 'guard') {
        guard(creep, guardpos);
  }
  else if(creep.memory.role == 'storer') {
      var energyloc = Memory.nonfull_extensions[0];
      storer(creep, Game.spawns.Spawn1, energyloc);
  }
  else if(creep.memory.role == 'repairman') {
      repairman(creep, Memory.damaged_structures[0]);
  }
  else if(creep.memory.role == 'claimer') {
      claimer(creep, firstroomflag, Game.spawns.Spawn1);
  }
  else if(creep.memory.role == 'collector') {
      collector(creep, firstroomflag);
  }
  else if(creep.memory.role == 'elderly') { //Do this last so we can still move this turn if the unit is aged
      elderly(creep);
  }
  creepcount++;
}

Memory.harvestercount = harvestercount;
Memory.collectorcount = collectorcount;

/////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------------------
//=-------------------------------SPAWNS -------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////
if(Memory.lastSpawn == undefined){ Memory.lastSpawn = Game.time }
if(firstroomflag.room.energyAvailable >= min_spawn_energy ||
    Game.time - Memory.lastSpawn > spawnInterval){
  Memory.lastSpawn = Game.time;
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
      if(harvestercount >= MAX_HARVESTERS){ weight_harvester = 0}
      weight_collector = 2/collectorcount;
      weight_repairman = .5/repairmancount;
      weight_builder = 1/buildercount;
      weight_claimer = 1/claimercount;
      console.log("--SPAWN WEIGHTS--")
      console.log("weight_harvester: " + weight_harvester)
      console.log("weight_collector: " + weight_collector)
      console.log("weight_repairman: " + weight_repairman)
      console.log("weight_builder: " + weight_builder)

      if(weight_harvester >= weight_collector && 
         weight_harvester >= weight_repairman &&
         weight_harvester >= weight_builder){
        //TODO for loop with a low thresh.
        var last_able = harvester_main_parts;
        var this_one = last_able;
        while(spawn.canCreateCreep(this_one) == OK){
          last_able = this_one;
          this_one = this_one.concat(harvester_main_parts);
        }

        var ret = spawn.createCreep(last_able, null, {role: 'harvester'});
      }
      else if (weight_collector >= weight_harvester && 
               weight_collector >= weight_repairman &&
               weight_collector >= weight_builder){
        var last_able = collector_main_parts;
        var this_one = last_able;
        while(spawn.canCreateCreep(this_one) == OK){
          last_able = this_one;
          this_one = this_one.concat(collector_main_parts);
        }

        var ret = spawn.createCreep(last_able, null, {role: 'collector'});
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
}
