var meshPlayer;
var speedCharacter = 8;
var gravity = 0.15;
var forwards;
var isCameraLimited = false;
var scene;
var gui;

window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);
    var light2;
    var proj;
    var firebullet;
    var bullet, box1;
    var shootingLine;
    var playerLoaded = false;

    var createScene = function () {

        // Create the scene space
        scene = new BABYLON.Scene(engine);
        // Enable physics engine and is running during the render loop.
        scene.enablePhysics();


        // Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
        //var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

        //Camera locked inside skybox
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        if (isCameraLimited) {
            camera.lowerRadiusLimit = 30;
            camera.upperRadiusLimit = 150;
        }
        camera.attachControl(canvas, true);

        // Add global light to the scene (TODO remove or decrease)
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;



        //Fog effect
        //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        //scene.fogDensity = 0.01;


        //Gravity effect
        //scene.gravity = new BABYLON.Vector3(0, -9.81, 0); //gravity along Y axis

        // Ground
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        var groundTex = new BABYLON.Texture("textures/asphalt1.jpg", scene)
        groundTex.vScale = 10.0;
        groundTex.uScale = 10.0;

        const ground_height = 50;
        const ground_width = 50;
        groundMaterial.ambientTexture = groundTex;

        // ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", ground_width, ground_height, 50, 0, 10, scene, false);
        ground = BABYLON.MeshBuilder.CreateGround("ground", { width: ground_width*2, height: ground_height, subdivisions: 4 }, scene);
        ground.position = new BABYLON.Vector3(0.0, -1.0, 0.0) //TODO REMOVE
        ground.material = groundMaterial;
        ground.isPickable = true;


        // //Int. walls
        // var sourcePlane = new BABYLON.Plane(0, 0, 0, 0);
        // sourcePlane.normalize();
        // const wallpos = 3.0; //change position of wall square
        // wall1 = BABYLON.MeshBuilder.CreatePlane("wall1", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        // wall1.position = new BABYLON.Vector3(5 + wallpos, 0, 0 + wallpos); wall1.rotation.y = BABYLON.Tools.ToRadians(0)
        // wall2 = BABYLON.MeshBuilder.CreatePlane("wall2", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        // wall2.position = new BABYLON.Vector3(0 + wallpos, 0, 5 + wallpos);
        // wall3 = BABYLON.MeshBuilder.CreatePlane("wall3", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        // wall3.position = new BABYLON.Vector3(5 + wallpos, 0, 10 + wallpos); wall3.rotation.y = BABYLON.Tools.ToRadians(0)
        // wall4 = BABYLON.MeshBuilder.CreatePlane("wall4", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        // wall4.position = new BABYLON.Vector3(10 + wallpos, 0, 5 + wallpos);


        ///External walls
       makeSquaredWalls("extWall", -ground_width / 2, ground_width, 10.0, ground.position.y + 5.0, scene);

        var matBox = new BABYLON.StandardMaterial("matBox", scene);
        matBox.diffuseColor = new BABYLON.Color3(1.0, 0.7, 0.3);

        // Player outside box
        var box0 = BABYLON.Mesh.CreateBox("box", 0.7, scene);   //temp player
        box0.position = new BABYLON.Vector3(0, 0, 0)

        box0.isVisible = false;
        meshPlayer = box0;
        meshPlayer.isPickable = true;

        forward = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);

        if (isCameraLimited)
            camera.lockedTarget = meshPlayer;
        matBox.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);

        



        // Player mesh
        BABYLON.SceneLoader.ImportMesh("", "./scenes/player_np/", "player1.babylon", scene, function (newMeshes, particleSystems, skeletons) {
            //Print player bones
            newMeshes.forEach(e => e.skeleton.bones.forEach(x => console.log(x.name)))

            mesh = newMeshes[0];
            mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)


            // forwards.negate();

            // meshPlayer.moveWithCollisions(forwards);

            // var backwards = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, -gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);
            // meshPlayer.moveWithCollisions(backwards);

            // //collision (NOT CANNON) => change color
            // if (wall1.intersectsMesh(meshPlayer, false)) {
            //     meshPlayer.material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
            // } else {
            //     meshPlayer.material.emissiveColor = new BABYLON.Color4(1, 1, 1, 1);
            // }

            newMeshes.forEach(function (mesh) {
                mesh.rotation.y = H.toRad(180)
                mesh.parent = meshPlayer
                scene.beginAnimation(mesh, 0, 1, false, 1);  //Default aiming pose

            })

            meshSkeletons = skeletons

            // scene.meshes.forEach(function(mesh){
            //    shadowGenerator.getShadowMap().renderList.push(mesh);
            //     mesh.receiveShadows = true;
            // })

            mesh.isPickable = true;
            // Soldier.aiming_pose(scene);
            meshPlayer.position.y = 1.0
            //meshPlayer.rotation.y = H.toRad(180) <- not visible change
            playerLoaded = true

            meshSkeletons.forEach(function (bone) { // Arms in right position
                scene.beginAnimation(bone, 103, 162, true, 1);
            })

        });


        // Gun mesh 
        var gun;
        BABYLON.SceneLoader.ImportMesh("", "./scenes/aceGun/", "aceGun.babylon", scene, function (newMeshes, particleSystems, skeletons) {

            gun = newMeshes
            newMeshes.forEach(e => {
                e.position = H.vec3(2.0, 2.0, 2.0);
                e.parent = meshPlayer;
                e.scaling = H.vec3(0.2, 0.2, 0.2);
                e.position = H.vec3(+0.7, -1.0, +1.5);
                e.rotation = H.vec3(0, H.toRad(90), 0)

            })


        });

        // Player torch
        light2 = new BABYLON.SpotLight("light2", new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(2, 0.5, 2), Math.PI / 6, 2, scene);
        skyboxMaterial.disableLighting = true;

        // Shadow effect
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.getShadowMap().renderList.push(ground);
        ground.receiveShadows = true;


        // Laser line for range of gun
        function createLine() {
            var myPoints = [
                scene.getBoneByName("Bip01 R Hand").position,
                new BABYLON.Vector3(10, 10, 10)
            ];
            var reds = [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0.5, 0, 1)];
            shootingLine = BABYLON.MeshBuilder.CreateLines("lines", { points: myPoints, dashNb: 400, colors: reds }, scene);
        }


        // Box Targets
        var box1 = BABYLON.MeshBuilder.CreateBox("box", { height: 5, width: 1, depth: 0.5 }, scene); // default box
        box1.position = new BABYLON.Vector3(-2.0, 0.0, -2.0);
        box1.material = matBox.clone();
        box1.onPhysicsCollide = function () { box1.material.diffuseColor = new BABYLON.Color3.Random() }
        //box1.material.diffuseColor = new BABYLON.Color3.Random();
        //box1.isPickable = true;
        var box2 = BABYLON.MeshBuilder.CreateBox("box", { height: 7, width: 1, depth: 0.5 }, scene); // default box
        box2.position = new BABYLON.Vector3(-2.0, 0.0, 2.0);
        box2.material = matBox.clone();
        box2.material.diffuseColor = new BABYLON.Vector3(0.2, 0.3, 0.4);
        //box2.isPickable = true;
        var box3 = BABYLON.MeshBuilder.CreateBox("box", { height: 9, width: 1, depth: 0.5 }, scene); // default box
        box3.position = new BABYLON.Vector3(2.0, 0.0, 2.0);
        box3.material = matBox.clone();
        box3.material.diffuseColor = new BABYLON.Vector3(0.2, 0.3, 0.4);
        //box3.isPickable = true;

        //Targets mesh
        var targets=[]
        BABYLON.SceneLoader.ImportMesh("", "./scenes/targetLowPoly/", "targetLowPoly.glb", scene, function (newMeshes) {
            
            newMeshes[0].scaling= new BABYLON.Vector3(0.3,0.3,0.3)
            newMeshes[0].rotation= new BABYLON.Vector3(0,H.toRad(-90),0);
            newMeshes[0].position.y = -1.0
            newMeshes[0].position.x = -30
            targets.push(newMeshes[0])
            
            var targClone1= newMeshes[0].clone();
            targClone1.position.z=3.0;
            targets.push(targClone1)

            var targClone2= newMeshes[0].clone();
            targClone2.position.z=6.0;
            targets.push(targClone2)
            

        });

        //Physics impostors
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        box1.physicsImpostor = new BABYLON.PhysicsImpostor(box1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

        //Data reporter plane
        var outputplane = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
        outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplane.position = new BABYLON.Vector3(-25, 15, 25);
        outputplane.scaling.y = 0.4;

        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplane.material.diffuseTexture = outputplaneTexture;
        outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane.material.backFaceCulling = false;

        outputplaneTexture.drawText("Points:", null, 140, "bold 140px verdana", "white", "#0000AA");

        var context2D = outputplaneTexture.getContext();
        var out = function (data) {
            context2D.clearRect(0, 200, 512, 512);
            outputplaneTexture.drawText(data, null, 380, "140px verdana", "white", null);
        }

        // GUI 
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        gui = new MyGUI(advancedTexture)
        gui.showAmmo();
        gui.showHit();

        // // Enable Collisions
        // scene.collisionsEnabled = true;
        // camera.checkCollisions = true;
        // //declare which meshes could be in collision with our camera:
        // ground.checkCollisions = true;


        //////////// MOUSE AIMING PART //////////////////////////
        function mousemovef() {
            var pickResult = scene.pick(scene.pointerX, scene.pointerY);

            if (pickResult.hit) {
                var diffX = pickResult.pickedPoint.x - meshPlayer.position.x;
                var diffY = pickResult.pickedPoint.z - meshPlayer.position.z;
                meshPlayer.rotation.y = Math.atan2(diffX, diffY);
                light2.direction.x = pickResult.pickedPoint.x
                light2.direction.z = pickResult.pickedPoint.z

            }
        }

        scene.onPointerMove = function () {
            mousemovef();
        };

        function vecToLocal(vector, mesh) {
            var m = mesh.getWorldMatrix();
            var v = BABYLON.Vector3.TransformCoordinates(vector, m);
            return v;
        }

        function castRay() {    //TODO REMOVE
            var origin = meshPlayer.position;

            var forward = new BABYLON.Vector3(0, 0, 1);
            forward = vecToLocal(forward, meshPlayer);

            var direction = forward.subtract(origin);
            direction = BABYLON.Vector3.Normalize(direction);

            var length = 100;

            var ray = new BABYLON.Ray(origin, direction, length);

            var hits = scene.multiPickWithRay(ray);

            if (hits) {
                for (var i = 0; i < hits.length; i++) {
                    // hits[i].pickedMesh.<do whatever with picked mesh>
                    var m = hits[i].pickedMesh;
                    // m.scaling.y += 0.01; <----- Raise hieght of hitted objects
                }
            }
        }

        scene.registerBeforeRender(function () {
            //castRay();
            if (playerLoaded) {
                scene.getBoneByName("Bip01 Spine1").setRotation(new BABYLON.Vector3(0, -Math.PI * 0.54 + camera.beta, 0));
                // Soldier.aiming_pose(scene)
            }
            if (gun && playerLoaded) {

                // gun.forEach(e => {;e.position=meshPlayer.position;
                //      e.parent = scene.getBoneByName("Bip01 R Hand") });

            }

        });
        return scene;
    };


    ////////////////// MOUSE CLICK CONTROLS ///////////////////

    //When click event is raised
    window.addEventListener("click", function () {
        // We try to pick an object
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        //meshPlayer.moveWithCollisions(new BABYLON.Vector3(parseFloat(pickResult.pickedPoint.x) / speedCharacter, gravity, parseFloat(pickResult.pickedPoint.y) / speedCharacter));
        this.console.log(meshPlayer, pickResult.pickedPoint.x, pickResult.pickedPoint.y)
        const shootPower = 0.8;
        const rangeFire = 2.0;
        firebullet(proj, light2.direction, shootPower, rangeFire)
        this.console.log("shooter position", meshPlayer.position)
    })

    if (bullet) {
        bullet.physicsImpostor.registerOnPhysicsCollide(box1.physicsImpostor, function (main, collided) {
            gui.increaseHit();

        });
    }

    firebullet = function (NObullet, dir, power, range) {
        console.log("Fire direction", dir)
        //Calculations to see if out of range of fire
        // const dVec2 = new BABYLON.Vector2(dir.x, dir.z)
        // const pVec2 = new BABYLON.Vector2(meshPlayer.position.x, meshPlayer.position.z)
        // const dis = BABYLON.Vector2.Distance(dVec2, pVec2)
        // if (dis > range) // to avoid almost infinite distance
        //     dir = new BABYLON.Vector3(dir.x / 15.0, 0.0, dir.z / 15.0)

        //When out of the play area
        dir.normalize();
        if (dir.x > 100) dir.x = 20
        if (dir.y > 100) dir.y = 20
        if (dir.z > 100) dir.z = 20

        //bullet texture
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);
        var metal = new BABYLON.PBRMaterial("metal", scene);
        metal.reflectionTexture = hdrTexture;
        metal.microSurface = 0.96;
        metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
        metal.albedoColor = new BABYLON.Color3(0.996, 0.839, 0.01);
        //bullet mesh
        bullet = BABYLON.MeshBuilder.CreateSphere("Bullet", { diameter:0.15 }, scene);

        bullet.material = metal;

        bullet.position = light2.getAbsolutePosition();
        bullet.physicsImpostor = new BABYLON.PhysicsImpostor(bullet, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.1, friction: 0.5, restition: 0.3 }, scene);

        bullet.physicsImpostor.applyImpulse(dir.scale(power), bullet.getAbsolutePosition());
        bullet.life = 0

        bullet.step = () => {
            bullet.life++
            if (bullet.life > 200 && bullet.physicsImpostor) {
                bullet.physicsImpostor.dispose()
                bullet.dispose()
            }
        }

        bullet.physicsImpostor.onCollideEvent = (e, t) => {
            console.log("Collision", e, t)
            console.log("hiited:", t.name)
            if (t.material)
                t.material.diffuseColor = new BABYLON.Color3.Random()
                    }
        scene.onBeforeRenderObservable.add(bullet.step)

        gui.decreaseAmmo();

    }


    ///////////// KEYBOARD CONTROLS ////////////////

    window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);

    function checkKeyboardEvents() {
        if (Key._pressed.length != 0) {
            var vC = new BABYLON.Vector3(0.0, 0, 0.0)
            const vR = BABYLON.Matrix.RotationY(meshPlayer.rotation.y);
            if (Key.isDown(Key.UP)) {
                vC.x = 0
                vC.z = 0.1
                Soldier.moveForwardAnimation();
            }
            if (Key.isDown(Key.LEFT)) {
                vC.x = -0.1
                vC.z = 0.0
            }
            if (Key.isDown(Key.DOWN)) {
                vC.x = 0.0
                vC.z = -0.1
            }
            if (Key.isDown(Key.RIGHT)) {
                vC.x = 0.1
                vC.z = 0.0
            }
            // translate action
            const v2 = BABYLON.Vector3.TransformCoordinates(vC, vR);
            meshPlayer.position.addInPlace(v2);
            light2.position.addInPlace(v2);
        }
    };



    window.addEventListener("resize", function () {
        engine.resize();
    });

    scene = createScene();
    //setInterval(function(){ console.log( scene.getBoneByName("Bip01 R Hand").position); }, 1000);

    //////// RENDER LOOP //////////////////
    const divFps = document.getElementById("fps");
    engine.runRenderLoop(function () {
        if (scene)
            scene.render();
        checkKeyboardEvents()
        
        if(divFps)
            divFps.innerHTML = engine.getFps().toFixed() + " fps"

    });



});



