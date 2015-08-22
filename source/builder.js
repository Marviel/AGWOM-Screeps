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
    else{
        if(creep.room != roomFlag.room && creep.carry.energy != 0){
            creep.moveTo(roomFlag)
        }
        else{
          if(creep.carry.energy == 0) {
              var storloc;
                if(creep.room.storage != null){
                    storloc = creep.room.storage;
                }
                else{
                    storloc = spawn
                }
              
            if(Memory.harvestercount > Memory.min_harvester_count - 2){
                creep.moveTo(storloc);
                storloc.transferEnergy(creep);
            }
            else{
                creep.moveTo(Game.flags.waitforspawner);
            }
          }
          else {
            var prioritytarget = creep.pos.findClosest(FIND_CONSTRUCTION_SITES, {
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
    }

