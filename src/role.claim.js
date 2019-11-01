module.exports = {
    /** @param {Creep} creep **/
    do_job: function(creep) {
        // room orientation first
        if (creep.room.name == creep.memory.target) {
            // try claim controller
            const code = creep.claimController(creep.room.controller)
            if (code == ERR_NOT_IN_RANGE) {
                // move to controller
                creep.moveTo(creep.room.controller);
            } else if (code == OK) {
                if (Memory.rooms[creep.memory.home] == undefined) {
                    Memory.rooms[creep.memory.home] = {};
                }
                if (Memory.rooms[creep.memory.home].claimed == undefined) {
                    Memory.rooms[creep.memory.home].claimed = [];
                }
                Memory.rooms[creep.memory.home].claimed.push(creep.room.name);
            }
        } // end if in target room
        else {
            const door = creep.room.findExitTo(creep.memory.target)
            creep.moveTo(creep.pos.findClosestByRange(door))
        }
    }
};