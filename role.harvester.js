var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {        
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            //console.log(sources);

            if (creep.memory.sourceId == null){
                creep.memory.sourceId = Math.floor(Math.random()*(2));
            }

            if(creep.harvest(sources[creep.memory.sourceId]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourceId], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            if (creep.memory.sourceId){
                creep.memory.sourceId = null;
            }
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;