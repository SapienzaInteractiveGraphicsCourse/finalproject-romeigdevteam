
class MyGUI {
    // class methods
    ammosCounter = 30;
    hitCounter = 0;
    constructor(advancedTexture) {
        this.advancedTexture = advancedTexture;
        
    }
    textAmmo=null;
    textHit=null;
    showAmmo() {
        this.textAmmo = new BABYLON.GUI.TextBlock();
        this.textAmmo.text = 'Ammos:'+' '+this.ammosCounter;
        this.textAmmo.color = "Yellow";
        this.textAmmo.fontSize = 24;
        this.textAmmo.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        this.textAmmo.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        this.advancedTexture.addControl(this.textAmmo);


    }
    decreaseAmmo(){
        if(this.ammosCounter>0){
            this.ammosCounter-=1;
            this.textAmmo.text = 'Ammos:'+' '+this.ammosCounter;
            
        }
    }

    showHit(){
        this.textHit = new BABYLON.GUI.TextBlock();
        this.textHit.text = 'Hit: '+this.hitCounter;
        this.textHit.color = "Red";
        this.textHit.fontSize = 24;
        this.textHit.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        this.textHit.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        this.advancedTexture.addControl(this.textHit);

    }
    increaseHit(){
        this.hitCounter+=1;
        this.textHit.text='Hit: '+this.hitCounter;
    }
    
}



