class ModelPlayer{
    /**
     * @param {id of div containing the viewer} _divParent 
     * @param {player's id} _divPlayer 
     * @param {url of the model} _model 
     */
    constructor(_divParent, _divPlayer, _model, _poi, _pad, _environement){
        this.parent = _divParent;
        this.player = _divPlayer;
        this.model = _model
        this.poi = _poi ? _poi : null
        // this.player = null
        this.playerCtrl = null
        this.sidebar = null
        this.show = false;
        this.cogs = null;
        this.environement = _environement
        this.multi = typeof _model === "object" ? true : false //if there is more than one model
        this.x=0
        this.y=0
        this.z=0
        this.loop = true;
        this.pad = _pad ? _pad : true;
        this.fullOn=false
    }

    buildPlayer(id){
        const player = document.createElement('model-viewer')
        player.id = "player";
        player.setAttribute('src', typeof this.model === "string" ? this.model : !id && typeof this.model === "object" ? this.model[0].src : id && typeof this.model === "object" ? this.model[id].src : "")
        if(!localStorage.getItem('interaction')){
            player.setAttribute('reveal', "interaction")
        }
        player.setAttribute('environment-image', this.environement)//neutral
        player.setAttribute('shadow-intensity', "0")
        player.setAttribute('max-field-of-view', "150deg")
        player.setAttribute('min-field-of-view', "10deg")
        player.setAttribute('alt', 'modèle 3D')
        player.setAttribute('bounds', 'tight')
        player.setAttribute('enable-pan', true)
        player.setAttribute('ar-modes', "webxr scene-viewer quick-look")
        player.setAttribute('camera-controls', '')
        player.setAttribute('interaction-prompt', 'none')
        player.setAttribute('ar', true)
        const windowWidth = (window.innerWidth * 0.0002645833).toFixed(2)
        player.scale = `${windowWidth} ${windowWidth} ${windowWidth}`

        const poster = document.createElement('div')
        poster.id = "lazy-load-poster"
        poster.slot = 'poster'

        if(!localStorage.getItem('interaction')){
            const loadButton = document.createElement('div')
            loadButton.id = "button-load"
            loadButton.slot = "poster"
            loadButton.innerText = "Charger"
            player.append(loadButton)
        }
        

        player.append(poster)
        // if(!localStorage.getItem('interaction')){}
        
        document.getElementById(this.parent).append(player)
        this.player = player
        // player.hasBakedShadow();
        // this.controls();
        return player;
    }
    /**
     * 
     * @builds the play/pause option 
     */
    buildControls(){
        // this.controls()
        const player = this.player //document.getElementById(this.player)
        const defaultAnimation = player.availableAnimations && player.availableAnimations[0] ? player.availableAnimations[0] : false;
        // on vérifie d'abord qu'il y a au moins une animation
        // si oui on construit sinon on ne fait rien
        if(Array.from(player.availableAnimations).length > 0){

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
            playBtn.title = "Lancer la lecture de l'animation"
            playBtn.setAttribute("alt", "jouer l'animation")
            playBtn.setAttribute('tabindex', 0)
            playBtn.onclick = (e)=>{
                if(player.availableAnimations && Array.from(player.availableAnimations).length >= 1){
                    if(playBtn.classList.contains('fa-play-circle')){
                        playBtn.classList.remove('fa-play-circle')
                        playBtn.classList.add('fa-pause-circle')
                        // console.log(this.player.src)
                        player.play({repetitions:0, pingpong:false})
                        console.log(this.player.src)
                        move(player.duration, false);
                        setTimeout(() => {
                            if(this.player.src === "modeles/Dinosaur.glb"){
                                const audio = new Audio('modeles/t-rex.wav')
                                audio.play()
                            }
                        }, 500);
                    }else if(playBtn.classList.contains('fa-pause-circle')){
                        playBtn.classList.add('fa-play-circle')
                        playBtn.classList.remove('fa-pause-circle')
                        player.pause()
                        move(player.duration, true);
                    }
                }
            }

            if(document.activeElement === playBtn){
                document.addEventListener('click', (e)=>{
                    if(e.keyCode === 32){
                        e.preventDefault()
                        console.log('blah')
                    }
                })
            }

            const playLoop = document.createElement('i')
            playLoop.classList.add('fas')
            playLoop.classList.add('fa-sync-alt')
            playLoop.classList.add('icones')
            playLoop.setAttribute('tabindex', 0)
            playLoop.setAttribute('alt', 'Jouer en continue')
            playLoop.title = "Jouer en continue"
            playLoop.style.backgroundColor = "rgba(0,0,0,0)"
            playLoop.onclick = (e) =>{
                player.play({repetitions:"infinity", pingpong:false})
                // console.log(document.getElementById('play'))
                const play = document.getElementById('play')

                if(play.classList.contains('fa-play-circle')){
                    play.classList.remove('fa-play-circle')
                    play.classList.add('fa-pause-circle')
                    player.play({repetitions:"infinity", pingpong:false})
                    move(player.duration, false); 
                }
                
            }
            const bar = document.createElement('div')
            bar.id="myBar"
            const duration = document.createElement('div')
            duration.id="duration"
            duration.innerText = "0:00 / 0:00"

            playerParent.append(playLoop)
            playerParent.append(playBtn)
            playerParent.append(bar)
            // playerParent.append(cursor)
            playerParent.append(duration)
            player.currentTime=0.1
            player.append(playerParent)

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
                        }

                    }else {
                        
                        width=player.currentTime>0 ? player.currentTime*100/time : 100;
                        elem.style.width = width  + "%";
                        if(document.getElementById('duration')){
                            document.getElementById('duration').innerText = player.currentTime.toFixed(2) + " / " + time.toFixed(2)
                        }
                    }
                }
                }
            }

            const speedSelect = document.createElement('select')
            speedSelect.style.width = "75px"
            speedSelect.classList.add('form-select')
            let speeds = [1, 0.5, 2, 3] //, -1
            speeds.map((vit)=>{
                let optV = document.createElement('option')
                optV.value=vit
                optV.label = vit > -1 ? "X"+vit : "↶"
                speedSelect.append(optV)
            })
            speedSelect.onchange = (e)=>{
                // console.log(e.target.value)
                this.player.timeScale = e.target.value
            }
            playerParent.prepend(speedSelect)

            this.playerCtrl = playerParent
            return playerParent;
        }
        
    }

    buildSidebar(id){
        const parent = document.getElementById(this.parent);
        const modelId = id;
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
        hideTitle.classList.add('mt-5')
        hideTitle.innerText = "Montrer / cacher des éléments"

        const hideSidebar = document.createElement('button')
        hideSidebar.classList.add('btn')
        hideSidebar.classList.add('text-white')
        hideSidebar.onclick = (e) =>{
            e.preventDefault()
            this.sidebar.remove()
            this.showSideBar();
            // document.getElementById(this.parent).append(showSidebar)
        }
        hideSidebar.id = "hideSidebar"
        // oui je sais, innerHtml c'est l'enfer qui m'attend
        hideSidebar.innerHTML='<i class="fas fa-window-close" id="closeIt"></i>'
        hideSidebar.setAttribute('style', 'position:absolute;right:1rem;')
        
        const fullScreen = this.fullScreener()
        sideBar.appendChild(fullScreen)
        

        sideBar.appendChild(hideSidebar)

        sideBar.append(hideTitle)
        sideBar.append(hr)
        if(parts.length >= 0){
            //on va nester les deux boutons dans une div
            const hidersDiv = document.createElement('div')
            hidersDiv.classList.add('d-flex', 'justify-content-between')

            const showAll = document.createElement('button')
            showAll.classList.add('btn', 'btn-secondary')
            showAll.innerText = "Voir tout"
            showAll.setAttribute('aria-label', 'Afficher tous les éléments du modèle')
            showAll.setAttribute('tabindex', '0')
            showAll.onclick = (e) =>{
                //hideElement
                const hiders = document.getElementsByClassName('showElement')
                for(let i = 0; i < hiders.length; i++){
                    hiders[i].click()
                }
            }

            const hideAll = document.createElement('button')
            hideAll.classList.add('btn', 'btn-secondary', 'ml-2')
            hideAll.innerText = "Cacher tout"
            hideAll.setAttribute('tabindex', '0')
            hideAll.setAttribute('aria-label', 'Cacher tous les éléments du modèle')
            hideAll.onclick = (e) =>{
                //hideElement
                const hiders = document.getElementsByClassName('hideElement')
                for(let i = 0; i < hiders.length; i++){
                    hiders[i].click()
                }
            }

            hidersDiv.append(showAll)
            hidersDiv.append(hideAll)
            sideBar.append(hidersDiv)
        }
        parts.map((part, id)=>{
            const divCtrl = document.createElement('div')
            divCtrl.classList.add('displayBtn')
            divCtrl.classList.add('mt-1')
            divCtrl.classList.add('d-flex')

            const hideBtn = document.createElement('i')
            hideBtn.classList.add('fas')
            hideBtn.classList.add('btn')
            hideBtn.classList.add('text-white')
            hideBtn.classList.add('fa-eye-slash')
            hideBtn.classList.add('hideElement')
            hideBtn.setAttribute('data-model', id)
            hideBtn.setAttribute('tabindex', 0)
            hideBtn.title = "Cacher l'élément"
            hideBtn.setAttribute('alt', 'Cacher l\'élément')
            hideBtn.onclick = (e)=>{
                parts[parseInt(e.target.getAttribute("data-model"))].setAlphaMode('MASK')
                hideBtn.style.display = "none"
                showBtn.style.display = "block"
                setTimeout(() => {
                parts[id].pbrMetallicRoughness.setBaseColorFactor([1,1,1,0]); 
                }, 100);
            }
            divCtrl.append(hideBtn)

            const showBtn = document.createElement('i')
            showBtn.classList.add('fas')
            showBtn.classList.add('btn')
            showBtn.classList.add('text-white')
            showBtn.classList.add('fa-eye')
            showBtn.classList.add('showElement')
            showBtn.setAttribute('tabindex', 0)
            showBtn.setAttribute('alt', 'cacher l\'élément')
            showBtn.title = "cacher l'élément"
            showBtn.setAttribute('data-model', id)
            showBtn.style.display = "none"
            showBtn.onclick = (e)=>{
                parts[parseInt(e.target.getAttribute("data-model"))].setAlphaMode('OPAQUE')
                showBtn.style.display = 'none'
                hideBtn.style.display = "block"
                setTimeout(() => {
                   parts[id].pbrMetallicRoughness.setBaseColorFactor([1,1,1,1]); 
                }, 100);
            } 
            divCtrl.append(showBtn)

            const colorBtn = document.createElement('i')
            colorBtn.classList.add('fas')
            colorBtn.classList.add('btn')
            colorBtn.classList.add('text-white')
            colorBtn.classList.add('fa-paint-roller')
            colorBtn.setAttribute('tabindex', 0)
            colorBtn.setAttribute('alt', "Changer la couleur de l'élément")
            colorBtn.setAttribute('aria-label', "Changer la couleur de l'élément")
            colorBtn.title = "Changer la couleur de l'élément"
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
        })

        player.append(sideBar)
        this.sidebar = sideBar

        if(animationList.length > 1){
            // S'il y a plusieurs animation on construira un select avec leur ensemble
            this.buildAnimationSelector(animationList)
        }

        if(this.poi){
            this.hotSpotBtn(modelId);
        }

        if(typeof this.model === "object" && id && this.model[id].part){
            // console.log(this.model[id].part)
            this.movePart(this.model[id].part);
        }
        
        if(typeof this.model === "object" && this.model[0].poi && !id){
            // console.log('if(typeof this.model === "object" && this.model[0].poi && !id){')
            this.hotSpotBtn(modelId);
            this.getOtherModel();
        }else if(id && typeof this.model === "object"){
            // console.log('}else if(id && typeof this.model === "object"){')
            this.getOtherModel(modelId);
            if(this.model[id].poi){
                this.hotSpotBtn(modelId);
            }
        }else{
            this.getOtherModel();
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
        select.classList.add('form-control')
        // select.classList.append('form-control')
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
    }

    showSideBar(){
        // console.log("blaah")
        const showSidebarBtn = document.createElement('span')
        showSidebarBtn.classList.add('btn')
        showSidebarBtn.classList.add('text-white')
            showSidebarBtn.onclick=(e)=>{
                e.preventDefault();
                this.buildSidebar();
                showSidebarBtn.remove()
            }
            showSidebarBtn.id = "showSideBar"
            showSidebarBtn.innerHTML = '<i class="fas fa-cogs" tabindex="0" id="fa-cogs"></i>'
            this.cogs = showSidebarBtn;
        if(document.getElementById('iconsWrapper')){
            document.getElementById('iconsWrapper').append(showSidebarBtn)
        }else{
            document.getElementById(this.parent).append(showSidebarBtn)
        }
    }

    hotSpotBtn(id){
        const modelViewer = this.player
        const json = this.poi && typeof this.model === "string" ? this.poi : typeof this.model === "object" && id ? this.model[id].poi : typeof this.model === "object" && this.model[0].poi ? this.model[0].poi : null
        const sidebar = this.sidebar
        const windowWidth = (window.innerWidth * 0.0002645833).toFixed(2)
        const hr = document.createElement('hr')
        const title = document.createElement('h5')
        title.classList.add('mt-5')
        title.innerText = "Voir les points d'intérêts"
        const poiBtn = document.createElement('button')
        poiBtn.classList.add('btn')
        poiBtn.id ="poi"
        poiBtn.innerText ="voir"
        poiBtn.onclick = (e) =>{
            e.preventDefault();
            if(!this.show){
                fetch(json)
                .then(res=>res.json())
                .then((data)=>{
                    const hotspots = data.hotspots
                    for(let i=0; i<hotspots.length; i++){
                        let dPositionArray = hotspots[i]["data-position"].split(' ')
                            let dPositionString = [];
                            dPositionArray.map((p)=>{
                                // console.log(parseFloat(p.slice(0, -1)))
                                let newP = (parseFloat(p.slice(0, -1)))*windowWidth
                                dPositionString.push(newP.toString()+"m")
                            })
                        const spot = document.createElement('button')
                        // spot.innerText = hotspots[i]["text"]
                        const nomOs = hotspots[i]["text"];
                        spot.classList.add('view-button')
                        spot.innerText = i+1
                        spot.setAttribute('slot', hotspots[i]["slot"])
                        spot.setAttribute('data-position', dPositionString.join(' ')) //hotspots[i]["data-position"]
                        spot.setAttribute('data-normal', hotspots[i]["data-normal"])
                        spot.setAttribute('data-visibility-attribute', hotspots[i]["data-visibility-attribute"])
                        spot.setAttribute('tabindex', "0")
                        spot.setAttribute('aria-label', 'Point d\'intérêt')
                        // spot.setAttribute('slot', hotspots[i]["slot"])
                        spot.onclick = (e)=>{
                            e.preventDefault();
                            // console.log(spot.dataset.normal + " :normal")
                            // console.log(spot.dataset.position + " :position")
                            const isFound = bones.some(element => {
                                if (element.nom.toLowerCase().replace(/\s/g, '') === nomOs.toLowerCase().replace(/\s/g, '')) {
                                    if(element.description && element.description !== ""){
                                        // return nomOs + "\n\r" + element.description;
                                        Swal.fire({
                                            title:nomOs,
                                            text:element.description
                                        })
                                    }else{
                                        Swal.fire(nomOs)
                                    }
                                }
                              });
                        }
                        modelViewer.append(spot)
                    }
                })
                poiBtn.innerText = "Cacher"
                this.show = true;
            }else{
                const elements = document.getElementsByClassName('view-button');
                while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
                }
                poiBtn.innerText = "Voir"
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
        if(this.model.length > 1){
            const select = document.createElement('select')
            select.classList.add('w-100')
            select.classList.add('mt-5')
            select.classList.add('form-control')
            const models = this.model
            const sideBar = this.sidebar
            const choose = document.createElement('option')
            choose.value = null
            choose.label = "Changer de modèle"
            // choose.disabled = true
            select.append(choose)
            
            models.map((model,id)=>{
                const opt = document.createElement('option')
                opt.id = id;
                opt.value = id
                opt.label = this.player.src && model.src.replace('modeles/','').replace('.glb','').split("/").pop() === this.player.src.replace('modeles/','').replace('.glb','').split("/").pop() ? model.src.replace('modeles/','').replace('.glb','').split("/").pop() + " (modèle affiché)" : model.src.replace('modeles/','').replace('.glb','').split("/").pop()
                opt.disabled = this.player.src && model.src.replace('modeles/','').replace('.glb','').split("/").pop() === this.player.src.replace('modeles/','').replace('.glb','').split("/").pop() ? true : false
                // opt.selected = this.player.src && model.src.replace('modeles/','').replace('.glb','').split("/").pop() === this.player.src.replace('modeles/','').replace('.glb','').split("/").pop() ? true : false
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
                    // console.log(this.player)
                    const id = parseInt(e.target.value)
                    this.player.remove()
                    if(this.playerCtrl){
                        this.playerCtrl.remove()
                    }                    
                    this.sidebar.remove()
                    const nuovo = this.buildPlayer(id);

                    nuovo.addEventListener('load', ()=>{
                        this.buildControls();
                        this.buildSidebar(id);
                        this.multi = true;
                        this.controls(id)

                        if(document.getElementById('fa-cogs')){
                            document.getElementById('fa-cogs').remove()
                        }

                        if(document.getElementById('closeIt')){ //on cache le panneau d'option pour une meilleure ergonomie.
                            document.getElementById('closeIt').click()
                        }
                
                        if(document.getElementById('poiAlert3d')){
                            document.getElementById('poiAlert3d').style.display = "none"
                        }
                        if(playerMulti.cogs && document.getElementById('showSideBar')){
                            const newCog = document.getElementById('showSideBar')
                            document.getElementById('showSideBar').remove()
                            document.getElementById('iconsWrapper').append(newCog)
                        }
                    })
                }
                
            }
            // on ajoute le select à la sidebar à droite
            if(window.innerWidth >= 800){
                sideBar.append(select)
            }else{
                this.player.append(select)
            }
        }
    }

    movePart = (id) =>{
        const part = parseInt(id)
        const modelPart = this.player
        const materials = modelPart.model.materials;
        // console.log(modelPart.model.materials[id])

        modelPart.model.materials[id].normalTexture.position = `${150}deg ${250}deg ${250}deg`;
        materials[part]. updateFraming()
    }

    fullScreener(){
        const model = document.getElementById(this.parent)
        const fsBtn = document.createElement('i')
        fsBtn.classList.add('fas')
        fsBtn.classList.add('fa-expand-arrows-alt')
        fsBtn.classList.add('btn')
        fsBtn.classList.add('btn-info')
        fsBtn.classList.add('text-white')
        fsBtn.setAttribute('tabindex', 0)
        fsBtn.title = "Plein écran"
        fsBtn.setAttribute('alt', 'Plein écran')
        // fsBtn.classList.add('icones')
        fsBtn.setAttribute('style', 'position:absolute;left:1rem;')

        fsBtn.onclick = (e) =>{
            e.preventDefault()

            if (document.fullscreenElement) {
                document.exitFullscreen()
            }else{
                model.requestFullscreen();
            }
        }

        return fsBtn
    }

    // Gestion des contrôles clavier / souris + modale explicative
    controls(id){
        const modelViewer = document.querySelector("#player");
        const parts = player.model.materials;
        const json = this.poi && typeof this.model === "string" ? this.poi : typeof this.model === "object" && id ? this.model[id].poi : typeof this.model === "object" && this.model[0].poi ? this.model[0].poi : null
        // on va mettre les icones dans un conteneur flex et colonne. Comme on va le prepend il sera à gauche
        const cogs = this.cogs ? this.cogs : null

        const iconsWrapper = document.createElement('div')
        iconsWrapper.id = "iconsWrapper"
        iconsWrapper.classList.add('d-flex', 'flex-column')
        iconsWrapper.style.maxWidth = "2rem"
        iconsWrapper.style.position = "absolute"

        const questionMark = document.createElement('i')
        questionMark.classList.add('fa-solid', 'fa-circle-question', 'mb-4')
        questionMark.setAttribute('aria-label', 'Voir les commandes au clavier')
        questionMark.setAttribute('tabindex', '0')
        questionMark.style.fontSize = "1.5rem"
        questionMark.style.borderRadius = "50%"
        questionMark.style.cursor = "pointer"
        questionMark.onclick = (e) =>{
            e.preventDefault() //peut sembler inutile mais des fois model viewer crois que le click est pour lui (dunno why though^^)
            Swal.fire({
                title:"Contrôles",
                html:'<div class="alert-danger"><strong>Attention !</strong><br /><span>S\'il y a des points d\'intérêts affichés, ils ne suivront pas les mouvements du modèle</span></div>'+
                    '<div class="mt-1" style="text-align:left !important;"><img src="../../wp-content/themes/animalia/img/32041.png" width="50px"></img>Orienter le modèle (maintenir)</div>'+
                     '<div class="mt-1" style="text-align:left !important;"><img src="../../wp-content/themes/animalia/img/31532.png" width="50px"></img>Déplacer le modèle (maintenir)</div>'+
                     '<div class="mt-1" style="text-align:left !important;"><img src="../../wp-content/themes/animalia/img/32041-double.png" width="50px"></img>Recentrer le modèle (double clique rapide)</div>'+
                     '<div class="mt-1" style="text-align:left !important;"><img src="../../wp-content/themes/animalia/img/32041-both.png" width="50px"></img>Changer l\'axe de rotation (simple clique)</div>'+
                     '<p class="text-center h3">Raccourcis clavier<p>'+
                     '<div class="mt-1" style="text-align:left !important;"><i class="fa-solid fa-keyboard"></i> (touche 2/4/6/7/8/9) Orienter le modèle</div>'+
                     '<div class="mt-1" style="text-align:left !important;"><i class="fa-solid fa-keyboard"></i> (touche 5) Recentrer le modèle</div>'+
                     '<div class="mt-1" style="text-align:left !important;"><i class="fa-solid fa-keyboard"></i> (touche +/-) Zoomer / Dézoomer</div>'+
                     '<div class="mt-1" style="text-align:left !important;"><i class="fa-solid fa-keyboard"></i> (touche 0/1) Luminosité (↓/↑)</div>'
                    //  '<div class="mt-1" style="text-align:left !important;"><i class="fa-solid fa-keyboard"></i> (espace) Play / Pause</div>'
            })
        }

        const fullScreen = document.createElement('i')
        fullScreen.classList.add('fas', 'fa-expand-arrows-alt', 'mb-4', "rounded")
        fullScreen.setAttribute('aria-label', "plein écran")
        fullScreen.setAttribute('tabindex', "0")
        fullScreen.style.fontSize = "1.5rem"
        fullScreen.style.borderRadius = "50%"
        fullScreen.style.cursor = "pointer"
        fullScreen.onclick = e =>{
            if (document.fullscreenElement) {
                document.exitFullscreen()
            }else{
                modelViewer.requestFullscreen();
            }
        }

        // hideall
        const hideAll = document.createElement('i')
        hideAll.classList.add('fas', 'fa-eye-slash', "rounded")
        hideAll.style.fontSize = "1.5rem"
        hideAll.style.borderRadius = "50%"
        hideAll.style.cursor = "pointer"
        hideAll.setAttribute('aria-label', 'Cacher et voir tout le model')
        hideAll.setAttribute('tab-index', '0')
        hideAll.onclick = e =>{
            if(hideAll.classList.contains('fa-eye-slash')){
                hideAll.classList.remove('fa-eye-slash')
                hideAll.classList.add('fa-eye')
                parts.map((part)=>{
                    part.setAlphaMode('MASK')
                    part.pbrMetallicRoughness.setBaseColorFactor([1,1,1,0]); 
                })
            }else if(hideAll.classList.contains('fa-eye')){
                hideAll.classList.remove('fa-eye')
                hideAll.classList.add('fa-eye-slash')
                parts.map((part)=>{
                    part.setAlphaMode('OPAQUE')
                    part.pbrMetallicRoughness.setBaseColorFactor([1,1,1,1]); 
                })
            }
        }
        let poiBtn = null
        if(json){
            // console.log(this.poi)
            hideAll.classList.add("mb-4")
            poiBtn = document.createElement('i')
            poiBtn.classList.add('fas', 'fa-map-marked-alt', "mb-4")
            poiBtn.setAttribute('tabindex', '0')
            poiBtn.style.cursor = 'pointer'
            poiBtn.style.fontSize = "1.5rem"
            const windowWidth = (window.innerWidth * 0.0002645833).toFixed(2)
            poiBtn.onclick = e =>{
                if(!this.show){
                    fetch(json)
                    .then(res=>res.json())
                    .then((data)=>{
                        const hotspots = data.hotspots
                        for(let i=0; i<hotspots.length; i++){
                            let dPositionArray = hotspots[i]["data-position"].split(' ')
                            let dPositionString = [];
                            dPositionArray.map((p)=>{
                                // console.log(parseFloat(p.slice(0, -1)))
                                let newP = (parseFloat(p.slice(0, -1)))*windowWidth
                                dPositionString.push(newP.toString()+"m")
                            })
                            // console.log(hotspots[i]["data-position"].split(' '))
                            // console.log(dPositionString.join(' '))
                            const spot = document.createElement('button')
                            const nomOs = hotspots[i]["text"];
                            spot.classList.add('view-button')
                            spot.innerText = i+1
                            spot.setAttribute('slot', hotspots[i]["slot"])
                            // spot.setAttribute('data-position', hotspots[i]["data-position"])
                            spot.setAttribute('data-position', dPositionString.join(' '))
                            spot.setAttribute('data-normal', hotspots[i]["data-normal"])
                            spot.setAttribute('data-visibility-attribute', hotspots[i]["data-visibility-attribute"])
                            spot.setAttribute('tabindex', "0")
                            spot.setAttribute('aria-label', 'Point d\'intérêt')
                            spot.onclick = (e)=>{
                                e.preventDefault();
                                const isFound = bones.some(element => {
                                    if (element.nom.toLowerCase().replace(/\s/g, '') === nomOs.toLowerCase().replace(/\s/g, '')) {
                                        if(element.description && element.description !== ""){
                                            Swal.fire({
                                                title:nomOs,
                                                text:element.description,
                                                target:this.player
                                            })
                                        }else{
                                            Swal.fire({
                                                text:nomOs,
                                                target:this.player
                                            })
                                        }
                                    }
                                  });
                            }
                            modelViewer.append(spot)
                        }
                    })
                    // poiBtn.innerText = "Cacher"
                    this.show = true;
                }else{
                    const elements = document.getElementsByClassName('view-button');
                    while(elements.length > 0){
                    elements[0].parentNode.removeChild(elements[0]);
                    }
                    // poiBtn.innerText = "Voir"
                    this.show = false;
                }
            }
        }
        // hideAll.style.background = "linear-gradient(#436fb5, #508dbb, #58a3ac, #62b997)"

        // generation d'une icône pour recentrer le modèle. Comportements "étranges"
        const bullsEye = document.createElement('i')
        bullsEye.classList.add('fa', 'fa-bullseye', "rounded", 'mt-2', 'mb-4')
        bullsEye.style.fontSize = "1.5rem"
        bullsEye.style.borderRadius = "50%"
        bullsEye.style.cursor = "pointer"
        bullsEye.setAttribute('title', 'recentrer le modèle')
        bullsEye.setAttribute('aria-label', 'recentrer le modèle')
        bullsEye.setAttribute('tab-index', '0')
        bullsEye.onclick = e =>{
            modelViewer.updateFraming()
        }

        const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

        const brush = document.createElement('i')
        brush.classList.add('fas', 'fa-paint-roller', "rounded", 'mt-2', 'mb-4')
        brush.style.fontSize = "1.5rem"
        brush.style.borderRadius = "50%"
        brush.style.cursor = "pointer"
        brush.setAttribute('title', 'Peindre les éléments')
        brush.setAttribute('aria-label', 'Peindre les éléments')
        brush.setAttribute('tab-index', '0')
        brush.onclick = e =>{
            const parts = player.model.materials;
            parts.map(part=>{
                part.pbrMetallicRoughness.setBaseColorFactor([Math.random(), Math.random(), Math.random()])
            })
            
        }

        iconsWrapper.append(questionMark)
        iconsWrapper.append(fullScreen)
        iconsWrapper.append(hideAll)
        iconsWrapper.append(bullsEye)
        if(poiBtn){
            // console.log(poiBtn)
            iconsWrapper.append(poiBtn)
        }
        iconsWrapper.append(brush)
        if(cogs){
            console.log(cogs)
            iconsWrapper.append(cogs)
        }

        modelViewer.appendChild(iconsWrapper)
        
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

        const nuovo = document.getElementById('player')

        let x = this.x
        let y = this.y
        let z = this.z

        let fieldOfView = 50
        let exposure = 1.1
        let play = false
        document.addEventListener('keydown', (e)=>{
            
            if(e.keyCode === 104 || e.keyCode === 56){
                e.preventDefault()
                if(document.getElementById('player')){
                    y = y-10
                    nuovo.orientation = `${x}deg ${y}deg ${z}deg`;
                }
            }

            if(e.keyCode === 98 || e.keyCode === 50){
                e.preventDefault()
                if(document.getElementById('player')){
                    y = y+10
                    nuovo.orientation = `${x}deg ${y}deg ${z}deg`;
                }
            }

            if(e.keyCode === 100 || e.keyCode === 52){
                e.preventDefault()
                if(document.getElementById('player')){
                    x = x+10
                    nuovo.orientation = `${x}deg ${y}deg ${z}deg`;
                }
            }

            if(e.keyCode === 102 || e.keyCode === 54){
                e.preventDefault()
                if(document.getElementById('player')){
                    x = x-10
                    nuovo.orientation = `${x}deg ${y}deg ${z}deg`;
                }
            }

            if(e.keyCode === 103 || e.keyCode === 55){
                e.preventDefault()
                if(document.getElementById('player')){
                    z = z-10
                    nuovo.orientation = `${x}deg ${y}deg ${z}deg`;
                }
            }

            if(e.keyCode === 105 || e.keyCode === 57){
                e.preventDefault()
                if(document.getElementById('player')){
                    z = z+10
                    nuovo.orientation = `${x}deg ${y}deg ${z}deg`;
                }
            }

            if(e.keyCode === 109){
                e.preventDefault()
                
                if(document.getElementById('player')){
                    fieldOfView = fieldOfView <= 140 ? fieldOfView+10 : fieldOfView
                    nuovo.fieldOfView = fieldOfView+"deg"
                }
            }

            if(e.keyCode === 107){
                e.preventDefault()
                if(document.getElementById('player')){
                    fieldOfView = fieldOfView > 10 ? fieldOfView-10 : fieldOfView
                    nuovo.fieldOfView = fieldOfView+"deg"
                }
            }

            if(e.keyCode === 96 || e.keyCode === 48){
                e.preventDefault()
                if(document.getElementById('player')){
                    exposure = exposure >= 0.2 ? exposure - 0.1 : exposure
                    nuovo.exposure = exposure
                }
            }

            if(e.keyCode === 97 || e.keyCode === 49){
                e.preventDefault()
                if(document.getElementById('player')){
                    exposure = exposure <= 5 ? exposure + 0.1 : exposure
                    nuovo.exposure = exposure
                }
            }

            if(e.keyCode === 101 || e.keyCode === 53){
                e.preventDefault()
                if(document.getElementById('player')){
                    nuovo.cameraTarget = 'auto auto auto';
                    nuovo.cameraOrbit = 'auto auto auto';
                }
            }
        })
    }
}

/**
 * 
 * Quelques notes :
 * 
 * Les modèles du site ne sont pas à l'échelle mais si ça devait se faire, il est possible d'afficher
 * conditionnellement les dimensions du modele (longueur, largeur et profondeur) :
 * https://modelviewer.dev/examples/annotations/index.html#dimensions
 * Conseil : Comme il s'agit de 11 boutons dont on met à jour le dataset, je conseille de créer un array d'objet et
 * de faire un .map() dessus pour créer et append les boutons.
 * 
 */
/*
<model-viewer bounds="tight" enable-pan src="Frelon-1.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls environment-image="neutral" poster="poster.webp" shadow-intensity="1">
    <button class="Hotspot" slot="hotspot-1" data-position="-421.5985737198323m 396.99711862280316m -0.39814903707031135m" data-normal="-0.9843421555329593m 0.174614241402124m 0.024091233681321125m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Clypeus
        </div>
    </button><button class="Hotspot" slot="hotspot-2" data-position="-420.4415666311206m 347.92319381770915m -0.8348059103347791m" data-normal="-0.9838157904411087m -0.1443014847082407m -0.10622415916228341m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Labre
        </div>
    </button><button class="Hotspot" slot="hotspot-3" data-position="-377.48137454200014m 291.2115114624923m 9.200739856578132m" data-normal="-0.8103917831504107m -0.5858310756534504m 0.008191983948907118m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Mandibule
        </div>
    </button><button class="Hotspot" slot="hotspot-6" data-position="-321.6573318338251m 290.93020151896224m -28.66491412165044m" data-normal="-0.4282940311289271m 0.23201971209956973m -0.8733447635937177m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Complexe maxillo-labial
        </div>
    </button><button class="Hotspot" slot="hotspot-7" data-position="-382.77484155199227m 433.1687297060706m -115.7170007115476m" data-normal="-0.9097972696691711m 0.13743285219711981m -0.39163904202656596m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Yeux composés
        </div>
    </button><button class="Hotspot" slot="hotspot-8" data-position="-507.99999691981384m 392.4913265911405m -227.86778802722648m" data-normal="-0.9636680265911368m -0.17711481597043677m -0.1999356808818838m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Flagelle
        </div>
    </button><button class="Hotspot" slot="hotspot-9" data-position="-386.06175259586166m 512.1070073979815m -49.21597853171342m" data-normal="-0.6829280284451639m 0.1091886710250215m 0.722279130311676m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Scape
        </div>
    </button><button class="Hotspot" slot="hotspot-10" data-position="-387.0376704751259m 540.4155558929062m -66.98007572716539m" data-normal="-0.4868038167824284m 0.6316499619450746m 0.6033575801635757m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Pédicelle
        </div>
    </button><button class="Hotspot" slot="hotspot-11" data-position="-355.3793551031779m 517.4662526110583m 6.955825110497727m" data-normal="-0.6525872942315695m 0.7484077505184398m 0.11838776276054844m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Front
        </div>
    </button><button class="Hotspot" slot="hotspot-12" data-position="-292.42920640294915m 542.6798768792482m -20.717054855151503m" data-normal="-0.1782823475552015m 0.9834312306775919m -0.032839291681817435m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Ocelles
        </div>
    </button><button class="Hotspot" slot="hotspot-13" data-position="386.2331051619144m 537.1587465925246m -710.8435166810752m" data-normal="0.5736235925982951m 0.1820068753647809m 0.7986422674355362m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Ailes membraneuses
        </div>
    </button><button class="Hotspot" slot="hotspot-14" data-position="514.2732748145995m 501.15562649605164m -49.98674256054869m" data-normal="0.4718828881061726m 0.8647385969903146m -0.17191189251415936m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Tergites du gastre
        </div>
    </button><button class="Hotspot" slot="hotspot-16" data-position="136.15445528968723m 335.52684508358135m -10.82240900314794m" data-normal="0.05189558201907877m -0.4356048948817173m 0.898640764778668m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Pétiole
        </div>
    </button><button class="Hotspot" slot="hotspot-17" data-position="-219.24011705300336m 5.002110454344404m -169.41762340728485m" data-normal="-0.19121316481951028m 0.735937868239317m 0.6494867047839212m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Griffes
        </div>
    </button><button class="Hotspot" slot="hotspot-18" data-position="-286.2601895913501m 87.92090128625341m -166.15617031746643m" data-normal="-0.5509938313361398m 0.5445084739004419m 0.6323893734718614m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Tarse
        </div>
    </button><button class="Hotspot" slot="hotspot-19" data-position="-195.6377216605581m 291.80862552087086m -168.48960085219895m" data-normal="-0.024671025360920487m 0.8946214769753248m 0.4461431983591473m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Fémur
        </div>
    </button><button class="Hotspot" slot="hotspot-32" data-position="-169.37567828168994m 302.78604831401844m -7.069934011409103m" data-normal="-0.6239843913674891m -0.4354915366783754m -0.6488378848458616m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Coxa
        </div>
    </button><button class="Hotspot" slot="hotspot-41" data-position="424.8953948336364m 267.5438081103828m 7.647782062972745m" data-normal="-0.18162954709713053m -0.916927310456591m 0.35532381704599203m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Sternites du gastre
        </div>
    </button><button class="Hotspot" slot="hotspot-44" data-position="571.2996808831224m 282.56670631553266m 43.99534805681688m" data-normal="-0.2684878712542995m -0.8506062458113143m 0.4520876879280353m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Sternite 6
        </div>
    </button><button class="Hotspot" slot="hotspot-46" data-position="643.0878705932298m 255.78730728657575m -10.651365606807143m" data-normal="-0.33719707800221344m -0.9330410459424023m 0.12542941111827424m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Sternite composite 7 + 8
        </div>
    </button><button class="Hotspot" slot="hotspot-56" data-position="-305.12515288792974m 259.4110908427122m -231.82910671535976m" data-normal="-0.6963756275091352m 0.21392302034183008m -0.6850532291574774m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Tibia
        </div>
    </button><button class="Hotspot" slot="hotspot-57" data-position="-102.48909251965279m 589.2981038209746m -81.7133163847549m" data-normal="-0.22937183137652803m 0.9395620375434758m -0.25418839583688707m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Mésoscutellum
        </div>
    </button><button class="Hotspot" slot="hotspot-58" data-position="18.802238349765503m 584.7390769906626m -62.42542087889818m" data-normal="0.41736493746698683m 0.8388080298150695m -0.34958203342125527m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Scutellum
        </div>
    </button><button class="Hotspot" slot="hotspot-59" data-position="68.91012613970724m 521.3862970649897m -58.271221102504455m" data-normal="0.9240392254296486m 0.36799326477368655m -0.1035976203808685m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Métanotum
        </div>
    </button><button class="Hotspot" slot="hotspot-60" data-position="104.32967222955494m 447.4307552551182m -34.28293612882424m" data-normal="0.8946449061392256m 0.44185100883800743m -0.06616780114203054m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Propodéum
        </div>
    </button><button class="Hotspot" slot="hotspot-61" data-position="-189.64808955097453m 490.76094549630795m -160.65731141088713m" data-normal="-0.5070860236637293m 0.38649427375494544m -0.7703803871851522m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Pronotum
        </div>
    </button><button class="Hotspot" slot="hotspot-62" data-position="-287.011673784555m 418.8088344052933m 117.47846989324336m" data-normal="0.24704139799653219m -0.36261050889241986m 0.8986012277516092m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Aires pariétales
        </div>
    </button>
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
    <button slot="ar-button" id="ar-button">
        View in your space
    </button>
    <div id="ar-prompt">
        <img src="https://modelviewer.dev/shared-assets/icons/hand.png">
    </div>
</model-viewer>
*/