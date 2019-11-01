require('type.spawn')();
require('type.source')();
require('type.creep')();
require('type.room')();

let roleJobs = {
    'supply': require('role.supply'),
    'upgrade': require('role.upgrader'),
    'build': require('role.builder'),
    'repair': require('role.repairer'),
    'mine': require('role.mine'),
    'carry': require('role.carry'),
    'wall': require('role.wall'),
    'harvester': require('role.supply'),
    'claim': require('role.claim'),
}

module.exports.loop = function() {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            if (Memory.creeps[name].role == 'mine') {
                const mem = Memory.creeps[name];
                Memory.rooms[mem.home].sources[mem.sourceId].miner = null;
            }
            delete Memory.creeps[name];
            console.log('Clearing dead creep memory: ' + name);
        }
    }
    let spawn_idx = 2;
    for (const spawn_name in Game.spawns) {
        const spawn = Game.spawns[spawn_name]
        // spawn.log('Energy: ' + spawn.room.energyAvailable)
        spawn.controlTowers();
        if (!spawn.memory.installed || Game.time % 79 == 0) {
            spawn.checkLevel();
        }

        if (!spawn.memory.birth_freq) {
            spawn.memory.birth_freq = spawn_idx;
        } else if (0 == Game.time % spawn.memory.birth_freq) {
            spawn.buildCreeps();
        }
        spawn_idx++;
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        roleJobs[creep.role].do_job(creep);
    }
}