function makeSquaredWalls(name = "wall" + Math.random().toString(36).substring(4) + "_", wallpos, wallWidth, wallHeight, y = 0.0, scene) {
    var extWallsMat = new BABYLON.StandardMaterial("extWallsMat", scene);
    // if (name.includes("ext")) {
    //     const tex = new BABYLON.Texture("textures/skysc2.png", scene)
    //     extWallsMat.diffuseTexture = tex;
    //     extWallsMat.opacityTexture = tex;
    //     extWallsMat.opacityTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    //     extWallsMat.opacityTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
    // }
    var sourcePlane = new BABYLON.Plane(0, 0, 0, 0);
    sourcePlane.normalize();
    wallWidth = wallWidth + 0.0; //to floatdiffuse
    wall1 = BABYLON.MeshBuilder.CreatePlane(name + "1", { height: wallHeight, width: wallWidth*2, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall1.position = new BABYLON.Vector3(wallWidth / 2 + wallpos, y, 0 + wallpos); wall1.rotation.y = BABYLON.Tools.ToRadians(0)
    wall1.isPickable = true;
    wall1.material = extWallsMat;
    wall2 = BABYLON.MeshBuilder.CreatePlane(name + "2", { height: wallHeight, width: wallWidth, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall2.position = new BABYLON.Vector3(0 + wallpos*2, y, wallWidth / 2 + wallpos);
    wall2.isPickable = true;
    wall2.material = extWallsMat;
    wall3 = BABYLON.MeshBuilder.CreatePlane(name + "3", { height: wallHeight, width: wallWidth*2, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall3.position = new BABYLON.Vector3(wallWidth / 2 + wallpos, y, wallWidth + wallpos); wall3.rotation.y = BABYLON.Tools.ToRadians(0)
    wall3.isPickable = true;
    wall3.material = extWallsMat;
    wall4 = BABYLON.MeshBuilder.CreatePlane(name + "4", { height: wallHeight, width: wallWidth, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall4.position = new BABYLON.Vector3(wallWidth , y, wallWidth / 2 + wallpos);
    wall4.isPickable = true;
    wall4.material = extWallsMat;

}




