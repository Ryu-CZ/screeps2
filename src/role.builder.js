var roleUpgrader = require('role.upgrader');

module.exports = {

    /** @param {Creep} creep **/
    do_job: function(creep) {

        if (creep.energy == 0 && creep.memory.building) {
            creep.memory.building = false;
            creep.say('stocking');
        } else if (!creep.memory.building && creep.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if (creep.memory.building) {
            if (creep.room.name != creep.memory.home) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
                return;
            }
            let target = null;
            if (creep.memory.contruction_site_id) {
                target = Game.getObjectById(creep.memory.contruction_site_id);
            }
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            }
            if (target) {
                // console.log(creep.name + ' building ' + target);
                const build_test = creep.build(target)
                creep.memory.contruction_site_id = target.id
                if (build_test == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (build_test == ERR_NOT_ENOUGH_ENERGY) {
                    creep.memory.building = false;
                }
            } else {
                roleUpgrader.do_job(creep);
            }
        } else {
            const free_meal = creep.pos.findClosestByPath(
                FIND_DROPPED_RESOURCES, {
                    filter: r => r.amount >= 0.62 * creep.carryCapacity
                });
            if (free_meal) {
                if (creep.pickup(free_meal) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(free_meal);
                }
            } else {
                creep.getEnergy()
            }
        }
    }
};