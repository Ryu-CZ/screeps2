module.exports = function() {

    /**
     * Write signed message into console log
     * @type {function}
     * @param {string} message
     */
    Source.prototype.log = function(
        message
    ) {
        console.log(this.name + " - " + message);
    };

    /**
     * get my container.
     * @type {function}
     *
     * @return {StructureContainer}
     */
    Source.prototype.container = function() {
        let container = null
        if (this.room.memory.sources[this.id].container) {
            container = Game.getObjectById(this.room.memory.sources[this.id].container)
            if (container) {
                this.room.memory['sources'][this.id].isConstructing = false;
            } else {
                this.room.memory.sources[this.id].container == null;
            }
        }
        return container
    };

    /**
     * find existing container and set it as current in use
     * @type {function}
     *
     * @return {StructureContainer}
     */
    Source.prototype.findContainer = function() {
        let container = null
        const sites = this.room.lookForAtArea(LOOK_STRUCTURES, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
        for (let i = 0; i < sites.length; i++) {
            if (sites[i].structure.structureType == STRUCTURE_CONTAINER) {
                container = sites[i].structure;
                this.room.memory.sources[this.id].container = container.id;
                this.room.memory.sources[this.id].isConstructing = false;
                break;
            }
        }
        return container
    };

    /**
     * place my container build side.
     * @type {function}
     *
     * @return {bool}
     */
    Source.prototype.placeContainer = function() {
        if (!this.room.memory.sources[this.id].isConstructing) {
            let construction = null
            const sites = this.room.lookForAtArea(LOOK_CONSTRUCTION_SITES, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
            for (let i = 0; i < sites.length; i++) {
                if (sites[i].structure.structureType == STRUCTURE_CONTAINER) {
                    construction = sites[i].structure.id;
                    break;
                }
            }
            if (construction) {
                this.room.memory['sources'][this.id].isConstructing = true;
                return true;
            } else {
                let center = this.room.storage;
                if (!center) {
                    center = Game.getObjectById(this.room.memory.mainSpawn);
                }
                if (center) {
                    const path_from_center = this.room.findPath(center.pos, this.pos, {
                        "ignoreCreeps": true
                    });
                    if (path_from_center.length) {
                        const place = path_from_center.slice(-1);
                        const containerPos = new RoomPosition(place.x, place.y, this.room.name);
                        const placing = containerPos.createConstructionSite(STRUCTURE_CONTAINER);
                        if (OK == placing) {
                            this.room.memory['sources'][this.id].isConstructing = true;
                            return true;
                        } else {
                            this.log("cannot place container: " + placing);
                        }
                    }
                }
            }
        }
        return false;
    };

    /**
     * place my container build side.
     * @type {function}
     *
     * @return {bool}
     */
    Source.prototype.ensureContainer = function() {
        return (this.room.memory.sources[this.id].isConstructing || this.container() || this.findContainer() || this.placeContainer())
    }
};