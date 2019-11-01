module.exports = function() {

    /**
     * Place main Spawn construction side of room
     * @type {function}
     * @return {number} result code of placed structure
     */
    Room.prototype.placeMainSpawn = function() {
        const storagePos = this.findCenter(this.controller.pos);
        this.memory.storage_pos = {
            "x": storagePos.x,
            "y": storagePos.y
        };
        const mainSpawnPos = this.findCenter(storagePos);
        const spawnName = 'core' + Object.keys(Game.spawns).length;
        const placed = mainSpawnPos.createConstructionSite(STRUCTURE_SPAWN, spawnName);
        if (OK == placed) {
            this.memory['mainSpawn'] = spawnName;
        } else {
            this.log("cannot place main spawns: " + placed);
        }
        return placed
    }

    /**
     * CPlace construction side of storage
     * @type {function}
     * @return {number} result code of placed structure
     */
    Room.prototype.placeStorage = function() {
        if (!this.memory.storage_pos) {
            this.log("calculating storage palce");
            const storagePos = this.findCenter(this.controller.pos);
            this.memory.storage_pos = {
                "x": storagePos.x,
                "y": storagePos.y
            };
        }
        const storagePos = new RoomPosition(
            this.memory.storage_pos.x,
            this.memory.storage_pos.y,
            this.name,
        );
        const placed = mainSpawnPos.createConstructionSite(STRUCTURE_STORAGE);
        if (OK == placed) {
            this.memory.storage_placed = true;
        } else {
            this.log("cannot place storage: " + placed);
        }
        return placed
    }

    /**
     * get center of room for logistical operations on resources
     * @type {function}
     * @param {RoomPosition} controllPos for example controll point
     * @return {RoomPosition} logistical center of room
     */
    Room.prototype.findCenter = function(
        controllPos
    ) {
        if (!pos) {
            controllPos = this.controller.pos;
        }
        let centers = []
        for (const source of this.find(FIND_SOURCES)) {
            centers.push(
                this.halfWay(
                    this.planPath(source.pos, controllPos)
                )
            )
        }
        while (1 < centers.length) {
            const oldCenters = [...centers];
            centers = [];
            for (let i = 1; i < oldCenters.length; i++) {
                centers.push(
                    this.halfWay(
                        this.planPath(oldCenters[i - 1], oldCenters[i])
                    )
                )
            }
        }
        return centers[0];
    };


    /**
     * get position on middle of path
     * @type {function}
     * @param {Array} path
     * @return {RoomPosition} center of path
     */
    Room.prototype.halfWay = function(
        path
    ) {
        let ret = null;
        if (path && path.length) {
            const center = path[Math.floor((path.length - 1) / 2)];
            ret = new RoomPosition(center.x, center.y, this.name);
        }
        return ret;
    };

    /**
     * get position on middle of path
     * @type {function}
     * @param {RoomPosition} fromPos
     * @param {RoomPosition} toPos
     */
    Room.prototype.planPath = function(
        fromPos,
        toPos
    ) {
        return this.findPath(
            fromPos,
            toPos, {
                swampCost: 1,
                ignoreCreeps: true,
                ignoreRoads: true,
                ignoreCreeps: true,
                ignoreDestructibleStructures: true
            }
        )
    };

};