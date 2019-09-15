var preModels = {
    1: {
        obj: "./scenes/weapons/uziGold.obj",
        mtl: "./scenes/weapons/uziGold.mtl",
        mesh: null,
        nameMesh: "uzi"
    },

    2: {
        obj: "./scenes/weapons/machinegun.obj",
        mtl: "./scenes/weapons/machinegun.mtl",
        mesh: null,
        nameMesh: "machinegun"
    },
    3: {
        obj: "./scenes/weapons/sniper.obj",
        mtl: "./scenes/weapons/sniper.mtl",
        mesh: null,
        nameMesh: "sniper"
    }

};

var preScene, preCamera, renderer, preMeshes = [];
var sizeBullet;
var veloBullet;

function preSceneInit() {

    //preScene.preScene.background = new THREE.Color(0xfff000)

    startbtn = document.getElementById('playBtn');

    startbtn.onclick = function () {
        if (selectedGun != -1) {
            addSelectedGunToCamera();
            PLAYGAME = true;
            $("#blocker").fadeIn("slow")
            $('.healthArea').fadeIn("slow");
            $('#ammoDiv').fadeIn("slow");
            $('#preSceneDiv').css({ display: "none" })


        }
    }
    preScene = new THREE.Scene();

    preCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    preCamera.position.z = 250;
    preScene.add(preCamera);

    var geometry = new THREE.CubeGeometry(200, 200, 200);
    var material = new THREE.MeshNormalMaterial();

    // preMeshes[0]= new THREE.Mesh(geometry, material);   //TEST cube
    // preScene.add(preMeshes[0]);

    // preMeshes[0].visible = false;

    var planeTexture = THREE.ImageUtils.loadTexture("../textures/bdPack/block_alt1/stone_bricks.png");

    // assuming you want the texture to repeat in both directions:
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;

    // how many times to repeat in each direction; the default is (1,1),
    //   which is probably why your example wasn't working
    planeTexture.repeat.set(40, 40);

    var plMaterial = new THREE.MeshLambertMaterial({ map: planeTexture });
    plMaterial.side = THREE.DoubleSide;

    var geometry = new THREE.PlaneGeometry(2000, 2000, 32);
    var plane = new THREE.Mesh(geometry, plMaterial);
    preScene.add(plane);  // preScene plane

    //var light = new THREE.PointLight( 0xff0000, 1, 100 );
    light = new THREE.AmbientLight(0xffffff, 0.9);
    light.position.set(0, 100, 100)
    preScene.add(light);


    // preScene.light.position.set(0, 6, 0);
    // preScene.light.castShadow = true;
    // preScene.light.shadow.preCamera.near = 0.1;
    // preScene.light.shadow.preCamera.far = 25;
    // preScene.preCamera.position.set(0,0,100)
    // preScene.preScene.add(preScene.light);

    for (var _key in preModels) {
        (function (key) {

            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.load(preModels[key].mtl, function (materials) {

                materials.preload();

                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(preModels[key].obj, function (object) {

                    object.nameMesh = preModels[key].nameMesh
                    object.scale.set(500, 500, 500);
                    object.position.z += 100
                    object.position.x = -150 + 75 * key
                    preScene.add(object);
                    preMeshes[key] = object
                });

            });

        })(_key)
    };
    initRay();

}
function preSceneAnimate() {


    // preMeshes[0].rotation.x += 0.01;
    // preMeshes[0].rotation.y += 0.02;

    // if(preScene.meshes.length > 0){
    //     preScene.meshes.forEach(m => m.rotation.y+=0.1)
    // }
    // // loadingScreen.box.position.x -= 0.05;
    // // if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
    // // loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

    if (preMeshes.length > 1) {
        preMeshes.forEach(e =>
            e.rotation.y += 0.01
        )
    }
    if (selectedGun != -1 && preMeshes[selectedGun].position.z < 150) {
        if (selectedGun==2) { //assault rifle
          preMeshes[selectedGun].position.z += 1;
        }
        else if (selectedGun==1) { //UZI OR PISTOL
          preMeshes[selectedGun].position.z += 1;
          preMeshes[selectedGun].position.x += 1;

        }
        else if (selectedGun==3){ //SNIPER RIFLE
          preMeshes[selectedGun].position.z += 1;
          preMeshes[selectedGun].position.x -= 1;
        }
    }

    renderer.render(preScene, preCamera);


}





var preRaycaster, mouse = { x: 0, y: 0 };
var selectedGun = -1;

var gunNameToIdx = {
    "uzi": 1,
    "machinegun": 2,
    "sniper": 3
}

var preIdxToIdx = {
    1: 4,
    2: 6,
    3: 7
}

function initRay() {

    //Usual setup code here.

    preRaycaster = new THREE.Raycaster();
    //Next setup code there.
}
function setFromCamera(raycaster, coords, origin) {
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
}

function raycast(e) {

    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    //setFromCamera(preRaycaster,mouse, camera);
    preRaycaster.setFromCamera(mouse, preCamera)
    //3. compute intersections
    var intersects = preRaycaster.intersectObjects(preScene.children, true);

    for (var i = 0; i < intersects.length; i++) {
        console.log(intersects[i]);
        if (intersects[i].object.parent.nameMesh && intersects[i].object.parent.nameMesh in gunNameToIdx) {
            if (selectedGun != -1 && selectedGun != gunNameToIdx[intersects[i].object.parent]) { //changed selected gun
                preMeshes[selectedGun].position.z = 100    //back to default position
                preMeshes[1].position.x=-75;
                preMeshes[3].position.x=75;
            }

            if(selectedGun==-1){
                $("#playBtn").css({ opacity: 1 })
            }
            selectedGun = gunNameToIdx[intersects[i].object.parent.nameMesh]

        }


        /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
        */
    }

}
