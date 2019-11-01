module.exports = {
    /** @param {Creep} creep **/
    do_job: function(creep) {
        const source = Game.getObjectById(creep.memory.sourceId);
        if (creep.memory.landed) {
            creep.harvest(source);
        } else {
            const container = Game.getObjectById(creep.memory.containerId);
            if (container) {
                if (creep.pos.isEqualTo(container.pos)) {
                    creep.harvest(source);
                    creep.memory.landed = true;
                    creep.room.memory.sources[creep.memory.sourceId].miner = creep.name;
                } else {
                    creep.moveTo(container);
                }
            } else {
                // tell source to replace container
                const source = Game.getObjectById(creep.memory.sourceId)
                source.ensureContainer();
                const possible_container = source.container();
                if (possible_container) {
                    creep.memory.containerId = possible_container.id;
                }
                creep.moveTo(source);
            }

        }
    }
};