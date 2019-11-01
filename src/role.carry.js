module.exports = {

    /** @param {Creep} creep **/
    do_job: function(creep) {
        if (creep.memory.carrying) {

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
                if (creep.carry.energy == 0) {
                    creep.memory.carrying = false;
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
                    creep.log("Missing STORAGE in room " + creep.room.name);
                    const mainSpawn = Game.getObjectById(creep.room.mainSpawn);
                    if (mainSpawn) {
                        creep.moveTo(mainSpawn);
                    }
                }
            } else if (creep.carry.energy == 0) {
                creep.memory.carrying = false;
            } else {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            if (creep.carry.energy >= 0.62 * creep.carryCapacity) {
                creep.memory.carrying = true;
            } else {
                const energy_deficit = 0.62 * (creep.carryCapacity - creep.carry[RESOURCE_ENERGY]);
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
                    creep.memory.container_id = container.id;
                    const withdraw_code = creep.withdraw(container, RESOURCE_ENERGY)
                    if (withdraw_code == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    } else if (withdraw_code == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.container_id = null;
                    } else if (withdraw_code == OK) {
                        creep.memory.carrying = true;
                    }
                } else {
                    let dropped_energy = Game.getObjectById(creep.memory.dropped_energy);
                    if (!dropped_energy) {
                        dropped_energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: d => d.amount >= 62
                        });
                        if (dropped_energy) {
                            creep.memory.dropped_energy = dropped_energy.id;
                        }
                    }
                    if (dropped_energy) {
                        const picked = creep.pickup(dropped_energy);
                        creep.memory.dropped_energy = dropped_energy.id;
                        if (picked == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropped_energy);
                        } else {
                            creep.memory.dropped_energy = null;
                        }
                    } else {
                        creep.memory.dropped_energy = null;
                    }
                }
            }
        }
        if (creep.carry.energy == 0) {
            // keep current state if there is some energy
            creep.memory.carrying = false;
        }
    }
};