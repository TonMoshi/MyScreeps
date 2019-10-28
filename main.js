var roleEnergyGrinder = require('role.energyGrinder');
var roleEnergyTransport = require('role.energyTransport');

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
            if (Memory.creeps[name].role == "energyGrinder") {
                spawn.memory.actualGrinders -= 1;
                spawn.memory.sourceList[Memory.creeps[name].sourceIndex].working -= 1;
            } else if (Memory.creeps[name].role == "energyTransport") {
                spawn.memory.actualTransport -= 1;
            }
            
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }        
    }
    
    
    if (spawn.room.energyAvailable >= 700  && !spawn.spawning) {

        if(spawn.memory.actualGrinders < spawn.memory.totalGrinders /*&& spawn.memory.actualGrinders <= spawn.memory.actualTransport*/) {
            roleEnergyGrinder.energyGrinder(spawn);
        }    
        else if(spawn.memory.actualTransport < spawn.memory.totalTransport && spawn.memory.actualTransport <= (spawn.memory.actualGrinders*3)) {
            roleEnergyTransport.energyTransport(spawn);
        } 
    }
    

    //var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
    
    var tower = Game.getObjectById('5db228b94779dc1b246b2019');

    if (tower){

        
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_WALL && structure.hits < 150000/*structure.hitsMax*/
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep.spawning){
            if(creep.memory.role == 'energyGrinder') {
                roleEnergyGrinder.run(creep);
            }
            else if(creep.memory.role == 'energyTransport') {
                roleEnergyTransport.run(creep);    
            }

            else if(creep.memory.role == 'harvester') {
                if(creep.carry.energy < creep.carryCapacity) {
                    var source = creep.room.find(FIND_SOURCES)[1];
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {reusePath: 50}, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ) && structure.energy < structure.energyCapacity;
                        }
                    });
                    
                    if (targets.length > 0) {  
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }               
            }
        }        
    }

    // VISUALS
    if(spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    }
    
} 
    

