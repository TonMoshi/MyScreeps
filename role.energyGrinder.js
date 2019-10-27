
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) { 
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.harvesting = false;
        }else if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting) {
            var source = creep.room.find(FIND_SOURCES, {
                filter: { id: creep.memory.sourceId }                
            })[0];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 50}, {visualizePathStyle: {stroke: '#ffaa00'}});
            } 
        } else {
            creep.drop( RESOURCE_ENERGY, 50);
        }
         

    },

    /** @param {Spawn} spawn*/
    energyGrinder: function(spawn) {
        var newName = 'energyGrinder' + Game.time;
        console.log('Spawning new energyGrinder: ' + newName);
        var spawnResult = spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
        {memory: {role: 'energyGrinder'}});//100+100+100+100+100+50+50 = 600
        if (spawnResult == 0){
            spawn.memory.actualGrinders += 1;
            Game.creeps[newName].memory.sourceId = checkWorkers(spawn);
            Game.creeps[newName].memory.sourceIndex = spawn.memory.sourceList.findIndex(s => s.sourceId == Game.creeps[newName].memory.sourceId);
            Game.creeps[newName].memory.harvesting = true;
        }        
    }

};


/** @param {Spawn} spawn **/
function checkWorkers(spawn){
    //console.log("spawn: "+spawn);
    let sourceId = "5bbcab2c9099fc012e633058";
    let sourceList = spawn.memory.sourceList;
    
    for(source in sourceList){
        //console.log("source: "+source);
        //if (sourceList[source].working < (sourceList[source].workers)) {
        if (sourceList[source].working < 1) {
            sourceList[source].working += 1;
            sourceId = sourceList[source].sourceId;
            break;
        }
    }
    
    //console.log("SourceId: "+sourceId);

    return sourceId;
}