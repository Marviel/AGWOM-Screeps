/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('guard'); // -> 'a thing'
 */
module.exports = function (creep, guardpos) {
  //var targets = creep.room.find(FIND_HOSTILE_CREEPS);
  var targets = creep.room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.role == 'guard';
        }
    });
    
    if(targets.length) {
      creep.moveTo(targets[0]);
      creep.attack(targets[0]);
    }
    else{
        creep.moveTo(guardpos);
    }
}
 
 