// console.log('blah')
let bones;
    fetch('os.json')
      .then(res => res.json())
      .then(data => bones = data)

const models = [
    {
        src:"./assets/Frelon-1.glb",
        poi:'./assets/frelonv3.json',
    },
    {
        src:"./assets/scene.gltf",
        poi:null
    }
]
// let player = new ModelPlayer("crane", "lazy-load", "modeles/5582b6d0-ad24-46e3-a008-7a52c5178cc02.glb", "modeles/Cheval.json") // if you have one model. For severals models, pass them as an array
let playerMulti = new ModelPlayer("crane", "lazy-load", models, null, true, "./assets/pillars_1k.hdr")
/**
 * build and display the player
 */
// const buildedPlayer = player.buildPlayer();
const buildedPlayer = playerMulti.buildPlayer();
// pour éviter d'ouvrir le menu contextuelle du clic droit quand on veut bouger le modele 3D :
// attention : Bien qu'on soit dans un "wordpress part", l'empêchement du clic droit sera sur tout les onglets d'un animal
document.addEventListener('contextmenu', event => event.preventDefault());
const buildControls = () =>{
    /**
     * once the player is loaded : builds its  controls and displays them
     * if you only want to display the 3D model, then do not proceed with this step
     */
    buildedPlayer.addEventListener('load', ()=>{
        // const windowWidth = window.innerWidth * 0.0002645833
        // console.log(windowWidth.toFixed(1))
        // on appelle les méthodes du viewers
        playerMulti.buildControls(); // créé les contrôles pour l'animation (s'il n'y en a pas ne renverra rien)
        playerMulti.buildSidebar(); // créera la sidebar avec les différentes options (voir les hotspots, fullscreen, cacher/montrer, ect)
        playerMulti.controls(); // instantie les contrôles au clavier et la modale les expliquant
        // buildedPlayer.scale = `${windowWidth} ${windowWidth} ${windowWidth}` // Important, ça permet de scale les éléments pour l'AR car les modèles sont beaucoup trop gros
        
        if(document.getElementById('closeIt')){ //on cache le panneau d'option pour une meilleure ergonomie.
            document.getElementById('closeIt').click()
        }

        if(document.getElementById('poiAlert3d')){
            document.getElementById('poiAlert3d').style.display = "none"
        }
        
        // buildedPlayer.updateFraming()

        // buildedPlayer.timeScale = 2;
        const materials = buildedPlayer.model.materials;
        // letsFocus()
        // parkinson()

        if(playerMulti.cogs && document.getElementById('showSideBar')){
            const newCog = document.getElementById('showSideBar')
            document.getElementById('showSideBar').remove()
            document.getElementById('iconsWrapper').append(newCog)

        }
    })
}

buildControls();