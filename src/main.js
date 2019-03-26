var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var tower = Game.getObjectById('0bab2c0be557e2a262471231');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    for(var spawn_i in Game.spawns) {
        var spawn = Game.spawns[spawn_i]
        // console.log('Energy: ' + spawn.room.energyAvailable)
        if (spawn.room.energyAvailable > 299) {
            if(harvesters.length < 2 ) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'harvester', home: spawn.room.name}});
            }
            if(upgraders.length < 2 ) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'upgrader', upgrading: false, home: spawn.room.name}});
            }
            if(builders.length < 2 ) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'builder', building: false , home: spawn.room.name}});
            }
            if(repairers.length < 1 ) {
                var newName = 'Repairer' + Game.time;
                console.log('Spawning new repairer: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'repairer', repairing: false, home: spawn.room.name}});
            }

            if(spawn.spawning) {
                var spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    'Spawning ' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }


        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
        }
    }
}
