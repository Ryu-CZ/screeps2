var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.uppgrading && creep.carry.energy == 0) {
            creep.memory.uppgrading = false;
            creep.say('charging');
        }
        else if (!creep.memory.uppgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.uppgrading = true;
            creep.say('uppgrading');
        }

        if(creep.memory.building) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;
