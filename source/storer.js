/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('storer'); // -> 'a thing'
 */
 
module.exports = function (creep, spawner, extension) {
    if(creep.ticksToLive < 60){
        creep.memory.role = 'elderly';
    }
    else{
      if(creep.carry.energy == 0) {
        creep.moveTo(Game.spawns.Spawn1);
        Game.spawns.Spawn1.transferEnergy(creep);
      }
        else {
            if(extension){
                creep.moveTo(extension);
                creep.transferEnergy(extension);
            }
            else{
                if(creep.room.storage){
                    creep.moveTo(creep.room.storage);
                    creep.transferEnergy(creep.room.storage);
                }
                else{
                    creep.moveTo(Game.flags.idlebuilder1);
                }
            }
        }
    }
}