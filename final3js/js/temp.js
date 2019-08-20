// instantiate a loader
var loaderGLTF = new THREE.GLTFLoader();

var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;


// Models index
var models = {
	tree: {
		obj:"./scenes/3d-nature-pack/Models/Tree_01.obj",
		mtl:"./scenes/3d-nature-pack/Models/Tree_01.mtl",
		mesh: null
    },
    uzi: {
        obj:"./scenes/weapon/uziGold.obj",
		mtl:"./scenes/weapon/uziGold.mtl",
		mesh: null
    },
    
    
    
};

// Meshes index
var meshes = {};


function initLoading(){
    // Set up the loading screen's scene.
	// It can be treated just like our main scene.
    loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	// Create a loading manager to set RESOURCES_LOADED when appropriate.
	// Pass loadingManager to all resource loaders.
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};
	
	loadModels();
	
	
}


function loadModels(){

    for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
    }
    
    importZombie();
}



function onResourcesLoaded(){
	
	// Clone models into meshes.
	meshes["tree"] = models.tree.mesh.clone();
	meshes["tree"].position.set(-5, 0, 4);
    scene.add(meshes["tree"]);

    meshes["uzi"] = models.uzi.mesh.clone();
    meshes["uzi"].position.set(0.4, -0.4, -0.5);
    meshes["uzi"].scale.set(10, 10, 10);
    meshes["uzi"].rotation.y = -Math.PI;
    camera.add(meshes["uzi"])
	
    
	
	
}






function importZombie() {





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


            gltf.scene.position.y += 1.0

            gltf.scene.children[0].children.forEach(element => {
                if (element.name.includes("Left") || element.name.includes("Right")) {
                    element.rotateZ(1.5)
                    console.log("->", element)
                };
            });
            model = gltf.scene
            scene.add(gltf.scene);

            console.log("gltd scene", gltf.scene)
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>

            zombieAnimated = new ZombieAnimation(bones);
            zombieAnimated.raisingArmsPose()


        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },

    );
}










	// var loader = new THREE.FBXLoader();
	// loader.load( './scene/wolf/Wolf.fbx ', function ( object ) {
	// 	//object.scaling.set(0.8,0.8,0.8)
	// 	//object.position.y-= 6
	// 	object.scale.set(0.1,0.1,0.1)
	// 	scene.add( object );

	// } );