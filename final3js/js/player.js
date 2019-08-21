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
        if (bounds.xMin <= collisions[index].xMax && bounds.xMax >= collisions[index].xMin) {
          // Determine center then push out accordingly.
          var objectCenterX = ((collisions[index].xMax - collisions[index].xMin) / 2) + collisions[index].xMin;
          var playerCenterX = ((bounds.xMax - bounds.xMin) / 2) + bounds.xMin;
          var objectCenterZ = ((collisions[index].zMax - collisions[index].zMin) / 2) + collisions[index].zMin;
          var playerCenterZ = ((bounds.zMax - bounds.zMin) / 2) + bounds.zMin;

          // Determine the X axis push.
          if (objectCenterX > playerCenterX) {
            controls.getObject().position.x -= 0.1;
          } else {
            controls.getObject().position.x += 0.1;
          }
        }
        if (bounds.zMin <= collisions[index].zMax && bounds.zMax >= collisions[index].zMin) {
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
    moveLeft = false
    moveRight = false
    moveForward = false
    moveBackward = false;


    //console.log("WALL HIT")

  }
  function escapeFromCollision(coll) {
    velocity.x = -velocity.x
    velocity.z = -velocity.z
    controls.getObject().position.x -= 1
    controls.getObject().position.z -= 1

  }


}



var characterSize = 2.0
var rotationPoint;
var playerBox;
var playerBoxBody;

function createPlayer() {

  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set(camera.position);
  scene.add(rotationPoint);

  // var halfExtents = new CANNON.Vec3(0.5, 0.8 ,0.5);

  //var geometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
  var geometry = new THREE.BoxBufferGeometry(characterSize / 3, characterSize, characterSize / 3);
  var material = new THREE.MeshPhongMaterial({ color: 0x22dd88 });
  playerBox = new THREE.Mesh(geometry, material);
  //playerBox.visible=false;
  playerBox.position.y = characterSize / 2;
  rotationPoint.add(playerBox);
  //scene.add(playerBox)

  //CANNON
  // boxShape = new CANNON.Box(halfExtents);
  // playerBoxBody = new CANNON.Body({ mass: 1, shape: boxShape} );
  // playerBoxBody.name = "playerBox"
  // playerBoxBody.addShape(boxShape);
  // world.addBody(playerBoxBody);



}








function getComplexBoundingBox(object3D) {
  var box = null;
  object3D.traverse(function (obj3D) {
    if (obj3D.matrixWorldNeedsUpdate) obj3D.updateMatrixWorld();
    var geometry = obj3D.geometry;
    // If current is not a geometry (THREE.Geometry), proceed to the next one
    if (geometry === undefined) return null;
    // If this object is already bounding box, then use it
    if (geometry.boundingBox) {
      var workableBox = geometry.boundingBox.clone();
      // Move the resulting bounding box to the position of the object itself
      workableBox.applyMatrix4(obj3D.matrixWorld);
      if (box === null) {
        box = workableBox;
      } else {
        box.union(workableBox);
      }
      // If there is no bounding box for current object - creating
    } else {
      var workableGeometry = geometry.clone();
      // Move the resulting geometry in the position of the object itself
      workableGeometry.applyMatrix(obj3D.matrixWorld);
      // Calculate the bounding box for the resulting geometry
      workableGeometry.computeBoundingBox();
      if (box === null) {
        box = workableGeometry.boundingBox;
      } else {
        box.union(workableGeometry.boundingBox);
      }
    }
  });
  return box;
}


function rayColl() {

  // Set the rays : one vector for every potential direction
  var rays = [
    new THREE.Vector3(0, 0, 100),
    new THREE.Vector3(100, 0, 100),
    new THREE.Vector3(100, 0, 0),
    new THREE.Vector3(100, 0, -100),
    new THREE.Vector3(0, 0, -100),
    new THREE.Vector3(-100, 0, -100),
    new THREE.Vector3(-100, 0, 0),
    new THREE.Vector3(-100, 0, 100)
  ];
  // And the "RayCaster", able to test for intersections
  var caster = new THREE.Raycaster();



  var collisions, i;
    // Maximum distance from the origin before we consider collision
    var distance = 32;

  // For each ray
  for (i = 0; i < rays.length; i += 1) {
    // We reset the raycaster to this direction
    caster.set( rotationPoint.position, rays[i]);
   // caster.setFromCamera( mouseVector, camera );
    // Test if we intersect with any obstacle mesh
    collisions = caster.intersectObjects(wallsArray);
    //console.log(wallsArray,collisions)
    //console.log(rotationPoint.position,rays[i])
    // And disable that direction if we do
    if (collisions.length > 0 && collisions[0].distance <= distance) {
      console.log("ray collision")
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
