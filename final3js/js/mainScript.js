
var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;
//Zombie mesh global vars
var model,zombieAnimated ;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);


	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(20, 20, 10, 10),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3, 6, -3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);


	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0, player.height, 0));

	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	// var loader = new THREE.FBXLoader();
	// loader.load( './scene/wolf/Wolf.fbx ', function ( object ) {
	// 	//object.scaling.set(0.8,0.8,0.8)
	// 	//object.position.y-= 6
	// 	object.scale.set(0.1,0.1,0.1)
	// 	scene.add( object );

	// } );
	var mm = new MyMeshes();
	// model=mm.importZombie();
	// console.log("model è dopo importZombie",model)


	var loaderGLTF = new THREE.GLTFLoader();

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




	document.body.appendChild(renderer.domElement);

	animate();


}


let then = 0;

var clock = new THREE.Clock();

const walkSpeed = 1.0


function animate(now) {
	now *= 0.001;  // make it seconds
	const delta = now - then;
	then = now;

	requestAnimationFrame(animate);


	if (keyboard[87]) { // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[83]) { // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[65]) { // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
	}
	if (keyboard[68]) { // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
	}

	if (keyboard[37]) { // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if (keyboard[39]) { // right arrow key
		camera.rotation.y += player.turnSpeed;
	}

	if (model) {
		zombieAnimated.walkingAnimate(delta,walkSpeed)
	}

	renderer.render(scene, camera);
}

function keyDown(event) {
	keyboard[event.keyCode] = true;
}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
