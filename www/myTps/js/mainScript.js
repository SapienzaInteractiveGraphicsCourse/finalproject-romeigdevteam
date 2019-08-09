var meshPlayer = [];
var speedCharacter = 8;
var gravity = 0.15;
var forwards;
var isCameraLimited = false;


window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);
    var light2;

    var createScene = function () {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);
        scene.enablePhisics();
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

        // Add lights to the scene
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
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0); //gravity along Y axis

        // Ground
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        var groundTex = new BABYLON.Texture("textures/asphalt1.jpg", scene)
        groundTex.vScale = 10.0;
        groundTex.uScale = 10.0;

        const ground_height = 50;
        const ground_width = 50;
        groundMaterial.ambientTexture = groundTex;
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", ground_width, ground_height, 50, 0, 10, scene, false);
        ground.position = new BABYLON.Vector3(0.0, -1.0, 0.0) //TODO REMOVE
        ground.material = groundMaterial;
        ground.isPickable = false;

        
        //Int. walls
        var sourcePlane = new BABYLON.Plane(0, 0, 0, 0);
        sourcePlane.normalize();
        const wallpos = 3.0; //change position of wall square
        wall1 = BABYLON.MeshBuilder.CreatePlane("wall1", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        wall1.position = new BABYLON.Vector3(5 + wallpos, 0, 0 + wallpos); wall1.rotation.y = BABYLON.Tools.ToRadians(0)
        wall2 = BABYLON.MeshBuilder.CreatePlane("wall2", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        wall2.position = new BABYLON.Vector3(0 + wallpos, 0, 5 + wallpos);
        wall3 = BABYLON.MeshBuilder.CreatePlane("wall3", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        wall3.position = new BABYLON.Vector3(5 + wallpos, 0, 10 + wallpos); wall3.rotation.y = BABYLON.Tools.ToRadians(0)
        wall4 = BABYLON.MeshBuilder.CreatePlane("wall4", { height: 4, width: 10, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        wall4.position = new BABYLON.Vector3(10 + wallpos, 0, 5 + wallpos);


        ///External walls
        makeSquaredWalls("extWall", -ground_width / 2, ground_width, 10.0,ground.position.y+5.5, scene);

        var matBox = new BABYLON.StandardMaterial("matBox", scene);
        matBox.diffuseColor = new BABYLON.Color3(1.0, 0.7, 0.3);

        //Player
        var box0 = BABYLON.Mesh.CreateBox("box", 0.7, scene);   //temp player
        box0.position= new BABYLON.Vector3(0, 0, 0)
        box0.scaling.y = 2.5;
        box0.scaling.z = 2;
        box0.scaling.y = 2.5;
        box0.material = matBox
        meshPlayer = box0;
        meshPlayer.isPickable = false;

        forward = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);
        if (isCameraLimited)
            camera.lockedTarget = meshPlayer;
        matBox.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);

        //Player torch
        light2 = new BABYLON.SpotLight("light2",  new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(2, 0.5, 2), Math.PI / 6, 2, scene);
        skyboxMaterial.disableLighting = true;
        //Shadow effect
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.getShadowMap().renderList.push(ground);
        ground.receiveShadows = true;


        //Targets
        var box1 = BABYLON.MeshBuilder.CreateBox("box", { height: 5, width: 1, depth: 0.5 }, scene); // default box
        box1.position = new BABYLON.Vector3(-2.0, 0.0, -2.0);
        box1.material = matBox;
        //box1.isPickable = false;
        var box2 = BABYLON.MeshBuilder.CreateBox("box", { height: 7, width: 1, depth: 0.5 }, scene); // default box
        box2.position = new BABYLON.Vector3(-2.0, 0.0, 2.0);
        box2.material = matBox;
        //box2.isPickable = false;
        var box3 = BABYLON.MeshBuilder.CreateBox("box", { height: 9, width: 1, depth: 0.5 }, scene); // default box
        box3.position = new BABYLON.Vector3(2.0, 0.0, 2.0);
        box3.material = matBox;
        //box3.isPickable = false;

        BABYLON.SceneLoader.ImportMesh("", "./scenes/", "soldier.glb", scene, function (newMeshes, particleSystems, skeletons, animationsGroup) {
            newMeshes.forEach(e => console.log(e.name, e.skeleton))
            // meshPlayer = newMeshes[0];
            // console.log("meshPlayer:", meshPlayer)
            // camera.target = meshPlayer;
            // meshPlayer.position = new BABYLON.Vector3(3.0, 15.0, 3.0);
            newMeshes[0].scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);

            // meshPlayer.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
            // meshPlayer.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
            // meshPlayer.checkCollisions = true;


            // console.log("m", meshPlayer);
            // var forwards = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);
            // forwards.negate();
            // meshPlayer.moveWithCollisions(forwards);
            // // or
            // var backwards = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, -gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);
            // meshPlayer.moveWithCollisions(backwards);

            // //collision => change color
            // if (wall1.intersectsMesh(meshPlayer, false)) {
            //     meshPlayer.material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
            // } else {
            //     meshPlayer.material.emissiveColor = new BABYLON.Color4(1, 1, 1, 1);
            // }

        });





        // Enable Collisions
        scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        //declare which meshes could be in collision with our camera:
        ground.checkCollisions = true;


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

        function castRay() {
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
                    m.scaling.y += 0.01;
                }
            }
        }

        scene.registerBeforeRender(function () {
            castRay();
        });



        return scene;

    };

    var scene = createScene();
    engine.runRenderLoop(function () {
        if (scene)
            scene.render();

    });

    ////////////////// KEYBOARD INPUT CONTROLS ///////////////////
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                console.log("KEY DOWN: ", kbInfo.event.key);
                switch (kbInfo.event.keyCode) {
                    case 87: // "W"
                        //meshPlayer.moveWithCollisions(new BABYLON.Vector3(meshPlayer.position.x+1,meshPlayer.position.y,meshPlayer.position.z+1))
                        meshPlayer.position.x -= 1;
                        light2.position.x -= 1;
                        break;
                    case 65: //"A"
                        meshPlayer.position.z -= 1;
                        light2.position.z -= 1;
                        break;
                    case 83: //"S"
                        meshPlayer.position.x += 1;
                        light2.position.x += 1;
                        break;
                    case 68: //"D"
                        meshPlayer.position.z += 1;
                        light2.position.z += 1;
                        break;
                }

                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                console.log("KEY UP: ", kbInfo.event.keyCode);
                break;
        }
    });
    ////////////////// MOUSE INPUT CONTROLS ///////////////////

    //When click event is raised
    window.addEventListener("click", function () {
        // We try to pick an object
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        //meshPlayer.moveWithCollisions(new BABYLON.Vector3(parseFloat(pickResult.pickedPoint.x) / speedCharacter, gravity, parseFloat(pickResult.pickedPoint.y) / speedCharacter));
        this.console.log(meshPlayer, pickResult.pickedPoint.x, pickResult.pickedPoint.y)
    })


    window.addEventListener("resize", function () {
        engine.resize();
    });
});


