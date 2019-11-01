module.exports = function() {

    /**
     * Write signed message into console log
     * @type {function}
     * @param {string} message
     */
    Creep.prototype.log = function(
        message
    ) {
        console.log(this.name + " - " + message);
    };

    /**
     * Cach role value
     * @type {string}
     */
    Object.defineProperty(Creep.prototype, 'role', {
        get: function() {
            if (!this._role) {
                this._role = this.memory.role;
            }
            return this._role;
        },
        enumerable: false,
        configurable: true
    });

    /**
     * Move or mine active source on map
     * @type {function}
     */
    Creep.prototype.mineSource = function() {
        const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
    };

    /**
     * get energy from storage
     * @type {function}
     */
    Creep.prototype.withdrawStorage = function() {
        const storage = this.room.storage;
        if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
    };

    /**
     * Fill creep with energy
     * @type {function}
     */
    Creep.prototype.getEnergy = function() {
        if (this.room.storage) {
            this.withdrawStorage();
        } else {
            this.mineSource();
        }
    };


    /**
     * Get carried energy
     * @type {number}
     */
    Object.defineProperty(Creep.prototype, 'energy', {
        get: function() {
            return this.store.getUsedCapacity(RESOURCE_ENERGY);
        },
        enumerable: false,
        configurable: true
    });

    /**
     * Get energy capacity
     * @type {number}
     */
    Object.defineProperty(Creep.prototype, 'energyCapacity', {
        get: function() {
            return this.store.getCapacity(RESOURCE_ENERGY);
        },
        enumerable: false,
        configurable: true
    });

    /**
     * Is there any space left in storage?
     * @type {number}
     */
    Object.defineProperty(Creep.prototype, 'freeCapacity', {
        get: function() {
            return this.store.getFreeCapacity();
        },
        enumerable: false,
        configurable: true
    });

};