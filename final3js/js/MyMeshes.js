var ZombieBonesIds= {
    
    URLEG: 1, 
    ULLEG: 4,
    TORSO: 7,
    HEAD: 9,
    URARM: 11,
    LRARM: 12,
    ULARM: 14,
    LLARM: 15
}

class ZombieAnimation{
    constructor(bones){
        this.rightStep = false;
        this.torsoRight = false;
        this.counter = 0;
        this.bones = bones
    }
    
    walkingAnimate (delta,walkSpeed) {
        if (this.rightStep) {
			// this.bones[ZombieBonesIds.ULLEG].rotateZ( Math.random() * 6.0)
			this.bones[ZombieBonesIds.URLEG].rotation.x += delta * walkSpeed
			this.bones[ZombieBonesIds.ULLEG].rotation.x -= delta * walkSpeed
			
			this.counter--;
			if (this.counter < -10) {
				this.rightStep = !this.rightStep;
			}
		}
		else {
			this.bones[ZombieBonesIds.URLEG].rotation.x -= delta * walkSpeed
			this.bones[ZombieBonesIds.ULLEG].rotation.x += delta * walkSpeed
			this.counter++;
			
			if (this.counter > 60) {
				this.rightStep = !this.rightStep;
			}
		}
		if (this.torsoRight) {
			this.bones[ZombieBonesIds.TORSO].rotation.z -= delta * walkSpeed/3.7
			this.bones[ZombieBonesIds.TORSO].rotation.y -= delta * walkSpeed/3.7
			
			if(this.bones[ZombieBonesIds.TORSO].rotation.z<-0.1)
				this.torsoRight=!this.torsoRight;
		}
		else {
			this.bones[ZombieBonesIds.TORSO].rotation.z += delta * walkSpeed/3.7
			this.bones[ZombieBonesIds.TORSO].rotation.y += delta * walkSpeed/3.7
			
			if(this.bones[ZombieBonesIds.TORSO].rotation.z>0.1)
				this.torsoRight=!this.torsoRight;
		}

    }

    raisingArmsPose(){
        //this.bones[this.URARM].rotateX(0.5)
        this.bones[ZombieBonesIds.ULARM].rotateY(-0.4)
        this.bones[ZombieBonesIds.ULARM].rotateX(-1.8)

        
    }
}




class MyMeshes {



    


    


}