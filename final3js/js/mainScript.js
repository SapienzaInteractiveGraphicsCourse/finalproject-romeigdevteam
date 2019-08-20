var world, mass, body, shape, timeStep=1/60, geometry, material, mesh;
var scene, camera, renderer, controls;
var meshFloor, ambientLight, light;
var weapon;
var sphereShape, sphereBody,balls=[], ballMeshes=[];

var crate, crateTexture, crateNormalMap, crateBumpMap;
//Zombie mesh global vars
var model,zombieAnimated ;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

var objects = [];

var raycaster;
initCannon();

var moveForward = false;
			var moveBackward = false;
			var moveLeft = false;
			var moveRight = false;
			var canJump = false;

			var prevTime = performance.now();
			var velocity = new THREE.Vector3();
			var direction = new THREE.Vector3();
			var vertex = new THREE.Vector3();
			var color = new THREE.Color();
			function initCannon(){
					// Setup our world
					world = new CANNON.World();
					world.quatNormalizeSkip = 0;
					world.quatNormalizeFast = false;

					var solver = new CANNON.GSSolver();

					world.defaultContactMaterial.contactEquationStiffness = 1e9;
					world.defaultContactMaterial.contactEquationRelaxation = 4;

					solver.iterations = 7;
					solver.tolerance = 0.1;
					var split = true;
					if(split)
							world.solver = new CANNON.SplitSolver(solver);
					else
							world.solver = solver;

					world.gravity.set(0,-20,0);
					world.broadphase = new CANNON.NaiveBroadphase();

					// Create a slippery material (friction coefficient = 0.0)
					physicsMaterial = new CANNON.Material("slipperyMaterial");
					var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
																																	physicsMaterial,
																																	0.0, // friction coefficient
																																	0.3  // restitution
																																	);
					// We must add the contact materials to the world
					world.addContactMaterial(physicsContactMaterial);

					// Create a sphere
					var mass = 5, radius = 1.3;
					sphereShape = new CANNON.Sphere(radius);
					sphereBody = new CANNON.Body({ mass: mass });
					sphereBody.addShape(sphereShape);
					sphereBody.position.set(0,5,0);
					sphereBody.linearDamping = 0.9;
					world.addBody(sphereBody);

					// Create a plane
					var groundShape = new CANNON.Plane();
					var groundBody = new CANNON.Body({ mass: 0 });
					groundBody.addShape(groundShape);
					groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
					world.addBody(groundBody);
			}

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

	geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add( mesh );



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
	//renderer.setSize(1280, 720);
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;



	controls = new THREE.PointerLockControls( camera );



	var instructions = document.getElementById( 'instructions' );

	instructions.addEventListener( 'click', function () {

		controls.lock();

	}, false );

	controls.addEventListener( 'lock', function () {

		instructions.style.display = 'none';
//		blocker.style.display = 'none';

	} );

	controls.addEventListener( 'unlock', function () {

//		blocker.style.display = 'block';
		instructions.style.display = '';

	} );

	scene.add( controls.getObject() );


	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 100;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );


	//Meshes imports

	initLoading();


	//importScenario();

	




	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );


	document.body.appendChild(renderer.domElement);

	animate();

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}



//var clock = new THREE.Clock();

const walkSpeed = 1.0

let then = 0;
var dt = 1/60;
function animate(now) {
	
	
	// Play the loading screen until resources are loaded.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}


	requestAnimationFrame(animate);
	world.step(dt);

	// Update ball positions
	for(var i=0; i<balls.length; i++){
			ballMeshes[i].position.copy(balls[i].position);
			ballMeshes[i].quaternion.copy(balls[i].quaternion);
	}



	now *= 0.001;  // make it seconds

	const myDelta = now - then;
  	then = now;


	if ( controls.isLocked === true ) {

		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects( objects );

		var onObject = intersections.length > 0;

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000.0 ;
		prevTime = time;


		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveLeft ) - Number( moveRight );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

		if ( onObject === true ) {

			velocity.y = Math.max( 0, velocity.y );
			canJump = true;

		}
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().position.y += ( velocity.y * delta ); // new behavior
		controls.getObject().translateZ( velocity.z * delta );

		if ( controls.getObject().position.y < 1.5 ) {

			velocity.y = 0;
			controls.getObject().position.y = 1.5;

			canJump = true;

		}

		if (model) {
			zombieAnimated.walkingAnimate(myDelta,walkSpeed)
		}
	
				// Detect collisions.
		if ( collisions.length > 0 ) {
			detectCollisions();
		}
	}





	renderer.render(scene, camera);
}

var ballShape = new CANNON.Sphere(0.2);
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
var shootDirection = new THREE.Vector3();
var shootVelo = 15;
//raycaster.ray.origin.copy( controls.getObject().position );
var projector = new THREE.Projector();
function getShootDir(targetVec){
		var vector = targetVec;
		targetVec.set(0,0,1);
		vector.unproject(camera);
		var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
		targetVec.copy(ray.direction);
		console.log(targetVec);
}

window.addEventListener("click",function(e){

				var x = camera.position.x;
				var y = camera.position.y;
				var z = camera.position.z;
				var ballBody = new CANNON.Body({ mass: 1 });
				ballBody.addShape(ballShape);
				var ballMesh = new THREE.Mesh( ballGeometry, material );
				world.addBody(ballBody);
				//camera.add(ballMesh);
				scene.add(ballMesh);

				ballMesh.castShadow = true;
				ballMesh.receiveShadow = true;
				balls.push(ballBody);
				ballMeshes.push(ballMesh);
				getShootDir(shootDirection);
				ballBody.velocity.set(  shootDirection.x * shootVelo,
																shootDirection.y * shootVelo,
																shootDirection.z * shootVelo);

				// Move the ball outside the player sphere
				x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
				y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
				z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
				ballBody.position.set(x,y,z);
				ballMesh.position.set(x,y,z);


});

window.onload = initCannon;
window.onload = init;
