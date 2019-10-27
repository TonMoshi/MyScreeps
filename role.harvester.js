var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {        
        if(creep.carry.energy < creep.carryCapacity && creep.memory.harvesting) {
            var source = creep.room.find(FIND_SOURCES, {
                filter: { id: creep.memory.sourceId }
                
            })[0];
            //console.log(source);
            //console.log(sources[0].id);
            //var source = _.filter(sources, (source) => source.id == creep.memory.sourceId);
            //var source = sources.find(s => s.id == creep.memory.sourceId);
            //console.log("source: "+ source);
            //console.log(creep.harvest(source));
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 50}, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            creep.memory.harvesting = false;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN /*||
                        structure.structureType == STRUCTURE_TOWER*/) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {                
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.say('🚧');
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.say('⚡');
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            if(creep.carry.energy == 0) {
                creep.say('🔄 harvest');
                creep.memory.harvesting = true;
            }
        }
    }
}

module.exports = roleHarvester;