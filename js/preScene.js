// var loadingScreen = {
//     preScene: new THREE.Scene(),
//     preCamera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
//     box: new THREE.Mesh(
//         new THREE.BoxGeometry(0.5, 0.5, 0.5),
//         new THREE.MeshBasicMaterial({ color: 0x4444ff })
//     )
// };
// var preScene = {
//     preScene: new THREE.scene(),
//     preCamera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
//     meshes: [],
//     light: new THREE.PointLight(0xffffff, 0.8, 18)
	
// }

var preScene, preCamera, renderer, preMeshes=[] ;

function preSceneInit() {

    //preScene.preScene.background = new THREE.Color(0xfff000)

    startbtn = document.getElementById( 'playBtn' );
    
    startbtn.onclick = function () {
        PLAYGAME = true;
        $("#blocker").fadeIn("slow")
        $('.healthArea').fadeIn("slow");
        $('#ammoDiv').fadeIn("slow");
        $('#playBtn').css({display: "none"})
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

    var geometry = new THREE.PlaneGeometry( 200, 200, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0f00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    preScene.add( plane );  // preScene plane

    //var light = new THREE.PointLight( 0xff0000, 1, 100 );
	light = new THREE.AmbientLight(0xffffff, 0.9);
    light.position.set(0,100,100)
    preScene.add( light );


    // preScene.light.position.set(0, 6, 0);
	// preScene.light.castShadow = true;
	// preScene.light.shadow.preCamera.near = 0.1;
    // preScene.light.shadow.preCamera.far = 25;
    // preScene.preCamera.position.set(0,0,100)
	// preScene.preScene.add(preScene.light);

    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.load(models[4].mtl, function (materials) {
    //     materials.preload();

    //     var objLoader = new THREE.OBJLoader();

    //     objLoader.setMaterials(materials);
    //     objLoader.load(models[4].obj, function (mesh) {
           
    //         preMeshes[1] = mesh;
    //         preMeshes[2] = mesh.clone();
    //         preMeshes[3] = mesh.clone();
    //         preMeshes[2].position = new THREE.Vector3(0,0,0)
    //         preMeshes[2].scaling = new THREE.Vector3(0,0,0)
            
    //         preMeshes[2].position.x += 0.5
    
    //         preMeshes[3].position.x += 1.0

    //         preMeshes[1].parent = preMeshes[0]
    //         preMeshes[1].scaling = new THREE.Vector3(200,200,200);
            
    //         preScene.add(preMeshes[1]);
    //         preScene.add(preMeshes[2]);
    //         preScene.add(preMeshes[3]);
            

        
    //     });
    //     objLoader.onError = (err) => {console.log(err); console.log("ERR")}

    // });
    // mtlLoader.onError = () => console.log("ERR")
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( models[4].mtl, function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.load( models[4].obj, function ( object ) {

        preScene.add( object );
        object.scale.set(1000,1000,1000);
        object.position.z+=100
        preMeshes[1]=object
    } );

});
    

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

    if(preMeshes.length > 1){
        preMeshes[1].rotation.y+=0.01
        preMeshes[1].scale.x+=0.1
        preMeshes[1].scale.y+=0.1
        preMeshes[1].scale.z+=0.1
        
    }

    renderer.render(preScene, preCamera);


}



