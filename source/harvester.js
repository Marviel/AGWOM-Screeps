/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
 module.exports = function (creep, roomFlag) {
    if(creep.ticksToLive < 60){
        creep.memory.role = 'elderly';
    }
    else{
        if(creep.room != roomFlag.room){
            creep.moveTo(roomFlag)
        }
        else{
            var sources = creep.room.find(FIND_SOURCES);
            creep.moveTo(sources[0]);
            creep.harvest(sources[0]);
        }
    }
}
