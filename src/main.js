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

const buildControls = () =>{
    /**
     * once the player is loaded : builds its  controls and displays them
     * if you only want to display the 3D model, then do not proceed with this step
     */
    buildedPlayer.addEventListener('load', ()=>{
        player.buildControls();
        player.buildSidebar();

        player.addTextureAndColor(); //only call this function if you use a blank model and want its parts colorized. The color is randomly generated. it also setRoughnessFactor to 1

        const modelViewer = document.querySelector("#player");
        const tapDistance = 2;
        let panning = false;
        let panX, panY;
        let startX, startY;
        let lastX, lastY;
        let metersPerPixel;

        const startPan = () => {
            const orbit = modelViewer.getCameraOrbit();
            const {theta, phi, radius} = orbit;
            const psi = theta - modelViewer.turntableRotation;
            metersPerPixel = 0.75 * radius / modelViewer.getBoundingClientRect().height;
            panX = [-Math.cos(psi), 0, Math.sin(psi)];
            panY = [
            -Math.cos(phi) * Math.sin(psi),
            Math.sin(phi),
            -Math.cos(phi) * Math.cos(psi)
            ];
            modelViewer.interactionPrompt = 'none';
        };

        const stopPan = (event) => {
            panning = false;
        }

        const movePan = (thisX, thisY) => {
            const dx = (thisX - lastX) * metersPerPixel;
            const dy = (thisY - lastY) * metersPerPixel;
            lastX = thisX;
            lastY = thisY;

            const target = modelViewer.getCameraTarget();
            target.x += dx * panX[0] + dy * panY[0];
            target.y += dx * panX[1] + dy * panY[1];
            target.z += dx * panX[2] + dy * panY[2];
            modelViewer.cameraTarget = `${target.x}m ${target.y}m ${target.z}m`;

            // This pauses turntable rotation
            modelViewer.dispatchEvent(new CustomEvent(
                'camera-change', {detail: {source: 'user-interaction'}}));
        };

        const recenter = (pointer) => {
            panning = false;
            if (Math.abs(pointer.clientX - startX) > tapDistance ||
                Math.abs(pointer.clientY - startY) > tapDistance)
            return;
            const hit = modelViewer.positionAndNormalFromPoint(pointer.clientX, pointer.clientY);
            if(hit != null) {
            modelViewer.cameraTarget = hit.position.toString();
            }
            else {
            modelViewer.cameraTarget = 'auto auto auto';
            modelViewer.cameraOrbit = 'auto auto auto';
            }
        };

        modelViewer.addEventListener('mousedown', (event) => {
            startX = event.clientX;
            startY = event.clientY;
            panning = event.button === 2 || event.ctrlKey || event.metaKey ||
                event.shiftKey;
            if (!panning)
            return;

            lastX = startX;
            lastY = startY;
            startPan();
            event.stopPropagation();
        }, true);

        modelViewer.addEventListener('touchstart', (event) => {
            const {targetTouches, touches} = event;
            startX = targetTouches[0].clientX;
            startY = targetTouches[0].clientY;
            panning = targetTouches.length === 2 && targetTouches.length === touches.length;
            if (!panning)
            return;

            lastX = 0.5 * (targetTouches[0].clientX + targetTouches[1].clientX);
            lastY = 0.5 * (targetTouches[0].clientY + targetTouches[1].clientY);
            startPan();
        }, true);

        self.addEventListener('mousemove', (event) => {
            if (!panning)
            return;

            movePan(event.clientX, event.clientY);
            event.stopPropagation();
        }, true);

        modelViewer.addEventListener('touchmove', (event) => {
            if (!panning || event.targetTouches.length !== 2)
            return;

            const {targetTouches} = event;
            const thisX = 0.5 * (targetTouches[0].clientX + targetTouches[1].clientX);
            const thisY = 0.5 * (targetTouches[0].clientY + targetTouches[1].clientY);
            movePan(thisX, thisY);
        }, true);

        let lastMousedown = {time: new Date().getTime()};
        let lastTouchstart = {time: new Date().getTime()};
        function doubletap(timer) {
            var now = new Date().getTime();
            var timesince = now - timer.time;
            timer.time = new Date().getTime();
            if((timesince < 400) && (timesince > 0))
            return true;
            else
            return false;
        }

        self.addEventListener('mouseup', (event) => {
            stopPan(event);
        }, true);

        modelViewer.addEventListener('oncontextmenu', (event) => {
            return false;
        });

        self.addEventListener('mousedown', (event) => {
            if(doubletap(lastMousedown))
                recenter(event);
        }, true);
        
        modelViewer.addEventListener('touchstart', (event) => {
            if (doubletap(lastTouchstart) && event.targetTouches.length === 0) {
            recenter(event.changedTouches[0]);

            if (event.cancelable) {
                event.preventDefault();
            }
            }
        }, true);
    })
}

buildControls();

