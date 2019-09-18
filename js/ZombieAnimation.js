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
		this.isAnimated = true;
	}

	walkingAnimate(delta, walkSpeed) {
		if(this.isAnimated){
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

	}

	raisingArmsPose() {
		//this.bones[this.URARM].rotateX(0.5)
		this.bones[ZombieBonesIds.ULARM].rotateY(-0.4)
		this.bones[ZombieBonesIds.ULARM].rotateX(-1.8)
	}

	dieingArmsPose() {
		//this.bones[this.URARM].rotateX(0.5)
		//const randAng=Math.random()*3*Math.PI/4
		const fixedAngle=Math.PI/2
		this.bones[ZombieBonesIds.ULARM].rotateZ(-fixedAngle)
		this.bones[ZombieBonesIds.ULARM].rotateY(-fixedAngle)

		this.bones[ZombieBonesIds.URARM].rotateZ(fixedAngle)
		this.bones[ZombieBonesIds.URARM].rotateY(fixedAngle)

	}


	startAnimation(){
		this.isAnimated=true;
	}
	stopAnimation(){
		this.isAnimated=false;
	}
}



function zombieFollowsCharacter(idx, delta) {
	//if(idx > 3) return;
	const speed = (0.9 + idx / 100) * delta
	var body = collisionboxes[idx]
	var x = body.position.x
	var y = body.position.y
	var z = body.position.z
	//One y axis Rotation
	if(! body.isDieing )
	{
		var diffX = playerSphereBody.position.x - x;
		var diffZ = playerSphereBody.position.z - z;
		if((diffX > 0.1 || diffX < -0.1 ) && ( diffZ > 0.1 || diffZ < -0.1  ) ){
		const angle= Math.atan2(diffX, diffZ)
		if(body.barGui)
		 body.barGui.rotation.y = angle
		const axis = new CANNON.Vec3(0, 1, 0);
		body.quaternion.setFromAxisAngle(axis,angle);
	}

	//Translation
	//const casualProb= (Math.random()*1000) +1
	if (0.1 > Math.abs( x - playerSphereBody.position.x ) ) { }
	else if (x > playerSphereBody.position.x) body.position.x -= speed;
	else body.position.x += speed;

	//make it jump
	// if( casualProb <10 && y ==0 ){
	// 	body.y =
	// }

	if (0.1 > Math.abs( z - playerSphereBody.position.z )) { }
	else if (z > playerSphereBody.position.z) body.position.z -= speed;
	else body.position.z += speed;

	}


}

// function aStarAlgo(){

// var start = zombieROOT[i].position
// var frontier = new PriorityQueue()
// frontier.enqueue(start, 0)
// var came_from = {}
// var cost_so_far = {}
// came_from[start] = null;
// cost_so_far[start] = 0
// var goal = new THREE.Vector3(-4,-4,-4)
// while (! frontier.isEmpty() ){
//    current = frontier.dequeue()

//    if ( current == goal)
//       break

//    for (var next in graph.neighbors(current):
//       new_cost = cost_so_far[current] + graph.cost(current, next)
//       if next not in cost_so_far or new_cost < cost_so_far[next]:
//          cost_so_far[next] = new_cost
//          priority = new_cost + heuristic(goal, next)
//          frontier.put(next, priority)
// 		 came_from[next] = current


// 		}
// 	}
