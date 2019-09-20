// instantiate a loader
var loaderGLTF = new THREE.GLTFLoader();
var loaderTex = new THREE.TextureLoader();
var canTakeDamage=true;

var loadingManager = null;
var RESOURCES_LOADED = false;
var PLAYGAME = false;
var zombieROOT = [];
var numZombie = 10;

var zombieAlive = 0;
var uselessBodies = []
var uselessMeshes = []
var zombieHitBoxFlag=false;


// Models index
var models = {
    1: {
        obj: "./scenes/3d-nature-pack/Models/Tree_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Tree_01.mtl",
        mesh: null,
        nameMesh: "tree",
        internal: false
    },

    2: {
        obj: "./scenes/3d-nature-pack/Models/Rock_1_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Rock_1_01.mtl",
        mesh: null,
        nameMesh: "rock",
        internal: false
    },
    3: {
        obj: "./scenes/3d-nature-pack/Models/Brown_Cliff_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Brown_Cliff_01.mtl",
        mesh: null,
        nameMesh: "cliff",
        internal: false

    },
    4: {
        obj: "./scenes/weapons/uziGold.obj",
        mtl: "./scenes/weapons/uziGold.mtl",
        mesh: null,
        nameMesh: "uzi",
        internal: false
    },

    5: {
        obj: "./scenes/3d-nature-pack/Models/Fallen_Trunk_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Fallen_Trunk_01.mtl",
        mesh: null,
        nameMesh: "rock",
        internal: false

    },
    6: {
        obj: "./scenes/weapons/machinegun.obj",
        mtl: "./scenes/weapons/machinegun.mtl",
        mesh: null,
        nameMesh: "machinegun",
        internal: false

    },
    7: {
        obj: "./scenes/weapons/sniper.obj",
        mtl: "./scenes/weapons/sniper.mtl",
        mesh: null,
        nameMesh: "sniper",
        internal: false

    },
    8: {

        nameMesh: "crate",
        internal: true,
        texture: "./textures/crate0/crate0_diffuse.png",
        size1: 1,
        size2: 1,
        size3: 1,
        mass: 10,
        shape: 1
    },
    9: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "wallZombie",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 6,
        size2: 5,
        size3: 0.5,
        mass: 1000000,
        shape: 1
    },
    10: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "wallZombie2",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 0.5,
        size2: 5,
        size3: 6,
        mass: 1000000,
        shape: 1
    },

    11: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "lifeUp",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 1,
        mass: 1000000,
        shape: 2
    },
    12: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "wallZombie",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 1,
        size2: 5,
        size3: 0.5,
        mass: 1000000,
        shape: 1
    },
    13: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "wallZombie",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 1,
        size2: 5,
        size3: 0.5,
        mass: 1000000,
        shape: 1
    },
    14: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "wallZombie",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 1,
        size2: 5,
        size3: 0.5,
        mass: 1000000,
        shape: 1
    },
    15: { // when put in the bitMap you need to leave two zeros of space

        nameMesh: "wallZombie",
        internal: true,
        texture: "./textures/wall/wallZombie.png",
        size1: 1,
        size2: 5,
        size3: 0.5,
        mass: 1000000,
        shape: 1
    },
    16: {
        obj: "./scenes/graveyard/gravestoneBroken.obj",
        mtl: "./scenes/graveyard/gravestoneBroken.mtl",
        mesh: null,
        nameMesh: "brokengrave",
        internal: false

    },
    17: {
        obj: "./scenes/graveyard/gravestoneCrossLarge.obj",
        mtl: "./scenes/graveyard/gravestoneCrossLarge.mtl",
        mesh: null,
        nameMesh: "crossgrave",
        internal: false

    },
    18: {
        obj: "./scenes/graveyard/gravestoneDecorative.obj",
        mtl: "./scenes/graveyard/gravestoneDecorative.mtl",
        mesh: null,
        nameMesh: "graveDec",
        internal: false

    },
    19: {
        obj: "./scenes/graveyard/gravestoneFlat.obj",
        mtl: "./scenes/graveyard/gravestoneFlat.mtl",
        mesh: null,
        nameMesh: "graveDec",
        internal: false

    },
    20: {
      obj: "./scenes/graveyard/coffinOld.obj",
      mtl: "./scenes/graveyard/coffinOld.mtl",
      mesh: null,
      nameMesh: "graveDec",
      internal: false

    },
    21: {
      obj: "./scenes/graveyard/coffin.obj",
      mtl: "./scenes/graveyard/coffin.mtl",
      mesh: null,
      nameMesh: "graveDec",
      internal: false

    }




};



