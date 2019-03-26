var roleBuilder = require('role.builder');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('stocking');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('building');
        }

        // behavior
        if (creep.memory.repairing) {

            if(creep.room.name != creep.memory.home) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
                return;
            }

            var structure = null
            if ( !creep.memory.toRepair ) {
                structure = creep.pos.findClosestByPath(
                    FIND_STRUCTURES,
                  {
                      filter: (s) => s.structureType != STRUCTURE_WALL &&
                      s.structureType != STRUCTURE_RAMPART &&
                      s.room.name == creep.room.name &&
                      s.hits < 0.83*s.hitsMax
                  });
              }
            else {
                structure = Game.getObjectById(creep.memory.toRepair)
                if ( structure && structure.hits >= structure.hitsMax ) {
                  structure = null
                  creep.memory.toRepair = null
                }
            }
            if ( !structure ) {
                // switch to upgrader if there is nothing to repair
                roleBuilder.run(creep);
            }
            else {
                // remember structure
                creep.memory.toRepair = structure.id
                // repair structure
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(structure, {visualizePathStyle: {stroke: '#00aaff'}});
                }
            }
        }
        else {
            // gather resources
            var source = creep.pos.findClosestByPath(FIND_SOURCES);;
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleRepairer;
