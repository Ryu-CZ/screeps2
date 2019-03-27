var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.delivering) {

            if (creep.room.name != creep.memory.home) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
                return;
            }

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && (structure.energyCapacity > structure.energy);
                }
            });
            if (target == null) {
                if (creep.carry.energy < creep.carryCapacity) {
                    creep.memory.delivering = false;
                }
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: {
                        structureType: STRUCTURE_SPAWN
                    }
                });
                if (targets.length) {
                    creep.moveTo(targets[0]);
                }
            } else if (creep.carry.energy == 0) {
                creep.memory.delivering = false;
            } else {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.delivering = true;
            }
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        }
    }
};

module.exports = roleHarvester;
