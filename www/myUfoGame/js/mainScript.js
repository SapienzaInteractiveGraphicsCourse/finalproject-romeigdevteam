var meshPlayer = [];
var speedCharacter = 8;
var gravity = 0.15;


window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {

        // Create the scene space
        var scene = new BABYLON.Scene(engine);

        // Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
        //Camera locked inside skybox
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        camera.lowerRadiusLimit = 30;
        camera.upperRadiusLimit = 150;
        camera.attachControl(canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        // Ground
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);

        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", 200, 200, 250, 0, 10, scene, false);
        ground.material = groundMaterial;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;


        // Add and manipulate meshes in the scene
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

        // BABYLON.SceneLoader.ImportMesh("plane", "scenes/planeBab/", "plane.babylon", scene, function (newMeshes) {
        //     var plane = newMeshes[0];
        //     camera.target = plane;	
        //  });	

        BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/", "ufo.glb", scene, function (newMeshes) {
            meshPlayer = newMeshes[1];
            console.log("meshPlayer:", meshPlayer)
            camera.target = meshPlayer;
            meshPlayer.position = new BABYLON.Vector3(3.0, 15.0, 3.0);
            meshPlayer.scaling = new BABYLON.Vector3(3.0, 3.0, 3.0);

            meshPlayer.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
            meshPlayer.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
            meshPlayer.checkCollisions = true;


            console.log("m", meshPlayer);
            var forwards = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);
            forwards.negate();
            meshPlayer.moveWithCollisions(forwards);
            // or
            var backwards = new BABYLON.Vector3(parseFloat(Math.sin(meshPlayer.rotation.y)) / speedCharacter, -gravity, parseFloat(Math.cos(meshPlayer.rotation.y)) / speedCharacter);
            meshPlayer.moveWithCollisions(backwards);

            //collision => change color
            if (wall1.intersectsMesh(meshPlayer, false)) {
                meshPlayer.material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
            } else {
                meshPlayer.material.emissiveColor = new BABYLON.Color4(1, 1, 1, 1);
            }


        });


        let loader = new BABYLON.AssetsManager(scene);
        loader.useDefaultLoadingScreen = true;  // Set to false to remove the default loading
        let mesh_loaded_task = loader.addMeshTask("<TASK_NAME>", "<MESHES_NAMES>", "/scenes/plane/", "us-c-130-hercules-airplane.obj");

        mesh_loaded_task.onSuccess = function (task) {
            task.loadedMeshes.forEach(function (m) {
                console.log("Loaded!");
                m.position = BABYLON.Vector3(3.0, 3.0, 3.0);
            });
        }

        scene.gravity = new BABYLON.Vector3(0, -9.81, 0); //gravity along Y axis





        // Enable Collisions
        scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        //declare which meshes could be in collision with our camera:
        ground.checkCollisions = true;



        return scene;

    };

    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });
    //When click event is raised
    window.addEventListener("click", function () {
        // We try to pick an object
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        meshPlayer.moveWithCollisions(new BABYLON.Vector3(parseFloat(pickResult.pickedPoint.x) / speedCharacter, gravity,parseFloat( pickResult.pickedPoint.y)/ speedCharacter));
        this.console.log(meshPlayer,pickResult.pickedPoint.x,pickResult.pickedPoint.y)
    })
});


