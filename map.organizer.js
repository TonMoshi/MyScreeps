
var mapOrganizer = {

    /** @param {Spawn} spawn **/
    run: function(spawn) {

        var sources = spawn.room.find(FIND_SOURCES);

        var sourceList = [];       

        for( source in sources )
        {
            var sourcelet = {};
            sourcelet.sourceId = sources[source].id;
            sources[source].pos.x;
            sources[source].pos.y;


        }

        Game.map.getRoomTerrain("W33S23").get(26,46);

    }   

};

/** @param {Int} x @param {Int} y**/
function checkFreeArea(x,y){
    var freePos = [];

    

    return freePos;
}

function checkFreePos(){
    
}

module.export = mapOrganizer;