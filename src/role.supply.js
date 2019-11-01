module.exports = {

    /** @param {Creep} creep **/
    do_job: function(creep) {
        if (creep.memory.supplying) {

            if (creep.room.name != creep.memory.home) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
                return;
            }

            const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && (structure.energyCapacity > structure.energy);
                }
            });
            if (target == null) {
                if (creep.carry.energy < creep.carryCapacity) {
                    creep.memory.supplying = false;
                }
                if (creep.room.storage) {
                    if (creep.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        if (ERR_NOT_IN_RANGE == creep.transfer(creep.room.storage, RESOURCE_ENERGY)) {
                            creep.moveTo(creep.room.storage);
                        }
                    } else {
                        creep.moveTo(creep.room.storage)
                    }
                } else {
                    const mainSpawn = Game.getObjectById(creep.room.mainSpawn);
                    if (mainSpawn) {
                        creep.moveTo(mainSpawn);
                    }
                }
            } else if (creep.carry.energy == 0) {
                creep.memory.supplying = false;
            } else {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.supplying = true;
            } else {
                const energy_deficit = creep.carryCapacity - creep.carry[RESOURCE_ENERGY];
                let container = Game.getObjectById(creep.memory.container_id)

                if (container && container.store[RESOURCE_ENERGY] < energy_deficit) {
                    creep.memory.container_id = null;
                    container = null;
                }

                if (!container) {
                    container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                            i.store[RESOURCE_ENERGY] >= energy_deficit
                    });
                    // console.log('found container ' + container);
                }
                if (container) {
                    creep.memory.source_id = null;
                    creep.memory.container_id = container.id;
                    const withdraw_code = creep.withdraw(container, RESOURCE_ENERGY)
                    if (withdraw_code == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    } else if (withdraw_code == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.container_id = null;
                    }
                    // console.log(creep.name + ' error code ' + withdraw_code);
                } else {
                    creep.memory.container_id = null;
                    let source = Game.getObjectById(creep.memory.source_id);
                    if (!source || source.energy == 0) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    }
                    if (source) {
                        creep.memory.source_id = source.id;
                        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                    } else {
                        creep.memory.source_id = null;
                    }
                }
            }
            if (creep.carry.energy == 0) {
                // keep current state if there is some energy
                creep.memory.supplying = false;
            }
        }
    }
};