// Meshes index
var meshes = {};
var meshesArray = [];
var collisionboxes1 = [];
var collisionboxMeshes1 = [];


function initLoading() {
    // Set up the loading screen's scene.
    // It can be treated just like our main scene.

    // loadingScreen.box.position.set(0, 0, 5);
    // loadingScreen.camera.lookAt(loadingScreen.box.position);
    // loadingScreen.scene.add(loadingScreen.box);

    // Create a loading manager to set RESOURCES_LOADED when appropriate.
    // Pass loadingManager to all resource loaders.
    loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    loadingManager.onLoad = function () {
        console.log("loaded all resources");
        RESOURCES_LOADED = true;
        onResourcesLoaded();

        htmlCloseLoading();

    };

    loadModels();


}


function loadModels() {



    createSkyBox();
    for (var _key in models) {
        (function (key) {
            if (models[key].internal==false) {

              var mtlLoader = new THREE.MTLLoader(loadingManager);
              mtlLoader.load(models[key].mtl, function (materials) {
                  materials.preload();

                  var objLoader = new THREE.OBJLoader(loadingManager);

                  objLoader.setMaterials(materials);
                  objLoader.load(models[key].obj, function (mesh) {

                     //not guns
                     if (key != 4 && key != 6 && key != 7) {

                          mesh.traverse(function (child) {

                              if (child instanceof THREE.Mesh) {
                                  //child.material = material;
                                  child.geometry.center();


                                  //( Shadow for objects)
                                  child.castShadow = true;
                                  child.receiveShadow = true;
                              }

                          });
                      }
                      models[key].mesh = mesh;

                  });
              });
            }
            else {
              models[key].mesh=createInternalMesh(models[key].texture, models[key].size1, models[key].size2, models[key].size3, models[key].shape);
            }
        })(_key);
    }

    //crei vari zombie quanti i


    /*for (var i = 0; i < zombieMap.length; i++) {
        for (var j = 0; j < zombieMap[i].length; j++) {
          if (zombieMap[i][j]!=0) {
            importZombie(i,j);
          }
        }
      }

      */

}





function onResourcesLoaded() {

    // Clone models into meshes.
    /*  meshes["tree"] = models.tree.mesh.clone();
      meshes["tree"].position.set(0, 2, 0);
      //meshes["tree"].position.y=0;

      scene.add(meshes["tree"]);
      createBoundCube(meshes["tree"]);
      meshesArray.push(meshes["tree"]);

      meshes["rock"] = models.rock.mesh.clone();
      meshes["rock"].position.set(-10, 0, -10);
      scene.add(meshes["rock"]);
      createBoundCube(meshes["rock"]);
      meshesArray.push(meshes["rock"]);

      var cliffs = []*/
    for (var i = 0; i < wallMap.length; i++) {
        for (var j = 0; j < wallMap[i].length; j++) {
            if (wallMap[i][j] != 0) {
                const UNITSIZE = 1.5;
                var currModel;

                currModel = models[wallMap[i][j]].mesh.clone();


                if (wallMap[i][j]==12) {
                  currModel.position.set(((i - 10 / 2) * UNITSIZE)-3.5, 2, ((j - 10 / 2) * UNITSIZE)-7.5);
                }
                else if (wallMap[i][j]==13) {
                  currModel.position.set(((i - 10 / 2) * UNITSIZE)+2, 2, ((j - 10 / 2) * UNITSIZE)-1.5);
                }
                else if (wallMap[i][j]==14) {
                  currModel.position.set(((i - 10 / 2) * UNITSIZE)-3.5, 2, ((j - 10 / 2) * UNITSIZE)+7.5);
                }
                else if (wallMap[i][j]==15) {
                  currModel.position.set(((i - 10 / 2) * UNITSIZE)+2, 2, ((j - 10 / 2) * UNITSIZE)+1.5);
                }
                else {
                  currModel.position.set((i - 10 / 2) * UNITSIZE, 2, (j - 10 / 2) * UNITSIZE);
                }

                scene.add(currModel);
                createBoundCube(currModel, models[wallMap[i][j]].mass);
                meshesArray.push(currModel);
                wallsArray.push(currModel)
            }


        }


    }

}
function createInternalMesh(texturePng, size1, size2=1, size3=1, shape=1) {
  var textureLoader= new THREE.TextureLoader();
  crateTexture= textureLoader.load(texturePng);
//  crateBumpMap= textureLoader.load("./textures/crate0/crate0_bump.png")
  //crateNormalMap=textureLoader.load("./textures/crate0/crate0_normal.png")
  var geometryShape;
  if (shape == 1) { //simple box
    geometryShape=new THREE.BoxGeometry(size1, size2, size3);
  }
  else if (shape == 2) {
    geometryShape=new THREE.OctahedronGeometry(size1);
  }
  crate = new THREE.Mesh(
    geometryShape,
    new THREE.MeshPhongMaterial({
      color:0xffffff,
      map:crateTexture,
      bumpMap:crateBumpMap,
      normalMap:crateNormalMap

    })
  );
  //scene.add(crate);
  //crate.position.set(2.5, 3/2 , 2.5);
  crate.receiveShadow = true;
  crate.castShadow = true;
  return crate;
}

