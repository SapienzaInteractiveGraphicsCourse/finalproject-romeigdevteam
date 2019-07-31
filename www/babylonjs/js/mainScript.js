window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        engine.enableOfflineSupport = false;    //if error turn off manifest related model

        scene.clearColor = new BABYLON.Color3.White();

        var box2 = BABYLON.Mesh.CreateBox("Box2", 4.0, scene);
        var material = new BABYLON.StandardMaterial("material1", scene);
        material.wireframe = true;
        box2.material = material;
        box2.position = new BABYLON.Vector3(0, 5, 0);




        // var assetsManager = new BABYLON.AssetsManager(scene);
        // var meshTask = assetsManager.addMeshTask("mp5", "", "scenes/mp5", "mp5k.babylon");

        // meshTask.onSuccess = function (task) {
        //     task.loadedMeshes[0].position = BABYLON.Vector3(5,5,5);
        // }	

        //  BABYLON.SceneLoader.ImportMesh("","scenes/mp5/","mp5k.babylon",
        // scene,
        // function(newMeshes){

        // });

        //BABYLON.SceneLoader.Load("/scenes/obj/", "k.obj", engine, function (newScene) { });

        //better texture, but with a longer loading.
        BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;

        //Against textures may appear distorted or inverted. UV coordinate scale 
        BABYLON.OBJFileLoader.UV_SCALE = new BABYLON.Vector2(10.0, 10.0)

        //normals calculated for you
        BABYLON.OBJFileLoader.COMPUTE_NORMALS = true;

        BABYLON.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;


        // BABYLON.SceneLoader.Append("./scenes/factory/", "TheFactory.obj", scene, function (element) {
        //     var sf = 3.0;
        //     element.scaling = new BABYLON.Vector3(sf, sf, sf);
        //     element.position.z = 4.0;
        // });


        BABYLON.SceneLoader.ImportMesh("", "scenes/4factories/", "4factory.babylon",
            scene,
            function (newMeshes) {
                newMeshes.array.forEach(element => {
                    element.scaling = new BABYLON.Vector3(1.0, 1.0, 4.0)
                });
            });


        /////////////////////////// CAMERA ///////////////////////

        // Parameters : name, position, scene
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
        // Targets the camera to a particular position. In this case the scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // Attach the camera to the canvas
        camera.attachControl(canvas, true);
        // camera.keysUp.push(87) //W
        // camera.keysLeft.push(65) //A
        // camera.keysDown.push(83) //S
        // camera.keysRight.push(68) //D


        // var camera = new BABYLON.FollowCamera("followCam",BABYLON.Vector3.Zero(),scene);
        // camera.target = box2;
        // camera.radius = 10;
        // camera.heightOffset = 5;
        // camera.attachControl(canvas,true);

        
        /////////////////////////// LIGHT ///////////////////////

        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);

        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,  //spaceBar 
            parameter: " "
        },
            function () {
                light.setEnabled(!light.isEnabled());
            }))



        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/NightPath/night", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;





        return scene;
    }

    var scene = createScene();
    engine.runRenderLoop(function () {
        //scene.getMeshByName("Box1").position.z += 0.01;
        scene.render();
    });
});

window.addEventListener('resize', function () {
    engine.resize();
});


