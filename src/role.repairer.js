var roleBuilder = require('role.builder');

var roleRepairer = {

    /** @param {Creep} creep **/
    do_job: function(creep) {

        if (creep.carry.energy == 0 && creep.memory.repairing) {
            creep.memory.repairing = false;
            creep.say('stocking');
        } else if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('building');
        }

        // behavior
        if (creep.memory.repairing) {

            if (creep.room.name != creep.memory.home) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
                return;
            }

            let structure = null
            if (!creep.memory.toRepair) {
                structure = creep.pos.findClosestByRange(
                    FIND_STRUCTURES, {
                        filter: (s) => s.structureType != STRUCTURE_WALL &&
                            s.structureType != STRUCTURE_RAMPART &&
                            s.room.name == creep.room.name &&
                            s.hits < 0.83 * s.hitsMax
                    });
            } else {
                structure = Game.getObjectById(creep.memory.toRepair)
                if (structure && structure.hits >= structure.hitsMax) {
                    structure = null
                    creep.memory.toRepair = null
                }
            }
            if (!structure) {
                // switch to upgrader if there is nothing to repair
                creep.memory.toRepair = null
                if (!creep.room.controller.sign) {
                    if (creep.signController(creep.room.controller, "My ancestors are smiling at me. Can you say the same? 🐲") == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                    return
                }
                roleBuilder.do_job(creep);
            } else {
                // remember structure
                creep.memory.toRepair = structure.id
                // repair structure
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, {
                        visualizePathStyle: {
                            stroke: '#00aaff'
                        }
                    });
                }
            }
        } else {
            // gather resources
            creep.getEnergy();
        }
    }
};

module.exports = roleRepairer;