function addSelectedGunToCamera(){
    meshes[preModels[selectedGun].nameMesh] = models[ preIdxToIdx[selectedGun] ].mesh.clone();
    meshes[preModels[selectedGun].nameMesh].position.set(0.4, -0.4, -0.5);
    meshes[preModels[selectedGun].nameMesh].freeAim = new THREE.Vector3(0.4, -0.4, -0.5);

    meshes[preModels[selectedGun].nameMesh].scale.set(10, 10, 10);
    meshes[preModels[selectedGun].nameMesh].rotation.y = -Math.PI;
    camera.add(meshes[preModels[selectedGun].nameMesh])

}

function createSkyBox() {
    //RIGHT ORDER:
    // 'pos-x.jpg',
    // 'neg-x.jpg',
    // 'pos-y.jpg',
    // 'neg-y.jpg',
    // 'pos-z.jpg',
    // 'neg-z.jpg',


    const path = "textures/fantasySkyboxes/"
    const ls = [
        "Sunny_01A_left.jpg",
        "Sunny_01A_right.jpg",
        "Sunny_01A_up.jpg",
        "Sunny_01A_down.jpg",
        "Sunny_01A_front.jpg",
        "Sunny_01A_back.jpg",

    ].map(x => path + x)



    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load(ls);
    scene.background = texture;

}


function importZombie(i, j, level = 1) {

    // Load a glTF resource
    loaderGLTF.load(
        // resource URL
        //'scenes/zombie_character/scene.gltf'
        'scenes/the_perfect_steve_rigged/sceneMyTex.gltf'
        ,
        // called when the resource is loaded
        function (gltf) {

            gltf.scene.scale.set(0.001, 0.001, 0.001);
            bones = gltf.scene.children[0]
                .children[0].children[0].children[0].children[0]
                .children[1].children[0].children[2].skeleton.bones
            console.log(bones)
            const UNITSIZE = 1.5;

            //const currModel = models[wallMap[i][j]].mesh.clone();

            //currModel.position.set((i - 10 / 2) * UNITSIZE, 2, (j - 10 / 2) * UNITSIZE);


            //gltf.scene.position.x += 3 * i;
            //gltf.scene.position.y += 1.0;
            gltf.scene.position.set((i - 10 / 2) * UNITSIZE, 2, (j - 10 / 2) * UNITSIZE);

            gltf.scene.children[0].children.forEach(element => {
                if (element.name.includes("Left") || element.name.includes("Right")) {
                    element.rotateZ(1.5)
                    console.log("->", element)
                };
            });
            //console.log("gltd scene", gltf.scene)

            var zombieMesh = gltf.scene
            scene.add(zombieMesh);

            zombieROOT.push(zombieMesh);

            var zombieAnimated = new ZombieAnimation(bones);
            zombieAnimated.raisingArmsPose()
            zombieAnimatedArray.push(zombieAnimated); //TODO remove
            zombieMesh.zombieAnimated = zombieAnimated

            zombieMesh.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })

            createSingleBodyCube(zombieMesh, i, level)


        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },

    );



}



