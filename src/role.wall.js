/** Re-charges walls and ramparts**/
var roleUpgrade = require('role.upgrader');

module.exports = {
    /** @param {Creep} creep **/
    do_job: function(creep) {
        if (creep.carry.energy == 0 && creep.memory.walling) {
            creep.memory.walling = false;
        } else if (!creep.memory.walling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.walling = true;
        }
        
        // behavior
        if (creep.memory.walling) {
            let wall = Game.getObjectById(creep.memory.wall)
            if (wall && wall.hits < wall.hitsMax) {
                if (creep.repair(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
            } else {
                let walls = creep.room.find(
                    FIND_STRUCTURES, {
                        filter: (s) => (
                            s.structureType == STRUCTURE_WALL ||
                            s.structureType == STRUCTURE_RAMPART
                        ) && s.hits < s.hitsMax
                    }
                );
                const min_hits = _.min(walls, (w) => w.hits).hits
                wall = creep.pos.findClosestByRange(
                    FIND_STRUCTURES, {
                        filter: (s) => (
                            s.structureType == STRUCTURE_WALL ||
                            s.structureType == STRUCTURE_RAMPART
                        ) && s.hits < s.hitsMax && s.hits <= min_hits 
                    }
                );
            }

            if (wall) {
                // remember structure
                creep.memory.wall = wall.id
                // repair structure
                if (creep.repair(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
            } else {
                // switch to upgrader if there is nothing to build
                roleUpgrade.do_job(creep);
            }
        } else {
            // reset target
            creep.memory.wall = null;
            // gather resources
            creep.getEnergy();
        }
    } // end run function
}