function makeSquaredWalls(name = "wall" + Math.random().toString(36).substring(4) + "_", wallpos, wallWidth, wallHeight,y=0.0, scene) {
    var extWallsMat = new BABYLON.StandardMaterial("extWallsMat", scene);
    if(name.includes("ext")){
        const tex = new BABYLON.Texture("textures/skysc2.png", scene)
        
        extWallsMat.diffuseTexture = tex;       
        extWallsMat.opacityTexture = tex;
        extWallsMat.opacityTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        extWallsMat.opacityTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
}
    var sourcePlane = new BABYLON.Plane(0, 0, 0, 0);
    sourcePlane.normalize();
    wallWidth = wallWidth + 0.0; //to floatdiffuse
    wall1 = BABYLON.MeshBuilder.CreatePlane(name + "1", { height: wallHeight, width: wallWidth, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall1.position = new BABYLON.Vector3(wallWidth / 2 + wallpos, y, 0 + wallpos); wall1.rotation.y = BABYLON.Tools.ToRadians(0)
    wall1.isPickable = false;
    wall1.material=extWallsMat;
    wall2 = BABYLON.MeshBuilder.CreatePlane(name + "2", { height: wallHeight, width: wallWidth, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall2.position = new BABYLON.Vector3(0 + wallpos, y, wallWidth / 2 + wallpos);
    wall2.isPickable = false;
    wall2.material=extWallsMat;
    wall3 = BABYLON.MeshBuilder.CreatePlane(name + "3", { height: wallHeight, width: wallWidth, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall3.position = new BABYLON.Vector3(wallWidth / 2 + wallpos, y, wallWidth + wallpos); wall3.rotation.y = BABYLON.Tools.ToRadians(0)
    wall3.isPickable = false;
    wall3.material=extWallsMat;
    wall4 = BABYLON.MeshBuilder.CreatePlane(name + "4", { height: wallHeight, width: wallWidth, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    wall4.position = new BABYLON.Vector3(wallWidth + wallpos, y, wallWidth / 2 + wallpos);
    wall4.isPickable = false;
    wall4.material=extWallsMat;
 
}
