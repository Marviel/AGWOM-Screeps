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
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        creep.moveTo(source);
        creep.harvest(source);    
    }
}
