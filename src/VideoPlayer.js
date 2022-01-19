class VideoPlayer{
    /**
     * @param {id of div containing the viewer} _divParent 
     * @param {player's id} _divPlayer 
     * @param {url of the model} _model 
     */
    constructor(_divParent, _divPlayer, _model, _poi){
        this.parent = _divParent;
        this.player = _divPlayer;
        this.model = _model
        this.poi = _poi
    }

    buildPlayer(){
        const player = document.createElement('model-viewer')
        player.id = this.player;
        player.setAttribute('src', this.model)
        player.setAttribute('reveal', "interaction")
        player.setAttribute('environment-image', "../modeles/pillars_1k.hdr")
        player.setAttribute('shadow-intensity', "0")
        player.setAttribute('exposure', "1")
        player.setAttribute('ar-modes', "webxr scene-viewer quick-look")
        player.setAttribute('camera-controls', true)
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

        return player;
    }

    buildControls(){
        const player = document.getElementById(this.player)
        // const parts = player.model.materials;
        // console.log(parts)

        const playerParent = document.createElement('div')
        playerParent.id ="myProgress"
        playerParent.classList.add('d-flex')
        
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

        playerParent.append(playBtn)
        playerParent.append(bar)
        playerParent.append(duration)

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
                    if(playBtn.classList.contains('fa-pause-circle')){
                        console.log('oui')
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
    }

    buildHiders(){
        const parent = document.getElementById(this.parent);
        const player = document.getElementById(this.player)
        const parts = player.model.materials;

        const sideBar = document.createElement('div')
        sideBar.id ="champ-info_troisd"
        sideBar.classList.add('text-center')
        sideBar.classList.add('alert')
        sideBar.classList.add('alert-primary')

        const hr = document.createElement('hr')

        const hideTitle = document.createElement('h5')
        hideTitle.classList.add('mt-1')
        hideTitle.innerText = "Show / Hide elements"

        

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

            const partName = document.createElement('h5')
            partName.innerText = part.name
            divCtrl.append(partName)

            sideBar.append(divCtrl)
            
        })
        parent.append(sideBar)
    }

}
