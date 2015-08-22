/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('repairman'); // -> 'a thing'
 */
module.exports = function (creep, damaged, flagloc) {
    if(creep.ticksToLive < 60){
        creep.memory.role = 'elderly';
    }
    else{
      if(creep.carry.energy == 0) {
          var storloc;
            if(creep.room.storage){
                storloc = creep.room.storage;
            }
            else{
                storloc = Game.spawns.Spawn1
            }
            
        creep.moveTo(storloc);
        if(Memory.harvestercount > Memory.min_harvester_count - 2 || storloc == creep.room.storage){
            storloc.transferEnergy(creep);
        }
        else{
            creep.moveTo(Game.flags.waitforspawner);
        }
      }
      else {
          var repair = creep.pos.findClosest(FIND_STRUCTURES, {
                filter: function (object) {
                    return object.hits < object.hitsMax;
                }
            });
          if(repair){
          creep.moveTo(repair);
          creep.repair(repair);
          }
      else{
            creep.moveTo(Game.flags.idlebuilder1);
        }
      }
    }
}