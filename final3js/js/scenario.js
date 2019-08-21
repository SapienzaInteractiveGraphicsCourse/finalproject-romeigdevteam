// instantiate a loader
var loaderGLTF = new THREE.GLTFLoader();

var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
};
var loadingManager = null;
var RESOURCES_LOADED = false;
var zombieROOT=[];
var numZombie=10;

//var boxBody;


// Models index
var models = {
    tree: {
        obj: "./scenes/3d-nature-pack/Models/Tree_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Tree_01.mtl",
        mesh: null
    },
    rock: {
        obj: "./scenes/3d-nature-pack/Models/Rock_1_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Rock_1_01.mtl",
        mesh: null
    },
    cliff: {
        obj: "./scenes/3d-nature-pack/Models/Brown_Cliff_01.obj",
        mtl: "./scenes/3d-nature-pack/Models/Brown_Cliff_01.mtl",
        mesh: null


    },
    uzi: {
        obj: "./scenes/weapon/uziGold.obj",
        mtl: "./scenes/weapon/uziGold.mtl",
        mesh: null
    },



};


var wallMap = [
//   0,1,2,3,4,5,6,7,8,9
    [0,1,1,1,1,1,1,1,1,0],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,1,1,1,1,1,1,1,1,0]
]

// Meshes index
var meshes = {};
var meshesArray= [];
var collisionboxes1=[];
var collisionboxMeshes1=[];


function initLoading() {
    // Set up the loading screen's scene.
    // It can be treated just like our main scene.
    loadingScreen.box.position.set(0, 0, 5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

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
    };

    loadModels();


}


function loadModels() {

    createPlayer();

    for (var _key in models) {
        (function (key) {

            var mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function (materials) {
                materials.preload();

                var objLoader = new THREE.OBJLoader(loadingManager);

                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function (mesh) {

                  mesh.traverse( function ( child ) {

                      if ( child instanceof THREE.Mesh ) {

                          //child.material = material;
                          child.geometry.center();

                      }

                  });
                    if (key != "uzi") { //NO Shadow for uzi
                        mesh.traverse(function (node) {
                            if (node instanceof THREE.Mesh) {
                                node.castShadow = true;
                                node.receiveShadow = true;
                            }
                        });
                    }
                    models[key].mesh = mesh;

                });
            });

        })(_key);
    }

    //crei vari zombie quanti i
    for(var i=0; i< numZombie; i++){
      importZombie(i);

    }



}



function onResourcesLoaded() {

    // Clone models into meshes.
    meshes["tree"] = models.tree.mesh.clone();
    meshes["tree"].position.set(0, 0, 0);
    //meshes["tree"].position.y=0;

    scene.add(meshes["tree"]);
    createBoundCube(meshes["tree"]);
    meshesArray.push(meshes["tree"]);

    meshes["rock"] = models.rock.mesh.clone();
    meshes["rock"].position.set(-10, 0, -10);
    scene.add(meshes["rock"]);
    createBoundCube(meshes["rock"]);
    meshesArray.push(meshes["rock"]);

    var cliffs= []
    for(var i=0; i< wallMap.length; i++){
        for(var j=0; j< wallMap[i].length; j++){
            if(wallMap[i][j]){
                const UNITSIZE = 3.1;
                const currCliff= models.cliff.mesh.clone();
                //cliffs.push(  currCliff );
                currCliff.position.set( (i - 10/2)*UNITSIZE  , 0,(j - 10/2)*UNITSIZE);
                if(i==0)
                currCliff.rotation.y = Math.PI;
                else if(j==0)
                currCliff.rotation.y = Math.PI/2;
                else if(j==9)
                currCliff.rotation.y = -Math.PI/2;

                scene.add(currCliff);
                //createBoundCube(currCliff);
                meshesArray.push(currCliff);

            }
        }

    }



    meshes["uzi"] = models.uzi.mesh.clone();
    meshes["uzi"].position.set(0.4, -0.4, -0.5);
    meshes["uzi"].scale.set(10, 10, 10);
    meshes["uzi"].rotation.y = -Math.PI;
    camera.add(meshes["uzi"])





}






