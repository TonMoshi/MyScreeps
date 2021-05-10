
var mapOrganizer = {

    /** @param {Spawn} spawn **/
    run: function(spawn) {

        var sources = spawn.room.find(FIND_SOURCES);

        var sourceList = [];  
        var totalGrinders = 0;     

        var roomTerrain = Game.map.getRoomTerrain("E49N43");

        sources.foreach( source =>
        {
            var sourcelet = {};
            sourcelet.sourceId = sources[source].id;
            sourcelet.workPositions = checkFreeArea(sources[source].pos.x, sources[source].pos.y, roomTerrain);
            sourcelet.Grinders = sourcelet.workPositions.length;
            totalGrinders += sourcelet.Grinders;
            //sourcelet.working = 0;
            sourceList.push(sourcelet);
        } );

        spawn.memory.sourceList = sourceList;
        //spawn.memory.totalGrinders = totalGrinders; CHANGE TO GET TOTAL Grinders == NUMBER OF HARVEST SITES
        spawn.memory.totalGrinders = sources.length;
        spawn.memory.actualGrinders = 0;
        spawn.memory.totalTransport = spawn.memory.totalGrinders*3;
        spawn.memory.actualTransport = 0;

    }   

}

module.exports = mapOrganizer;

/** @param {Int} x @param {Int} y @param {Terrain} roomTerrain **/
function checkFreeArea(x,y,roomTerrain){
    var freePos = [];

    /**
     *  x-1,y-1     x,y-1   x+1,y-1
     *  x-1,y       x,y     x+1,y
     *  x-1,y+1     x,y+1   x+1,y+1
     */
    
    // x-1,y-1
    if(!roomTerrain.get(x-1,y-1)) freePos.push({"x":x-1, "y":y-1});
    // x,y-1
    if(!roomTerrain.get(x,y-1)) freePos.push({"x":x, "y":y-1});
    // x+1,y-1
    if(!roomTerrain.get(x+1,y-1)) freePos.push({"x":x+1, "y":y-1});

    // x-1,y
    if(!roomTerrain.get(x-1,y)) freePos.push({"x":x-1, "y":y});
    // x+1,y
    if(!roomTerrain.get(x+1,y)) freePos.push({"x":x+1, "y":y});

    // x-1,y+1
    if(!roomTerrain.get(x-1,y+1)) freePos.push({"x":x-1, "y":y+1});
    // x,y+1
    if(!roomTerrain.get(x,y+1)) freePos.push({"x":x, "y":y+1});
    // x+1,y+1
    if(!roomTerrain.get(x+1,y+1)) freePos.push({"x":x+1, "y":y+1});

    return freePos;
}

