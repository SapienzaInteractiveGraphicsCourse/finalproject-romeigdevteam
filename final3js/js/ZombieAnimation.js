var ZombieBonesIds = {

	URLEG: 1,
	ULLEG: 4,
	TORSO: 7,
	HEAD: 9,
	URARM: 11,
	LRARM: 12,
	ULARM: 14,
	LLARM: 15
}

class ZombieAnimation {
	constructor(bones) {
		this.rightStep = false;
		this.torsoRight = false;
		this.counter = 0;
		this.bones = bones
	}

	walkingAnimate(delta, walkSpeed) {
		if (this.rightStep) {
			this.bones[ZombieBonesIds.URLEG].rotation.x += delta * walkSpeed
			this.bones[ZombieBonesIds.ULLEG].rotation.x -= delta * walkSpeed
			//console.log(this.bones[ZombieBonesIds.URLEG].rotation.x,this.bones[ZombieBonesIds.ULLEG].rotation.x)
			if (this.bones[ZombieBonesIds.URLEG].rotation.x > - 0.84) {
				this.rightStep = !this.rightStep;
			}
		}
		else {
			this.bones[ZombieBonesIds.URLEG].rotation.x -= delta * walkSpeed
			this.bones[ZombieBonesIds.ULLEG].rotation.x += delta * walkSpeed
			if (this.bones[ZombieBonesIds.URLEG].rotation.x < -2.0) {
				this.rightStep = !this.rightStep;
			}
		}
		if (this.torsoRight) {
			this.bones[ZombieBonesIds.TORSO].rotation.z -= delta * walkSpeed / 4.5
			this.bones[ZombieBonesIds.TORSO].rotation.y -= delta * walkSpeed / 4.5

			if (this.bones[ZombieBonesIds.TORSO].rotation.z < - 0.1)
				this.torsoRight = !this.torsoRight;
		}
		else {
			this.bones[ZombieBonesIds.TORSO].rotation.z += delta * walkSpeed / 4.5
			this.bones[ZombieBonesIds.TORSO].rotation.y += delta * walkSpeed / 4.5

			if (this.bones[ZombieBonesIds.TORSO].rotation.z > 0.1)
				this.torsoRight = !this.torsoRight;
		}

	}

	raisingArmsPose() {
		//this.bones[this.URARM].rotateX(0.5)
		this.bones[ZombieBonesIds.ULARM].rotateY(-0.4)
		this.bones[ZombieBonesIds.ULARM].rotateX(-1.8)


	}
}




class MyMeshes {









}