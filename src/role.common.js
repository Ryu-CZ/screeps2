class Role {
    /** @param {Creep} creep **/
    constructor(creep) {
        this.creep = creep;
    }

    /** create a balanced body as big as possible with the given energy
     * @param {int} energy
     * @returns {Array}
     **/
    design_body(energy) {
        var partsCnt = Math.floor(energy / 200);
        var body = [];
        for (let i = 0; i < partsCnt; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < partsCnt; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < partsCnt; i++) {
            body.push(MOVE);
        }
        return body
    }

    /** create a balanced body as big as possible with the given energy
     * @returns {*}
     **/
    init_memory() {
        return {
            home: spawn.room.name
        }
    }

    /** generate new name
     * @returns {string}
     **/
    next_name() {
        return self.creep.memory.role + Game.time % 5000;
    }

    /**
     * Adding a method to the construct creep
     * @param {Spawn} spawn
     * @param {int} energy
     **/
    breed(spawn, energy) {
        spawn.spawnCreep(
            this.design_body(energy),
            this.next_name(), {
                memory: this.init_memory()
            }
        );
    }
}

module.exports = Role;
