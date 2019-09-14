// instantiate a loader
var loaderGLTF = new THREE.GLTFLoader();
var loaderTex = new THREE.TextureLoader();


var loadingManager = null;
var RESOURCES_LOADED = false;
var PLAYGAME = false;
var zombieROOT = [];
var numZombie = 10;

var zombieAlive = 0;
var uselessBodies = []
var uselessMeshes = []


// Models index
var models = {
    1: {
        obj: "./scenes/3d-nature-pack/Models/Tree_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Tree_01.mtl",
        mesh: null,
        nameMesh: "tree"
    },

    2: {
        obj: "./scenes/3d-nature-pack/Models/Rock_1_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Rock_1_01.mtl",
        mesh: null,
        nameMesh: "rock"
    },
    3: {
        obj: "./scenes/3d-nature-pack/Models/Brown_Cliff_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Brown_Cliff_01.mtl",
        mesh: null,
        nameMesh: "cliff"


    },
    4: {
        obj: "./scenes/weapons/uziGold.obj",
        mtl: "./scenes/weapons/uziGold.mtl",
        mesh: null,
        nameMesh: "uzi"
    },

    5: {
        obj: "./scenes/3d-nature-pack/Models/Fallen_Trunk_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Fallen_Trunk_01.mtl",
        mesh: null,
        nameMesh: "rock"
    },
    6: {
        obj: "./scenes/weapons/machinegun.obj",
        mtl: "./scenes/weapons/machinegun.mtl",
        mesh: null,
        nameMesh: "machinegun"
    },
    7: {
        obj: "./scenes/weapons/sniper.obj",
        mtl: "./scenes/weapons/sniper.mtl",
        mesh: null,
        nameMesh: "sniper"
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

                const currModel = models[wallMap[i][j]].mesh.clone();

                currModel.position.set((i - 10 / 2) * UNITSIZE, 2, (j - 10 / 2) * UNITSIZE);

                scene.add(currModel);
                createBoundCube(currModel);
                meshesArray.push(currModel);
                wallsArray.push(currModel)
            }


        }


    }

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

    if (value < 0) // also 0?
        return;

    loaderTex.load(
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

}

function changeLifeBar(zombieObj, value = 10) {
    uselessMeshes.push(zombieObj.barGui)
    addLifeBarSprite(zombieObj, value)
}


function createBoundCube(objectMesh) {
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
    var mass = 1000;
    var body = new CANNON.Body({
        mass: 1000
    });
    body.addShape(shape);

    body.position.copy(mesh.position);


    world.addBody(body);
    collisionboxes1.push(body);


}


function createSingleBodyCube(mesh, sidePositionChange = 0, level = 1) {
    var halfExtents = new CANNON.Vec3(0.5, 0.8, 0.5);
    boxShape = new CANNON.Box(halfExtents);
    boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

    newmaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.name = "zombieBox"
    boxBody.damage = 2 * level;
    boxBody.addShape(boxShape);
    //boxBody.position.x += 3 * sidePositionChange;
    //boxBody.position.y += 1;
    boxBody.position.copy(mesh.position)
    boxBody.life = 10;  // ADDED: life
    boxBody.angularDamping = 1; //ADDED: no ragdoll till death
    boxBody.isDieing = false; //true when start counter to be removed
    addLifeBarSprite(boxBody)      //ADDED: gui life




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

            if (e.target.life < 0)
                return; //it is in disappearing phase

            e.target.life -= 1;
            if (e.target.life == 1)
                e.target.angularDamping = 0; // enable ragdoll



            if (e.target.life == 0) {
                uselessMeshes.push(e.target.barGui)
                //byeMeshBody(e.target)
                e.target.isDieing = true;  //start counter to remove it
                e.target.myMeshes[0].zombieAnimated.stopAnimation();
                e.target.myMeshes[0].zombieAnimated.dieingArmsPose();

                return;
            }
            uselessMeshes.push(e.target.barGui)
            addLifeBarSprite(e.target, e.target.life) //update gui bar

        }

        else if (e.body.name == "playerBox" && e.target.name == "zombieBox" && !e.target.isDieing) {

            // ... hurt the player ...
            $('#hurt').fadeIn(30);
            playerLife -= e.target.damage;
            changePlayerLifeBar(playerLife)
            $('#hurt').fadeOut(350);
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
    boxMesh.visible = false;
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
          console.log(collisionboxMeshes1[key])
        }
    }
});
