
const PLAYERLIFE = 8
var weaponBullets;

var playerLife = PLAYERLIFE;  // LIFE

var characterSize = 2.0
var rotationPoint;
var playerBox;
var playerBoxBody;

var numBullets;
//var gunRecoil = 0;

function stopMovement() {
  velocity.x = 0
  velocity.z = 0 //none
  moveLeft = false
  moveRight = false
  moveForward = false
  moveBackward = false;


  //console.log("WALL HIT")

}

function createPlayer() {

  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set(camera.position);
  scene.add(rotationPoint);

  var halfExtents = new CANNON.Vec3(0.5, 0.8, 0.5);
  var geometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
  //var geometry = new THREE.BoxBufferGeometry(characterSize / 3, characterSize, characterSize / 3);
  var material = new THREE.MeshPhongMaterial({ color: 0x22dd88 });
  playerBox = new THREE.Mesh(geometry, material);
  //playerBox.visible=false;
  playerBox.position.set(3, 3, 3);
  rotationPoint.add(playerBox);
  scene.add(playerBox)

  //CANNON
  boxShape = new CANNON.Box(halfExtents);
  playerBoxBody = new CANNON.Body({ mass: 1, shape: boxShape });
  playerBoxBody.position.set(0, 0, 0)
  playerBoxBody.name = "playerBox"
  playerBox.angularDamping = 1;
  playerBoxBody.addShape(boxShape);
  world.addBody(playerBoxBody);
  playerBoxBody.angularDamping = 1;




}

function checkPlayerLife() {
  if (playerLife <= 0 && !gameOver) {
    
    fadeOutAll();
    $("#youLose").fadeIn("fast")
    setTimeout(() =>{
      //redirect
    
      
    }
    ,4000)
    gameOver = true;
    controls.enabled = false;
  }
}



function checkCanTakeDamage(invulnerabilityTime) {
  //this is the time of INVULNERABILITY OF THE PLAYER
  //THE PLAYER CAN'T BE DAMAGED UNTIL THIS TIMER GOES OUT
  setTimeout(function(){ canTakeDamage=true }, invulnerabilityTime);
}





function rayCollisionsCheck() {

  var rdp = rayDirectionPoint = 30;
  // Set the rays : one vector for every potential direction
  var rays = [
    new THREE.Vector3(0, 0.5, rdp),
    new THREE.Vector3(rdp, 0.5, rdp),
    new THREE.Vector3(rdp, 0.5, 0),
    new THREE.Vector3(rdp, 0.5, -rdp),
    new THREE.Vector3(0, 0.5, -rdp),
    new THREE.Vector3(-rdp, 0.5, -rdp),
    new THREE.Vector3(-rdp, 0.5, 0),
    new THREE.Vector3(-rdp, 0.5, rdp)
  ];
  // And the "RayCaster", able to test for intersections
  var caster = new THREE.Raycaster();



  var collisions, i;
  // Maximum distance from the origin before we consider collision
  var distance = 2;

  // For each ray
  for (i = 0; i < rays.length; i += 1) {
    // We reset the raycaster to this direction
    //caster.set( playerBox.position, rays[i]);
    caster.setFromCamera(rays[i], camera);

    //drawLine(  rays[i], camera.position )
    // caster.setFromCamera( mouseVector, camera );
    // Test if we intersect with any obstacle mesh
    collisions = caster.intersectObjects(wallsArray, true);
    //console.log(wallsArray,collisions)
    //console.log(rotationPoint.position,rays[i])
    // And disable that direction if we do
    if (collisions.length > 0 && collisions[0].distance <= distance) {
      // console.log("ray collision")
      // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
      if ((i === 0 || i === 1 || i === 7) && direction.z === 1) {
        direction.setZ(0);
      } else if ((i === 3 || i === 4 || i === 5) && direction.z === -1) {
        direction.setZ(0);
      }
      if ((i === 1 || i === 2 || i === 3) && direction.x === 1) {
        direction.setX(0);
      } else if ((i === 5 || i === 6 || i === 7) && direction.x === -1) {
        direction.setX(0);
      }
    }
  }


}


function drawLine(pointA, pointB) {
  // Draw a line from pointA in the given direction at distance 100
  var direction = new THREE.Vector3(10, 0, 0);
  direction.normalize();

  var distance = 100; // at what distance to determine pointB

  pointB.addVectors(pointA, direction.multiplyScalar(distance));

  var geometry = new THREE.Geometry();
  geometry.vertices.push(pointA);
  geometry.vertices.push(pointB);
  var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  var line = new THREE.Line(geometry, material);
  scene.add(line);

}

// function recoilAnimation() {

//   if (gunRecoil > 0) {
//     // var maxRecoil = new THREE.Quaternion();
//     // maxRecoil.setFromEuler(new THREE.Euler(20.0, 0, 0) );
//     // // Dampen towards the target rotation
//     // recoilMod.rotation = Three.Slerp(recoilMod.rotation, maxRecoil, Time.deltaTime * recoilSpeed);
//     // weapon.transform.localEulerAngles.x = recoilMod.localEulerAngles.x;

//     meshes["uzi"].rotation += 0.1
//   }
//   else {
//     gunRecoil = 0;
//     // var minRecoil = Quaternion.Euler(0, 0, 0);
//     // // Dampen towards the target rotation
//     // recoilMod.rotation = Quaternion.Slerp(recoilMod.rotation, minRecoil, Time.deltaTime * recoilSpeed / 2);
//     // weapon.transform.localEulerAngles.x = recoilMod.localEulerAngles.x;
//   }


// gunRecoil += 0.1
// 			meshes["uzi"].rotation.x += gunRecoil

// if(gunRecoil){
//   gunRecoil -= 0.5
// }
//   if(gunRecoil < 0)
//   gunRecoil = 0

// meshes["uzi"].rotation.x += gunRecoil

// }
