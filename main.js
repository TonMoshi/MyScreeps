var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var mapOrganizer = require('map.organizer');

module.exports.loop = function () {


    //let terrain = Game.map.getRoomTerrain("W33S23");
    let spawn = Game.spawns['Spawn1'];

    // CHECK FOR MAP INFO, ONLY FIRST TIME
    if(!spawn.memory.sourceList){
       mapOrganizer.run(spawn);
    }

    // ORDERS TO CREEPS AND MEMORY CLEANING
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            spawn.memory.sourceList[Memory.creeps[name].sourceIndex].working -= 1;
            spawn.memory.actualWorkers -= 1;
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        } else {
            var creep = Game.creeps[name];
            if(creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
            else {
                if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
        }
        
    }
    

    if (spawn.room.energyAvailable >= 500  && !spawn.spawning) {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');


              
        if(upgrader.length < Math.floor(spawn.memory.totalWorkers/4) && spawn.memory.actualWorkers < spawn.memory.totalWorkers) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            var spawnResult = spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'upgrader'}});
            if (spawnResult == 0) {
                spawn.memory.actualWorkers += 1;
                Game.creeps[newName].memory.sourceId = checkWorkers(spawn);
                Game.creeps[newName].memory.sourceIndex = spawn.memory.sourceList.findIndex(s => s.sourceId == Game.creeps[newName].memory.sourceId);
                Game.creeps[newName].memory.harvesting = true;
            }
            
        }    
        else if(harvesters.length < Math.floor(spawn.memory.totalWorkers + 1) && spawn.memory.actualWorkers < spawn.memory.totalWorkers + 2) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            var spawnResult = spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'harvester'}});
            if (spawnResult == 0) {
                spawn.memory.actualWorkers += 1;
                Game.creeps[newName].memory.sourceId = checkWorkers(spawn);
                Game.creeps[newName].memory.sourceIndex = spawn.memory.sourceList.findIndex(s => s.sourceId == Game.creeps[newName].memory.sourceId);
                Game.creeps[newName].memory.harvesting = true;
            }
        }  
        /*
        else if(builders.length < Math.floor(spawn.memory.totalWorkers/4) && spawn.memory.actualWorkers < spawn.memory.totalWorkers) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            var spawnResult = spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'builder'}});
            if (spawnResult == 0) {
                spawn.memory.actualWorkers += 1;
                Game.creeps[newName].memory.sourceId = checkWorkers(spawn);
                Game.creeps[newName].memory.sourceIndex = spawn.memory.sourceList.findIndex(s => s.sourceId == Game.creeps[newName].memory.sourceId);
                Game.creeps[newName].memory.harvesting = true;
            }
        }
        */

    }


    /*
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    */

    
    if(spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            //roleBuilder.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            //roleHarvester.run(creep);

        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            //roleHarvester.run(creep);
        }
    }
    
} 




/** @param {Spawn} spawn **/
function checkWorkers(spawn){
    //console.log("spawn: "+spawn);
    let sourceId = "5bbcab2c9099fc012e633058";
    let sourceList = spawn.memory.sourceList;
    for(source in sourceList){
        //console.log("source: "+source);
        if (sourceList[source].working < (sourceList[source].workers + 1)) {
            sourceList[source].working += 1;
            sourceId = sourceList[source].sourceId;
            break;
        }
    }
    //console.log("SourceId: "+sourceId);

    return sourceId;
}

//Memory.creeps.filter(s => s.sourceId == source.id).length