/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('claimer'); // -> 'a thing'
 */
module.exports = function (creep, roomFlag){
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
            if(creep.room != roomFlag.room){
                creep.moveTo(roomFlag)
            }
            else{
                creep.moveTo(creep.room.controller);
                if(creep.room.controller.level == 0){
                    creep.claimController(creep.room.controller);
                }
                else{
                    creep.upgradeController(creep.room.controller);
                }
            }
        }
    }
}