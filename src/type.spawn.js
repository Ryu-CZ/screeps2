module.exports = function() {

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
        energy = Math.min(energy, this.memory.commonerEnergyMax);
        // create a balanced body as big as possible with the given energy
        let partsCnt = Math.floor(energy / 200);
        let body = [];
        for (let i = 0; i < partsCnt; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < partsCnt; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < partsCnt; i++) {
            body.push(MOVE);
        }
        return body;
    };
};
