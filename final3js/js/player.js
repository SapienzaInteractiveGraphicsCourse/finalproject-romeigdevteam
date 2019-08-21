//array to hold the parameters of all objects. 
var collisions = [];

/*
Let's create a new object to compute the bounding box of a given object 
using a nice Threejs class called Box3 that will calculate the needed 
parameters for you. We are going to call this function calculateCollisionPoints(). 
The reason we do not use the computeBoundingBox() function is that it will not take scale into
 effect.
*/

/**
 * Calculates collision detection parameters.
 */
function calculateCollisionPoints(mesh, scale, type = 'collision') {
  // Compute the bounding box after scale, translation, etc.
  var bbox = new THREE.Box3().setFromObject(mesh);

  var bounds = {
    type: type,
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  };

  collisions.push(bounds);
}

/**
 * Collision detection for every solid object.
 */
function detectCollisions() {

  // Get the user's current collision area.
  var bounds = {
    xMin: rotationPoint.position.x - playerBox.geometry.parameters.width / 2,
    xMax: rotationPoint.position.x + playerBox.geometry.parameters.width / 2,
    yMin: rotationPoint.position.y - playerBox.geometry.parameters.height / 2,
    yMax: rotationPoint.position.y + playerBox.geometry.parameters.height / 2,
    zMin: rotationPoint.position.z - playerBox.geometry.parameters.width / 2,
    zMax: rotationPoint.position.z + playerBox.geometry.parameters.width / 2,
  };

  // Run through each object and detect if there is a collision.
  for (var index = 0; index < collisions.length; index++) {

    if (collisions[index].type == 'collision') {
      if ((bounds.xMin <= collisions[index].xMax && bounds.xMax >= collisions[index].xMin) &&
        (bounds.yMin <= collisions[index].yMax && bounds.yMax >= collisions[index].yMin) &&
        (bounds.zMin <= collisions[index].zMax && bounds.zMax >= collisions[index].zMin)) {
        // We hit a solid object! Stop all movements.
       stopMovement();
         // escapeFromCollision( collisions[ index ] )

        // Move the object in the clear. Detect the best direction to move.
        if ( bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin ) {
          // Determine center then push out accordingly.
          var objectCenterX = ((collisions[ index ].xMax - collisions[ index ].xMin) / 2) + collisions[ index ].xMin;
          var playerCenterX = ((bounds.xMax - bounds.xMin) / 2) + bounds.xMin;
          var objectCenterZ = ((collisions[ index ].zMax - collisions[ index ].zMin) / 2) + collisions[ index ].zMin;
          var playerCenterZ = ((bounds.zMax - bounds.zMin) / 2) + bounds.zMin;

          // Determine the X axis push.
          if (objectCenterX > playerCenterX) {
            controls.getObject().position.x -= 0.1;
          } else {
            controls.getObject().position.x += 0.1;
          }
        }
        if ( bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin ) {
          // Determine the Z axis push.
          if (objectCenterZ > playerCenterZ) {
            controls.getObject().position.z -= 0.1;
          } else {
            controls.getObject().position.z += 0.1;
          }
        }
      }
    }
  }

  function stopMovement() {
    velocity.x = 0
    velocity.z = 0 //none
    moveLeft=false
    moveRight=false
    moveForward=false
    moveBackward=false;


    //console.log("WALL HIT")

  }
  function escapeFromCollision(coll) {
    velocity.x = -velocity.x
    velocity.z = -velocity.z
    controls.getObject().position.x-=1
    controls.getObject().position.z-=1
    
  }


}



var characterSize = 2.0
var rotationPoint;
var playerBox;

function createPlayer() {

  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set(0, 0, 0);
  scene.add(rotationPoint);

  var geometry = new THREE.BoxBufferGeometry(characterSize/3, characterSize, characterSize/3);
  var material = new THREE.MeshPhongMaterial({ color: 0x22dd88 });
  playerBox = new THREE.Mesh(geometry, material);
  playerBox.visible=false;
  playerBox.position.y = characterSize / 2;
  rotationPoint.add(playerBox);

}
