var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < 0.1*creep.carryCapacity) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&  structure.energyCapacity - structure.energy > creep.carry.energy;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var targets = creep.room.findClosestByPath(FIND_STRUCTURES)
                if(targets.length > 0){
                    creep.moveTo(targets[0])
                }
            }
        }
	}
};

module.exports = roleHarvester;
