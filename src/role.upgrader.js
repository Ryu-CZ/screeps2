module.exports = {
    /** @param {Creep} creep **/
    do_job: function(creep) {
        if (creep.carry.energy == 0 && creep.memory.upgrading) {
            creep.memory.upgrading = false;
        } else if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(Game.rooms[creep.memory.home].controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
            }
        } else {
            creep.getEnergy();
        }
    }
};
