
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if (creep.memory.sourceId){
                creep.memory.sourceId = null;
            }
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {            
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.sourceId  == null){
                creep.memory.sourceId = Math.floor(Math.random()*(2));
            }
            if(creep.harvest(sources[creep.memory.sourceId]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourceId], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;