function importZombie(i) {





    // Load a glTF resource
    loaderGLTF.load(
        // resource URL
        //'scenes/zombie_character/scene.gltf'
        'scenes/the_perfect_steve_rigged/scene.gltf'
        ,
        // called when the resource is loaded
        function (gltf) {


            gltf.scene.scale.set(0.001, 0.001, 0.001);
            bones = gltf.scene.children[0]
                .children[0].children[0].children[0].children[0]
                .children[1].children[0].children[2].skeleton.bones
            console.log(bones)

            gltf.scene.position.x +=3*i;
            gltf.scene.position.y += 1.0;

            gltf.scene.children[0].children.forEach(element => {
                if (element.name.includes("Left") || element.name.includes("Right")) {
                    element.rotateZ(1.5)
                    console.log("->", element)
                };
            });
            model = gltf.scene
            scene.add(gltf.scene);



            //console.log("gltd scene", gltf.scene)
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            zombieROOT.push(gltf.scene);


            zombieAnimated = new ZombieAnimation(bones);
            zombieAnimated.raisingArmsPose()
            zombieAnimatedArray.push(zombieAnimated);


        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },

    );
}
function createBoundCube(objectMesh) {
  var bbox = (new THREE.Box3()).setFromObject( objectMesh );
  var helper = new THREE.Box3Helper( bbox, 0xffff00 );
  scene.add( helper );
  var dimensions=bbox.getSize();

  var geometry = new THREE.BoxGeometry( dimensions.x, dimensions.y, dimensions.z );
  var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.copy(objectMesh.position);
  scene.add( mesh );
  //mesh.visible=false;

  collisionboxMeshes1.push(mesh);
  var shape = new CANNON.Box(new CANNON.Vec3(dimensions.x/2, dimensions.y/2, dimensions.z/2));
  var mass = 1000;
  var body = new CANNON.Body({
    mass: 1000
  });
  body.addShape(shape);

  body.position.copy(mesh.position);


  world.addBody(body);
  collisionboxes1.push(body);


}
function createBodyCube(length) {
  var halfExtents = new CANNON.Vec3(0.5, 0.8 ,0.5);
  boxShape = new CANNON.Box(halfExtents);
  boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
  for(var i=0; i< length; i++){
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.name = "zombieBox"
    boxBody.addShape(boxShape);
    boxBody.position.x+=3*i;
    boxBody.position.y+=1;
    world.addBody(boxBody);
    collisionboxes.push(boxBody);
    boxBody.addEventListener("collide",function(e){
                                //e.body.id 1 è IL GROUND
                  if (e.body.id!=1 && e.body.name=="bullet") {
  								        console.log("Collided with body:",e.body);
  								        console.log("id:",e.body.id);
                                        console.log(e)
                                    }
  								//console.log("Contact between bodies:",e.contact);

  								//console.log(flagHit);

  						});
  }

  newmaterial= new THREE.MeshLambertMaterial( { color: 0xffffff } );

	for(var i=0; i< length; i++){
		var boxMesh = new THREE.Mesh( boxGeometry,  newmaterial);
		boxMesh.position.x+=3*i;
		boxMesh.position.y-=1;
		//boxMesh.visible=false;
		scene.add(boxMesh);
		console.log("Added box external #: ",i);
		boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
        collisionboxMeshes.push(boxMesh);
        console.log(boxMesh)
	}

}










	// var loader = new THREE.FBXLoader();
	// loader.load( './scene/wolf/Wolf.fbx ', function ( object ) {
	// 	//object.scaling.set(0.8,0.8,0.8)
	// 	//object.position.y-= 6
	// 	object.scale.set(0.1,0.1,0.1)
	// 	scene.add( object );

	// } );
