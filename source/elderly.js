/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('elderly'); // -> 'a thing'
 */
 
module.exports = function (creep){
    if(creep.carry.energy == 0){
            creep.moveTo(Game.flags.boneyardloc);
    }
    else{
        creep.moveTo(Game.spawns.Spawn1);
    creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY);
    }
}
