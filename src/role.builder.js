var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('stocking');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
            if(creep.room.name != creep.memory.home) {
                creep.moveTo(Game.rooms[creep.memory.home].controller);
                return;
            }

	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var build_test = creep.build(targets[0])
                if(build_test == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (build_test == ERR_NOT_ENOUGH_ENERGY) {
                    creep.memory.building = false;
                }
            }
            else {
                roleUpgrader.run(creep);
            }
	    }
	    else {
	        var source = creep.pos.findClosestByPath(FIND_SOURCES);;
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;
