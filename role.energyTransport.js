
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {     
        
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.harvesting = true;
        }else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.harvesting = false;
        }
        
        if(creep.memory.harvesting) {
            var source = creep.room.find(FIND_DROPPED_RESOURCES)[0];

            if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 50}, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        (structure.structureType == STRUCTURE_TOWER /*&& structure.energy <= structure.energyCapacity*/)) 
                         && structure.energy < structure.energyCapacity;
                }
            });
            
            if (targets.length > 0) {  
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
                }else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.say('⚡');
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            
        }        
    },

    /** @param {Spawn} spawn*/
    energyTransport: function(spawn) {
        var newName = 'energyTransport' + Game.time;
        console.log('Spawning new energyTransport: ' + newName);
        var spawnResult = spawn.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
        {memory: {role: 'energyTransport'}});//WORK(4x100)+CARRY(6x50)+MOVE(5x50) = 950 ENERGY
        if (spawnResult == 0){
            spawn.memory.actualTransport += 1;
            //Game.creeps[newName].memory.sourceId = checkWorkers(spawn);
            //Game.creeps[newName].memory.sourceIndex = spawn.memory.sourceList.findIndex(s => s.sourceId == Game.creeps[newName].memory.sourceId);
            Game.creeps[newName].memory.harvesting = true;
        }  
    }
};