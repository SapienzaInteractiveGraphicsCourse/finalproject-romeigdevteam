var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {
  // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 15, BABYLON.Vector3(10,10,10), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    //var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, -1), scene);
    var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 1, -1), new BABYLON.Vector3(0, 0, -1), Math.PI / 3, 2, scene);

    // Add and manipulate meshes in the scene

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 100, width: 100, subdivisions: 4}, scene);
    var box = BABYLON.MeshBuilder.CreateBox("box", {height:0.5, }, scene); // default box
    box.position.y=0.25;
    box.position.z-=2;
    var material = new BABYLON.StandardMaterial(scene);
    material.alpha = 1;
    material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
    box.material = material;
    var material1= new BABYLON.StandardMaterial(scene);
    material1.alpha = 1;
    material1.diffuseColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    ground.material= material1;
    // Parameters: name, position, scene
    camera.target=box;

    document.addEventListener('keydown', (e) => {
      //if (e.keyCode == 90) { box.position.z+=1; }
      //if (e.keyCode == 81) { box.position.z+=1; }
      if (e.keyCode == 83) { box.position.z+=1; light.position.z+=1; light.direction.z=1; light.direction.x=0;} // press S
      if (e.keyCode == 87) { box.position.z-=1; light.position.z-=1; light.direction.z=-1; light.direction.x=0;} // press W
      if (e.keyCode == 65) { box.position.x+=1; light.position.x+=1; light.direction.x=1; light.direction.z=0;} // press A
      if (e.keyCode == 68) { box.position.x-=1; light.position.x-=1; light.direction.x=-1; light.direction.z=0;} // press D
      //if (e.keyCode == 66) { box.position.z+=1; }
    });


    return scene;
};
/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
