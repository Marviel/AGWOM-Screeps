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
        creep.moveTo(spawn);
        creep.withdraw(spawn, RESOURCE_ENERGY); 
      }
      else {
            creep.moveTo(creep.room.controller);
        creep.transfer(creep.room.controller, RESOURCE_ENERGY);
      }
    }
}
