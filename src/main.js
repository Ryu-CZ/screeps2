require('type.spawn')();

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');

module.exports.loop = function() {

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    for (let spawn_i in Game.spawns) {
        let spawn = Game.spawns[spawn_i];
        // console.log('Energy: ' + spawn.room.energyAvailable)

        if (Game.time % 137 == 0) {
            spawn.memory.towers = []
            let towers = spawn.room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            });
            for (let tower of towers) {
                spawn.memory.towers.push(tower.id);
            }
            console.log('Found towers: ' + spawn.memory.towers.length)
        }

        for (let t_id of spawn.memory.towers) {
            let tower = Game.getObjectById(t_id);
            if (tower) {
                let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                } else {
                    let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < 0.48 * structure.hitsMax
                    });
                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }

        if (spawn.room.energyAvailable > 299) {
            let curent_energy = spawn.room.energyAvailable
            var idx = Game.time % 5000
            if (harvesters.length < 2) {
                var newName = 'Harvester' + idx;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep(spawn.createBody(curent_energy), newName, {
                    memory: {
                        role: 'harvester',
                        home: spawn.room.name
                    }
                });
            }
            if (upgraders.length < 3) {
                let newName = 'Upgrader' + idx;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep(spawn.createBody(curent_energy), newName, {
                    memory: {
                        role: 'upgrader',
                        upgrading: false,
                        home: spawn.room.name
                    }
                });
            }
            if (builders.length < 2) {
                let newName = 'Builder' + idx;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(spawn.createBody(curent_energy), newName, {
                    memory: {
                        role: 'builder',
                        building: false,
                        home: spawn.room.name
                    }
                });
            }
            if (repairers.length < 1) {
                let newName = 'Repairer' + idx;
                console.log('Spawning new repairer: ' + newName);
                spawn.spawnCreep(spawn.createBody(curent_energy), newName, {
                    memory: {
                        role: 'repairer',
                        repairing: false,
                        home: spawn.room.name
                    }
                });
            }

            if (spawn.spawning) {
                let spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    'Spawning ' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y, {
                        align: 'left',
                        opacity: 0.8
                    });
            }
        }


        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            } else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            } else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            } else if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
        }
    }
}
