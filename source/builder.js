/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 
module.exports = function (creep, damaged, roomFlag, buildpriority, spawn) {
  if(creep.ticksToLive < 60){
      creep.memory.role = 'elderly';
  }
  else
  {
      if(creep.room != roomFlag.room && creep.carry.energy != 0){
          creep.moveTo(roomFlag)
      }
      if(creep.carry.energy == 0 && 
          Memory.harvestercount >= Memory.min_harvester_count &&
          Memory.collectorcount >= Memory.min_collector_count) {
          var storloc;
            if(creep.room.storage != null){
                storloc = creep.room.storage;
            }
            else{
                storloc = spawn
            }
          
            creep.moveTo(storloc);
            creep.withdraw(storloc, RESOURCE_ENERGY);
      }
      else{
            creep.moveTo(Game.flags.waitforspawner);
      }
      var prioritytarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
          {
              filter: function (object) {
                  return object.type = buildpriority;
              }
          });
          
      var targets;
      if(prioritytarget){ targets = [prioritytarget]; }
      else{ targets = creep.room.find(FIND_CONSTRUCTION_SITES);}
      
      if(targets.length) {
        creep.moveTo(targets[0]);
        creep.build(targets[0]);
      }
      else{
          creep.moveTo(Game.flags.idlebuilder1);
      }
    }
}
