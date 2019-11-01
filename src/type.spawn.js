module.exports = function() {

    Object.defineProperty(StructureSpawn.prototype, 'ROLES', {
        value: ['supply', 'upgrade', 'build', 'repair', 'mine', 'carry', 'wall', 'claim'],
        writable: false,
        enumerable: false,
        configurable: false,
    });

    /**
     * Write signed message into console log
     * @type {function}
     * @param {string} message
     */
    StructureSpawn.prototype.log = function(
        message
    ) {
        console.log(this.name + " - " + message);
    };

    /**
     * Genereta the strongest creep body .
     * @type {function}
     *
     * @param {int} energy
     *
     * @return {Array<string>}
     */
    StructureSpawn.prototype.createBody = function(
        energy) {
        if (isNaN(this.memory.commonerEnergyMax)) {
            console.log('Notice: commonerEnergyMax not set in ' + this.name);
        } else {
            energy = Math.min(energy, this.memory.commonerEnergyMax);
        }
        // create a balanced body as big as possible with the given energy
        let partsCnt = Math.floor(energy / 200);
        let body = [];
        for (let i = 0; i < partsCnt; i++) {
            body.push(WORK);
            body.push(CARRY);
        }
        for (let i = 0; i < partsCnt; i++) {
            body.push(MOVE);
        }
        return body;
    };

    /**
     * Genereta the strongest creep body .
     * @type {function}
     *
     * @param {int} energy
     *
     * @return {Array<string>}
     */
    StructureSpawn.prototype.createCarryBody = function(
        energy) {
        if (isNaN(this.memory.commonerEnergyMax)) {
            console.log('Notice: commonerEnergyMax not set in ' + this.name);
        } else {
            energy = Math.min(energy, this.memory.commonerEnergyMax);
        }
        // create a balanced body as big as possible with the given energy
        let partsCnt = Math.floor(energy / 150);
        let body = [];
        for (let i = 0; i < partsCnt; i++) {
            body.push(CARRY);
            body.push(CARRY);
        }
        for (let i = 0; i < partsCnt; i++) {
            body.push(MOVE);
        }
        return body;
    };

    /**
     * Create a other target room claimer .
     * @type {function}
     *
     * @param {string} target
     *
     * @return {number}
     */
    StructureSpawn.prototype.createClaimer = function(
        target
    ) {
        const newName = 'Claimer' + (Game.time % 5000);
        const is_spawning = this.spawnCreep(
            [CLAIM, MOVE, MOVE],
            newName, {
                memory: {
                    role: 'claimer',
                    target: target,
                    home: this.room.name
                }
            }
        );
        if (is_spawning == OK) {
            this.log('Spawning new: ' + newName);
        } else {
            this.log('Cannot spawn claimer ' + is_spawning);
        }
        return is_spawning
    };

    /**
     * COunt existing containers for mining and build missing containers.
     * @type {function}
     * @return {number}
     */
    StructureSpawn.prototype.countMinerPlaces = function() {
        let cnt = 0;
        for (const source_id in this.room.memory.sources) {
            const source = Game.getObjectById(source_id);
            if (source.container()) {
                cnt += 1;
            } else {
                source.ensureContainer();
            }
        }
        return cnt;
    }

    /**
     * Handle towers in my room.
     * @type {function}
     */
    StructureSpawn.prototype.checkLevel = function(

    ) {
        if (!('mainSpawn' in this.room.memory)) {
            this.room.memory.mainSpawn = this.id;
            this.log('init mainSpawn');
        }
        if (!('creepsLimit' in this.memory)) {
            this.memory.creepsLimit = {};
            this.log('init creepsLimit');
        }
        if (!('controllerDistance' in this.memory)) {
            this.memory.controllerDistance = this.pos.findPathTo(this.room.controller).length;
            this.log('init controllerDistance');
        }
        if (!('sources' in this.room.memory)) {
            this.log('init room.sources');
            let source_list = {}
            for (let source of this.room.find(FIND_SOURCES)) {
                source_list[source.id] = {
                    "container": null,
                    "isConstructing": false
                };
            }
            this.room.memory.sources = source_list;
        }
        if (!('stepsControllerSource' in this.memory)) {
            this.log('init stepsControllerSource');
            this.memory.stepsControllerSource = 1;
            for (let source of this.room.find(FIND_SOURCES)) {
                this.memory.stepsControllerSource = Math.max(
                    this.memory.stepsControllerSource,
                    this.room.controller.pos.findPathTo(source).length,
                );
            }
        }
        this.memory.level = Math.floor(Math.min(800, this.room.energyCapacityAvailable - 100) / 200)
        const build_power = this.room.find(FIND_MY_CONSTRUCTION_SITES).length > 5;
        if (1 >= this.memory.level) {
            this.memory.commonerEnergyMax = 200
            this.memory.creepsLimit.supply = 3;
            this.memory.creepsLimit.upgrade = 1 + Math.floor(this.memory.stepsControllerSource / 4);
            this.memory.creepsLimit.build = 2;
            this.memory.creepsLimit.repair = 1;
            if (build_power) {
                this.memory.creepsLimit.build += 3;
            }
        } else if (2 >= this.memory.level) {
            this.memory.commonerEnergyMax = 400
            this.memory.creepsLimit.supply = 2;
            this.memory.creepsLimit.upgrade = 1 + Math.floor(this.memory.stepsControllerSource / 5);
            this.memory.creepsLimit.build = 2;
            this.memory.creepsLimit.repair = 1;
            this.memory.creepsLimit.wall = 0;
            if (build_power) {
                this.memory.creepsLimit.build += 2;
            }
        } else if (3 >= this.memory.level) {
            this.memory.commonerEnergyMax = 600
            this.memory.creepsLimit.supply = 2;
            this.memory.creepsLimit.upgrade = 1 + Math.floor(this.memory.stepsControllerSource / 6.5);
            this.memory.creepsLimit.build = 2;
            this.memory.creepsLimit.repair = 1;
            this.memory.creepsLimit.wall = 1;
            if (build_power) {
                this.memory.creepsLimit.build += 2;
            }
        } else if (3 < this.memory.level) {
            this.memory.commonerEnergyMax = 800
            this.memory.creepsLimit.supply = 2;
            this.memory.creepsLimit.upgrade = 1 + Math.floor(this.memory.stepsControllerSource / 8);
            this.memory.creepsLimit.build = 1;
            this.memory.creepsLimit.repair = 1;
            this.memory.creepsLimit.wall = 1;
            if (build_power) {
                this.memory.creepsLimit.build += 2;
            }
        }
        if (((5 * BODYPART_COST[WORK]) + (2 * BODYPART_COST[MOVE])) <= this.memory.commonerEnergyMax) {
            this.memory.creepsLimit.mine = this.countMinerPlaces();
            this.memory.creepsLimit.carry = this.memory.creepsLimit.miner;
            this.memory.creepsLimit.upgrade = 1 + Math.max(
                Math.floor(this.memory.creepsLimit.upgrade / 2),
                1
            );
        } else {
            this.memory.creepsLimit.mine = 0;
            this.memory.creepsLimit.carry = 0;
        }
        if (8 == this.room.controller.level) {
            this.memory.creepsLimit.upgrade = 1;
        }
        if (155 < this.room.find(FIND_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_ROAD
                }
            }).length) {
            this.memory.creepsLimit.repair++;
        }
        this.memory.installed = true;
    };


    /**
     * Handle towers in my room.
     * @type {function}
     */
    StructureSpawn.prototype.controlTowers = function(

    ) {
        if (this.memory.towers == undefined || Game.time % 137 == 0) {
            this.memory.towers = []
            const towers = this.room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            });
            for (const tower of towers) {
                this.memory.towers.push(tower.id);
            }
            this.log('Found towers: ' + this.memory.towers.length);
        }
        for (const t_id of this.memory.towers) {
            const tower = Game.getObjectById(t_id);
            if (tower) {
                const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                } else {
                    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType != STRUCTURE_RAMPART && s.hits < 0.48 * s.hitsMax)
                    });
                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }
    };

    /**
     * Create specialized source mining creep.
     * @type {function}
     * @param {number} idx
     * @return {number}
     **/
    StructureSpawn.prototype.buildMiner = function(
        idx,
        sourceId,
        containerId,
    ) {
        const newName = "miner" + idx;
        const body = [WORK, WORK, WORK, WORK, WORK, MOVE]
        if (600 <= this.room.energyAvailable) {
            body.push(MOVE);
        }
        const is_spawning = this.spawnCreep(
            body,
            newName, {
                memory: {
                    role: 'mine',
                    landed: false,
                    sourceId: sourceId,
                    containerId: containerId,
                    home: this.room.name
                }
            }
        );
        if (is_spawning == OK) {
            this.log('Spawning new: ' + newName);
            this.room.memory.sources[sourceId].miner = newName;
        }
        return is_spawning;
    };

    /**
     * Create creep of given type.
     * @type {function}
     * @param {string} role
     * @param {number} idx
     * @return {number}
     **/
    StructureSpawn.prototype.buildCreep = function(
        role,
        idx
    ) {
        const newName = role + idx;
        is_spawning = this.spawnCreep(this.createBody(this.room.energyAvailable), newName, {
            memory: {
                role: role,
                [role + "ing"]: false,
                home: this.room.name
            }
        });
        if (is_spawning == OK) {
            this.log('Spawning new: ' + newName);
        }
        return is_spawning
    };

    /**
     * Create creep carry type.
     * @type {function}
     * @param {number} idx
     * @return {number}
     **/
    StructureSpawn.prototype.buildCarry = function(
        idx
    ) {
        const role = 'carry';
        const newName = role + idx;
        is_spawning = this.spawnCreep(
            this.createCarryBody(this.room.energyAvailable),
            newName, {
                memory: {
                    role: role,
                    [role + "ing"]: false,
                    home: this.room.name
                }
            }
        );
        if (is_spawning == OK) {
            this.log('Spawning new: ' + newName);
        }
        return is_spawning
    };

    /**
     * Fill memory with actual count creeps .
     * @type {function}
     **/
    StructureSpawn.prototype.buildCreeps = function(

    ) {
        if (!this.memory.liveCreeps) {
            this.memory.liveCreeps = {};
            this.log(this.name + ' init liveCreeps');
        }
        // this.log('roles ' + this.ROLES);
        const curent_energy = this.room.energyAvailable;
        const room_name = this.room.name;
        const counter = {}
        for (let i = 0; i < this.ROLES.length; i++) {
            counter[this.ROLES[i]] = 0;
        }
        for (const i in Game.creeps) {
            const creep = Game.creeps[i];
            if (room_name == creep.memory.home) {
                counter[creep.memory.role] += 1;
            }
        }
        // this.log('counter ' + counter);
        for (const role of this.ROLES) {
            this.memory.liveCreeps[role] = counter[role] || 0;
        }
        if (!this.spawning && curent_energy > 199) {
            const idx = Game.time % 5000
            if (curent_energy >= Math.min(this.memory.commonerEnergyMax, this.room.energyCapacityAvailable)) {
                if (counter.mine == 0 && (counter.supply < this.memory.creepsLimit.supply)) {
                    this.buildCreep('supply', idx);
                } else if (counter.carry < this.memory.creepsLimit.carry) {
                    this.buildCarry(idx);
                } else if (counter.mine < this.memory.creepsLimit.mine) {
                    for (const source in this.room.memory.sources) {
                        const source_mem = this.room.memory.sources[source];
                        if (!source_mem.miner) {
                            this.buildMiner(
                                idx,
                                sourceId = source,
                                containerId = source_mem.container
                            );
                        }
                    }
                } else if (counter.upgrade < this.memory.creepsLimit.upgrade) {
                    this.buildCreep('upgrade', idx);
                } else if (counter.build < this.memory.creepsLimit.build) {
                    this.buildCreep('build', idx);
                } else if (counter.repair < this.memory.creepsLimit.repair) {
                    this.buildCreep('repair', idx);
                } else if (counter.wall < this.memory.creepsLimit.wall) {
                    this.buildCreep('wall', idx);
                }
            } else if ((counter.supply || 0) < 1) {
                this.buildCreep('supply', idx);
            }
        }
    };
};