function addLifeBarSprite(zombieObj, value = 10) {
    if(zombieObj.barGui)
        uselessMeshes.push(zombieObj.barGui)

    if (value < 0) // also 0?
        return;

    /*loaderTex.load(
        'sprites/lifebar/VIDA_' + value + '.png',
        // onLoad callback
        function (texture) {
            // in this example we create the material when the texture is loaded
            var lifeMaterial = new THREE.MeshBasicMaterial({
                map: texture, side: THREE.DoubleSide
            })
            var lifeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            var life = new THREE.Mesh(lifeGeometry, lifeMaterial);
            life.scale.set(0.6, 0.1, 0.1)
            life.position.copy(zombieObj.position);
            life.position.y += 1;
            scene.add(life);
            zombieObj.barGui = life;
        })
    */
    var spriteMap = new THREE.TextureLoader().load( "sprites/lifebar/VIDA_"+value+".png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.6, 0.1, 0.1);
    sprite.position.copy(zombieObj.position);
    sprite.position.y += 2;
    scene.add( sprite );
    zombieObj.barGui=sprite


}

function changeLifeBar(zombieObj, value = 10) {
    uselessMeshes.push(zombieObj.barGui)
    addLifeBarSprite(zombieObj, value)
}


function createBoundCube(objectMesh, mass=1000) {
    var bbox = (new THREE.Box3()).setFromObject(objectMesh);
    var helper = new THREE.Box3Helper(bbox, 0xffff00);
    //scene.add(helper);
    var dimensions = new THREE.Vector3(0, 0, 0);
    bbox.getSize(dimensions);

    var geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(objectMesh.position);
    scene.add(mesh);
    mesh.visible=false;

    collisionboxMeshes1.push(mesh);
    var shape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
    var body = new CANNON.Body({
        mass: mass
    });
    body.addShape(shape);

    body.position.copy(mesh.position);
    // Allow sleeping
    world.allowSleep = true;
    body.allowSleep = true;
    // Sleep parameters
    body.sleepSpeedLimit = 1.5; // Body will feel sleepy if speed<1 (speed == norm of velocity)
    body.sleepTimeLimit = 1; // Body falls asleep after 1s of sleepiness


    world.addBody(body);
    collisionboxes1.push(body);


}


function createSingleBodyCube(mesh, sidePositionChange = 0, level = 1) {
    var halfExtents = new CANNON.Vec3(0.3, 0.6, 0.3);
    boxShape = new CANNON.Box(halfExtents);
    boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

    newmaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true  });

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.name = "zombieBox"
    boxBody.damage = 2 //2 * level; TODO NOT SURE ABOUT THIS BUT I THINK THAT CAN BE A PROBLEM WITH HIGH WAVE
    boxBody.addShape(boxShape);
    //boxBody.position.x += 3 * sidePositionChange;
    //boxBody.position.y += 1;
    boxBody.position.copy(mesh.position)
    boxBody.life = 10;  // ADDED: life
    boxBody.angularDamping = 1; //ADDED: no ragdoll till death
    boxBody.isDieing = false; //true when start counter to be removed
    addLifeBarSprite(boxBody)      //ADDED: gui life
    boxBody.allowSleep = false;




    boxBody.postStep = () => {  //ADDED: counter till be removed
        if (!boxBody.isDieing)
            return;
        boxBody.life--;

        if (boxBody.life < -200) {
            byeMeshBody(boxBody);
            zombieAlive--;
            if (zombieAlive == 0) {
                noZombie = true;
            }
            // collisionboxMeshes.splice(boxBody.idInArray,1)
        }


    }
    boxBody.addEventListener("collide", function (e) {
        //e.body.id -> 1 is ground
        if (e.target.name != "zombieBox" || e.body.id == 0 || e.body.name == "ground" || e.target.name == "ground")
            return;
        if (e.body.name == "bullet" && e.target.name == "zombieBox") {
            console.log("Collided with body:", e);
            console.log("id:", e.body.id);
            console.log(e)

            uselessBodies.push(e.body)
            uselessMeshes.push(e.body.myMesh) //funzione byeBodyMesh(e.body) fa entrambe

            //if (e.target.life < 0)
              //  return; //it is in disappearing phase

            e.target.life -= weaponDamage;
            if (e.target.life == 1 && weaponSelected==1 )
                e.target.angularDamping = 0; // enable ragdoll
            else if (e.target.life== 1 && weaponSelected==2)
                e.target.angularDamping = 0; // enable ragdoll

            else if (e.target.life== 5 && weaponSelected==3) // IF WE ARE GONNA CHANGE THIS AND MAKE THE SNIPER ONESHOT WE HAVE TO FIND ANOTHER WAY TO CHANGE THE DAMPING(MAYBE WE CAN PUT AN IF-ELSE WHEN CREATING THE ZOMBIES IF THE SNIPER IS CHOSEN)
                e.target.angularDamping = 0; // enable ragdoll




            if (e.target.life <= 0) {
              if (e.target.isDieing) return;
              else {
                uselessMeshes.push(e.target.barGui)
                //byeMeshBody(e.target)
                e.target.isDieing = true;  //start counter to remove it
                e.target.myMeshes[0].zombieAnimated.stopAnimation();
                e.target.myMeshes[0].zombieAnimated.dieingArmsPose();

                return;
              }
            }
            uselessMeshes.push(e.target.barGui)
            addLifeBarSprite(e.target, e.target.life) //update gui bar

        }

        else if (e.body.name == "playerBox" && e.target.name == "zombieBox" && !e.target.isDieing) {

            // ... hurt the player ...

            if (canTakeDamage) {
              $('#hurt').fadeIn(30);
              playerLife -= e.target.damage;
              changePlayerLifeBar(playerLife);
              canTakeDamage=false;
              checkCanTakeDamage(2000);
              $('#hurt').fadeOut(350);
            }
            //THIS IS THE JUMPAWAY OF THE ZOMBIES AFTER THEY TOUCH YOU
            var jumpVelo=10;
            var jumpDirX;
            var jumpDirZ;
            var differencePosX=e.target.position.x-e.body.position.x;
            var differencePosZ=e.target.position.z-e.body.position.z;
            if (differencePosX>0) {
              jumpDirX=1;
            }
            else {
              jumpDirX=-1;
            }
            if (differencePosZ>0) {
              jumpDirZ=1;
            }
            else {
              jumpDirZ=-1;
            }



            e.target.velocity.set(jumpDirX*jumpVelo,jumpVelo,jumpDirZ*jumpVelo);

        }
        else {
            //console.log("Contact between bodies:",e.contact);

        }

        //console.log(flagHit);

    });



    var boxMesh = new THREE.Mesh(boxGeometry, newmaterial);
    //boxMesh.position.x += 3 * sidePositionChange;
    //boxMesh.position.y -= 1;
    boxMesh.position.copy(mesh.position);
    if (zombieHitBoxFlag==false) {
      boxMesh.visible = false;
    }
    else {
      boxMesh.visible = true;
    }

    scene.add(boxMesh);
    console.log("Added box external #: ", sidePositionChange);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    collisionboxMeshes.push(boxMesh);
    console.log(boxMesh)

    boxBody.myMeshes = [mesh, boxMesh]   //TODO: unire con parte mesh e accedere da questo (eliminare forse anche array???)

    world.addBody(boxBody);
    boxMesh.idInArray = collisionboxes.push(boxBody) - 1;
}





