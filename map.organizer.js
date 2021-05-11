
var mapOrganizer = {

    /** @param {Spawn} spawn **/
    run: function(spawn) {

        const sources = spawn.room.find(FIND_SOURCES);

        let sourceList = [];  
        let totalGrinders = 0;     

        let roomTerrain = Game.map.getRoomTerrain(spawn.room.name);

        if (sources.length) {
            sources.forEach( source =>
                {
                    let sourcelet = {};
                    sourcelet.sourceId = source.id;
                    sourcelet.workPositions = checkFreeArea(source.pos.x, source.pos.y, roomTerrain);
                    sourcelet.Grinders = sourcelet.workPositions.length;
                    totalGrinders += sourcelet.Grinders;
                    sourcelet.working = 0;
                    sourceList.push(sourcelet);
                } );
        }


        spawn.memory.sourceList = sourceList;
        //spawn.memory.totalGrinders = totalGrinders; CHANGE TO GET TOTAL Grinders == NUMBER OF HARVEST SITES
        spawn.memory.totalGrinders = sources.length * 3; // TODO: CHange this again to sources.length
        spawn.memory.actualGrinders = 0;
        spawn.memory.totalTransport = spawn.memory.totalGrinders * 3;
        spawn.memory.actualTransport = 0;

    }   

}

module.exports = mapOrganizer;

/** @param {Int} x @param {Int} y @param {Terrain} roomTerrain **/
function checkFreeArea(x,y,roomTerrain){
    var freePos = [];

    const checkSwampOrPlain = (terrain) => terrain === 0 || terrain === 2;

    /**
     *  x-1,y-1     x,y-1   x+1,y-1
     *  x-1,y       x,y     x+1,y
     *  x-1,y+1     x,y+1   x+1,y+1
     */
    
    // x-1,y-1
    if(checkSwampOrPlain(roomTerrain.get(x-1,y-1))) freePos.push({"x":x-1, "y":y-1});
    // x,y-1
    if(checkSwampOrPlain(roomTerrain.get(x,y-1))) freePos.push({"x":x, "y":y-1});
    // x+1,y-1
    if(checkSwampOrPlain(roomTerrain.get(x+1,y-1))) freePos.push({"x":x+1, "y":y-1});

    // x-1,y
    if(checkSwampOrPlain(roomTerrain.get(x-1,y))) freePos.push({"x":x-1, "y":y});
    // x+1,y
    if(checkSwampOrPlain(roomTerrain.get(x+1,y))) freePos.push({"x":x+1, "y":y});

    // x-1,y+1
    if(checkSwampOrPlain(roomTerrain.get(x-1,y+1))) freePos.push({"x":x-1, "y":y+1});
    // x,y+1
    if(checkSwampOrPlain(roomTerrain.get(x,y+1))) freePos.push({"x":x, "y":y+1});
    // x+1,y+1
    if(checkSwampOrPlain(roomTerrain.get(x+1,y+1))) freePos.push({"x":x+1, "y":y+1});

    return freePos;
}

