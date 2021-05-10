const roleInitial =  {

    /** @param {Creep} creep **/
    run: function(creep) {    

        if (creep.carry.energy < creep.carryCapacity && creep.memory.harvesting) {
            var source = creep.room.find(FIND_SOURCES, {
                filter: { id: creep.memory.sourceId }
                
            })[0];

            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 50}, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {

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
    },

    /** @param {Spawn} spawn*/
    initialCreep: function(spawn) {
        var newName = 'initialCreep' + Game.time;
        console.log('Spawning new initialCreep: ' + newName);
        var spawnResult = spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
        {memory: {role: 'initialCreep'}});//100+100+100+100+100+50+50 = 600
        if (spawnResult == 0){
            spawn.memory.actualGrinders += 1;
            Game.creeps[newName].memory.sourceId = checkWorkers(spawn);
            Game.creeps[newName].memory.sourceIndex = spawn.memory.sourceList.findIndex(s => s.sourceId == Game.creeps[newName].memory.sourceId);
            Game.creeps[newName].memory.harvesting = true;
        }        
    }

}

module.exports = roleInitial;