function byeMeshBody(body, mesh = null) {
    if ("myMesh" in body && mesh == null) {
        uselessBodies.push(body)
        uselessMeshes.push(body.myMesh)
    }
    else if ("myMeshes" in body && mesh == null) {
        uselessBodies.push(body)
        body.myMeshes.forEach(e => { uselessMeshes.push(e) })
    }
    else {   //separati
        uselessBodies.push(body)
        uselessMeshes.push(mesh)
    }

}





// TODO AUDIOOOOO


// var listener = new THREE.AudioListener();
// camera.add( listener );
// var sounds={
//     "gameOver": {
//         path: "vattelo/a/pija",
//         audio: null
//     },
// }
// var audioLoader ;

// function initSounds(){
//     sounds.push()

// }
// function addSound(path){

//     // create a global audio source
//     for( var _key in sounds){
//         sounds[_key].audio = new THREE.Audio(listener)
//     }

//     // load a sound and set it as the Audio object's buffer

//     audioLoader = new THREE.AudioLoader();
//     audioLoader.load( path, function( buffer ) {
//     sound.setBuffer( buffer );
//     sound.setLoop( true );
//     sound.setVolume( 0.5 );
//     sound.play();
//     });
// }
window.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        for (var key in collisionboxMeshes1) {
          collisionboxMeshes1[key].visible=!(collisionboxMeshes1[key].visible);



        }

        for (var key in collisionboxMeshes) {
          zombieHitBoxFlag=!zombieHitBoxFlag;
          collisionboxMeshes[key].visible=!(collisionboxMeshes[key].visible);


        }
    }
});
