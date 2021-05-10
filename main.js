var roleInitialCreep = require('role.initial.creep');
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
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }        
    }

    if ( spawn.room.energyAvailable >= 300  &&  !spawn.spawning) {

        roleInitialCreep.initialCreep(spawn);

        // if(spawn.memory.actualGrinders < spawn.memory.totalGrinders /*&& spawn.memory.actualGrinders <= spawn.memory.actualTransport*/) {
        //     roleEnergyGrinder.energyGrinder(spawn);
        // }    
        // else if(spawn.memory.actualTransport < spawn.memory.totalTransport && spawn.memory.actualTransport <= (spawn.memory.actualGrinders*3)) {
        //     roleEnergyTransport.energyTransport(spawn);
        // } 
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep.spawning){
            if(creep.memory.role == 'initialCreep') {
                roleInitialCreep.run(creep);
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