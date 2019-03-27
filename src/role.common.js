class Role {
    /** @param {Creep} creep **/
    constructor(creep) {
        this.creep = creep;
        this.role = 'harvester'
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

    /**
     * Adding a method to the constructor
     * @param {Spawn} spawn
     * @param {int} energy
     **/
    breed(spawn, energy) {
        spawn.room.energyAvailable
        return `${this.name} says hello.`;
    }
}
