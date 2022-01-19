/**
 * instanciate the 3Dplayer : 
 * 1st parameter: containing div's id, 
 * 2nd paramater:Viewer's id, 
 * 3rd parameter : path to the model. Ideally .glb
 * 4rth paramter : path to the hotspots (optionnal)
 */
let player = new VideoPlayer("crane", "lazy-load", "modeles/5582b6d0-ad24-46e3-a008-7a52c5178cc02.glb", "modeles/Cheval.json")

/**
 * build and display the player
 */
const buildedPlayer = player.buildPlayer();

buildedPlayer.addEventListener('load', ()=>{
    /**
     * once the player id loaded : builds its  controls and displays them
     */
    player.buildControls()
    player.buildHiders()
})