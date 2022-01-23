class ModelPlayer{
    /**
     * @param {id of div containing the viewer} _divParent 
     * @param {player's id} _divPlayer 
     * @param {url of the model} _model 
     */
    constructor(_divParent, _divPlayer, _model, _poi){
        this.parent = _divParent;
        this.player = _divPlayer;
        this.model = _model
        this.poi = _poi ? _poi : null
        this.player = null
        this.playerCtrl = null
        this.sidebar = null
        this.show = false;
        this.multi = typeof _model === "object" ? true : false //if there is more than one model
        this.x=0
        this.y=0
        this.z=0
    }

    buildPlayer(id){
        const player = document.createElement('model-viewer')
        player.id = "player";
        player.setAttribute('src', typeof this.model === "string" ? this.model : !id && typeof this.model === "object" ? this.model[0].src : id && typeof this.model === "object" ? this.model[id].src : "")
        player.setAttribute('reveal', "interaction")
        player.setAttribute('skybox-image', "modeles/hall_of_finfish_4k.hdr")
        player.setAttribute('shadow-intensity', "0")
        player.setAttribute('exposure', "1")
        player.setAttribute('ar-modes', "webxr scene-viewer quick-look")
        player.setAttribute('camera-controls', '')
        player.setAttribute('ar', true)

        const poster = document.createElement('div')
        poster.id = "lazy-load-poster"
        poster.slot = 'poster'

        const loadButton = document.createElement('div')
        loadButton.id = "button-load"
        loadButton.slot = "poster"
        loadButton.innerText = "load model"

        player.append(poster)
        player.append(loadButton)
        document.getElementById(this.parent).append(player)
        this.player = player
        return player;
    }
    /**
     * 
     * @builds the play/pause option 
     */
    buildControls(){
        const player = this.player //document.getElementById(this.player)
        const defaultAnimation = player.availableAnimations && player.availableAnimations[0] ? player.availableAnimations[0] : false;
        
        if(defaultAnimation){
            player.setAttribute("animation-name", defaultAnimation)
        }

        const playerParent = document.createElement('div')
        playerParent.id ="myProgress"
        playerParent.classList.add('d-flex')
        playerParent.classList.add('mt-2')
        playerParent.classList.add('mx-auto')
        
        const playBtn = document.createElement('i')
        playBtn.id = "play"
        playBtn.classList.add('fas')
        playBtn.classList.add('fa-play-circle')
        playBtn.classList.add('icones')
        playBtn.onclick = (e)=>{
            if(player.availableAnimations && Array.from(player.availableAnimations).length > 0){
               console.log(player.availableAnimations) 
                if(playBtn.classList.contains('fa-play-circle')){
                    playBtn.classList.remove('fa-play-circle')
                    playBtn.classList.add('fa-pause-circle')
                    player.play({repetitions:1, pingpong:false})
                    move(player.duration, false);
                }else if(playBtn.classList.contains('fa-pause-circle')){
                    playBtn.classList.add('fa-play-circle')
                    playBtn.classList.remove('fa-pause-circle')
                    player.pause()
                    this.move(player.duration, true);
                }
                
            }
            
        }

        const bar = document.createElement('div')
        bar.id="myBar"
        const duration = document.createElement('div')
        duration.id="duration"
        duration.innerText = "0:00 / 0:00"

        // TBC
        // const cursor = document.createElement('div')
        // cursor.id = "time-cursor";

        // cursor.onmousedown=(e)=>{
        //     // window.onmousedown = handleMouseMove;
        //     // console.log(e.clientX)

        //     moveCursor(e.clientX)
        // }

        playerParent.append(playBtn)
        playerParent.append(bar)
        // playerParent.append(cursor)
        playerParent.append(duration)

        player.currentTime=0.1

        player.append(playerParent)

        // function moveCursor(xPos){
        //     console.log(xPos)
        // }

        function move(time, pause) {
            // console.log("temps de l'animation : "+parseInt(time))
            let i = 0;        
            if (i == 0) {
              i = 1;
              const elem = bar;
              let width = 0;
              let id = setInterval(frame, time);
    
              function frame() {
                  
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                    elem.style.width = "0%"
                    player.currentTime=0.1;
                    if(playBtn.classList.contains('fa-pause-circle')){
                        // console.log('oui')
                        playBtn.classList.remove('fa-pause-circle')
                        playBtn.classList.add('fa-play-circle')
                    }else{
                        console.log("non")
                    }
                    player.pause();
                }else {
                    width=player.currentTime>0 ? player.currentTime*100/time : 100;
                    elem.style.width = width  + "%";
                    document.getElementById('duration').innerText = player.currentTime.toFixed(2) + " / " + time.toFixed(2)
                }
              }
            }
        }

        this.playerCtrl = playerParent
        return playerParent;
    }

    buildSidebar(id){
        const parent = document.getElementById(this.parent);
        const player = this.player
        const parts = player.model.materials;
        const defaultAnimation = player.availableAnimations && player.availableAnimations[0] ? player.availableAnimations[0] : false;
        const animationList = player.availableAnimations && player.availableAnimations.length > 1 ? player.availableAnimations : []

        const sideBar = document.createElement('div')
        sideBar.id ="champ-info_troisd"
        sideBar.classList.add('text-center')
        sideBar.classList.add('alert')
        sideBar.classList.add('alert-primary')

        const hr = document.createElement('hr')

        const hideTitle = document.createElement('h5')
        hideTitle.id = "hideTitle"
        hideTitle.classList.add('mt-1')
        hideTitle.innerText = "Show / Hide elements"

        const hideSidebar = document.createElement('button')
        hideSidebar.onclick = (e) =>{
            e.preventDefault()
            this.sidebar.remove()
            this.showSideBar();
            // document.getElementById(this.parent).append(showSidebar)
        }
        hideSidebar.id = "hideSidebar"
        hideSidebar.innerHTML='<i class="fas fa-window-close"></i>'
        hideSidebar.setAttribute('style', 'position:absolute;right:1rem;')
        

        sideBar.appendChild(hideSidebar)

        sideBar.append(hideTitle)
        sideBar.append(hr)
        parts.map((part, id)=>{
            const divCtrl = document.createElement('div')
            divCtrl.classList.add('displayBtn')

            const hideBtn = document.createElement('i')
            hideBtn.classList.add('fas')
            hideBtn.classList.add('fa-eye-slash')
            hideBtn.classList.add('hideElement')
            hideBtn.setAttribute('data-model', id)
            hideBtn.onclick = (e)=>{
                parts[parseInt(e.target.getAttribute("data-model"))].setAlphaMode('MASK')
                setTimeout(() => {
                parts[id].pbrMetallicRoughness.setBaseColorFactor([1,1,1,0]); 
                }, 100);
            }
            divCtrl.append(hideBtn)

            const showBtn = document.createElement('i')
            showBtn.classList.add('fas')
            showBtn.classList.add('fa-eye')
            showBtn.classList.add('showElement')
            showBtn.setAttribute('data-model', id)
            showBtn.onclick = (e)=>{
                parts[parseInt(e.target.getAttribute("data-model"))].setAlphaMode('OPAQUE')
                setTimeout(() => {
                   parts[id].pbrMetallicRoughness.setBaseColorFactor([1,1,1,1]); 
                }, 100);
            } 
            divCtrl.append(showBtn)

            const colorBtn = document.createElement('i')
            colorBtn.classList.add('fas')
            colorBtn.classList.add('fa-paint-roller')
            colorBtn.setAttribute('data-model', id)
            colorBtn.onclick = (e)=>{
                const material = parts[parseInt(e.target.getAttribute("data-model"))]
                material != null ? material.pbrMetallicRoughness.setBaseColorFactor([Math.random(), Math.random(), Math.random()]) : ""
            }
            divCtrl.append(colorBtn)

            const partName = document.createElement('h5')
            partName.innerText = part.name
            divCtrl.append(partName)

            sideBar.append(divCtrl)

            const gamePad = this.buildGamePad()
            sideBar.append(gamePad)
            
        })
        

        player.append(sideBar)
        this.sidebar = sideBar

        if(animationList.length > 0){
            this.buildAnimationSelector(animationList)
        }

        if(this.poi){
            this.hotSpotBtn();
        }

        if(typeof this.model === "object" && id && this.model[id].part){
            // console.log(this.model[id].part)
            this.movePart(this.model[id].part);
        }

        if(typeof this.model === "object" && this.model[0].poi && !id ){
            this.hotSpotBtn();
            this.getOtherModel();
        }else if(id && typeof this.model === "object"){
            this.getOtherModel();
            if(this.model[id].poi){
                this.hotSpotBtn();
            }
        }

        return this.sidebar;
    }

    buildAnimationSelector=(options)=>{
        // console.log(this.sidebar)
        const modelViewer = this.player
        const side = document.getElementById(this.sidebar.id)

        const title = document.createElement('h5')
        title.classList.add('mt-5')
        title.innerText = `This model possesses ${options.length} animations`

        const titleAfterHr = document.createElement('hr')

        const select = document.createElement('select')
        options.map((opt, id)=>{
            const option = document.createElement('option')
            option.value = opt
            option.id = id
            option.label = opt
            select.append(option)
        })

        select.onchange = (e) =>{
            modelViewer.pause()
            modelViewer.animationName = e.target.value
        }

        side.append(title)
        side.append(titleAfterHr)
        side.append(select)
        // console.log(this)
    }

    showSideBar(){
        console.log("blaah")
        const showSidebarBtn = document.createElement('button')
            showSidebarBtn.onclick=(e)=>{
                e.preventDefault();
                this.buildSidebar();
                e.target.remove();
            }
            showSidebarBtn.id = "showSideBar"
            showSidebarBtn.innerHTML = '<i class="fas fa-cogs"></i>'
            // showSidebarBtn.setAttribute('style', 'position:absolute;top:1rem;right:1rem;')
            
        
        document.getElementById(this.parent).append(showSidebarBtn)
    }

    hotSpotBtn(){
        console.log(this.sidebar)
        const modelViewer = this.player
        const json = this.poi && typeof this.model === "string" ? this.poi : typeof this.model === "object" && this.model[0].poi ? this.model[0].poi : null
        const sidebar = this.sidebar

        const hr = document.createElement('hr')
        const title = document.createElement('h5')
        title.classList.add('mt-5')
        title.innerText = "Show points of interests"
        const poiBtn = document.createElement('button')
        poiBtn.id ="poi"
        poiBtn.innerText ="show"
        poiBtn.onclick = (e) =>{
            e.preventDefault();
            if(!this.show){
                fetch(json)
                .then(res=>res.json())
                .then((data)=>{
                    const hotspots = data.hotspots
                    for(let i=0; i<hotspots.length; i++){
                        // console.log(hotspots[i])
                        const spot = document.createElement('button')
                        spot.innerText = hotspots[i]["text"]
                        spot.classList.add('view-button')
                        spot.setAttribute('slot', hotspots[i]["slot"])
                        spot.setAttribute('data-position', hotspots[i]["data-position"])
                        spot.setAttribute('data-normal', hotspots[i]["data-normal"])
                        spot.setAttribute('data-visibility-attribute', hotspots[i]["data-visibility-attribute"])
                        // spot.setAttribute('slot', hotspots[i]["slot"])
                        spot.onclick = (e)=>{
                            e.preventDefault();
                            modelViewer.cameraTarget = hotspots[i]["data-position"];
                            modelViewer.cameraOrbit = hotspots[i]["data-orbit"];
                        }
    
                        console.log(spot)
                        modelViewer.append(spot)
                    }
                })
                poiBtn.innerText = "hide"
                this.show = true;
            }else{
                const elements = document.getElementsByClassName('view-button');
                while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
                }
                poiBtn.innerText = "show"
                this.show = false;
            }
        }

        sidebar.append(title)
        sidebar.append(hr)
        sidebar.append(poiBtn)
    }

    addTextureAndColor(){
        const modelViewerTexture = this.player;
        const materials = modelViewerTexture.model.materials;

        if(materials.length > 0){
            materials.map((material)=>{
                material.pbrMetallicRoughness.setBaseColorFactor([Math.random(), Math.random(), Math.random()])
                material.pbrMetallicRoughness.setRoughnessFactor(1);
            })
        }
    }

    getOtherModel(){
        const select = document.createElement('select')
        select.classList.add('w-100')
        select.classList.add('mt-5')
        const models = this.model
        const sideBar = this.sidebar
        const choose = document.createElement('option')
        choose.value = null
        choose.label = "Change model"
        // choose.disabled = true
        select.append(choose)
        
        models.map((model,id)=>{
            const opt = document.createElement('option')
            opt.id = id;
            opt.value = id
            opt.label = model.src.replace('modeles/','').replace('.glb','')
            select.append(opt)
        })

        /**
            this.player
            this.playerCtrl
            this.sidebar
         */
        select.onchange = (e) =>{
            // console.log(e.target.value)
            if(e.target.value !== null){
                const id = parseInt(e.target.value)
                this.player.remove()
                this.playerCtrl.remove()
                this.sidebar.remove()
                // this.player = ""
                // this.model = models[id].src

                // this.poi = models[id].poi ? models[id].poi : null
                
                const nuovo = this.buildPlayer(id);

                nuovo.addEventListener('load', ()=>{
                    this.buildControls();
                    this.buildSidebar(id);
                    this.multi = true;
                })
            }
            
        }
        
        

        sideBar.append(select)
        
    }

    movePart = (id) =>{
        const part = parseInt(id)
        const modelPart = this.player
        const materials = modelPart.model.materials;
        console.log(modelPart.model.materials[id])

        modelPart.model.materials[id].normalTexture.position = `${150}deg ${250}deg ${250}deg`;
        materials[part]. updateFraming()
    }

    buildGamePad(){
        const model = this.player

        const dpad = document.createElement('div')
        dpad.classList.add('d-pad')
        dpad.classList.add('mx-auto')

        const up = document.createElement('div')
        up.classList.add('d-pad-button')
        up.classList.add('up')
        up.onclick =(e)=>{
            e.preventDefault()
            console.log(model.orientation)
            this.y = this.y-10
            model.orientation = `${this.x}deg ${this.y}deg ${this.z}deg`;
        }

        const down =document.createElement('div')
        down.classList.add('d-pad-button')
        down.classList.add('down')
        down.onclick =(e)=>{
            e.preventDefault()
            console.log(model.orientation)
            this.y = this.y+10
            model.orientation = `${this.x}deg ${this.y}deg ${this.z}deg`;
        }

        const left = document.createElement('div')
        left.classList.add('d-pad-button')
        left.classList.add('left')
        left.onclick=(e)=>{
            e.preventDefault()
            console.log(model.orientation)
            this.x = this.x+10
            model.orientation = `${this.x}deg ${this.y}deg ${this.z}deg`;
        }

        const right = document.createElement('div')
        right.classList.add('d-pad-button')
        right.classList.add('right')
        right.onclick=(e)=>{
            e.preventDefault()
            console.log(model.orientation)
            this.x = this.x-10
            model.orientation = `${this.x}deg ${this.y}deg ${this.z}deg`;
        }

        const barrelRoll = document.createElement('div')
        barrelRoll.classList.add('directions')
        barrelRoll.classList.add('directions-horizontal')
        barrelRoll.classList.add('mx-auto')
        barrelRoll.onclick=(e)=>{
            e.preventDefault()
            console.log(model.orientation)
            this.z = this.z-10
            model.orientation = `${this.x}deg ${this.y}deg ${this.z}deg`;
        }

        dpad.append(up)
        dpad.append(down)
        dpad.append(left)
        dpad.append(right)
        dpad.append(barrelRoll)

        return dpad;
    }

}

/***
 * <button class="Hotspot" 
 * slot="hotspot-1" 
 * data-position="-4.2187474980126485m -0.7969916084390367m -6.023500668861005m" data-normal="0m 1m -2.2204460492503128e-16m" data-visibility-attribute="visible">
 
<button class="Hotspot" slot="hotspot-2" data-position="-9.492227459642127m 0.8358180974986169m 1m" data-normal="0m 0m 1m" data-visibility-attribute="visible">

*/
