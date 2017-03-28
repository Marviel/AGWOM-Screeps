/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('collector'); // -> 'a thing'
 */
 
  module.exports = function (creep, roomFlag) {
    if(creep.ticksToLive < 60){
        creep.memory.role = 'elderly';
    }
    else{
        if(creep.room != roomFlag.room){
            creep.moveTo(roomFlag)
        }
      if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_DROPPED_ENERGY);
        creep.moveTo(sources[0]);
        creep.pickup(sources[0]);
      }
      else {
            creep.moveTo(Game.spawns.Spawn1);
        creep.transferEnergy(Game.spawns.Spawn1);
      }
    }
}
